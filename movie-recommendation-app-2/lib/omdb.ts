// OMDb API integration for Netflix clone
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

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string
  backdrop_path: string
  first_air_date: string
  vote_average: number
  genre_ids: number[]
  adult: boolean
  original_language: string
  popularity: number
}

export interface Genre {
  id: number
  name: string
}

export interface ApiResponse<T> {
  results: T[]
  total_results: number
  total_pages: number
}

export interface GenreResponse {
  genres: Genre[]
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

// Convert OMDb response to our TVShow format
function convertOMDbToTVShow(omdbItem: any, index: number): TVShow {
  return {
    id: index + 1,
    name: omdbItem.Title || "Unknown Title",
    overview: omdbItem.Plot || "No overview available.",
    poster_path: omdbItem.Poster && omdbItem.Poster !== "N/A" ? omdbItem.Poster : "/netflix-inspired-poster.png",
    backdrop_path: omdbItem.Poster && omdbItem.Poster !== "N/A" ? omdbItem.Poster : "/netflix-inspired-poster.png",
    first_air_date: omdbItem.Year ? `${omdbItem.Year}-01-01` : "2023-01-01",
    vote_average: omdbItem.imdbRating ? Number.parseFloat(omdbItem.imdbRating) : 7.0,
    genre_ids: convertGenreStringToIds(omdbItem.Genre || "Comedy"),
    adult: false,
    original_language: "en",
    popularity: Math.random() * 100 + 50,
  }
}

// Convert genre string to genre IDs
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
    .map((genre) => genreMap[genre] || 18) // Default to Drama
    .slice(0, 3) // Max 3 genres
}

// Helper function to validate if a string is valid JSON
function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str)
    return true
  } catch {
    return false
  }
}

