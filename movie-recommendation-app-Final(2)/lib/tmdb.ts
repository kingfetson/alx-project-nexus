const API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY
const API_HOST = process.env.NEXT_PUBLIC_MOVIE_API_HOST
const BASE_URL = `https://${API_HOST}`
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const TMDB_CONFIG = {
  API_KEY,
  API_HOST,
  BASE_URL,
  IMAGE_BASE_URL,
  POSTER_SIZES: {
    small: '/w342',
    medium: '/w500',
    large: '/w780'
  },
  BACKDROP_SIZES: {
    small: '/w780',
    medium: '/w1280',
    large: '/original'
  }
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
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
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  genre_ids: number[]
  origin_country: string[]
  original_language: string
  popularity: number
}

export interface Genre {
  id: number
  name: string
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

// Enhanced API function with better error handling
export async function fetchFromTMDB(endpoint: string): Promise<any> {
  if (!API_KEY || !API_HOST) {
    throw new Error('Missing API credentials')
  }

  const url = `${BASE_URL}${endpoint}`
  
  console.log('🔗 Fetching from:', url)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': API_HOST,
        'Content-Type': 'application/json'
      },
      next: { revalidate: 3600 }
    })

    console.log(`📊 Response status for ${endpoint}:`, response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ API Error for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        body: errorText.substring(0, 200)
      })
      throw new Error(`API request failed: ${response.status} - ${response.statusText}`)
    }

    const responseText = await response.text()
    console.log(`📝 Raw response preview for ${endpoint}:`, responseText.substring(0, 100))

    if (!responseText.trim()) {
      console.error(`❌ Empty response from API for ${endpoint}`)
      throw new Error('Empty response from API')
    }

    // Check if response looks like JSON
    if (!responseText.trim().startsWith('{') && !responseText.trim().startsWith('[')) {
      console.error(`❌ Response doesn't look like JSON for ${endpoint}:`, responseText.substring(0, 200))
      throw new Error(`Invalid response format: ${responseText.substring(0, 50)}...`)
    }

    try {
      const data = JSON.parse(responseText)
      console.log(`✅ Successfully parsed JSON for ${endpoint}:`, data.results ? `${data.results.length} items` : 'No results array')
      
      // Validate the response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data structure')
      }
      
      return data
    } catch (parseError) {
      console.error(`❌ JSON Parse Error for ${endpoint}:`, parseError)
      console.error('📄 Full response text:', responseText.substring(0, 500))
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}...`)
    }

  } catch (error) {
    console.error(`🚨 Network/Fetch error for ${endpoint}:`, error)
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`API call failed for ${endpoint}: ${error.message}`)
    } else {
      throw new Error(`Unknown error occurred for ${endpoint}`)
    }
  }
}

// API functions with better error handling
export async function getTrendingMovies(): Promise<TMDBResponse<Movie>> {
  try {
    return await fetchFromTMDB('/movie/popular')
  } catch (error) {
    console.error('❌ Failed to get trending movies:', error)
    throw error
  }
}

export async function getPopularMovies(): Promise<TMDBResponse<Movie>> {
  try {
    return await fetchFromTMDB('/movie/popular')
  } catch (error) {
    console.error('❌ Failed to get popular movies:', error)
    throw error
  }
}

export async function getTopRatedMovies(): Promise<TMDBResponse<Movie>> {
  try {
    return await fetchFromTMDB('/movie/top_rated')
  } catch (error) {
    console.error('❌ Failed to get top rated movies:', error)
    throw error
  }
}

export async function getMovieGenres(): Promise<{ genres: Genre[] }> {
  try {
    return await fetchFromTMDB('/genre/movie/list')
  } catch (error) {
    console.error('❌ Failed to get movie genres:', error)
    throw error
  }
}

export function getImageUrl(path: string | null, size: 'small' | 'medium' | 'large' = 'medium', type: 'poster' | 'backdrop' = 'poster'): string {
  if (!path) return '/placeholder.svg?height=600&width=400&text=No+Image'
  
  const sizeMap = type === 'poster' ? TMDB_CONFIG.POSTER_SIZES : TMDB_CONFIG.BACKDROP_SIZES
  return `${IMAGE_BASE_URL}${sizeMap[size]}${path}`
}

export function getGenreNames(genreIds: number[], genres: Genre[]): string {
  if (!genreIds || !genres) return 'Drama'
  
  return genreIds
    .map(id => genres.find(genre => genre.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(' • ') || 'Drama'
}
