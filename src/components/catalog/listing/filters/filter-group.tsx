"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function FilterGroup({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("pt-4 first:pt-0", className)}>
      <Separator className="mb-4" />
      <div className="mb-2 text-sm font-extrabold text-slate-900">{title}</div>
      {children}
    </div>
  );
}

