"use client"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "@/components/layout/Icons"

interface GalleryImage {
  url: string
  alt: string
}

interface ProductGalleryProps {
  images: GalleryImage[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoom, setZoom] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }, [])

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-secondary flex items-center justify-center">
        <span className="text-xs text-muted-foreground">No image</span>
      </div>
    )
  }

  const current = images[activeIndex]

  return (
    <div className="flex gap-4">
      {images.length > 1 && (
        <div className="hidden sm:flex flex-col gap-2 w-20 shrink-0">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`aspect-[4/5] bg-secondary overflow-hidden relative transition-colors ${
                activeIndex === i ? "ring-1 ring-foreground" : "ring-1 ring-transparent hover:ring-border"
              }`}
            >
              <Image src={img.url} alt={img.alt || `View ${i + 1}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 space-y-4">
        <div
          ref={containerRef}
          className="aspect-[4/5] bg-secondary overflow-hidden relative w-full cursor-crosshair group"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <div className={`w-full h-full transition-all duration-500 ${zoom ? "scale-150" : "scale-100"}`}
            style={zoom ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
          >
            <Image
              src={current.url}
              alt={current.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-opacity duration-500"
              priority={activeIndex === 0}
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-background/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === activeIndex ? "bg-foreground" : "bg-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex sm:hidden gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`aspect-square w-16 shrink-0 bg-secondary overflow-hidden relative transition-colors ${
                  activeIndex === i ? "ring-1 ring-foreground" : "ring-1 ring-transparent"
                }`}
              >
                <Image src={img.url} alt={img.alt || `View ${i + 1}`} fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}