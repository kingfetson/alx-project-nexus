import { NextResponse } from "next/server"

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY
  const API_URL = process.env.NEXT_PUBLIC_OMDB_API_URL

  console.log("🔑 Testing OMDb API with key:", API_KEY ? `${API_KEY.substring(0, 4)}****` : "Missing")
  console.log("🌐 API URL:", API_URL)

  if (!API_KEY || !API_URL) {
    return NextResponse.json({
      error: "Missing OMDb API credentials",
      API_KEY: API_KEY ? "Present" : "Missing",
      API_URL: API_URL ? "Present" : "Missing",
    })
  }

  // Test different OMDb API endpoints
  const testsToRun = [
    {
      name: "Search Movies",
      params: { s: "Batman", type: "movie" },
    },
    {
      name: "Search TV Series",
      params: { s: "Breaking Bad", type: "series" },
    },
    {
      name: "Get Movie by ID",
      params: { i: "tt0468569" }, // The Dark Knight
    },
    {
      name: "Search Popular",
      params: { s: "Marvel" },
    },
  ]

  const results = []

  for (const test of testsToRun) {
    try {
      const searchParams = new URLSearchParams({
        apikey: API_KEY,
        ...test.params,
      })

      const url = `${API_URL}/?${searchParams.toString()}`
      console.log(`🧪 Testing: ${test.name}`)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      results.push({
        test: test.name,
        status: response.status,
        success: data.Response === "True",
        error: data.Error || null,
        resultCount: data.Search ? data.Search.length : data.Title ? 1 : 0,
        sampleData: data.Search ? data.Search[0] : data.Title ? { Title: data.Title, Year: data.Year } : null,
      })

      console.log(`✅ ${test.name}:`, data.Response === "True" ? "Success" : `Failed - ${data.Error}`)
    } catch (error) {
      results.push({
        test: test.name,
        status: "Error",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        resultCount: 0,
        sampleData: null,
      })

      console.log(`❌ ${test.name}:`, error)
    }
  }

  const successfulTests = results.filter((r) => r.success).length
  const totalTests = results.length

  return NextResponse.json({
    apiKey: API_KEY ? `${API_KEY.substring(0, 4)}****` : "Missing",
    apiUrl: API_URL,
    testResults: results,
    summary: {
      successful: successfulTests,
      total: totalTests,
      successRate: `${Math.round((successfulTests / totalTests) * 100)}%`,
      status:
        successfulTests === totalTests
          ? "All tests passed"
          : successfulTests > 0
            ? "Some tests passed"
            : "All tests failed",
    },
  })
}
