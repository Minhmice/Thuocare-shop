"""
Scrape product data from nhathuoclongchau.com.vn into src/data/longchau.

Approach:
- Use the public sitemap index to discover /thuoc/*.html product URLs (avoids internal API).
- Fetch each product page HTML and parse __NEXT_DATA__ (Next.js) for structured product fields.
- Write per-product JSON files and a combined products.json index.

This script is intentionally stdlib-only.
"""

from __future__ import annotations

import argparse
import json
import os
import random
import re
import time
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse


SITEMAP_INDEX = "https://nhathuoclongchau.com.vn/sitemap.xml"
PRODUCT_URL_RE = re.compile(r"^https?://nhathuoclongchau\.com\.vn/thuoc/.+\.html$")
NEXT_DATA_RE = re.compile(r'<script[^>]+id="__NEXT_DATA__"[^>]*>(.*?)</script>', re.S)


def http_get(url: str, *, timeout: float = 30.0, retries: int = 4) -> bytes:
    last_err: Exception | None = None
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
            )
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read()
        except Exception as e:
            last_err = e
            # Basic backoff to play nice with transient failures / rate limits.
            sleep = min(15.0, (2.0 ** attempt) + random.random())
            time.sleep(sleep)
    raise last_err or RuntimeError("http_get failed")


def parse_sitemap_urls(xml_bytes: bytes) -> list[str]:
    root = ET.fromstring(xml_bytes)

    # Handle both sitemapindex and urlset; default namespace varies.
    def strip_ns(tag: str) -> str:
        return tag.split("}", 1)[-1] if "}" in tag else tag

    urls: list[str] = []
    for el in root.iter():
        if strip_ns(el.tag) == "loc" and el.text:
            urls.append(el.text.strip())
    return urls


def discover_product_urls(limit: int) -> list[str]:
    index_xml = http_get(SITEMAP_INDEX)
    sitemap_urls = [u for u in parse_sitemap_urls(index_xml) if u.endswith(".xml")]

    out: list[str] = []
    seen: set[str] = set()

    for sm in sitemap_urls:
        try:
            sm_xml = http_get(sm)
        except Exception:
            continue

        for u in parse_sitemap_urls(sm_xml):
            if not PRODUCT_URL_RE.match(u):
                continue
            if "tra-cuu" in u:
                continue
            if u in seen:
                continue
            seen.add(u)
            out.append(u)
            if len(out) >= limit:
                return out

    return out


def parse_next_data_product(html: str) -> dict | None:
    m = NEXT_DATA_RE.search(html)
    if not m:
        return None
    try:
        data = json.loads(m.group(1))
    except Exception:
        return None
    pp = (data.get("props") or {}).get("pageProps") or {}
    p = pp.get("product")
    if not isinstance(p, dict):
        return None
    t = pp.get("transformedProductData") or {}
    return {"product": p, "transformed": t}


def to_schema(url: str, payload: dict) -> dict:
    p: dict = payload["product"]
    t: dict = payload.get("transformed") or {}

    def pick_default_price(prices: list[dict]) -> dict:
        dp = t.get("defaultPrice")
        if isinstance(dp, dict) and dp.get("price") is not None:
            return dp
        for it in prices:
            if isinstance(it, dict) and it.get("isSellDefault"):
                return it
        return prices[0] if prices else {}

    prices = p.get("prices") if isinstance(p.get("prices"), list) else []
    dp = pick_default_price(prices)

    categories = p.get("categories") if isinstance(p.get("categories"), list) else []
    cat = t.get("highestLevelCategory") if isinstance(t.get("highestLevelCategory"), dict) else (categories[-1] if categories else None)

    parent_slug = None
    if isinstance(cat, dict) and cat.get("level") and categories:
        want = int(cat.get("level")) - 1
        parent = next((c for c in categories if isinstance(c, dict) and c.get("level") == want), None)
        if isinstance(parent, dict):
            parent_slug = parent.get("slug")

    imgs = []
    gallery = t.get("galleryImgUrls") if isinstance(t.get("galleryImgUrls"), list) else []
    imgs = [x for x in gallery if isinstance(x, str) and x]
    if not imgs:
        primary = p.get("primaryImage") or p.get("thumbnail")
        if isinstance(primary, str) and primary:
            imgs.append(primary)
        sec = p.get("secondaryImages") if isinstance(p.get("secondaryImages"), list) else []
        imgs += [x for x in sec if isinstance(x, str) and x]

    image_url = imgs[0] if imgs else None
    slug = p.get("slug")
    if not isinstance(slug, str) or not slug:
        slug = Path(urlparse(url).path).name.replace(".html", "")

    return {
        "id": str(p.get("sku") or "") or None,
        "slug": slug,
        "title": p.get("webName") or p.get("name"),
        "short_title": p.get("shortName"),
        "brand": {
            "name": p.get("brand"),
            "slug": p.get("brandSlug"),
            "country": p.get("brandOrigin"),
        },
        "category": {
            "slug": (cat.get("slug") if isinstance(cat, dict) else None),
            "name": (cat.get("name") if isinstance(cat, dict) else None),
            "parent_slug": parent_slug,
        },
        "price_amount": int(dp.get("price") or 0),
        "compare_at_amount": 0,
        "unit": dp.get("measureUnitName"),
        "pack_note": dp.get("productSpecs"),
        "image_url": image_url,
        "images": imgs,
        "origin_label": p.get("brandOrigin"),
        "country": p.get("brandOrigin"),
        "badge": None,
        "benefit_tag": p.get("specialFeatures"),
        "format_tag": p.get("dosageForm"),
        "trust_label": None,
        "short_description": p.get("shortDescription"),
        "description_html": p.get("description"),
        "usage_html": p.get("usage"),
        "ingredients_html": p.get("webIngredient") or p.get("ingredient"),
        "stock_qty": 0,
    }


