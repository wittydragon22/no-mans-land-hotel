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
import { ArrowLeft, Search, Key } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { LogoSVG } from '@/components/logo'

const checkinSearchSchema = z.object({
  reservationId: z.string().min(1, 'Reservation ID is required'),
  email: z.string().email('Please enter a valid email address'),
})

export default function CheckInPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSearching, setIsSearching] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkinSearchSchema),
    defaultValues: {
      reservationId: '',
      email: '',
    }
  })

  const onSearch = async (data: any) => {
    setIsSearching(true)
    
    try {
      const response = await fetch('/api/checkin/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.ok) {
        toast({
          title: "Reservation Found",
          description: "Redirecting to verification page...",
        })
        
        // Redirect to verification page
        setTimeout(() => {
          router.push(`/checkin/verify?id=${data.reservationId}`)
        }, 1000)
      } else {
        toast({
          title: "Search Failed",
          description: result.error || "Reservation not found. Please check your reservation ID and email",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Network error. Please try again",
        variant: "destructive",
      })
    } finally {
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
                  Please enter your reservation ID and email address
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
