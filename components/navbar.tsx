'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoSVG } from '@/components/logo'
import Link from 'next/link'
import { User, LogOut, Calendar, Menu } from 'lucide-react'

interface UserData {
  id: string
  email: string
  name: string | null
  role: string
}

export function Navbar({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    
    const performCheck = async () => {
      if (mounted) {
        await checkAuth()
      }
    }
    
    performCheck()
    
    // Listen for auth changes (when user logs in/out)
    const handleAuthChange = () => {
      if (mounted) {
        checkAuth()
      }
    }
    
    window.addEventListener('auth-change', handleAuthChange)
    
    // Listen for storage events (when user logs in/out in another tab)
    const handleStorageChange = () => {
      if (mounted) {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check on focus (when user comes back to tab) - but debounce it
    let focusTimeout: NodeJS.Timeout
    const handleFocus = () => {
      clearTimeout(focusTimeout)
      focusTimeout = setTimeout(() => {
        if (mounted) {
          checkAuth()
        }
      }, 100)
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      mounted = false
      clearTimeout(focusTimeout)
      window.removeEventListener('auth-change', handleAuthChange)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const result = await response.json()
        if (result.ok) {
          setUser(result.data.user)
        } else {
          setUser(null)
        }
      } else if (response.status === 401) {
        // 401 is expected when user is not logged in - not an error
        setUser(null)
      } else {
        // Only log actual errors (not 401)
        console.error('Auth check error:', response.status, response.statusText)
        setUser(null)
      }
    } catch (error) {
      // Network errors or other issues
      console.error('Auth check error:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setUser(null)
        // Clear booking data from session storage on logout
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('bookingData')
        }
        // Trigger auth change event
        window.dispatchEvent(new Event('auth-change'))
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out",
        })
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Logout Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isLight = variant === 'light'
  const textColor = isLight ? 'text-white/90 hover:text-white' : 'text-gray-600 hover:text-primary'
  const buttonVariant = isLight ? 'outline' : 'default'
  const buttonClassName = isLight 
    ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
    : 'bg-primary'

  return (
    <nav className={`border-b ${isLight ? 'bg-white/10 backdrop-blur-md' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <LogoSVG variant={isLight ? 'light' : 'dark'} />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/features" className={`${textColor} transition-colors`}>
              Features
            </Link>
            <Link href="/docs" className={`${textColor} transition-colors`}>
              Docs
            </Link>
            <Link href="/support" className={`${textColor} transition-colors`}>
              Support
            </Link>
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={buttonVariant} className={buttonClassName}>
                    <User className="h-4 w-4 mr-2" />
                    {user.name || user.email.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer">
                      <Calendar className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === 'operator' && (
                    <DropdownMenuItem asChild>
                      <Link href="/operator" className="cursor-pointer">
                        Operator Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button variant={buttonVariant} className={buttonClassName}>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

