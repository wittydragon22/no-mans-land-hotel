'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, RotateCcw, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface CameraCaptureProps {
  onCapture: (file: File, type: 'front' | 'back') => void
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [captureType, setCaptureType] = useState<'front' | 'back'>('front')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsStreaming(true)
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please check permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `id-${captureType}-${Date.now()}.jpg`, {
          type: 'image/jpeg'
        })
        setCapturedImage(URL.createObjectURL(blob))
        onCapture(file, captureType)
      }
    }, 'image/jpeg', 0.8)
  }, [captureType, onCapture])

  const confirmCapture = useCallback(() => {
    if (capturedImage) {
      stopCamera()
      setCapturedImage(null)
    }
  }, [capturedImage, stopCamera])

  const retakeCapture = useCallback(() => {
    setCapturedImage(null)
  }, [])

  const switchCamera = useCallback(() => {
    setCaptureType(prev => prev === 'front' ? 'back' : 'front')
  }, [])

  return (
    <div className="space-y-4">
      {/* Camera Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={switchCamera}
            className={captureType === 'front' ? 'bg-primary text-white' : ''}
          >
            Front
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={switchCamera}
            className={captureType === 'back' ? 'bg-primary text-white' : ''}
          >
            Back
          </Button>
        </div>

        {!isStreaming && !capturedImage && (
          <Button onClick={startCamera} className="bg-primary">
            <Camera className="h-4 w-4 mr-2" />
            Start Camera
          </Button>
        )}
      </div>

      {/* Camera View */}
      {isStreaming && !capturedImage && (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-64 object-cover rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Camera Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                <Button
                  onClick={stopCamera}
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <X className="h-4 w-4 mr-2" />
                  Stop
                </Button>
                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100"
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Captured Image Preview */}
      {capturedImage && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured ID"
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                {/* Image Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <Button
                    onClick={retakeCapture}
                    variant="outline"
                    size="sm"
                    className="bg-white/90 hover:bg-white"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake
                  </Button>
                  <Button
                    onClick={confirmCapture}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Confirm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Instructions */}
      {!isStreaming && !capturedImage && (
        <div className="text-center text-gray-500">
          <p className="text-sm">
            Position your ID document clearly within the camera frame
          </p>
          <p className="text-xs mt-1">
            Ensure good lighting and avoid glare or shadows
          </p>
        </div>
      )}
    </div>
  )
}

