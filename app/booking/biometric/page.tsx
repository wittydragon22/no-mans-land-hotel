'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

import { StepWizard } from '@/components/booking/step-wizard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CameraCapture } from '@/components/booking/camera-capture'
import { ArrowLeft, Camera, Shield, CheckCircle, AlertTriangle, Clock } from 'lucide-react'

const steps = [
  { id: 'search', title: 'Search', description: 'Find your room', status: 'completed' as const },
  { id: 'details', title: 'Details', description: 'Guest information', status: 'completed' as const },
  { id: 'id', title: 'ID Capture', description: 'Identity verification', status: 'completed' as const },
  { id: 'payment', title: 'Payment', description: 'Secure payment', status: 'completed' as const },
  { id: 'biometric', title: 'Biometric', description: 'Face verification', status: 'current' as const },
  { id: 'confirm', title: 'Confirm', description: 'Complete booking', status: 'upcoming' as const },
]

type BiometricStatus = 'pending' | 'processing' | 'pass' | 'fail' | 'manual_review'

export default function BiometricPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookingData, setBookingData] = useState<any>(null)
  const [capturedImage, setCapturedImage] = useState<File | null>(null)
  const [biometricStatus, setBiometricStatus] = useState<BiometricStatus>('pending')
  const [matchScore, setMatchScore] = useState<number | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Load booking data from session storage
    const stored = sessionStorage.getItem('bookingData')
    if (!stored) {
      router.push('/booking')
      return
    }
    setBookingData(JSON.parse(stored))
  }, [router])

  const handleImageCapture = (file: File) => {
    setCapturedImage(file)
  }

  const processBiometricMatch = async () => {
    if (!capturedImage) {
      toast({
        title: "Image Required",
        description: "Please capture your face image first",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setBiometricStatus('processing')

    try {
      // Mock biometric processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Simulate match score (0-100)
      const score = Math.floor(Math.random() * 100)
      setMatchScore(score)
      
      // Determine status based on score
      if (score >= 80) {
        setBiometricStatus('pass')
        toast({
          title: "Biometric Match Successful",
          description: `Match score: ${score}% - Identity verified`,
        })
      } else if (score >= 60) {
        setBiometricStatus('manual_review')
        toast({
          title: "Manual Review Required",
          description: `Match score: ${score}% - Manual verification needed`,
        })
      } else {
        setBiometricStatus('fail')
        toast({
          title: "Biometric Match Failed",
          description: `Match score: ${score}% - Please try again`,
          variant: "destructive",
        })
      }
    } catch (error) {
      setBiometricStatus('fail')
      toast({
        title: "Processing Failed",
        description: "An error occurred during biometric processing",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = async () => {
    try {
      // Update booking data with biometric information
      const updatedBookingData = {
        ...bookingData,
        biometricCheck: {
          image: capturedImage,
          matchScore,
          status: biometricStatus
        }
      }
      sessionStorage.setItem('bookingData', JSON.stringify(updatedBookingData))
      
      if (biometricStatus === 'pass') {
        router.push('/booking/confirm')
      } else if (biometricStatus === 'manual_review') {
        router.push('/booking/confirm')
      } else {
        // Retry biometric verification
        setCapturedImage(null)
        setBiometricStatus('pending')
        setMatchScore(null)
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    router.push('/booking/payment')
  }

  if (!bookingData) {
    return <div>Loading...</div>
  }

  const getStatusIcon = () => {
    switch (biometricStatus) {
      case 'processing':
        return <Clock className="h-8 w-8 text-blue-500 animate-spin" />
      case 'pass':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'fail':
        return <AlertTriangle className="h-8 w-8 text-red-500" />
      case 'manual_review':
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />
      default:
        return <Camera className="h-8 w-8 text-gray-400" />
    }
  }

  const getStatusMessage = () => {
    switch (biometricStatus) {
      case 'processing':
        return 'Processing your biometric data...'
      case 'pass':
        return 'Biometric verification successful!'
      case 'fail':
        return 'Biometric verification failed. Please try again.'
      case 'manual_review':
        return 'Manual review required. You can still proceed.'
      default:
        return 'Capture your face for identity verification'
    }
  }

  const getStatusColor = () => {
    switch (biometricStatus) {
      case 'processing':
        return 'text-blue-600'
      case 'pass':
        return 'text-green-600'
      case 'fail':
        return 'text-red-600'
      case 'manual_review':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Biometric Verification</h1>
          <p className="text-xl text-gray-600">Face recognition for secure check-in</p>
        </div>

        {/* Step Wizard */}
        <div className="mb-8">
          <StepWizard steps={steps} currentStep={4} />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Face Verification
              </CardTitle>
              <CardDescription>
                We'll compare your face with your ID document for secure verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Status Display */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-4"
                  >
                    {getStatusIcon()}
                  </motion.div>
                  <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
                    {getStatusMessage()}
                  </h3>
                  {matchScore !== null && (
                    <p className="text-sm text-gray-600 mt-2">
                      Match Score: {matchScore}%
                    </p>
                  )}
                </div>

                {/* Camera Capture */}
                {biometricStatus === 'pending' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <CameraCapture
                      onCapture={handleImageCapture}
                    />
                  </motion.div>
                )}

                {/* Captured Image Display */}
                {capturedImage && biometricStatus !== 'pending' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <div className="relative inline-block">
                      <img
                        src={URL.createObjectURL(capturedImage)}
                        alt="Captured face"
                        className="w-32 h-32 object-cover rounded-full border-4 border-gray-200"
                      />
                      <div className="absolute -bottom-2 -right-2">
                        {getStatusIcon()}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Processing Animation */}
                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="inline-block">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-primary rounded-full"
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Analyzing facial features...
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Payment
                  </Button>

                  {biometricStatus === 'pending' && capturedImage && (
                    <Button
                      onClick={processBiometricMatch}
                      disabled={isProcessing}
                      className="bg-primary"
                    >
                      {isProcessing ? 'Processing...' : 'Verify Identity'}
                    </Button>
                  )}

                  {(biometricStatus === 'pass' || biometricStatus === 'manual_review') && (
                    <Button
                      onClick={handleContinue}
                      className="bg-primary"
                    >
                      Continue to Confirmation
                    </Button>
                  )}

                  {biometricStatus === 'fail' && (
                    <Button
                      onClick={() => {
                        setCapturedImage(null)
                        setBiometricStatus('pending')
                        setMatchScore(null)
                      }}
                      className="bg-primary"
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Information */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Biometric Security</h4>
                  <p className="text-sm text-blue-700">
                    Your facial biometric data is encrypted and stored securely. 
                    It's only used for identity verification and is never shared with third parties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manual Review Notice */}
          {biometricStatus === 'manual_review' && (
            <Card className="mt-6 bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Manual Review Required</h4>
                    <p className="text-sm text-yellow-700">
                      Your identity will be manually verified by our team. 
                      You can still proceed with your booking, and we'll notify you once verification is complete.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

