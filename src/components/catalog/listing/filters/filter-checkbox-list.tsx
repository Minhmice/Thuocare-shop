"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function FilterCheckboxList({
  items,
  defaultCheckedIndex = 0,
}: {
  items: string[];
  defaultCheckedIndex?: number | null;
}) {
  return (
    <div className="space-y-2">
      {items.map((t, i) => {
        const id = `${t}-${i}`;
        return (
          <div key={id} className="flex items-center gap-2">
            <Checkbox id={id} defaultChecked={defaultCheckedIndex === i} />
            <Label htmlFor={id} className="text-sm font-normal text-slate-700">
              {t}
            </Label>
          </div>
        );
      })}
    </div>
  );
}