def safe_slug_for_filename(slug: str) -> str:
    s = slug.replace("/", "-")
    s = re.sub(r"[^a-zA-Z0-9._-]+", "-", s).strip("-")
    return s or "item"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--target", type=int, default=1000, help="Total number of products to have in products.json")
    ap.add_argument("--delay", type=float, default=0.15, help="Delay between product page fetches (seconds)")
    ap.add_argument("--jitter", type=float, default=0.08, help="Random jitter added to delay (seconds)")
    ap.add_argument("--seed", type=int, default=0, help="Random seed; 0 means random")
    ap.add_argument("--progress-every", type=int, default=25, help="Print progress every N new products")
    args = ap.parse_args()

    root = Path(__file__).resolve().parents[1]
    out_dir = root / "src" / "data" / "longchau" / "products"
    out_dir.mkdir(parents=True, exist_ok=True)
    index_path = out_dir.parent / "products.json"

    existing: list[dict] = []
    existing_slugs: set[str] = set()
    if index_path.exists():
        try:
            existing = json.loads(index_path.read_text(encoding="utf-8"))
            if not isinstance(existing, list):
                existing = []
        except Exception:
            existing = []
    for it in existing:
        if isinstance(it, dict) and isinstance(it.get("slug"), str):
            existing_slugs.add(it["slug"])

    target_total = max(args.target, len(existing))
    need = target_total - len(existing)
    if need <= 0:
        return 0

    print(f"Existing: {len(existing)}; target: {target_total}; need new: {need}")

    # Discover more URLs than we need because some will redirect or be missing product payload.
    candidates = discover_product_urls(limit=target_total * 3)
    if args.seed:
        random.seed(args.seed)
    else:
        random.seed()
    random.shuffle(candidates)

    new_items: list[dict] = []
    picked = 0

    for u in candidates:
        if picked >= need:
            break
        try:
            html = http_get(u).decode("utf-8", "ignore")
        except Exception:
            continue
        payload = parse_next_data_product(html)
        if not payload:
            continue
        item = to_schema(u, payload)
        slug = item.get("slug")
        if not isinstance(slug, str) or not slug:
            continue
        if slug in existing_slugs:
            continue
        existing_slugs.add(slug)

        # Append-style: write the new per-item file immediately so a long run can be resumed.
        i = len(existing) + len(new_items) + 1
        fn = f"{i:04d}-{safe_slug_for_filename(slug)}.json"
        (out_dir / fn).write_text(json.dumps(item, ensure_ascii=False, indent=2), encoding="utf-8")

        new_items.append(item)
        picked += 1

        if args.progress_every and picked % args.progress_every == 0:
            # Save a partial index so the repo always has a usable snapshot.
            partial = existing + new_items
            index_path.write_text(json.dumps(partial, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"Picked {picked}/{need} new (total now {len(partial)}/{target_total}). Last: {slug}")

        time.sleep(max(0.0, args.delay + (random.random() * args.jitter)))

    if picked < need:
        raise SystemExit(f"Only scraped {picked} new products, need {need}.")

    all_items = existing + new_items
    index_path.write_text(json.dumps(all_items, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Done. Total: {len(all_items)} -> {index_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
