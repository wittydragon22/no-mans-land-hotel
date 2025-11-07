'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, FileImage } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  acceptedTypes: string[]
  maxSize: number
  className?: string
}

export function FileUpload({ 
  onFileSelect, 
  acceptedTypes, 
  maxSize, 
  className 
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      alert(`Invalid file type. Please upload: ${acceptedTypes.join(', ')}`)
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      alert(`File too large. Maximum size: ${(maxSize / 1024 / 1024).toFixed(1)}MB`)
      return
    }

    setSelectedFile(file)
    onFileSelect(file)
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      {selectedFile ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 border-2 border-dashed border-green-300 bg-green-50 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileImage className="h-8 w-8 text-green-600" />
              <div>
                <p className="font-medium text-green-800">{selectedFile.name}</p>
                <p className="text-sm text-green-600">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeFile}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ) : (
        <Card
          className={`cursor-pointer transition-all duration-200 ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-dashed hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <CardContent className="p-8 text-center">
            <motion.div
              animate={{ y: isDragOver ? -4 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {isDragOver ? 'Drop your file here' : 'Upload ID Document'}
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Accepted formats: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
                <br />
                Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
              </p>
            </motion.div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

