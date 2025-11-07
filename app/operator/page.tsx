'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Calendar, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Shield,
  Wrench
} from 'lucide-react'

interface KPIData {
  occupancy: number
  inHouse: number
  dueOut: number
  pendingCheckIns: number
  manualReviewQueue: number
}

interface Reservation {
  id: string
  guestName: string
  roomNumber: string
  checkInDate: string
  checkOutDate: string
  status: string
  totalAmount: number
  biometricStatus?: string
}

export default function OperatorDashboard() {
  const [kpiData, setKpiData] = useState<KPIData | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data loading
    const loadData = async () => {
      setLoading(true)
      
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setKpiData({
        occupancy: 85,
        inHouse: 42,
        dueOut: 8,
        pendingCheckIns: 5,
        manualReviewQueue: 2
      })
      
      setReservations([
        {
          id: '1',
          guestName: 'John Doe',
          roomNumber: '101',
          checkInDate: '2024-01-15',
          checkOutDate: '2024-01-17',
          status: 'checked_in',
          totalAmount: 32500,
          biometricStatus: 'pass'
        },
        {
          id: '2',
          guestName: 'Jane Smith',
          roomNumber: '205',
          checkInDate: '2024-01-15',
          checkOutDate: '2024-01-18',
          status: 'confirmed',
          totalAmount: 48750,
          biometricStatus: 'manual_review'
        },
        {
          id: '3',
          guestName: 'Bob Johnson',
          roomNumber: '301',
          checkInDate: '2024-01-16',
          checkOutDate: '2024-01-19',
          status: 'pending',
          totalAmount: 65000
        }
      ])
      
      setLoading(false)
    }
    
    loadData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'checked_in':
        return <Badge className="bg-green-100 text-green-800">Checked In</Badge>
      case 'confirmed':
        return <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'checked_out':
        return <Badge className="bg-gray-100 text-gray-800">Checked Out</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getBiometricBadge = (status?: string) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-100 text-green-800">Pass</Badge>
      case 'fail':
        return <Badge className="bg-red-100 text-red-800">Fail</Badge>
      case 'manual_review':
        return <Badge className="bg-yellow-100 text-yellow-800">Manual Review</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Operator Dashboard</h1>
          <p className="text-xl text-gray-600">Hotel operations and guest management</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData?.occupancy}%</div>
                <p className="text-xs text-muted-foreground">
                  +2% from yesterday
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In House</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData?.inHouse}</div>
                <p className="text-xs text-muted-foreground">
                  Current guests
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Due Out</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData?.dueOut}</div>
                <p className="text-xs text-muted-foreground">
                  Today's departures
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Check-ins</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData?.pendingCheckIns}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting arrival
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Manual Review</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpiData?.manualReviewQueue}</div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="reservations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="housekeeping">Housekeeping</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservations</CardTitle>
                <CardDescription>
                  Manage guest reservations and check-ins
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations.map((reservation) => (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold">{reservation.guestName}</h4>
                          <p className="text-sm text-gray-600">Room {reservation.roomNumber}</p>
                          <p className="text-xs text-gray-500">
                            {reservation.checkInDate} - {reservation.checkOutDate}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold">${(reservation.totalAmount / 100).toFixed(2)}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            {getStatusBadge(reservation.status)}
                            {reservation.biometricStatus && getBiometricBadge(reservation.biometricStatus)}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                          {reservation.biometricStatus === 'manual_review' && (
                            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                              Review
                            </Button>
                          )}
                          <Button size="sm" variant="destructive">
                            Revoke Key
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="housekeeping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Housekeeping Schedule
                </CardTitle>
                <CardDescription>
                  Manage cleaning and maintenance tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Housekeeping management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance Log
                </CardTitle>
                <CardDescription>
                  Track and manage maintenance issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Maintenance management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security & Access Logs
                </CardTitle>
                <CardDescription>
                  Monitor access events and security alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Security monitoring coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

