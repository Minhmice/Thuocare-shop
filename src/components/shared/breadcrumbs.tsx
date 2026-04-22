"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[1200px] px-3 pt-4 text-xs text-slate-500 sm:px-4", className)}>
      <div className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => (
          <React.Fragment key={`${c.label}-${i}`}>
            {c.href ? (
              <Link className="hover:text-(--lc-blue-700) hover:underline" href={c.href}>
                {c.label}
              </Link>
            ) : (
              <span className={i === items.length - 1 ? "text-slate-700" : undefined}>{c.label}</span>
            )}
            {i < items.length - 1 ? <span>/</span> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

