import { getPopularMovies, getTrendingMovies } from "@/lib/omdb-cached"
import NetflixClient from "./net-client"
import CacheManagerComponent from "./cache-manager"

// ... (keep the same fallback data and interfaces)

export default async function NetflixContentCached() {
  const apiKey = "your_api_key_here" // Declare apiKey variable
  let movies = [] // Declare movies variable
  let usingAPI = false // Declare usingAPI variable
  let trendingMovies = [] // Declare trendingMovies variable
  const statusColor = "bg-green-500" // Declare statusColor variable
  const statusMessage = "API is working" // Declare statusMessage variable
  const featuredMovie = {} // Declare featuredMovie variable
  const contentRows = [] // Declare contentRows variable
  const genres = { genres: [] } // Declare genres variable

  console.log("🎬 Starting Netflix content fetch with caching...")

  // ... (same initialization logic)

  // The caching is now handled automatically in the API functions!
  if (apiKey && apiKey.length === 8) {
    try {
      console.log("🚀 Attempting to fetch from OMDb API with caching...")

      const popularResult = await getPopularMovies() // Now cached!
      if (popularResult && popularResult.results && popularResult.results.length > 0) {
        movies = popularResult.results
        usingAPI = true
        console.log("✅ Successfully loaded popular movies (cached or fresh):", movies.length)
      }

      if (usingAPI) {
        const trendingResult = await getTrendingMovies() // Now cached!
        if (trendingResult && trendingResult.results && trendingResult.results.length > 0) {
          trendingMovies = trendingResult.results
          console.log("✅ Successfully loaded trending movies (cached or fresh):", trendingMovies.length)
        }
      }
    } catch (error) {
      console.error("❌ OMDb API request failed:", error)
      // Keep using fallback
    }
  }

  // ... (rest of the component logic)

  return (
    <div className="relative">
      {/* Status indicator */}
      <div
        className={`fixed top-20 right-4 z-50 ${statusColor} text-white px-3 py-2 rounded shadow-lg text-sm max-w-48`}
      >
        <div className="font-semibold">🏠 Home</div>
        <div className="text-xs opacity-90">{statusMessage}</div>
        {!usingAPI && (
          <div className="text-xs opacity-75 mt-1">
            <a href="/test-omdb" className="underline hover:no-underline">
              Test API
            </a>
          </div>
        )}
      </div>

      <NetClient featuredContent={featuredMovie} contentRows={contentRows} genres={genres.genres} />

      {/* Add cache manager */}
      <CacheManagerComponent />
    </div>
  )
}
