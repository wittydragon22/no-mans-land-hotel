'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Key, QrCode, Smartphone, Wifi, Clock, Shield, ArrowLeft } from 'lucide-react'

interface DigitalKeyPageProps {
  params: {
    reservationId: string
  }
}

export default function DigitalKeyPage({ params }: DigitalKeyPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [keyData, setKeyData] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isRotating, setIsRotating] = useState(false)

  useEffect(() => {
    // Load booking data from session storage
    const stored = sessionStorage.getItem('bookingData')
    if (stored) {
      const bookingData = JSON.parse(stored)
      if (bookingData.digitalKey) {
        setKeyData(bookingData.digitalKey)
      }
    }
  }, [])

  useEffect(() => {
    if (!keyData) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Rotate key
          rotateKey()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [keyData])

  const rotateKey = async () => {
    setIsRotating(true)
    
    try {
      // Mock key rotation API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newToken = `token_${Math.random().toString(36).substring(2)}`
      const newKeyData = {
        ...keyData,
        currentToken: newToken,
        expiresAt: new Date(Date.now() + 30 * 1000),
        lastRotatedAt: new Date()
      }
      
      setKeyData(newKeyData)
      
      toast({
        title: "Key Rotated",
        description: "Your digital key has been updated for security",
      })
    } catch (error) {
      toast({
        title: "Rotation Failed",
        description: "Unable to rotate key. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRotating(false)
    }
  }

  const handleElevatorAccess = () => {
    toast({
      title: "Elevator Access",
      description: "Elevator will automatically take you to your floor",
    })
  }

  const handleRoomService = () => {
    toast({
      title: "Room Service",
      description: "Room service menu will be sent to your mobile device",
    })
  }

  const handleNFC = () => {
    toast({
      title: "NFC Pairing",
      description: "Hold your device near the door lock to pair NFC",
    })
  }

  if (!keyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your digital key...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="outline"
            onClick={() => router.push('/booking/confirm')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>
          <h1 className="text-4xl font-bold text-primary mb-4">Your Digital Key</h1>
          <p className="text-xl text-gray-600">Access your room with this secure key</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* QR Code Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Digital Key QR Code
              </CardTitle>
              <CardDescription>
                Scan this code at your room door or elevator
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                {/* QR Code */}
                <motion.div
                  key={keyData.currentToken} // Re-render on token change
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200"
                >
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">QR Code</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {keyData.currentToken.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Key expires in {timeLeft} seconds
                  </span>
                  {isRotating && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="flex justify-center">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Shield className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={handleNFC}
                    className="w-full"
                    variant="outline"
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    Pair NFC
                  </Button>
                  <Button
                    onClick={() => toast({
                      title: "Add to Wallet",
                      description: "Key added to your digital wallet",
                    })}
                    className="w-full"
                    variant="outline"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Add to Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Hotel Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={handleElevatorAccess}
                    className="w-full"
                    variant="outline"
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Open Elevator
                  </Button>
                  <Button
                    onClick={handleRoomService}
                    className="w-full"
                    variant="outline"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Request Room Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Information */}
          <Card>
            <CardHeader>
              <CardTitle>Key Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Reservation ID</span>
                  <span className="font-mono text-sm">{keyData.reservationId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Token</span>
                  <span className="font-mono text-sm">{keyData.currentToken.substring(0, 12)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Rotated</span>
                  <span className="text-sm">{new Date(keyData.lastRotatedAt).toLocaleTimeString('en-US')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expires At</span>
                  <span className="text-sm">{new Date(keyData.expiresAt).toLocaleTimeString('en-US')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Security Features</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Key rotates every 30 seconds for maximum security</li>
                    <li>• QR code is unique to your reservation</li>
                    <li>• Access is logged and monitored</li>
                    <li>• Key expires automatically after checkout</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

