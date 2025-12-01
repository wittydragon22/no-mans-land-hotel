'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Search, Key, Mail } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { LogoSVG } from '@/components/logo'

const checkinSearchSchema = z.object({
  reservationId: z.string().optional(),
  email: z.union([
    z.string().email('Please enter a valid email address'),
    z.literal(''),
  ]).optional(),
  confirmationCode: z.string().optional(),
}).refine(
  (data) => {
    // Either reservationId+email OR confirmationCode must be provided
    return (data.reservationId && data.email && data.email.length > 0) || (data.confirmationCode && data.confirmationCode.length > 0)
  },
  {
    message: "Either provide reservation ID and email, or confirmation code",
  }
)

export default function CheckInPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSearching, setIsSearching] = useState(false)

  const [searchMethod, setSearchMethod] = useState<'code' | 'id'>('code')

  const { register, handleSubmit, formState: { errors }, watch, getValues } = useForm({
    resolver: zodResolver(checkinSearchSchema),
    defaultValues: {
      reservationId: '',
      email: '',
      confirmationCode: '',
    },
    mode: 'onChange', // Validate on change for better UX
  })
  
  // Debug: Log form values when they change
  const confirmationCodeValue = watch('confirmationCode')
  console.log('📝 Confirmation code value:', confirmationCodeValue)

  const onSearch = async (data: any) => {
    console.log('🔍 Check-in search started:', { searchMethod, data })
    console.log('📋 Form data:', data)
    console.log('📋 Errors:', errors)
    
    // Skip validation if there are form errors (let react-hook-form handle it)
    if (Object.keys(errors).length > 0) {
      console.log('❌ Form validation errors detected, skipping manual validation')
      // Don't return, let the form validation show the errors
    }
    
    // Validate input based on search method
    if (searchMethod === 'code') {
      if (!data.confirmationCode || data.confirmationCode.trim().length === 0) {
        console.log('❌ Validation failed: Empty confirmation code')
        toast({
          title: "Validation Error",
          description: "Please enter a confirmation code",
          variant: "destructive",
        })
        return
      }
      // Ensure confirmation code is exactly 6 digits
      if (data.confirmationCode.length !== 6) {
        console.log('❌ Validation failed: Code length is', data.confirmationCode.length)
        toast({
          title: "Invalid Code",
          description: `Confirmation code must be 6 digits (you entered ${data.confirmationCode.length})`,
          variant: "destructive",
        })
        return
      }
      // Check if it's all numbers
      if (!/^\d{6}$/.test(data.confirmationCode)) {
        console.log('❌ Validation failed: Code contains non-numeric characters')
        toast({
          title: "Invalid Code",
          description: "Confirmation code must contain only numbers",
          variant: "destructive",
        })
        return
      }
    } else {
      if (!data.reservationId || !data.email) {
        console.log('❌ Validation failed: Missing reservation ID or email')
        toast({
          title: "Validation Error",
          description: "Please enter both reservation ID and email",
          variant: "destructive",
        })
        return
      }
      // Validate email format if provided
      if (data.email && !z.string().email().safeParse(data.email).success) {
        console.log('❌ Validation failed: Invalid email format')
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address",
          variant: "destructive",
        })
        return
      }
    }
    
    console.log('✅ Validation passed, starting search...')
    setIsSearching(true)
    
    try {
      // Prepare request body based on search method
      const requestBody = searchMethod === 'code' 
        ? { confirmationCode: data.confirmationCode.trim() }
        : { reservationId: data.reservationId.trim(), email: data.email.trim() }

      console.log('📤 Sending request to /api/checkin/search:', requestBody)
      console.log('📤 Request URL:', '/api/checkin/search')

      const response = await fetch('/api/checkin/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📥 Response status:', response.status)
      console.log('📥 Response ok:', response.ok)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Response not ok:', errorText)
        try {
          const errorResult = JSON.parse(errorText)
          toast({
            title: "Search Failed",
            description: errorResult.error || "Reservation not found. Please check your information",
            variant: "destructive",
          })
        } catch (e) {
          toast({
            title: "Search Failed",
            description: `Server error (${response.status}). Please try again.`,
            variant: "destructive",
          })
        }
        return
      }

      const result = await response.json()
      console.log('📥 Response data:', result)

      if (result.ok) {
        console.log('✅ Reservation found:', result.data.reservation.id)
        toast({
          title: "Reservation Found",
          description: "Redirecting to verification page...",
        })
        
        // Redirect to verification page
        const reservationId = result.data.reservation.id
        setTimeout(() => {
          console.log('🔄 Redirecting to:', `/checkin/verify?id=${reservationId}`)
          router.push(`/checkin/verify?id=${reservationId}`)
        }, 1000)
      } else {
        console.error('❌ Search failed:', result.error)
        toast({
          title: "Search Failed",
          description: result.error || "Reservation not found. Please check your information",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message)
        console.error('❌ Error stack:', error.stack)
      }
      toast({
        title: "Search Failed",
        description: error instanceof Error ? error.message : "Network error. Please try again",
        variant: "destructive",
      })
    } finally {
      console.log('🏁 Search completed')
      setIsSearching(false)
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

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Self Check-In</h1>
            <p className="text-xl text-gray-600">Fast, secure, no front desk waiting</p>
          </div>

          {/* Search Step */}
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Find Your Reservation
                </CardTitle>
                <CardDescription>
                  Use your confirmation code or reservation ID and email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={searchMethod} onValueChange={(v) => setSearchMethod(v as 'code' | 'id')} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="code">
                      <Key className="h-4 w-4 mr-2" />
                      Confirmation Code
                    </TabsTrigger>
                    <TabsTrigger value="id">
                      <Mail className="h-4 w-4 mr-2" />
                      Reservation ID
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="mt-4">
                    <form 
                      onSubmit={handleSubmit(
                        (data) => {
                          console.log('📝 Form submitted with valid data:', data)
                          onSearch(data)
                        },
                        (errors) => {
                          console.log('❌ Form validation failed:', errors)
                          // Show first error
                          const firstError = Object.values(errors)[0]
                          if (firstError && 'message' in firstError) {
                            toast({
                              title: "Validation Error",
                              description: firstError.message as string,
                              variant: "destructive",
                            })
                          }
                        }
                      )} 
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="confirmationCode">Confirmation Code</Label>
                        <Input
                          id="confirmationCode"
                          placeholder="Enter your 6-digit confirmation code"
                          maxLength={6}
                          {...register('confirmationCode', {
                            required: 'Confirmation code is required',
                            minLength: {
                              value: 6,
                              message: 'Confirmation code must be 6 digits'
                            },
                            maxLength: {
                              value: 6,
                              message: 'Confirmation code must be 6 digits'
                            },
                            pattern: {
                              value: /^\d{6}$/,
                              message: 'Confirmation code must be 6 digits'
                            }
                          })}
                          className={errors.confirmationCode ? 'border-red-500' : ''}
                          onChange={(e) => {
                            // Only allow numbers
                            const value = e.target.value.replace(/\D/g, '')
                            e.target.value = value
                            const onChange = register('confirmationCode').onChange
                            if (onChange) {
                              onChange(e)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              console.log('⌨️ Enter key pressed')
                              handleSubmit(onSearch)(e).catch((error) => {
                                console.error('❌ Form submission error:', error)
                              })
                            }
                          }}
                        />
                        {errors.confirmationCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.confirmationCode.message}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          Check your email for the confirmation code sent after booking
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSearching}
                        className="w-full bg-primary"
                        onClick={(e) => {
                          console.log('🖱️ Button clicked')
                          const formData = getValues()
                          console.log('📋 Current form values:', formData)
                          console.log('📋 Current errors:', errors)
                          // Don't prevent default, let form handle it
                        }}
                      >
                        {isSearching ? 'Searching...' : 'Search with Code'}
                        <Search className="ml-2 h-4 w-4" />
                      </Button>
                      
                      {/* Debug button - remove in production */}
                      {process.env.NODE_ENV === 'development' && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const formData = getValues()
                            console.log('🔍 Manual search trigger')
                            console.log('📋 Form data:', formData)
                            console.log('📋 Errors:', errors)
                            onSearch(formData)
                          }}
                          className="w-full mt-2"
                        >
                          Debug: Direct Search
                        </Button>
                      )}
                    </form>
                  </TabsContent>

                  <TabsContent value="id" className="mt-4">
                    <form onSubmit={handleSubmit(onSearch)} className="space-y-4">
                      <div>
                        <Label htmlFor="reservationId">Reservation ID</Label>
                        <Input
                          id="reservationId"
                          placeholder="Enter your reservation ID"
                          {...register('reservationId')}
                          className={errors.reservationId ? 'border-red-500' : ''}
                        />
                        {errors.reservationId && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.reservationId.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter the email used for booking"
                          {...register('email')}
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        disabled={isSearching}
                        className="w-full bg-primary"
                      >
                        {isSearching ? 'Searching...' : 'Search Reservation'}
                        <Search className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
