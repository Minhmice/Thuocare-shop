"use client";

import type { CartLine } from "@/types/commerce";

export const CART_KEY = "thuocare:cart:v1";
const LEGACY_CART_KEY = "longchau:cart:v1";

function migrateLegacyCartIfNeeded() {
  if (typeof window === "undefined") return;

  const hasNew = window.localStorage.getItem(CART_KEY);
  if (hasNew) return;

  const legacy = readJson<CartLine[]>(LEGACY_CART_KEY);
  if (!legacy || legacy.length === 0) return;

  writeJson(CART_KEY, legacy);
  window.localStorage.removeItem(LEGACY_CART_KEY);
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const localDb = {
  cart: {
    get(): CartLine[] {
      migrateLegacyCartIfNeeded();
      return readJson<CartLine[]>(CART_KEY) ?? [];
    },
    set(lines: CartLine[]) {
      writeJson(CART_KEY, lines);
    },
    upsert(productId: string, qtyDelta: number) {
      const lines = localDb.cart.get();
      const idx = lines.findIndex((l) => l.productId === productId);
      if (idx === -1) {
        if (qtyDelta > 0) lines.push({ productId, qty: qtyDelta });
      } else {
        const nextQty = lines[idx]!.qty + qtyDelta;
        if (nextQty <= 0) lines.splice(idx, 1);
        else lines[idx] = { productId, qty: nextQty };
      }
      localDb.cart.set(lines);
      return lines;
    },
    clear() {
      localDb.cart.set([]);
    },
  },
} as const;

