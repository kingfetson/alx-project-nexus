"use client"

import { useState, useEffect } from 'react'
import NetflixWorking from './netflix-working'

// Simple API test component
export default function NetflixWithApiFallback() {
  const [apiWorking, setApiWorking] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test API on component mount
    const testAPI = async () => {
      try {
        console.log('🔍 Testing API connection...')
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        const response = await fetch(`https://${process.env.NEXT_PUBLIC_MOVIE_API_HOST}/movie/popular`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': process.env.NEXT_PUBLIC_MOVIE_API_KEY || '',
            'X-RapidAPI-Host': process.env.NEXT_PUBLIC_MOVIE_API_HOST || '',
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          if (data && data.results && data.results.length > 0) {
            console.log('✅ API is working! Found', data.results.length, 'movies')
            setApiWorking(true)
          } else {
            console.log('⚠️ API responded but no data found')
            setApiWorking(false)
          }
        } else {
          console.log('❌ API responded with error:', response.status)
          setApiWorking(false)
        }
      } catch (error) {
        console.log('❌ API test failed:', error.message)
        setApiWorking(false)
      } finally {
        setLoading(false)
      }
    }

    if (process.env.NEXT_PUBLIC_MOVIE_API_KEY && process.env.NEXT_PUBLIC_MOVIE_API_HOST) {
      testAPI()
    } else {
      console.log('⚠️ No API credentials found, using poster images')
      setApiWorking(false)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-3xl font-bold mb-4">NETFLIX</div>
          <div className="text-lg">Testing API connection...</div>
          <div className="text-sm text-gray-400 mt-2">Falling back to poster images if needed</div>
        </div>
      </div>
    )
  }

  // Show status message briefly if API failed
  if (apiWorking === false) {
    return (
      <div className="relative">
        <div className="fixed top-20 right-4 z-50 bg-yellow-600 text-black px-4 py-2 rounded shadow-lg">
          <div className="text-sm font-medium">📸 Using poster images</div>
          <div className="text-xs">API not available</div>
        </div>
        <NetflixWorking />
      </div>
    )
  }

  // If API is working, you could implement the API version here
  // For now, we'll just use the working poster version
  return (
    <div className="relative">
      {apiWorking && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          <div className="text-sm font-medium">✅ API Connected</div>
          <div className="text-xs">Using poster fallback for now</div>
        </div>
      )}
      <NetflixWorking />
    </div>
  )
}
