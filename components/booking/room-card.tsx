'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import { motion } from 'framer-motion'
import { Wifi, Car, Coffee, Shield, Star } from 'lucide-react'
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
          {/* Room Image Placeholder */}
          <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">🏨</span>
              </div>
              <p className="text-sm text-gray-500">Room #{room.number}</p>
            </div>
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
