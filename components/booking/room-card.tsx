'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import { motion } from 'framer-motion'
import { Wifi, Car, Coffee, Shield, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface RoomCardProps {
  room: {
    id: string
    number: string
    type: string
    basePrice: number
    totalPrice: number
    taxAmount: number
    maxGuests: number
    amenities: string[]
    cancellationPolicy: string
  }
  onSelect: (roomId: string) => void
  isSelected?: boolean
}

const amenityIcons: Record<string, React.ReactNode> = {
  'WiFi': <Wifi className="h-4 w-4" />,
  'Parking': <Car className="h-4 w-4" />,
  'Coffee': <Coffee className="h-4 w-4" />,
  'Security': <Shield className="h-4 w-4" />,
}


export function RoomCard({ room, onSelect, isSelected = false }: RoomCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [validImages, setValidImages] = useState<string[]>([])
  const triedPathsRef = useRef<Set<string>>(new Set()) // Track which paths we've already tried
  const loadingRef = useRef<Set<number>>(new Set()) // Track which image numbers are currently loading
  
  // Initialize: Try loading images one by one, starting with highest priority format
  useEffect(() => {
    // Reset state when room type changes
    setValidImages([])
    triedPathsRef.current.clear()
    loadingRef.current.clear()
    setCurrentImageIndex(0)
    
    const formats = ['jpg', 'png', 'webp']
    const typeLower = room.type.toLowerCase()
    let isMounted = true
    
    const tryLoadImage = (num: number) => {
      if (!isMounted || loadingRef.current.has(num)) return
      
      // Find the next format to try for this number
      let formatToTry: string | null = null
      for (const format of formats) {
        const path = `/images/rooms/${typeLower}/${num}.${format}`
        if (!triedPathsRef.current.has(path)) {
          formatToTry = format
          break
        }
      }
      
      if (!formatToTry) return // All formats tried
      
      const path = `/images/rooms/${typeLower}/${num}.${formatToTry}`
      triedPathsRef.current.add(path)
      loadingRef.current.add(num)
      
      // Try loading this image (use native Image constructor, not Next.js Image component)
      const img = new window.Image()
      img.onload = () => {
        if (!isMounted) return
        loadingRef.current.delete(num)
        setValidImages(prev => {
          // Check if we already have an image for this number
          const match = path.match(/\/(\d+)\.(jpg|png|webp)$/)
          if (!match) return prev
          const imageNumber = parseInt(match[1])
          
          const hasImageForNumber = prev.some(p => {
            const pMatch = p.match(/\/(\d+)\.(jpg|png|webp)$/)
            return pMatch && parseInt(pMatch[1]) === imageNumber
          })
          
          if (hasImageForNumber) return prev // Already have image for this number
          
          // Add new image
          return [...prev, path]
        })
      }
      img.onerror = () => {
        if (!isMounted) return
        loadingRef.current.delete(num)
        // Try next format
        setTimeout(() => {
          if (isMounted) {
            tryLoadImage(num)
          }
        }, 50)
      }
      img.src = path
    }
    
    // Try loading all images
    for (let num = 1; num <= 4; num++) {
      tryLoadImage(num)
    }
    
    return () => {
      isMounted = false
      loadingRef.current.clear()
    }
  }, [room.type]) // Only run when room type changes
  
  // Filter to only show successfully loaded images, sorted by number
  const availableImages = validImages.length > 0 
    ? validImages.sort((a, b) => {
        const numA = parseInt(a.match(/\/(\d+)\.(jpg|png|webp)$/)?.[1] || '0')
        const numB = parseInt(b.match(/\/(\d+)\.(jpg|png|webp)$/)?.[1] || '0')
        return numA - numB
      })
    : []
  
  // Auto-advance images every 5 seconds if there are multiple images
  useEffect(() => {
    if (availableImages.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % availableImages.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [availableImages.length])
  
  
  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length)
  }
  
  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length)
  }
  
  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }
  
  // Reset current index when available images change
  useEffect(() => {
    if (currentImageIndex >= availableImages.length && availableImages.length > 0) {
      setCurrentImageIndex(0)
    }
  }, [availableImages.length, currentImageIndex])
  return (
    <div className="transition-transform duration-300 hover:-translate-y-1">
      <Card className={`cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg' 
          : 'hover:shadow-lg hover:border-primary/50'
      }`}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                {room.type} Room #{room.number}
              </CardTitle>
              <CardDescription className="mt-1">
                Up to {room.maxGuests} guests
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              <Star className="h-3 w-3 mr-1" />
              {room.type}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Room Image Carousel */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 overflow-hidden relative group">
            {availableImages.length > 0 && 
             currentImageIndex >= 0 && 
             currentImageIndex < availableImages.length && 
             availableImages[currentImageIndex] ? (
              <>
                {/* Main Image */}
                <Image
                  key={`${room.id}-${availableImages[currentImageIndex]}-${currentImageIndex}`}
                  src={availableImages[currentImageIndex] || ''}
                  alt={`${room.type} Room ${room.number} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover transition-opacity duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
                
                {/* Preload adjacent images for smoother transitions */}
                {availableImages.length > 1 && (
                  <>
                    {/* Preload next image */}
                    {availableImages[(currentImageIndex + 1) % availableImages.length] && (
                      <img
                        key={`preload-next-${availableImages[(currentImageIndex + 1) % availableImages.length]}`}
                        src={availableImages[(currentImageIndex + 1) % availableImages.length]}
                        alt=""
                        className="hidden"
                      />
                    )}
                    {/* Preload previous image */}
                    {availableImages[(currentImageIndex - 1 + availableImages.length) % availableImages.length] && (
                      <img
                        key={`preload-prev-${availableImages[(currentImageIndex - 1 + availableImages.length) % availableImages.length]}`}
                        src={availableImages[(currentImageIndex - 1 + availableImages.length) % availableImages.length]}
                        alt=""
                        className="hidden"
                      />
                    )}
                  </>
                )}
                
                
                {/* Navigation Arrows - Show on hover */}
                {availableImages.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                
                {/* Image Indicators - Show on hover */}
                {availableImages.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {availableImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation()
                          goToImage(index)
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 w-1.5 hover:bg-white/75'
                        }`}
                        aria-label={`Go to image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <span className="text-2xl">🏨</span>
                  </div>
                  <p className="text-sm text-gray-500">Room #{room.number}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {room.type} Room
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
                  {amenityIcons[amenity] || <Star className="h-3 w-3" />}
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span>Base price</span>
              <span>{formatCurrency(room.basePrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Taxes & fees</span>
              <span>{formatCurrency(room.taxAmount)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total per night</span>
                <span className="text-primary">{formatCurrency(room.totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Cancellation Policy</p>
            <p className="text-xs text-gray-700">{room.cancellationPolicy}</p>
          </div>

          {/* Select Button */}
          <Button 
            onClick={() => onSelect(room.id)}
            className="w-full"
            variant={isSelected ? "default" : "outline"}
          >
            {isSelected ? 'Selected' : 'Select Room'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
