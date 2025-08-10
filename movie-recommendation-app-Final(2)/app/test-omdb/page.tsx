"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface TestResult {
  test: string
  status: number | string
  success: boolean
  error: string | null
  resultCount: number
  sampleData: {
    Title?: string
    Year?: string
    Type?: string
  } | null
}

interface ApiTestResponse {
  apiKey: string
  apiUrl: string
  testResults: TestResult[]
  summary: {
    successful: number
    total: number
    successRate: string
    status: string
  }
}

export default function TestOMDbPage() {
  const [testResults, setTestResults] = useState<ApiTestResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function runTests() {
      try {
        const response = await fetch("/api/test-omdb")
        const data = await response.json()

        if (response.ok) {
          setTestResults(data)
        } else {
          setError(data.error || "Failed to run tests")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    runTests()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Testing OMDb API Connection</h1>
          <p className="text-gray-400">Running multiple API endpoint tests...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-red-500">Test Failed</h1>
          <p className="text-gray-400 mb-6">Error: {error}</p>
          <Link href="/" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors">
            Back to SilverScreenet
          </Link>
        </div>
      </div>
    )
  }

  if (!testResults) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No test results available</h2>
          <Link href="/" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors">
            Back to SilverScreenet
          </Link>
        </div>
      </div>
    )
  }

  const { summary, testResults: results, apiKey, apiUrl } = testResults

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">OMDb API Test Results</h1>
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← Back to SilverScreenet
            </Link>
          </div>

          {/* Summary Card */}
          <div
            className={`p-6 rounded-lg mb-8 ${
              summary.successful === summary.total
                ? "bg-green-900/20 border border-green-500/30"
                : summary.successful > 0
                  ? "bg-yellow-900/20 border border-yellow-500/30"
                  : "bg-red-900/20 border border-red-500/30"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              {summary.successful === summary.total ? "✅" : summary.successful > 0 ? "⚠️" : "❌"} {summary.status}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">API Key</div>
                <div className="font-mono">{apiKey}</div>
              </div>
              <div>
                <div className="text-gray-400">API URL</div>
                <div className="font-mono text-xs break-all">{apiUrl}</div>
              </div>
              <div>
                <div className="text-gray-400">Success Rate</div>
                <div className="font-semibold">{summary.successRate}</div>
              </div>
              <div>
                <div className="text-gray-400">Tests Passed</div>
                <div className="font-semibold">
                  {summary.successful}/{summary.total}
                </div>
              </div>
            </div>
          </div>

          {/* Individual Test Results */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Individual Test Results</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded border ${
                  result.success ? "bg-green-900/10 border-green-500/20" : "bg-red-900/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">
                    {result.success ? "✅" : "❌"} {result.test}
                  </h4>
                  <div className="text-sm text-gray-400">Status: {result.status}</div>
                </div>

                {result.success ? (
                  <div className="text-sm">
                    <div className="text-green-400 mb-2">
                      Found {result.resultCount} result{result.resultCount !== 1 ? "s" : ""}
                    </div>
                    {result.sampleData && (
                      <div className="bg-gray-800 p-3 rounded font-mono text-xs">
                        <div className="text-gray-400 mb-1">Sample Data:</div>
                        <div>Title: {result.sampleData.Title || "N/A"}</div>
                        <div>Year: {result.sampleData.Year || "N/A"}</div>
                        {result.sampleData.Type && <div>Type: {result.sampleData.Type}</div>}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-red-400">Error: {result.error}</div>
                )}
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <div className="mt-8 p-6 bg-gray-800 rounded">
            <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
            <div className="space-y-2 text-sm">
              {summary.successful === summary.total ? (
                <>
                  <div className="text-green-400">✅ All tests passed! Your OMDb API is working perfectly.</div>
                  <div>• SilverScreenet will now use real movie data from OMDb</div>
                  <div>• Movie posters and details will be fetched from the API</div>
                  <div>• Fallback to local images will only happen if API is unavailable</div>
                </>
              ) : summary.successful > 0 ? (
                <>
                  <div className="text-yellow-400">⚠️ Some tests passed. API is partially working.</div>
                  <div>• Some features will use real data, others will use fallback images</div>
                  <div>• Check the failed tests above for specific issues</div>
                </>
              ) : (
                <>
                  <div className="text-red-400">❌ All tests failed. Using fallback images.</div>
                  <div>• Check your API key and internet connection</div>
                  <div>• SilverScreenet  will use local poster images</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
