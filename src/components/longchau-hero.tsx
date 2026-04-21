"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type HeroSlide = {
  id: string;
  imageUrl: string;
  alt: string;
  ctaLabel: string;
};

const SLIDES: HeroSlide[] = [
  {
    id: "hero-1",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90):format(webp)/D_H1_Desktop_1200x367_0927ab9e8c.png",
    alt: "Banner khuyến mãi",
    ctaLabel: "Mua ngay",
  },
  {
    id: "hero-2",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/1920x0/filters:quality(90):format(webp)/D_H1_Desktop_1200x367_25e0d1a1f9.png",
    alt: "Banner sức khỏe",
    ctaLabel: "Xem ngay",
  },
];

export function LongChauHero({ className }: { className?: string }) {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 6500);
    return () => window.clearInterval(t);
  }, []);

  const slide = SLIDES[active]!;

  return (
    <section className={cn("bg-[color:var(--lc-blue-950)]/5", className)}>
      <div className="mx-auto max-w-[1200px] px-3 py-3 sm:px-4 sm:py-4">
        <div className="relative overflow-hidden rounded-2xl bg-[color:var(--lc-blue-900)]">
          <Image
            src={slide.imageUrl}
            alt={slide.alt}
            width={1200}
            height={367}
            className="block h-auto w-full select-none object-cover"
            priority
          />

          <button
            type="button"
            aria-label="Previous"
            onClick={() => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length)}
            className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-slate-900 shadow hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => setActive((i) => (i + 1) % SLIDES.length)}
            className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-slate-900 shadow hover:bg-white"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setActive(idx)}
                className={cn(
                  "h-2 w-2 rounded-full bg-white/60",
                  idx === active && "w-6 bg-white"
                )}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />

          <div className="absolute bottom-4 left-4">
            <Button className="pointer-events-auto h-9 rounded-full bg-white px-6 text-[color:var(--lc-blue-800)] hover:bg-white/90">
              {slide.ctaLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

