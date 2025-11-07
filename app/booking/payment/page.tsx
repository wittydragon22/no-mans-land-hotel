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
import { paymentSchema } from '@/lib/validations'
import { formatCurrency, validateCardNumber, validateExpiryDate } from '@/lib/utils'
import { ArrowLeft, CreditCard, Shield, Lock } from 'lucide-react'

const steps = [
  { id: 'search', title: 'Search', description: 'Find your room', status: 'completed' as const },
  { id: 'details', title: 'Details', description: 'Guest information', status: 'completed' as const },
  { id: 'id', title: 'ID Capture', description: 'Identity verification', status: 'completed' as const },
  { id: 'payment', title: 'Payment', description: 'Secure payment', status: 'current' as const },
  { id: 'biometric', title: 'Biometric', description: 'Face verification', status: 'upcoming' as const },
  { id: 'confirm', title: 'Confirm', description: 'Complete booking', status: 'upcoming' as const },
]

export default function PaymentPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [bookingData, setBookingData] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiryMonth: 0,
      expiryYear: 0,
      cvv: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      }
    }
  })

  const cardNumber = watch('cardNumber')
  const expiryMonth = watch('expiryMonth')
  const expiryYear = watch('expiryYear')

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
    setIsProcessing(true)
    
    try {
      // Validate card number
      if (!validateCardNumber(data.cardNumber)) {
        toast({
          title: "Invalid Card Number",
          description: "Please check your card number and try again",
          variant: "destructive",
        })
        return
      }

      // Validate expiry date
      if (!validateExpiryDate(data.expiryMonth, data.expiryYear)) {
        toast({
          title: "Card Expired",
          description: "Please use a card with a future expiry date",
          variant: "destructive",
        })
        return
      }

      // Mock payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate payment success/failure
      const isSuccess = Math.random() > 0.1 // 90% success rate
      
      if (!isSuccess) {
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed. Please try a different card.",
          variant: "destructive",
        })
        return
      }

      // Update booking data with payment information
      const updatedBookingData = {
        ...bookingData,
        paymentDetails: data
      }
      sessionStorage.setItem('bookingData', JSON.stringify(updatedBookingData))
      
      toast({
        title: "Payment Authorized",
        description: "Your payment has been successfully authorized",
      })
      
      router.push('/booking/biometric')
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBack = () => {
    router.push('/booking/id')
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  if (!bookingData) {
    return <div>Loading...</div>
  }

  const selectedRoom = bookingData.selectedRoom
  const nights = Math.ceil((new Date(bookingData.search.checkOutDate).getTime() - new Date(bookingData.search.checkInDate).getTime()) / (1000 * 60 * 60 * 24))
  const subtotal = selectedRoom.basePrice * nights
  const taxAmount = Math.round(subtotal * 0.085) // 8.5% tax
  const depositAmount = selectedRoom.basePrice // One night deposit
  const total = subtotal + taxAmount

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Payment & Deposit</h1>
          <p className="text-xl text-gray-600">Secure payment processing</p>
        </div>

        {/* Step Wizard */}
        <div className="mb-8">
          <StepWizard steps={steps} currentStep={3} />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Your payment information is encrypted and secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Card Information */}
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value)
                        setValue('cardNumber', formatted)
                      }}
                      className={errors.cardNumber ? 'border-red-500' : ''}
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.cardNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Month *</Label>
                      <Select onValueChange={(value) => setValue('expiryMonth', parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {(i + 1).toString().padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.expiryMonth && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.expiryMonth.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="expiryYear">Year *</Label>
                      <Select onValueChange={(value) => setValue('expiryYear', parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() + i
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      {errors.expiryYear && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.expiryYear.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="password"
                        placeholder="123"
                        {...register('cvv')}
                        className={errors.cvv ? 'border-red-500' : ''}
                        maxLength={4}
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cvv.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
                    
                    <div>
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        {...register('billingAddress.street')}
                        className={errors.billingAddress?.street ? 'border-red-500' : ''}
                      />
                      {errors.billingAddress?.street && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.billingAddress.street.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          {...register('billingAddress.city')}
                          className={errors.billingAddress?.city ? 'border-red-500' : ''}
                        />
                        {errors.billingAddress?.city && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.billingAddress.city.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          {...register('billingAddress.state')}
                          className={errors.billingAddress?.state ? 'border-red-500' : ''}
                        />
                        {errors.billingAddress?.state && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.billingAddress.state.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">ZIP Code *</Label>
                        <Input
                          id="zipCode"
                          {...register('billingAddress.zipCode')}
                          className={errors.billingAddress?.zipCode ? 'border-red-500' : ''}
                        />
                        {errors.billingAddress?.zipCode && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.billingAddress.zipCode.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select onValueChange={(value) => setValue('billingAddress.country', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="DE">Germany</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.billingAddress?.country && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.billingAddress.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
                        <p className="text-sm text-blue-700">
                          Your payment information is encrypted and processed securely. 
                          We only authorize a deposit hold - the full amount will be charged at checkout.
                        </p>
                      </div>
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
                      Back to ID Capture
                    </Button>

                    <Button 
                      type="submit" 
                      disabled={isProcessing}
                      className="bg-primary"
                    >
                      {isProcessing ? 'Processing...' : 'Authorize Payment'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
                <CardDescription>
                  {selectedRoom.type} Room #{selectedRoom.number}
                </CardDescription>
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
                      <span>Subtotal</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-semibold text-yellow-800 mb-1">Deposit Hold</h4>
                  <p className="text-sm text-yellow-700">
                    We will hold {formatCurrency(depositAmount)} on your card as a deposit. 
                    The full amount will be charged at checkout.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-semibold text-green-800 mb-1">Refund Policy</h4>
                  <p className="text-sm text-green-700">
                    Deposit will be refunded within 3-5 business days after checkout, 
                    minus any charges for damages or additional services.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="h-4 w-4" />
                  <span>256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

