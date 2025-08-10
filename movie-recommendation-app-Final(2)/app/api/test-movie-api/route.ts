import { NextResponse } from "next/server"

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY
  const API_URL = process.env.NEXT_PUBLIC_OMDB_API_URL

  console.log("🔑 Testing Movie API with key:", API_KEY ? `${API_KEY.substring(0, 4)}****` : "Missing")
  console.log("🌐 API URL:", API_URL)

  if (!API_KEY || !API_URL) {
    return NextResponse.json({
      error: "Missing API credentials",
      hasKey: !!API_KEY,
      hasUrl: !!API_URL,
    })
  }

  try {
    // Test a simple movie search
    const searchParams = new URLSearchParams({
      apikey: API_KEY,
      s: "Batman",
      type: "movie",
    })

    const url = `${API_URL}/?${searchParams.toString()}`
    console.log("🧪 Testing URL:", url)

    const response = await fetch(url)
    const data = await response.json()

    console.log("📊 API Response:", data)

    return NextResponse.json({
      success: data.Response === "True",
      data: data,
      url: url,
      status: response.status,
    })
  } catch (error) {
    console.error("❌ API Test Error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
