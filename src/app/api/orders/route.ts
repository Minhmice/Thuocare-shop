import { NextResponse } from "next/server";
import { createOrderFromLocalCart } from "@/data/orders";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      phone: string;
      customerName?: string;
      note?: string;
      items: Array<{ productId: string; qty: number }>;
    };

    const result = await createOrderFromLocalCart({
      phone: body.phone,
      customerName: body.customerName,
      note: body.note,
      items: body.items,
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

