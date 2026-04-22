"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TopNavItem } from "@/components/navigation/nav.types";
import { TOP_NAV } from "@/components/navigation/nav.data";
import { NavPanelView } from "@/components/navigation/nav-panel";
import { Search } from "lucide-react";

export function Header({
  className,
  nav = TOP_NAV,
}: {
  className?: string;
  nav?: TopNavItem[];
}) {
  const [activeTopId, setActiveTopId] = React.useState<string | null>(null);
  const [activeSidebarId, setActiveSidebarId] = React.useState<string | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const closeTimerRef = React.useRef<number | null>(null);

  const activeTop = React.useMemo(() => nav.find((i) => i.id === activeTopId) ?? null, [activeTopId, nav]);
  const activePanel = activeTop?.panel ?? null;

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function requestClose(delayMs = 140) {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveTopId(null);
      setActiveSidebarId(null);
      closeTimerRef.current = null;
    }, delayMs);
  }

  React.useEffect(() => {
    if (!activePanel) return;

    function onPointerDown(e: PointerEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setActiveTopId(null);
      setActiveSidebarId(null);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveTopId(null);
        setActiveSidebarId(null);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activePanel]);

  return (
    <header className={cn("sticky top-0 z-40 w-full", className)}>
      <div className="bg-white">
        <div className="mx-auto max-w-[1200px] px-3 py-3 sm:px-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <div className="grid size-10 place-items-center rounded-2xl bg-(--lc-blue-700) text-white shadow-sm">
                <span className="text-[11px] font-extrabold leading-none">T</span>
              </div>
              <div className="leading-tight">
                <div className="text-[10px] font-semibold text-slate-600">THUỐC</div>
                <div className="text-sm font-extrabold tracking-wide text-slate-900">THUOCARE</div>
              </div>
            </Link>

            <div className="relative hidden flex-1 sm:block">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                className="h-11 w-full rounded-full bg-(--lc-surface) px-10 pr-28 text-sm text-slate-900 placeholder:text-slate-500 shadow-sm outline-none ring-1 ring-black/5 focus:ring-2 focus:ring-(--lc-blue-700)/30"
                placeholder="Tìm thuốc, triệu chứng, hoạt chất, danh mục…"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button className="h-9 rounded-full bg-(--lc-blue-700) px-5 text-white hover:bg-(--lc-blue-800)">Tìm kiếm</Button>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" className="h-10 rounded-full">
                Tài khoản
              </Button>
              <Button className="h-10 rounded-full bg-(--lc-blue-700) text-white hover:bg-(--lc-blue-800)">Giỏ hàng</Button>
            </div>
          </div>
        </div>
      </div>

      {nav.length ? (
        <div className="border-b bg-white">
          <div ref={wrapperRef} className="relative" onMouseEnter={() => clearCloseTimer()} onMouseLeave={() => requestClose()}>
            <nav className="mx-auto flex max-w-[1200px] items-center gap-5 overflow-x-auto px-3 py-2 text-sm text-slate-800 sm:px-4">
              {nav.map((item) => {
                const hasDropdown = Boolean(item.panel);
                const isActive = item.id === activeTopId;

                if (!hasDropdown) {
                  return (
                    <a key={item.id} href={item.href ?? "#"} className="inline-flex items-center gap-1 whitespace-nowrap hover:text-(--lc-blue-800)">
                      {item.label}
                    </a>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={cn("inline-flex items-center gap-1 whitespace-nowrap transition hover:text-(--lc-blue-800)", isActive && "text-(--lc-blue-800)")}
                    aria-haspopup="menu"
                    aria-expanded={isActive}
                    onMouseEnter={() => {
                      clearCloseTimer();
                      setActiveTopId(item.id);
                    }}
                    onFocus={() => setActiveTopId(item.id)}
                    onClick={() => setActiveTopId((cur) => (cur === item.id ? null : item.id))}
                  >
                    {item.label}
                    <span className="text-xs opacity-70">▾</span>
                  </button>
                );
              })}
            </nav>

            {activePanel ? (
              <>
                <div className="pointer-events-none absolute left-0 right-0 top-full hidden sm:block">
                  <div className="pointer-events-auto mx-auto max-w-[1200px] px-3 pb-4 pt-3 sm:px-4">
                    <NavPanelView panel={activePanel} mode="desktop" activeSidebarId={activeSidebarId} setActiveSidebarId={setActiveSidebarId} />
                  </div>
                </div>

                <div className="sm:hidden">
                  <div className="mx-auto max-w-[1200px] px-3 pb-4 sm:px-4">
                    <NavPanelView panel={activePanel} mode="mobile" activeSidebarId={activeSidebarId} setActiveSidebarId={setActiveSidebarId} />
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

