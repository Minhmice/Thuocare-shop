"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { HeaderNavModel, NavTopItem } from "@/components/navigation/nav.types";
import { STATIC_HEADER_NAV } from "@/components/navigation/nav.data";
import { NavPanelView } from "@/components/navigation/nav-panel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Menu, Search, ShoppingCart, User } from "lucide-react";

export function Header({
  className,
  nav = STATIC_HEADER_NAV,
}: {
  className?: string;
  nav?: HeaderNavModel;
}) {
  const [activeTopId, setActiveTopId] = React.useState<string | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const closeTimerRef = React.useRef<number | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();
  const navStripRef = React.useRef<HTMLDivElement | null>(null);
  const pillRefs = React.useRef<Record<string, HTMLElement | null>>({});
  const [indicator, setIndicator] = React.useState<{ x: number; w: number; visible: boolean }>({ x: 0, w: 0, visible: false });

  const activeTop = React.useMemo(() => nav.main.find((i) => i.id === activeTopId) ?? null, [activeTopId, nav.main]);
  const activeMega = activeTop?.mega ?? null;

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function requestClose(delayMs = 360) {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveTopId(null);
      closeTimerRef.current = null;
    }, delayMs);
  }

  React.useEffect(() => {
    if (!activeMega) return;

    function onPointerDown(e: PointerEvent) {
      const el = wrapperRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setActiveTopId(null);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActiveTopId(null);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeMega]);

  const utilityNav = nav.utility;
  const mainNav = nav.main;
  const currentTopId = React.useMemo(() => {
    const cur = mainNav.find((item) => pathname === item.href || (item.href !== "/" && pathname?.startsWith(`${item.href}/`)));
    return cur?.id ?? null;
  }, [mainNav, pathname]);

  const indicatorId = activeTopId ?? currentTopId;

  React.useLayoutEffect(() => {
    const container = navStripRef.current;
    const id = indicatorId;
    if (!container || !id) {
      setIndicator((s) => ({ ...s, visible: false }));
      return;
    }

    const el = pillRefs.current[id];
    if (!el) {
      setIndicator((s) => ({ ...s, visible: false }));
      return;
    }

    const containerBox = container.getBoundingClientRect();
    const elBox = el.getBoundingClientRect();
    const x = elBox.left - containerBox.left;
    const w = elBox.width;
    setIndicator({ x, w, visible: true });
  }, [indicatorId, mainNav.length]);

  function MobileNav({ items }: { items: NavTopItem[] }) {
    const [openIds, setOpenIds] = React.useState<Record<string, boolean>>({});
    return (
      <div className="grid gap-1">
        {items.map((item) => {
          const expanded = Boolean(openIds[item.id]);
          const hasChildren = Boolean(item.mega?.blocks?.length);
          return (
            <div key={item.id} className="rounded-2xl border bg-white">
              <div className="flex items-center gap-2 px-3 py-2">
                <Link href={item.href} className="min-w-0 flex-1 truncate py-2 text-sm font-extrabold text-slate-900" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
                {hasChildren ? (
                  <button
                    type="button"
                    className="grid size-10 place-items-center rounded-xl text-slate-700 hover:bg-slate-50"
                    aria-label={expanded ? `Thu gọn ${item.label}` : `Mở ${item.label}`}
                    aria-expanded={expanded}
                    onClick={() => setOpenIds((cur) => ({ ...cur, [item.id]: !expanded }))}
                  >
                    <span className="text-sm">{expanded ? "▴" : "▾"}</span>
                  </button>
                ) : null}
              </div>
              {hasChildren && expanded ? (
                <div className="border-t px-3 py-3">
                  <Link href={item.href} className="mb-3 inline-flex text-xs font-semibold text-(--lc-accent-700) hover:underline" onClick={() => setMobileOpen(false)}>
                    Xem tất cả
                  </Link>
                  <div className="grid gap-3">
                    {item.mega?.blocks
                      .filter((b) => b.kind === "links")
                      .map((b) => (
                        <div key={b.id}>
                          <div className="text-xs font-extrabold text-slate-700">{b.title}</div>
                          <div className="mt-2 grid gap-1">
                            {b.links.slice(0, 8).map((l) => (
                              <Link
                                key={l.id}
                                href={l.href}
                                className="rounded-xl px-2 py-2 text-sm text-slate-800 hover:bg-slate-50"
                                onClick={() => setMobileOpen(false)}
                              >
                                {l.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <header className={cn("sticky top-0 z-40 w-full", className)}>
      <div className="bg-transparent">
        <div className="mx-auto w-[calc(100%-24px)] max-w-[1200px] pb-2 pt-3 sm:w-[calc(100%-32px)]">
          <div
            ref={wrapperRef}
            className={cn(
              "relative",
              "animate-in fade-in slide-in-from-top-1 duration-300",
              "rounded-3xl border border-border bg-white",
              "shadow-[0_18px_50px_rgba(0,52,40,0.10)]"
            )}
            onMouseEnter={() => clearCloseTimer()}
            onMouseLeave={() => requestClose()}
          >
            <div className="px-3 py-3 sm:px-4">
              <div className="flex items-center gap-3">
            <button
              type="button"
              className={cn(
                "grid size-11 place-items-center rounded-2xl",
                "bg-[color:var(--lc-surface)] text-slate-700 ring-1 ring-black/5",
                "transition-colors hover:bg-white",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                "sm:hidden"
              )}
              aria-label="Mở menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-5" />
            </button>
            <Link href="/" className="flex shrink-0 items-center gap-2.5">
              <div
                className={cn(
                  "grid size-10 place-items-center rounded-2xl",
                  "bg-(--lc-accent-800) text-white shadow-[0_10px_22px_rgba(0,52,40,0.18)]",
                  "ring-1 ring-black/5"
                )}
              >
                <span className="text-[11px] font-extrabold leading-none tracking-wide">T</span>
              </div>
              <div className="leading-[1.05]">
                <div className="text-[10px] font-semibold tracking-[0.22em] text-slate-500">THUỐC</div>
                <div className="text-sm font-extrabold tracking-[0.08em] text-slate-900">THUOCARE</div>
              </div>
            </Link>

            <div className="relative hidden flex-1 sm:block">
              <div
                className={cn(
                  "group relative flex h-12 w-full items-center rounded-full",
                  "bg-[color:var(--lc-surface)] px-3",
                  "ring-1 ring-border",
                  "shadow-[0_10px_24px_rgba(2,33,24,0.06)]",
                  "transition-[box-shadow,background-color,transform] duration-200 ease-out",
                  "hover:bg-white hover:shadow-[0_14px_30px_rgba(2,33,24,0.08)]",
                  "focus-within:bg-white focus-within:ring-2 focus-within:ring-ring/35"
                )}
              >
                <Search className="ml-1 size-[18px] text-slate-400 transition-colors group-focus-within:text-(--lc-accent-700)" />
                <input
                  className={cn(
                    "h-full w-full bg-transparent px-3 text-sm text-slate-900",
                    "placeholder:text-slate-500",
                    "outline-none"
                  )}
                  placeholder="Tìm thuốc, triệu chứng, hoạt chất, danh mục…"
                />
                <Button
                  className={cn(
                    "h-10 rounded-full px-5 text-white",
                    "bg-(--lc-accent-800) hover:bg-(--lc-accent-900)",
                    "shadow-[0_10px_22px_rgba(0,52,40,0.16)]",
                    "transition-[transform,box-shadow,background-color] duration-150 ease-out",
                    "active:translate-y-px active:shadow-[0_6px_14px_rgba(0,52,40,0.14)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  )}
                >
                  Tìm kiếm
                </Button>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-white p-1 shadow-sm">
                <button
                  type="button"
                  className={cn(
                    "relative grid size-10 place-items-center rounded-full text-slate-700",
                    "transition-[background-color,transform,color] duration-150 ease-out",
                    "hover:bg-[color:var(--lc-surface)] hover:text-(--lc-accent-900)",
                    "active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
                  )}
                  aria-label="Tài khoản"
                >
                  <User className="size-[18px]" />
                </button>
                <button
                  type="button"
                  className={cn(
                    "relative grid size-10 place-items-center rounded-full text-slate-700",
                    "transition-[background-color,transform,color] duration-150 ease-out",
                    "hover:bg-[color:var(--lc-surface)] hover:text-(--lc-accent-900)",
                    "active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
                  )}
                  aria-label="Giỏ hàng"
                >
                  <ShoppingCart className="size-[18px]" />
                  <span
                    className={cn(
                      "absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full px-1.5 py-0.5",
                      "bg-(--lc-accent-800) text-[10px] font-extrabold leading-none text-white",
                      "ring-2 ring-white"
                    )}
                  >
                    3
                  </span>
                </button>
              </div>
            </div>
          </div>
            </div>
          </div>

          {mainNav.length ? (
            <div className="hidden sm:block">
              <div className="mx-3 h-px bg-border/70 sm:mx-4" />
              <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                <nav aria-label="Danh mục">
                  <div className="rounded-full bg-[color:var(--lc-surface)] p-1 ring-1 ring-border/80">
                    <div ref={navStripRef} className="relative flex items-center gap-1 overflow-x-auto px-1">
                      <div
                        aria-hidden="true"
                        className={cn(
                          "pointer-events-none absolute left-1 top-1 bottom-1 rounded-full",
                          "bg-white ring-1 ring-border/80",
                          "shadow-[0_10px_18px_rgba(0,52,40,0.08)]",
                          "transition-[transform,width,opacity] duration-200 ease-out"
                        )}
                        style={{
                          width: `${indicator.w}px`,
                          transform: `translateX(${indicator.x}px)`,
                          opacity: indicator.visible ? 1 : 0,
                        }}
                      />

                      {mainNav.map((item) => {
                        const hasDropdown = Boolean(item.mega);
                        const isActive = item.id === activeTopId;
                        const isCurrent = item.id === currentTopId;
                        const isSelected = isActive || (!activeTopId && isCurrent);

                        return (
                          <div
                            key={item.id}
                            className="relative inline-flex shrink-0 items-center"
                            onMouseEnter={() => {
                              clearCloseTimer();
                              if (hasDropdown) setActiveTopId(item.id);
                            }}
                            onMouseLeave={() => {
                              if (hasDropdown) requestClose(420);
                            }}
                          >
                            <Link
                              ref={(el) => {
                                pillRefs.current[item.id] = el;
                              }}
                              className={cn(
                                "relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-sm",
                                "transition-[color,transform,background-color] duration-150 ease-out",
                                isSelected ? "text-(--lc-accent-900)" : "text-slate-700 hover:text-(--lc-accent-900)",
                                "hover:bg-white/60 active:translate-y-px",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--lc-accent-700)/30"
                              )}
                              aria-current={isCurrent ? "page" : undefined}
                              onFocus={() => (hasDropdown ? setActiveTopId(item.id) : null)}
                              href={item.href}
                            >
                              <span className={cn("font-semibold", isSelected && "font-extrabold")}>{item.label}</span>
                            </Link>

                            {hasDropdown ? (
                              <button
                                type="button"
                                className={cn(
                                  "relative z-10 -ml-2 grid size-9 place-items-center rounded-full text-[11px] text-slate-600",
                                  "transition-[background-color,color,transform] duration-150 ease-out",
                                  isActive ? "text-(--lc-accent-900)" : "hover:text-(--lc-accent-900)",
                                  "hover:bg-white/60 active:translate-y-px",
                                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--lc-accent-700)/30"
                                )}
                                aria-label={isActive ? `Đóng menu ${item.label}` : `Mở menu ${item.label}`}
                                aria-haspopup="menu"
                                aria-expanded={isActive}
                                onFocus={() => setActiveTopId(item.id)}
                                onClick={() => setActiveTopId((cur) => (cur === item.id ? null : item.id))}
                              >
                                ▾
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          ) : null}

          {activeMega ? (
            <div className="pointer-events-none absolute left-0 right-0 top-full hidden sm:block">
              <div className="pointer-events-auto pt-3">
                <NavPanelView topItem={activeTop} />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
        <DialogContent
          className={cn(
            "left-auto top-0 h-full w-[min(420px,calc(100vw-16px))] translate-x-0 translate-y-0 rounded-none rounded-l-3xl",
            "right-0"
          )}
        >
          <DialogHeader className="border-b px-5 py-4">
            <DialogTitle>Menu</DialogTitle>
            <button
              type="button"
              className="grid size-10 place-items-center rounded-full border text-slate-700 hover:bg-slate-50"
              aria-label="Đóng"
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>
          </DialogHeader>
          <div className="max-h-[calc(100vh-80px)] overflow-auto p-5">
            {utilityNav.length ? (
              <>
                <div className="mb-3 text-xs font-extrabold text-slate-700">Dịch vụ</div>
                <MobileNav items={utilityNav} />
                <div className="my-5 h-px bg-slate-200" />
              </>
            ) : null}
            <div className="mb-3 text-xs font-extrabold text-slate-700">Danh mục mua sắm</div>
            <MobileNav items={mainNav} />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}

