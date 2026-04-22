"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function DetailTabsMobile({
  tabs,
  value,
  onValueChange,
}: {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  value: string;
  onValueChange: (id: string) => void;
}) {
  return (
    <div className="mt-8 border-t pt-5 lg:hidden">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onValueChange(t.id)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold",
              value === t.id
                ? "border-(--lc-blue-700) bg-(--lc-blue-700) text-white"
                : "bg-white text-slate-800 hover:border-(--lc-blue-700) hover:text-(--lc-blue-700)"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">{tabs.find((t) => t.id === value)?.content ?? tabs[0]?.content}</div>
    </div>
  );
}

