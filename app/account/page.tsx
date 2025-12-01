'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { LogoSVG } from '@/components/logo'
import { ArrowLeft, Calendar, Key, Mail, Phone, User, CreditCard, CheckCircle, Clock, XCircle, X, Copy } from 'lucide-react'
import Link from 'next/link'

interface Reservation {
  id: string
  confirmationCode: string | null
  roomNumber: string
  roomType: string
  checkInDate: string
  checkOutDate: string
  guests: number
  status: string
  totalAmount: number
  createdAt: string
  guestName: string | null
  hasDigitalKey: boolean
  digitalKeyExpiresAt: string | null
}

export default function AccountPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userInfo, setUserInfo] = useState<any>(null)

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/user/reservations', {
        credentials: 'include'
      })

      if (response.status === 401) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view your bookings",
          variant: "destructive",
        })
        router.push('/login')
        return
      }

      const result = await response.json()

      if (result.ok) {
        setReservations(result.data.reservations)
      } else {
        toast({
          title: "Failed to Load Reservations",
          description: result.error || "Please try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Load reservations error:', error)
      toast({
        title: "Error",
        description: "Failed to load reservations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'checked_in':
        return <Key className="h-4 w-4 text-blue-500" />
      case 'checked_out':
        return <CheckCircle className="h-4 w-4 text-gray-500" />
      case 'canceled':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'checked_in':
        return 'bg-blue-100 text-blue-800'
      case 'checked_out':
        return 'bg-gray-100 text-gray-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LogoSVG variant="dark" />
            <div className="flex gap-2">
              <Link href="/booking">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Clear old booking data when starting new booking
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('bookingData')
                    }
                  }}
                >
                  Book a Room
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">My Account</h1>
            <p className="text-xl text-gray-600">View and manage your bookings</p>
          </div>

          {/* Reservations List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                My Reservations
              </CardTitle>
              <CardDescription>
                All your bookings are stored here and linked to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-4 text-gray-600">Loading your reservations...</p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reservations Yet</h3>
                  <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
                  <Link href="/booking">
                    <Button className="bg-primary">
                      Book Your First Room
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <Card key={reservation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              {getStatusIcon(reservation.status)}
                              <h3 className="text-lg font-semibold">
                                Room {reservation.roomNumber} - {reservation.roomType}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                {reservation.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500 mb-1">Check-in</p>
                                <p className="font-medium">{formatDate(new Date(reservation.checkInDate))}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Check-out</p>
                                <p className="font-medium">{formatDate(new Date(reservation.checkOutDate))}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Guests</p>
                                <p className="font-medium">{reservation.guests}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 mb-1">Total</p>
                                <p className="font-medium">{formatCurrency(reservation.totalAmount)}</p>
                              </div>
                            </div>

                          </div>

                          <div className="flex flex-col gap-2">
                            {reservation.confirmationCode && (
                              <div className="mb-3 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-semibold text-blue-900">Confirmation Code for Check-in</p>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      navigator.clipboard.writeText(reservation.confirmationCode || '')
                                      toast({
                                        title: "Copied!",
                                        description: "Confirmation code copied to clipboard",
                                      })
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-4 w-4" />
                                  </Button>
                                </div>
                                <p className="text-2xl font-mono font-bold text-blue-900 mb-1">
                                  {reservation.confirmationCode}
                                </p>
                                <p className="text-xs text-blue-700">
                                  Use this code at the check-in page or enter it directly
                                </p>
                              </div>
                            )}
                            {reservation.hasDigitalKey && (
                              <Link href={`/key/${reservation.id}`}>
                                <Button variant="outline" className="w-full">
                                  <Key className="h-4 w-4 mr-2" />
                                  View Digital Key
                                </Button>
                              </Link>
                            )}
                            {reservation.status !== 'canceled' && reservation.status !== 'checked_out' && (
                              <>
                                <Link href={`/checkin?reservationId=${reservation.id}`}>
                                  <Button variant="outline" className="w-full">
                                    Check In
                                  </Button>
                                </Link>
                                {reservation.status !== 'checked_in' && (
                                  <Button
                                    variant="outline"
                                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={async () => {
                                      if (!confirm('Are you sure you want to cancel this reservation?')) {
                                        return
                                      }
                                      
                                      try {
                                        const response = await fetch(`/api/user/reservations/${reservation.id}/cancel`, {
                                          method: 'POST',
                                          credentials: 'include'
                                        })
                                        
                                        const result = await response.json()
                                        
                                        if (result.ok) {
                                          toast({
                                            title: "Reservation Canceled",
                                            description: "Your reservation has been canceled successfully",
                                          })
                                          loadReservations() // Reload the list
                                        } else {
                                          toast({
                                            title: "Cancel Failed",
                                            description: result.error || "Failed to cancel reservation",
                                            variant: "destructive",
                                          })
                                        }
                                      } catch (error) {
                                        console.error('Cancel error:', error)
                                        toast({
                                          title: "Error",
                                          description: "Failed to cancel reservation. Please try again.",
                                          variant: "destructive",
                                        })
                                      }
                                    }}
                                  >
                                    Cancel Booking
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Account Integration</h4>
                  <p className="text-sm text-blue-700">
                    All your bookings are automatically stored in your account. 
                    If you're logged in, bookings are linked to your account. 
                    If not logged in, bookings are linked to your email address.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

