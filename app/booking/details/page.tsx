'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'

import { StepWizard } from '@/components/booking/step-wizard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { guestDetailsSchema } from '@/lib/validations'
import { ArrowLeft, User, Mail, Phone, Building } from 'lucide-react'

const steps = [
  { id: 'search', title: 'Search', description: 'Find your room', status: 'completed' as const },
  { id: 'details', title: 'Details', description: 'Guest information', status: 'current' as const },
  { id: 'id', title: 'ID Capture', description: 'Identity verification', status: 'upcoming' as const },
  { id: 'payment', title: 'Payment', description: 'Secure payment', status: 'upcoming' as const },
  { id: 'biometric', title: 'Biometric', description: 'Face verification', status: 'upcoming' as const },
  { id: 'confirm', title: 'Confirm', description: 'Complete booking', status: 'upcoming' as const },
]

export default function GuestDetailsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookingData, setBookingData] = useState<any>(null)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(guestDetailsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      isBusiness: false,
      company: '',
      vat: '',
    }
  })

  const isBusiness = watch('isBusiness')

  useEffect(() => {
    // Load booking data from session storage
    const stored = sessionStorage.getItem('bookingData')
    if (!stored) {
      router.push('/booking')
      return
    }
    setBookingData(JSON.parse(stored))
  }, [router])

  const onSubmit = async (data: any) => {
    try {
      // Update booking data with guest details
      const updatedBookingData = {
        ...bookingData,
        guestDetails: data
      }
      sessionStorage.setItem('bookingData', JSON.stringify(updatedBookingData))
      
      toast({
        title: "Details Saved",
        description: "Guest information has been saved successfully",
      })
      
      router.push('/booking/id')
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Please try again",
        variant: "destructive",
      })
    }
  }

  const handleBack = () => {
    router.push('/booking')
  }

  if (!bookingData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Guest Details</h1>
          <p className="text-xl text-gray-600">Tell us about yourself</p>
        </div>

        {/* Step Wizard */}
        <div className="mb-8">
          <StepWizard steps={steps} currentStep={1} />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                We need this information for your reservation and check-in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register('firstName')}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register('lastName')}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Select onValueChange={(value) => setValue('country', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="DE">Germany</SelectItem>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="IT">Italy</SelectItem>
                      <SelectItem value="ES">Spain</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="JP">Japan</SelectItem>
                      <SelectItem value="CN">China</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Business Stay */}
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="isBusiness"
                      checked={isBusiness}
                      onCheckedChange={(checked) => setValue('isBusiness', checked as boolean)}
                    />
                    <Label htmlFor="isBusiness" className="text-sm font-medium">
                      This is a business stay
                    </Label>
                  </div>

                  {isBusiness && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="company">Company Name *</Label>
                        <Input
                          id="company"
                          {...register('company')}
                          className={errors.company ? 'border-red-500' : ''}
                        />
                        {errors.company && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.company.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="vat">VAT Number (Optional)</Label>
                        <Input
                          id="vat"
                          {...register('vat')}
                          placeholder="Enter VAT number if applicable"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Data Privacy Consent */}
                <div className="border-t pt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="privacyConsent"
                      required
                    />
                    <Label htmlFor="privacyConsent" className="text-sm">
                      I agree to the collection and processing of my personal data for the purpose of hotel reservation and check-in. 
                      <a href="/privacy" className="text-primary hover:underline ml-1">
                        Read our privacy policy
                      </a>
                    </Label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Search
                  </Button>

                  <Button type="submit" className="bg-primary">
                    Continue to ID Capture
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