// Helper function to make OMDb API requests with better error handling
async function makeOMDbRequest(params: Record<string, string>): Promise<any> {
  if (!OMDB_API_KEY) {
    throw new Error("OMDb API key not configured")
  }

  // Validate API key format (should be 8 characters)
  if (OMDB_API_KEY.length !== 8) {
    throw new Error("Invalid OMDb API key format (should be 8 characters)")
  }

  // Build URL with proper encoding
  const url = new URL(OMDB_API_URL)
  url.searchParams.set("apikey", OMDB_API_KEY)

  // Add all other parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value)
    }
  })

  console.log(`🔗 Making OMDb request: ${url.toString().replace(OMDB_API_KEY, "***API_KEY***")}`)

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent": "Netflix-Clone/1.0",
      },
    })

    console.log(`📊 OMDb Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
    }

    // Get response text first to check if it's valid JSON
    const responseText = await response.text()
    console.log(`📝 OMDb Response text (first 100 chars): ${responseText.substring(0, 100)}`)

    // Check if response is valid JSON
    if (!isValidJSON(responseText)) {
      console.error("❌ Response is not valid JSON:", responseText)

      // Check for common error messages
      if (responseText.includes("Invalid API key")) {
        throw new Error("Invalid OMDb API key - please check your API key")
      } else if (responseText.includes("Invalid request")) {
        throw new Error("Invalid OMDb API request - check your parameters")
      } else if (responseText.includes("Request limit reached")) {
        throw new Error("OMDb API request limit reached")
      } else {
        throw new Error(`OMDb API returned invalid response: ${responseText.substring(0, 50)}`)
      }
    }

    // Parse JSON
    const data = JSON.parse(responseText)

    console.log(`📊 OMDb Response data:`, {
      Response: data.Response,
      Error: data.Error,
      ResultCount: data.Search?.length || 0,
      Title: data.Title,
    })

    return data
  } catch (error) {
    console.error("❌ OMDb API request failed:", error)
    throw error
  }
}

// Search movies using OMDb API
export async function searchMovies(query: string): Promise<ApiResponse<Movie>> {
  if (!OMDB_API_KEY) {
    console.warn("⚠️ OMDb API key not configured")
    return { results: [], total_results: 0, total_pages: 0 }
  }

  try {
    console.log(`🔍 Searching OMDb for movies: "${query}"`)

    const data = await makeOMDbRequest({
      s: query,
      type: "movie",
      page: "1",
    })

    if (data.Response === "True" && data.Search && Array.isArray(data.Search)) {
      const movies = data.Search.map((item: any, index: number) => convertOMDbToMovie(item, index))
      console.log(`✅ Successfully converted ${movies.length} movies from OMDb`)

      return {
        results: movies,
        total_results: Number.parseInt(data.totalResults) || movies.length,
        total_pages: Math.ceil((Number.parseInt(data.totalResults) || movies.length) / 10),
      }
    } else if (data.Response === "False") {
      console.warn(`⚠️ OMDb API returned error: ${data.Error}`)
      return { results: [], total_results: 0, total_pages: 0 }
    } else {
      console.warn(`⚠️ OMDb API returned unexpected response format`)
      return { results: [], total_results: 0, total_pages: 0 }
    }
  } catch (error) {
    console.error("❌ Error in searchMovies:", error)
    return { results: [], total_results: 0, total_pages: 0 }
  }
}

// Get popular movies - using multiple searches to get variety
export async function getPopularMovies(): Promise<ApiResponse<Movie>> {
  const popularSearches = ["Batman", "Spider", "Avengers", "Star", "Marvel"]
  const randomSearch = popularSearches[Math.floor(Math.random() * popularSearches.length)]

  console.log(`🎬 Getting popular movies with search: "${randomSearch}"`)
  return searchMovies(randomSearch)
}

// Get trending movies
export async function getTrendingMovies(): Promise<ApiResponse<Movie>> {
  const trendingSearches = ["Action", "Adventure", "Thriller", "Comedy", "Drama"]
  const randomSearch = trendingSearches[Math.floor(Math.random() * trendingSearches.length)]

  console.log(`📈 Getting trending movies with search: "${randomSearch}"`)
  return searchMovies(randomSearch)
}

// Get top rated movies
export async function getTopRatedMovies(): Promise<ApiResponse<Movie>> {
  const topRatedSearches = ["Godfather", "Shawshank", "Dark", "Pulp", "Forrest"]
  const randomSearch = topRatedSearches[Math.floor(Math.random() * topRatedSearches.length)]

  console.log(`⭐ Getting top rated movies with search: "${randomSearch}"`)
  return searchMovies(randomSearch)
}

// Search TV shows using OMDb API
export async function searchTVShows(query: string): Promise<ApiResponse<TVShow>> {
  if (!OMDB_API_KEY) {
    console.warn("⚠️ OMDb API key not configured")
    return { results: [], total_results: 0, total_pages: 0 }
  }

  try {
    console.log(`🔍 Searching OMDb for TV shows: "${query}"`)

    const data = await makeOMDbRequest({
      s: query,
      type: "series",
      page: "1",
    })

    if (data.Response === "True" && data.Search && Array.isArray(data.Search)) {
      const tvShows = data.Search.map((item: any, index: number) => convertOMDbToTVShow(item, index))
      console.log(`✅ Successfully converted ${tvShows.length} TV shows from OMDb`)

      return {
        results: tvShows,
        total_results: Number.parseInt(data.totalResults) || tvShows.length,
        total_pages: Math.ceil((Number.parseInt(data.totalResults) || tvShows.length) / 10),
      }
    } else if (data.Response === "False") {
      console.warn(`⚠️ OMDb API returned error: ${data.Error}`)
      return { results: [], total_results: 0, total_pages: 0 }
    } else {
      console.warn(`⚠️ OMDb API returned unexpected response format`)
      return { results: [], total_results: 0, total_pages: 0 }
    }
  } catch (error) {
    console.error("❌ Error in searchTVShows:", error)
    return { results: [], total_results: 0, total_pages: 0 }
  }
}

// Get popular TV shows
export async function getPopularTVShows(): Promise<ApiResponse<TVShow>> {
  const popularTVSearches = ["Breaking", "Game", "Friends", "Office", "Stranger"]
  const randomSearch = popularTVSearches[Math.floor(Math.random() * popularTVSearches.length)]

  console.log(`📺 Getting popular TV shows with search: "${randomSearch}"`)
  return searchTVShows(randomSearch)
}

// Get trending TV shows
export async function getTrendingTVShows(): Promise<ApiResponse<TVShow>> {
  const trendingTVSearches = ["Netflix", "HBO", "Comedy", "Drama", "Crime"]
  const randomSearch = trendingTVSearches[Math.floor(Math.random() * trendingTVSearches.length)]

  console.log(`📈 Getting trending TV shows with search: "${randomSearch}"`)
  return searchTVShows(randomSearch)
}

// Get top rated TV shows
export async function getTopRatedTVShows(): Promise<ApiResponse<TVShow>> {
  const topRatedTVSearches = ["Sopranos", "Wire", "Mad", "Breaking", "Better"]
  const randomSearch = topRatedTVSearches[Math.floor(Math.random() * topRatedTVSearches.length)]

  console.log(`⭐ Getting top rated TV shows with search: "${randomSearch}"`)
  return searchTVShows(randomSearch)
}

// Get movie genres
export async function getMovieGenres(): Promise<GenreResponse> {
  return {
    genres: [
      { id: 28, name: "Action" },
      { id: 12, name: "Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 14, name: "Fantasy" },
      { id: 36, name: "History" },
      { id: 27, name: "Horror" },
      { id: 10402, name: "Music" },
      { id: 9648, name: "Mystery" },
      { id: 10749, name: "Romance" },
      { id: 878, name: "Science Fiction" },
      { id: 53, name: "Thriller" },
      { id: 10752, name: "War" },
      { id: 37, name: "Western" },
    ],
  }
}

// Get TV genres
export async function getTVGenres(): Promise<GenreResponse> {
  return {
    genres: [
      { id: 10759, name: "Action & Adventure" },
      { id: 16, name: "Animation" },
      { id: 35, name: "Comedy" },
      { id: 80, name: "Crime" },
      { id: 99, name: "Documentary" },
      { id: 18, name: "Drama" },
      { id: 10751, name: "Family" },
      { id: 10762, name: "Kids" },
      { id: 9648, name: "Mystery" },
      { id: 10763, name: "News" },
      { id: 10764, name: "Reality" },
      { id: 878, name: "Sci-Fi & Fantasy" },
      { id: 10766, name: "Soap" },
      { id: 10767, name: "Talk" },
      { id: 10768, name: "War & Politics" },
      { id: 37, name: "Western" },
    ],
  }
}

// Get movie details by ID
export async function getMovieDetails(id: string): Promise<Movie | null> {
  if (!OMDB_API_KEY) {
    console.warn("⚠️ OMDb API key not configured")
    return null
  }

  try {
    console.log(`🎬 Getting movie details for ID: ${id}`)

    const data = await makeOMDbRequest({
      i: id,
    })

    if (data.Response === "True") {
      const movie = convertOMDbToMovie(data, 1)
      console.log(`✅ Successfully got movie details: ${movie.title}`)
      return movie
    } else if (data.Response === "False") {
      console.warn(`⚠️ OMDb API returned error: ${data.Error}`)
      return null
    } else {
      console.warn(`⚠️ OMDb API returned unexpected response format`)
      return null
    }
  } catch (error) {
    console.error("❌ Error getting movie details:", error)
    return null
  }
}

// Helper function to get genre names from IDs
export function getGenreNames(genreIds: number[], genres: Genre[]): string {
  if (!genreIds || !genres) return "Drama"

  return (
    genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
      .slice(0, 3)
      .join(" • ") || "Drama"
  )
}
