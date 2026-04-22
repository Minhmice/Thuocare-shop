"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type GalleryImage = { src: string; alt: string };

export function ProductGallery({
  images,
  activeIdx,
  setActiveIdx,
}: {
  images: GalleryImage[];
  activeIdx: number;
  setActiveIdx: (idx: number) => void;
}) {
  const activeImg = images[activeIdx] ?? images[0];
  if (!activeImg) return null;

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl border bg-white">
        <Image src={activeImg.src} alt={activeImg.alt} width={900} height={900} className="h-auto w-full object-contain" priority />
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {images.map((img, idx) => (
          <button
            key={`${img.src}-${idx}`}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={cn(
              "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white",
              idx === activeIdx && "border-(--lc-blue-700) ring-2 ring-(--lc-blue-700)/20"
            )}
            aria-label={`Chọn ảnh ${idx + 1}`}
          >
            <Image src={img.src} alt={img.alt} width={96} height={96} className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}

