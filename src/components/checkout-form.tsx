"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CART_KEY } from "@/lib/local-db";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import { formatVnd } from "@/lib/money";
import type { CartLine } from "@/types/commerce";

export function CheckoutForm() {
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);
  const [phone, setPhone] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{ orderId: string; subtotalAmount: number } | null>(null);

  async function submit() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          phone,
          items: cartLines.map((l) => ({ productId: l.productId, qty: l.qty })),
        }),
      });
      const json = (await res.json()) as
        | { ok: true; orderId: string; subtotalAmount: number }
        | { ok: false; error: string };
      if (!json.ok) throw new Error(json.error ?? "Đặt hàng thất bại");
      setResult({ orderId: json.orderId, subtotalAmount: json.subtotalAmount });
      setCartLines([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 grid gap-3">
      <label className="grid gap-1 text-sm font-semibold text-slate-800">
        Số điện thoại
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="VD: 090xxxxxxx"
          className="h-11 rounded-2xl border px-4 outline-none focus:ring-2 focus:ring-[color:var(--lc-blue-700)]/25"
        />
      </label>

      <div className="rounded-2xl bg-[color:var(--lc-surface)] p-4">
        <div className="text-sm font-extrabold text-slate-900">Giỏ hàng (local)</div>
        <div className="mt-1 text-sm text-slate-600">Số dòng: {cartLines.length}</div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
          {cartLines.map((l) => (
            <span key={l.productId} className="rounded-full bg-white px-3 py-1">
              {l.productId} × {l.qty}
            </span>
          ))}
        </div>
      </div>

      <Button
        className="h-11 rounded-full bg-[color:var(--lc-blue-700)] text-white hover:bg-[color:var(--lc-blue-800)]"
        disabled={loading || !cartLines.length}
        onClick={submit}
      >
        {loading ? "Đang tạo đơn…" : "Xác nhận đặt hàng"}
      </Button>

      {result ? (
        <div className="rounded-2xl border bg-white p-4 text-sm text-slate-700">
          Tạo đơn thành công. Mã đơn: <span className="font-mono font-semibold">{result.orderId}</span> — Tổng:{" "}
          <span className="font-semibold">{formatVnd(result.subtotalAmount)}</span>
        </div>
      ) : null}
    </div>
  );
}

