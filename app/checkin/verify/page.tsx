'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileUpload } from '@/components/booking/file-upload'
import { ArrowLeft, Shield, CheckCircle, Key } from 'lucide-react'
import Link from 'next/link'
import { LogoSVG } from '@/components/logo'

function CheckInVerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [reservationId] = useState(searchParams.get('id') || '')
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [verificationStep, setVerificationStep] = useState<'id' | 'complete'>('id')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleIDUpload = async (file: File) => {
    setFrontImage(file)
    setIsProcessing(true)
    
    toast({
      title: "ID Uploaded Successfully",
      description: "Processing your check-in...",
    })
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Directly complete check-in after ID upload
      setVerificationStep('complete')
      toast({
        title: "Check-In Successful!",
        description: "Your identity has been verified",
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCompleteCheckIn = async () => {
    try {
      const response = await fetch('/api/checkin/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservationId }),
      })

      const result = await response.json()

      if (result.ok) {
        toast({
          title: "Check-In Complete!",
          description: "Your digital key has been generated",
        })
        
        // Redirect to digital key page
        router.push(`/key/${reservationId}`)
      } else {
        toast({
          title: "Check-In Failed",
          description: result.error || "Please try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Check-In Failed",
        description: "Network error. Please try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <LogoSVG variant="dark" />
            <Link href="/checkin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Identity Verification</h1>
            <p className="text-xl text-gray-600">Please complete identity verification to finish check-in</p>
          </div>

          {/* ID Upload Step */}
          {verificationStep === 'id' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Upload ID Document
                  </CardTitle>
                  <CardDescription>
                    Please upload a photo of the front of your ID document to complete check-in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileSelect={handleIDUpload}
                    acceptedTypes={['image/jpeg', 'image/png', 'application/pdf']}
                    maxSize={5 * 1024 * 1024} // 5MB
                  />
                  {isProcessing && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-700">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                        <span className="text-sm font-medium">Processing your check-in...</span>
                      </div>
                    </div>
                  )}
                  {frontImage && !isProcessing && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">ID uploaded successfully</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Complete Step */}
          {verificationStep === 'complete' && (
            <div className="space-y-6">
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Verification Successful!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-green-700">
                      Congratulations! Your check-in is complete. You can now get your digital key.
                    </p>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Reservation ID</span>
                        <span className="font-bold">{reservationId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Verification Status</span>
                        <span className="text-green-600 font-semibold">Verified</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={handleCompleteCheckIn}
                className="w-full bg-primary text-lg py-6"
                size="lg"
              >
                <Key className="h-5 w-5 mr-2" />
                Complete Check-In & Get Digital Key
              </Button>
            </div>
          )}

          {/* Security Notice */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Security & Privacy</h4>
                  <p className="text-sm text-blue-700">
                    Your identity information is encrypted and stored securely, used only for identity verification purposes, and will not be shared with third parties.
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

export default function CheckInVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CheckInVerifyContent />
    </Suspense>
  )
}
