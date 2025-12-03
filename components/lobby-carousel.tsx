'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react'

interface LobbyCarouselProps {
  images: string[]
  autoPlayInterval?: number // in milliseconds
}

export function LobbyCarousel({ images, autoPlayInterval = 5000 }: LobbyCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [validImages, setValidImages] = useState<string[]>([])
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  // Filter out images that failed to load
  useEffect(() => {
    const filtered = images.filter(img => !imageErrors.has(img))
    setValidImages(filtered)
    // Reset index if current image is no longer valid
    if (currentIndex >= filtered.length && filtered.length > 0) {
      setCurrentIndex(0)
    }
  }, [images, imageErrors, currentIndex])

  // Auto-play functionality
  useEffect(() => {
    if (validImages.length <= 1 || isHovered) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [validImages.length, isHovered, autoPlayInterval])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (validImages.length === 0) {
    return (
      <div className="aspect-video bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Camera className="h-16 w-16 text-secondary/50 mx-auto mb-4" />
          <p className="text-white/80">Hotel Lobby Gallery</p>
          <p className="text-white/60 text-sm mt-2">Images will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        {validImages[currentIndex] && (
          <Image
            src={validImages[currentIndex]}
            alt={`Hotel lobby view ${currentIndex + 1}`}
            fill
            className="object-cover transition-opacity duration-500"
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            unoptimized
            onError={() => {
              setImageErrors((prev) => new Set(prev).add(validImages[currentIndex]))
            }}
          />
        )}
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Navigation Arrows */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image Indicators */}
      {validImages.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {validImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 w-2 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {validImages.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
          {currentIndex + 1} / {validImages.length}
        </div>
      )}
    </div>
  )
}

