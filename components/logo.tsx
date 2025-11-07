'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  showText?: boolean
  variant?: 'light' | 'dark'
}

export function Logo({ className = '', showText = true, variant = 'dark' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-primary'
  const [imageError, setImageError] = useState(false)
  
  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Image */}
      <div className="relative h-10 w-10 flex-shrink-0">
        {imageError ? (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="18" fill="#1a1a1a"/>
            <path d="M20 8C20 8 12 12 12 20C12 24 16 28 20 28C24 28 28 24 28 20C28 12 20 8 20 8Z" fill="#E74C3C"/>
            <path d="M16 18L20 14L24 18L22 20L20 18L18 20L16 18Z" fill="#E74C3C"/>
            <path d="M14 22L12 24L14 26L16 24L14 22Z" fill="#4CAF50"/>
            <path d="M26 22L24 24L26 26L28 24L26 22Z" fill="#4CAF50"/>
          </svg>
        ) : (
          <Image
            src="/images/logo.jpg"
            alt="No Man's Land Automated Hotel Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
            onError={() => setImageError(true)}
          />
        )}
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`text-xl font-bold ${textColor} leading-tight`}>
            NO MAN'S LAND
          </span>
          <span className={`text-xs ${textColor} opacity-80 leading-tight`}>
            AUTOMATED HOTEL
          </span>
        </div>
      )}
    </Link>
  )
}

// Logo Component that tries to use image first, falls back to SVG
export function LogoSVG({ className = '', showText = true, variant = 'dark' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-primary'
  const [imageError, setImageError] = useState(false)
  
  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <div className="relative h-10 w-10 flex-shrink-0">
        {imageError ? (
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 8C20 8 12 12 12 20C12 24 16 28 20 28C24 28 28 24 28 20C28 12 20 8 20 8Z" fill="#E74C3C"/>
            <path d="M20 10C20 10 14 13 14 20C14 23 17 26 20 26C23 26 26 23 26 20C26 13 20 10 20 10Z" fill="#C0392B"/>
            <path d="M20 12C20 12 16 14 16 20C16 22 18 24 20 24C22 24 24 22 24 20C24 14 20 12 20 12Z" fill="#A93226"/>
            <path d="M14 22L12 24L14 26L16 24L14 22Z" fill="#4CAF50"/>
            <path d="M26 22L24 24L26 26L28 24L26 22Z" fill="#4CAF50"/>
            <path d="M13 25L11 27L13 29L15 27L13 25Z" fill="#27AE60"/>
            <path d="M27 25L25 27L27 29L29 27L27 25Z" fill="#27AE60"/>
          </svg>
        ) : (
          <Image
            src="/images/logo.jpg"
            alt="No Man's Land Automated Hotel Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
            onError={() => setImageError(true)}
          />
        )}
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`text-xl font-bold ${textColor} leading-tight`}>
            NO MAN'S LAND
          </span>
          <span className={`text-xs ${textColor} opacity-80 leading-tight`}>
            AUTOMATED HOTEL
          </span>
        </div>
      )}
    </Link>
  )
}

