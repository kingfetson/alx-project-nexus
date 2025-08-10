import { BrowserCache } from "./cache"

// OMDb API integration with caching
const OMDB_API_URL = process.env.NEXT_PUBLIC_OMDB_API_URL || "http://www.omdbapi.com"
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  popularity: number
}

export interface ApiResponse<T> {
  results: T[]
  total_results: number
  total_pages: number
}

// Cache durations (in milliseconds)
const CACHE_DURATIONS = {
  POPULAR: 1000 * 60 * 60 * 6, // 6 hours
  TRENDING: 1000 * 60 * 60 * 2, // 2 hours
  SEARCH: 1000 * 60 * 60 * 1, // 1 hour
  DETAILS: 1000 * 60 * 60 * 24, // 24 hours
  GENRES: 1000 * 60 * 60 * 24 * 7, // 7 days
}

// Convert OMDb response to our Movie format
function convertOMDbToMovie(omdbItem: any, index: number): Movie {
  return {
    id: index + 1,
    title: omdbItem.Title || "Unknown Title",
    overview: omdbItem.Plot || "No overview available.",
    poster_path: omdbItem.Poster && omdbItem.Poster !== "N/A" ? omdbItem.Poster : "/netflix-inspired-poster.png",
    backdrop_path: omdbItem.Poster && omdbItem.Poster !== "N/A" ? omdbItem.Poster : "/netflix-inspired-poster.png",
    release_date: omdbItem.Year ? `${omdbItem.Year}-01-01` : "2023-01-01",
    vote_average: omdbItem.imdbRating ? Number.parseFloat(omdbItem.imdbRating) : 7.0,
    genre_ids: convertGenreStringToIds(omdbItem.Genre || "Drama"),
    adult: false,
    original_language: "en",
    popularity: Math.random() * 100 + 50,
  }
}

function convertGenreStringToIds(genreString: string): number[] {
  const genreMap: { [key: string]: number } = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    "Science Fiction": 878,
    "Sci-Fi": 878,
    Thriller: 53,
    War: 10752,
    Western: 37,
  }

  return genreString
    .split(",")
    .map((genre) => genre.trim())
    .map((genre) => genreMap[genre] || 18)
    .slice(0, 3)
}

// Enhanced API request with caching
async function makeOMDbRequestWithCache(
  cacheKey: string,
  params: Record<string, string>,
  cacheDuration: number,
): Promise<any> {
  // Try to get from cache first
  const cached = BrowserCache.get<any>(cacheKey)
  if (cached) {
    console.log(`🎯 Using cached data for: ${cacheKey}`)
    return cached
  }

  if (!OMDB_API_KEY) {
    throw new Error("OMDb API key not configured")
  }

  // Build URL
  const url = new URL(OMDB_API_URL)
  url.searchParams.set("apikey", OMDB_API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value)
  })

  console.log(`🌐 Making fresh API request: ${cacheKey}`)

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Netflix-Clone/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseText = await response.text()
    const data = JSON.parse(responseText)

    // Cache the successful response
    if (data.Response === "True") {
      BrowserCache.set(cacheKey, data, cacheDuration)
      console.log(`💾 Cached successful response for: ${cacheKey}`)
    }

    return data
  } catch (error) {
    console.error(`❌ API request failed for ${cacheKey}:`, error)
    throw error
  }
}

// Cached API functions
export async function getPopularMovies(): Promise<ApiResponse<Movie>> {
  const cacheKey = "popular_movies"
  const popularSearches = ["Batman", "Spider", "Avengers", "Star", "Marvel"]
  const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)]

  try {
    const data = await makeOMDbRequestWithCache(
      `${cacheKey}_${randomSearch}`,
      { s: randomSearch, type: "movie", page: "1" },
      CACHE_DURATIONS.POPULAR,
    )

    if (data.Response === "True" && data.Search && Array.isArray(data.Search)) {
      const movies = data.Search.map((item: any, index: number) => convertOMDbToMovie(item, index))
      return {
        results: movies,
        total_results: Number.parseInt(data.totalResults) || movies.length,
        total_pages: Math.ceil((Number.parseInt(data.totalResults) || movies.length) / 10),
      }
    }

    return { results: [], total_results: 0, total_pages: 0 }
  } catch (error) {
    console.error("❌ Error in getPopularMovies:", error)
    return { results: [], total_results: 0, total_pages: 0 }
  }
}

export async function getTrendingMovies(): Promise<ApiResponse<Movie>> {
  const cacheKey = "trending_movies"
  const trendingSearches = ["Action", "Adventure", "Thriller", "Comedy", "Drama"]
  const randomSearch = trendingSearches[Math.floor(Math.random() * trendingSearches.length)]

  try {
    const data = await makeOMDbRequestWithCache(
      `${cacheKey}_${randomSearch}`,
      { s: randomSearch, type: "movie", page: "1" },
      CACHE_DURATIONS.TRENDING,
    )

    if (data.Response === "True" && data.Search && Array.isArray(data.Search)) {
      const movies = data.Search.map((item: any, index: number) => convertOMDbToMovie(item, index))
      return {
        results: movies,
        total_results: Number.parseInt(data.totalResults) || movies.length,
        total_pages: Math.ceil((Number.parseInt(data.totalResults) || movies.length) / 10),
      }
    }

    return { results: [], total_results: 0, total_pages: 0 }
  } catch (error) {
    console.error("❌ Error in getTrendingMovies:", error)
    return { results: [], total_results: 0, total_pages: 0 }
  }
}

export async function searchMovies(query: string): Promise<ApiResponse<Movie>> {
  const cacheKey = `search_${query.toLowerCase().replace(/\s+/g, "_")}`

  try {
    const data = await makeOMDbRequestWithCache(
      cacheKey,
      { s: query, type: "movie", page: "1" },
      CACHE_DURATIONS.SEARCH,
    )

    if (data.Response === "True" && data.Search && Array.isArray(data.Search)) {
      const movies = data.Search.map((item: any, index: number) => convertOMDbToMovie(item, index))
      return {
        results: movies,
        total_results: Number.parseInt(data.totalResults) || movies.length,
        total_pages: Math.ceil((Number.parseInt(data.totalResults) || movies.length) / 10),
      }
    }

    return { results: [], total_results: 0, total_pages: 0 }
  } catch (error) {
    console.error("❌ Error in searchMovies:", error)
    return { results: [], total_results: 0, total_pages: 0 }
  }
}

// Cache management utilities
export const CacheManager = {
  getStats: () => BrowserCache.getStats(),
  clearAll: () => BrowserCache.clear(),
  clearExpired: () => {
    const { keys } = BrowserCache.getStats()
    keys.forEach((key) => {
      // This will automatically remove expired items
      BrowserCache.get(key)
    })
  },
}
