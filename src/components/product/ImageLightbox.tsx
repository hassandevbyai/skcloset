"use client"

import { useEffect, useCallback } from "react"
import Image from "next/image"

interface ImageLightboxProps {
  images: { url: string; alt_text: string }[]
  currentIndex: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function ImageLightbox({ images, currentIndex, onClose, onPrev, onNext }: ImageLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [handleKeyDown])

  const current = images[currentIndex]

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 text-white/60 hover:text-white transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors"
            aria-label="Previous image"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/60 hover:text-white transition-colors"
            aria-label="Next image"
          >
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      <div className="relative w-full h-full max-w-4xl max-h-[90vh] m-8" onClick={(e) => e.stopPropagation()}>
        <Image
          src={current.url}
          alt={current.alt_text}
          fill
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}
