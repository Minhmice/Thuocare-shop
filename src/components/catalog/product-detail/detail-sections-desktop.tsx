"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function DetailSectionsDesktop({
  tabs,
  className,
}: {
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
  className?: string;
}) {
  const tabOrder = tabs.map((t) => t.id);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(tabOrder[0] ?? "");

  const detailCardRef = React.useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null);
  const sectionElsRef = React.useRef<Record<string, HTMLElement | null>>({});

  React.useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;

    const elements = tabOrder.map((id) => sectionElsRef.current[id]).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries.filter((e) => e.isIntersecting) as Array<IntersectionObserverEntry & { target: HTMLElement }>;
        if (inView.length === 0) return;
        inView.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const nextId = inView[0]?.target.id;
        if (nextId) setActiveSectionId(nextId);
      },
      { root, threshold: [0.15, 0.3, 0.6], rootMargin: "-15% 0px -75% 0px" }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = React.useCallback((id: string) => {
    setActiveSectionId(id);

    const cardEl = detailCardRef.current;
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      const viewportH = window.innerHeight || 0;
      const desiredTopOffset = 96;
      const isCompletelyAbove = rect.bottom <= 0;
      const isCompletelyBelow = rect.top >= viewportH;
      if (isCompletelyAbove || isCompletelyBelow) {
        const targetY = window.scrollY + rect.top - desiredTopOffset;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
      }
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const root = scrollAreaRef.current;
        const el = sectionElsRef.current[id];
        if (!root || !el) return;
        const rootRect = root.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const paddingTop = 12;
        const nextTop = root.scrollTop + (elRect.top - rootRect.top) - paddingTop;
        root.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
      });
    });
  }, []);

  return (
    <div ref={detailCardRef} className={cn("mt-8 hidden lg:block", className)}>
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <aside className="border-r pr-4">
            <div className="sticky top-4">
              <nav className="grid gap-2">
                {tabs.map((t) => {
                  const isActive = activeSectionId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => scrollToSection(t.id)}
                      className={cn(
                        "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
                        isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          <div ref={scrollAreaRef} className="max-h-[640px] overflow-y-auto scroll-smooth rounded-xl bg-white pr-2">
            <div className="space-y-8 pb-2">
              {tabs.map((t) => (
                <section
                  key={t.id}
                  id={t.id}
                  ref={(el) => {
                    sectionElsRef.current[t.id] = el;
                  }}
                  className="scroll-mt-4"
                >
                  {t.content}
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

