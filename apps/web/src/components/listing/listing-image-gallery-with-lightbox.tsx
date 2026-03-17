"use client"

import { useState } from "react"

interface ListingImageGalleryWithLightboxProps {
  images: string[]
  title: string
}

export function ListingImageGalleryWithLightbox({
  images,
  title,
}: ListingImageGalleryWithLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const activeImage = images[activeIndex] ?? ""
  const thumbnails = images.slice(0, 3)

  return (
    <>
      {/* Gallery layout */}
      <div className="flex flex-col gap-2 md:flex-row">
        {/* Main image */}
        <div
          className="relative md:w-2/3 aspect-[4/3] bg-muted rounded-xl overflow-hidden cursor-zoom-in"
          onClick={() => activeImage && setIsLightboxOpen(true)}
        >
          {activeImage ? (
            <img
              src={activeImage}
              alt={title}
              className="w-full h-full object-cover transition-opacity duration-200"
            />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        {/* Thumbnails — vertical on desktop, horizontal scroll on mobile */}
        <div className="flex flex-row gap-2 overflow-x-auto md:flex-col md:w-1/3 md:overflow-x-visible">
          {thumbnails.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={[
                "relative shrink-0 w-24 h-20 md:w-full md:h-full md:aspect-[4/3] rounded-lg overflow-hidden bg-muted border-2 transition-all",
                idx === activeIndex
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100",
              ].join(" ")}
            >
              {src ? (
                <img
                  src={src}
                  alt={`${title} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox overlay */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setIsLightboxOpen(false)}
        >
          <img
            src={activeImage}
            alt={title}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl leading-none hover:text-primary transition-colors"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
      )}
    </>
  )
}
