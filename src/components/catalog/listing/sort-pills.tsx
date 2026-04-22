"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type SortKey = "ban-chay" | "gia-thap" | "gia-cao";

export function SortPills({
  value,
  onValueChange,
  className,
}: {
  value: SortKey;
  onValueChange: (next: SortKey) => void;
  className?: string;
}) {
  const items: Array<{ id: SortKey; label: string }> = [
    { id: "ban-chay", label: "Bán chạy" },
    { id: "gia-thap", label: "Giá thấp" },
    { id: "gia-cao", label: "Giá cao" },
  ];

  return (
    <div className={cn("flex items-center gap-2 rounded-full bg-slate-100 p-1", className)}>
      {items.map((s) => (
        <Button
          key={s.id}
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onValueChange(s.id)}
          className={cn(
            "h-8 rounded-full px-3 text-xs font-semibold",
            value === s.id ? "bg-white text-(--lc-blue-700) shadow hover:bg-white" : "text-slate-700 hover:bg-transparent"
          )}
        >
          {s.label}
        </Button>
      ))}
    </div>
  );
}

