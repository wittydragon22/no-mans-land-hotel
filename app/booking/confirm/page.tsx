'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

import { StepWizard } from '@/components/booking/step-wizard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowLeft, CheckCircle, Key, Shield, CreditCard, User, Calendar, MapPin } from 'lucide-react'

const steps = [
  { id: 'search', title: 'Search', description: 'Find your room', status: 'completed' as const },
  { id: 'details', title: 'Details', description: 'Guest information', status: 'completed' as const },
  { id: 'id', title: 'ID Capture', description: 'Identity verification', status: 'completed' as const },
  { id: 'payment', title: 'Payment', description: 'Secure payment', status: 'completed' as const },
  { id: 'biometric', title: 'Biometric', description: 'Face verification', status: 'completed' as const },
  { id: 'confirm', title: 'Confirm', description: 'Complete booking', status: 'current' as const },
]

export default function ConfirmationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookingData, setBookingData] = useState<any>(null)
  const [isConfirming, setIsConfirming] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [digitalKey, setDigitalKey] = useState<any>(null)

  useEffect(() => {
    // Load booking data from session storage
    const stored = sessionStorage.getItem('bookingData')
    if (!stored) {
      router.push('/booking')
      return
    }
    setBookingData(JSON.parse(stored))
  }, [router])

  const handleConfirmBooking = async () => {
    if (!agreedToTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please agree to the terms and conditions to continue",
        variant: "destructive",
      })
      return
    }

    setIsConfirming(true)

    try {
      // Mock booking confirmation API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate digital key
      const mockDigitalKey = {
        id: `key_${Date.now()}`,
        reservationId: `res_${Date.now()}`,
        currentToken: `token_${Math.random().toString(36).substring(2)}`,
        expiresAt: new Date(Date.now() + 30 * 1000), // 30 seconds
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`key_${Date.now()}`)}`
      }
      
      setDigitalKey(mockDigitalKey)
      
      // Store in session storage
      const updatedBookingData = {
        ...bookingData,
        confirmed: true,
        digitalKey: mockDigitalKey
      }
      sessionStorage.setItem('bookingData', JSON.stringify(updatedBookingData))
      
      toast({
        title: "Booking Confirmed!",
        description: "Your digital key has been generated successfully",
      })
      
    } catch (error) {
      toast({
        title: "Confirmation Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsConfirming(false)
    }
  }

  const handleBack = () => {
    router.push('/booking/biometric')
  }

  const handleViewKey = () => {
    if (digitalKey) {
      router.push(`/key/${digitalKey.reservationId}`)
    }
  }

  if (!bookingData) {
    return <div>Loading...</div>
  }

  const selectedRoom = bookingData.selectedRoom
  const guestDetails = bookingData.guestDetails
  const searchData = bookingData.search
  const nights = Math.ceil((new Date(searchData.checkOutDate).getTime() - new Date(searchData.checkInDate).getTime()) / (1000 * 60 * 60 * 24))
  const subtotal = selectedRoom.basePrice * nights
  const taxAmount = Math.round(subtotal * 0.085)
  const total = subtotal + taxAmount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">
            {digitalKey ? 'Booking Confirmed!' : 'Confirm Your Booking'}
          </h1>
          <p className="text-xl text-gray-600">
            {digitalKey ? 'Your digital key is ready' : 'Review your reservation details'}
          </p>
        </div>

        {/* Step Wizard */}
        <div className="mb-8">
          <StepWizard steps={steps} currentStep={5} />
        </div>

        {digitalKey ? (
          /* Digital Key Generated */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="text-center">
              <CardHeader>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mx-auto mb-4"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
                <CardDescription>
                  Your digital key has been generated and is ready to use
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Digital Key Details</h4>
                  <div className="text-sm text-green-700 space-y-1">
                    <div>Reservation ID: {digitalKey.reservationId}</div>
                    <div>Key Token: {digitalKey.currentToken.substring(0, 8)}...</div>
                    <div>Expires: {new Date(digitalKey.expiresAt).toLocaleTimeString('en-US')}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleViewKey}
                    className="w-full bg-primary text-lg py-6"
                    size="lg"
                  >
                    <Key className="h-5 w-5 mr-2" />
                    View Digital Key
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Add to Wallet
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Open in App
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p>Your digital key will be sent to your email address.</p>
                  <p>You can access your key anytime from the mobile app or web portal.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Booking Confirmation */
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Booking Summary */}
              <div className="lg:col-span-2 space-y-6">
                {/* Guest Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Guest Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-semibold">{guestDetails.firstName} {guestDetails.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold">{guestDetails.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-semibold">{guestDetails.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Country</p>
                        <p className="font-semibold">{guestDetails.country}</p>
                      </div>
                    </div>
                    {guestDetails.isBusiness && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-semibold">{guestDetails.company}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Reservation Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Reservation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Check-in</p>
                        <p className="font-semibold">{formatDate(new Date(searchData.checkInDate))}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Check-out</p>
                        <p className="font-semibold">{formatDate(new Date(searchData.checkOutDate))}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Duration</p>
                        <p className="font-semibold">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="font-semibold">{searchData.guests} {searchData.guests === 1 ? 'guest' : 'guests'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Room Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Room Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{selectedRoom.type} Room #{selectedRoom.number}</h4>
                        <p className="text-gray-600">Up to {selectedRoom.maxGuests} guests</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedRoom.amenities.map((amenity: string) => (
                            <span key={amenity} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{formatCurrency(selectedRoom.totalPrice)}</p>
                        <p className="text-sm text-gray-600">per night</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Summary & Actions */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Room rate × {nights} nights</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Taxes & fees</span>
                        <span>{formatCurrency(taxAmount)}</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <h4 className="font-semibold text-yellow-800 mb-1">Deposit Hold</h4>
                      <p className="text-sm text-yellow-700">
                        {formatCurrency(selectedRoom.basePrice)} will be held on your card as a deposit.
                      </p>
                    </div>

                    {/* Terms Agreement */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={agreedToTerms}
                          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the{' '}
                          <a href="/terms" className="text-primary hover:underline">
                            Terms and Conditions
                          </a>{' '}
                          and{' '}
                          <a href="/privacy" className="text-primary hover:underline">
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button
                        onClick={handleConfirmBooking}
                        disabled={!agreedToTerms || isConfirming}
                        className="w-full bg-primary text-lg py-6"
                        size="lg"
                      >
                        {isConfirming ? 'Confirming...' : 'Confirm Booking'}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={handleBack}
                        className="w-full"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Biometric
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="h-4 w-4" />
                      <span>Secure booking with 256-bit encryption</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

