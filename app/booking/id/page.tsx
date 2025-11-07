'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

import { StepWizard } from '@/components/booking/step-wizard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload } from '@/components/booking/file-upload'
import { CameraCapture } from '@/components/booking/camera-capture'
import { ArrowLeft, Shield, Camera, Upload, CheckCircle } from 'lucide-react'

const steps = [
  { id: 'search', title: 'Search', description: 'Find your room', status: 'completed' as const },
  { id: 'details', title: 'Details', description: 'Guest information', status: 'completed' as const },
  { id: 'id', title: 'ID Capture', description: 'Identity verification', status: 'current' as const },
  { id: 'payment', title: 'Payment', description: 'Secure payment', status: 'upcoming' as const },
  { id: 'biometric', title: 'Biometric', description: 'Face verification', status: 'upcoming' as const },
  { id: 'confirm', title: 'Confirm', description: 'Complete booking', status: 'upcoming' as const },
]

export default function IDCapturePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookingData, setBookingData] = useState<any>(null)
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [ocrData, setOcrData] = useState<any>(null)
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

  const handleFileUpload = (file: File, type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontImage(file)
    } else {
      setBackImage(file)
    }
  }

  const handleCameraCapture = (file: File, type: 'front' | 'back') => {
    handleFileUpload(file, type)
  }

  const processOCR = async () => {
    if (!frontImage) {
      toast({
        title: "Front Image Required",
        description: "Please upload the front of your ID first",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    
    try {
      // Mock OCR processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const mockOcrData = {
        name: `${bookingData.guestDetails.firstName} ${bookingData.guestDetails.lastName}`,
        dateOfBirth: '1990-01-01',
        documentNumber: 'A123456789',
        extractedAt: new Date().toISOString()
      }
      
      setOcrData(mockOcrData)
      
      toast({
        title: "OCR Processing Complete",
        description: "Document information has been extracted successfully",
      })
    } catch (error) {
      toast({
        title: "OCR Processing Failed",
        description: "Please try uploading the image again",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinue = async () => {
    if (!frontImage) {
      toast({
        title: "Front Image Required",
        description: "Please upload the front of your ID",
        variant: "destructive",
      })
      return
    }

    try {
      // Update booking data with ID information
      const updatedBookingData = {
        ...bookingData,
        idDocuments: {
          frontImage,
          backImage,
          ocrData
        }
      }
      sessionStorage.setItem('bookingData', JSON.stringify(updatedBookingData))
      
      toast({
        title: "ID Documents Saved",
        description: "Your identity documents have been securely stored",
      })
      
      router.push('/booking/payment')
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    router.push('/booking/details')
  }

  if (!bookingData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Identity Verification</h1>
          <p className="text-xl text-gray-600">Upload your ID for secure verification</p>
        </div>

        {/* Step Wizard */}
        <div className="mb-8">
          <StepWizard steps={steps} currentStep={2} />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* ID Front Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  ID Front (Required)
                </CardTitle>
                <CardDescription>
                  Upload the front of your government-issued ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileSelect={(file) => handleFileUpload(file, 'front')}
                  acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                  maxSize={5 * 1024 * 1024} // 5MB
                />
                {frontImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Front image uploaded</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {frontImage.name} ({(frontImage.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* ID Back Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  ID Back (Optional)
                </CardTitle>
                <CardDescription>
                  Upload the back of your ID for additional verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  onFileSelect={(file) => handleFileUpload(file, 'back')}
                  acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                  maxSize={5 * 1024 * 1024} // 5MB
                />
                {backImage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Back image uploaded</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {backImage.name} ({(backImage.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Camera Capture Option */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Live Camera Capture
              </CardTitle>
              <CardDescription>
                Use your device camera to capture ID images directly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CameraCapture
                onCapture={(file, type) => handleCameraCapture(file, type)}
              />
            </CardContent>
          </Card>

          {/* OCR Processing */}
          {frontImage && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Document Information Extraction</CardTitle>
                <CardDescription>
                  Extract information from your ID document automatically
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={processOCR}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? 'Processing...' : 'Extract Information'}
                  </Button>

                  {ocrData && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <h4 className="font-semibold text-blue-900 mb-2">Extracted Information:</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Name:</strong> {ocrData.name}</div>
                        <div><strong>Date of Birth:</strong> {ocrData.dateOfBirth}</div>
                        <div><strong>Document Number:</strong> {ocrData.documentNumber}</div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Notice */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Security & Privacy</h4>
                  <p className="text-sm text-blue-700">
                    We store only encrypted verification hashes of your documents. 
                    Your personal information is protected with bank-level security 
                    and is never shared with third parties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Details
            </Button>

            <Button
              onClick={handleContinue}
              disabled={!frontImage}
              className="bg-primary"
            >
              Continue to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

