'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

import { StepWizard } from '@/components/booking/step-wizard'
import { RoomCard } from '@/components/booking/room-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { bookingSearchSchema } from '@/lib/validations'
import { formatCurrency } from '@/lib/utils'
import { Calendar, Users, Search, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LogoSVG } from '@/components/logo'

const steps = [
  { id: 'search', title: 'Search', description: 'Find your room', status: 'current' as const },
  { id: 'details', title: 'Details', description: 'Guest information', status: 'upcoming' as const },
  { id: 'id', title: 'ID Capture', description: 'Identity verification', status: 'upcoming' as const },
  { id: 'payment', title: 'Payment', description: 'Secure payment', status: 'upcoming' as const },
  { id: 'biometric', title: 'Biometric', description: 'Face verification', status: 'upcoming' as const },
  { id: 'confirm', title: 'Confirm', description: 'Complete booking', status: 'upcoming' as const },
]

// Mock data - in real app, this would come from API
const mockRooms = [
  {
    id: '1',
    number: '101',
    type: 'Standard',
    basePrice: 15000,
    totalPrice: 16275,
    taxAmount: 1275,
    maxGuests: 2,
    amenities: ['WiFi', 'Coffee', 'Security'],
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in'
  },
  {
    id: '2',
    number: '201',
    type: 'Deluxe',
    basePrice: 25000,
    totalPrice: 27125,
    taxAmount: 2125,
    maxGuests: 4,
    amenities: ['WiFi', 'Coffee', 'Security', 'Parking'],
    cancellationPolicy: 'Free cancellation up to 48 hours before check-in'
  },
  {
    id: '3',
    number: '301',
    type: 'Suite',
    basePrice: 40000,
    totalPrice: 43400,
    taxAmount: 3400,
    maxGuests: 6,
    amenities: ['WiFi', 'Coffee', 'Security', 'Parking'],
    cancellationPolicy: 'Free cancellation up to 72 hours before check-in'
  }
]

export default function BookingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<typeof mockRooms>([])

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(bookingSearchSchema),
    defaultValues: {
      checkInDate: '',
      checkOutDate: '',
      guests: 1,
      roomType: undefined,
    }
  })

  const onSubmit = async (data: any) => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSearchResults(mockRooms)
      toast({
        title: "Search Complete",
        description: `Found ${mockRooms.length} available rooms`,
      })
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId)
  }

  const handleContinue = () => {
    if (!selectedRoom) {
      toast({
        title: "Room Selection Required",
        description: "Please select a room to continue",
        variant: "destructive",
      })
      return
    }

    const selectedRoomData = searchResults.find(room => room.id === selectedRoom)
    if (selectedRoomData) {
      // Store booking data in session storage for next steps
      sessionStorage.setItem('bookingData', JSON.stringify({
        search: watch(),
        selectedRoom: selectedRoomData
      }))
      router.push('/booking/details')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LogoSVG variant="dark" />
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Book Your Stay</h1>
          <p className="text-xl text-gray-600">Experience the future of hospitality</p>
        </div>

        {/* Step Wizard */}
        <div className="mb-8">
          <StepWizard steps={steps} currentStep={0} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Rooms
                </CardTitle>
                <CardDescription>
                  Find the perfect room for your stay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="checkInDate">Check-in Date</Label>
                    <Input
                      id="checkInDate"
                      type="date"
                      {...register('checkInDate')}
                      className={errors.checkInDate ? 'border-red-500' : ''}
                    />
                    {errors.checkInDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.checkInDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="checkOutDate">Check-out Date</Label>
                    <Input
                      id="checkOutDate"
                      type="date"
                      {...register('checkOutDate')}
                      className={errors.checkOutDate ? 'border-red-500' : ''}
                    />
                    {errors.checkOutDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.checkOutDate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Select onValueChange={(value) => setValue('guests', parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.guests && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.guests.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="roomType">Room Type (Optional)</Label>
                    <Select onValueChange={(value) => setValue('roomType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard">Standard</SelectItem>
                        <SelectItem value="Deluxe">Deluxe</SelectItem>
                        <SelectItem value="Suite">Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    <Search className="h-4 w-4 mr-2" />
                    Search Rooms
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-2">
            {searchResults.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Search for Available Rooms
                  </h3>
                  <p className="text-gray-500">
                    Fill out the search form to find available rooms for your dates
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">
                    Available Rooms ({searchResults.length})
                  </h2>
                  {selectedRoom && (
                    <Button onClick={handleContinue} className="bg-primary">
                      Continue to Details
                    </Button>
                  )}
                </div>

                <div className="grid gap-6">
                  {searchResults.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      onSelect={handleRoomSelect}
                      isSelected={selectedRoom === room.id}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
