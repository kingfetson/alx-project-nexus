import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY
  const API_HOST = process.env.NEXT_PUBLIC_MOVIE_API_HOST
  
  if (!API_KEY || !API_HOST) {
    return NextResponse.json({ 
      error: 'Missing API credentials',
      API_KEY: API_KEY ? 'Present' : 'Missing',
      API_HOST: API_HOST ? 'Present' : 'Missing'
    })
  }

  // Test different endpoint formats
  const endpointsToTest = [
    '/movie/popular',
    '/3/movie/popular',
    '/movies/popular',
    '/popular',
    '/trending/movie/week',
    '/3/trending/movie/week'
  ]

  const results = []

  for (const endpoint of endpointsToTest) {
    try {
      const url = `https://${API_HOST}${endpoint}`
      
      console.log('Testing endpoint:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST,
          'Content-Type': 'application/json'
        }
      })

      const responseText = await response.text()
      
      results.push({
        endpoint,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        responsePreview: responseText.substring(0, 200),
        isJSON: (() => {
          try {
            JSON.parse(responseText)
            return true
          } catch {
            return false
          }
        })()
      })

    } catch (error: unknown) {
      results.push({
        endpoint,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      })
    }
  }

  return NextResponse.json({
    apiHost: API_HOST,
    apiKeyPresent: !!API_KEY,
    testResults: results
  })
}
