import { useState } from "react"
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react"

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

  return (
    <>
      {/* Main image */}
      <div
        className="relative w-full aspect-4/3 bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in"
        onClick={() => activeImage && setIsLightboxOpen(true)}
      >
        {activeImage ? (
          <img
            src={activeImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">Không có ảnh</div>
        )}
        {/* Zoom hint */}
        <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
          <ZoomIn className="w-3.5 h-3.5 inline mr-1" /> Nhấn để xem lớn
        </span>
        {/* Image counter */}
        {images.length > 1 && (
          <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full pointer-events-none">
            {activeIndex + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Thumbnails row — show all images */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={[
                "relative shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all",
                idx === activeIndex
                  ? "border-primary ring-1 ring-primary"
                  : "border-gray-200 opacity-60 hover:opacity-100 hover:border-primary/50",
              ].join(" ")}
            >
              <img
                src={src}
                alt={`${title} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Prev/Next navigation */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors"
                onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + images.length) % images.length) }}
                aria-label="Ảnh trước"
              ><ChevronLeft className="w-5 h-5" /></button>
              <button
                className="absolute right-14 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors"
                onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % images.length) }}
                aria-label="Ảnh sau"
              ><ChevronRight className="w-5 h-5" /></button>
            </>
          )}
          <img
            src={activeImage}
            alt={title}
            className="max-w-[88vw] max-h-[88vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Đóng"
          ><X className="w-5 h-5" /></button>
        </div>
      )}
    </>
  )
}
