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
    poster_path: omdbItem.Poster && omdbItem.Poster !== "N/A" ? omdbItem.Poster : "netflix-inspired-poster.png",
    backdrop_path: omdbItem.Poster && omdbItem.Poster !== "N/A" ? omdbItem.Poster : "netflix-inspired-poster.png",
    release_date: omdbItem.Year || "2023",
    vote_average: Number.parseFloat(omdbItem.imdbRating) || 7.0,
    genre_ids: [18, 28], // Default genres
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
    poster_path: omdbItem.Poster && omdbItem.Poster !== "N/A" ? omdbItem.Poster : "netflix-inspired-poster.png",
    backdrop_path: omdbItem.Poster && omdbItem.Poster !== "N/A" ? omdbItem.Poster : "netflix-inspired-poster.png",
    first_air_date: omdbItem.Year || "2023",
    vote_average: Number.parseFloat(omdbItem.imdbRating) || 7.0,
    genre_ids: [18, 35], // Default genres
    adult: false,
    original_language: "en",
    popularity: Math.random() * 100 + 50,
  }
}

// Search movies using OMDb API
export async function searchMovies(query: string): Promise<ApiResponse<Movie>> {
  if (!OMDB_API_KEY) {
    throw new Error("OMDb API key not configured")
  }

  try {
    const response = await fetch(`${OMDB_API_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=movie`)

    const data = await response.json()

    if (data.Response === "True" && data.Search) {
      const movies = data.Search.map((item: any, index: number) => convertOMDbToMovie(item, index))
      return {
        results: movies,
        total_results: Number.parseInt(data.totalResults) || movies.length,
        total_pages: Math.ceil((Number.parseInt(data.totalResults) || movies.length) / 10),
      }
    }

    return { results: [], total_results: 0, total_pages: 0 }
  } catch (error) {
    console.error("Error searching movies:", error)
    return { results: [], total_results: 0, total_pages: 0 }
  }
}

// Get popular movies
export async function getPopularMovies(): Promise<ApiResponse<Movie>> {
  return searchMovies("popular")
}

// Get trending movies
export async function getTrendingMovies(): Promise<ApiResponse<Movie>> {
  return searchMovies("action")
}

// Get top rated movies
export async function getTopRatedMovies(): Promise<ApiResponse<Movie>> {
  return searchMovies("drama")
}

// Search TV shows using OMDb API
export async function searchTVShows(query: string): Promise<ApiResponse<TVShow>> {
  if (!OMDB_API_KEY) {
    throw new Error("OMDb API key not configured")
  }

  try {
    const response = await fetch(`${OMDB_API_URL}/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(query)}&type=series`)

    const data = await response.json()

    if (data.Response === "True" && data.Search) {
      const tvShows = data.Search.map((item: any, index: number) => convertOMDbToTVShow(item, index))
      return {
        results: tvShows,
        total_results: Number.parseInt(data.totalResults) || tvShows.length,
        total_pages: Math.ceil((Number.parseInt(data.totalResults) || tvShows.length) / 10),
      }
    }

    return { results: [], total_results: 0, total_pages: 0 }
  } catch (error) {
    console.error("Error searching TV shows:", error)
    return { results: [], total_results: 0, total_pages: 0 }
  }
}

// Get popular TV shows
export async function getPopularTVShows(): Promise<ApiResponse<TVShow>> {
  return searchTVShows("series")
}

// Get trending TV shows
export async function getTrendingTVShows(): Promise<ApiResponse<TVShow>> {
  return searchTVShows("drama")
}

// Get top rated TV shows
export async function getTopRatedTVShows(): Promise<ApiResponse<TVShow>> {
  return searchTVShows("comedy")
}

// Get movie genres
export async function getMovieGenres(): Promise<GenreResponse> {
  // Return static genres since OMDb doesn't have a genres endpoint
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
    throw new Error("OMDb API key not configured")
  }

  try {
    const response = await fetch(`${OMDB_API_URL}/?apikey=${OMDB_API_KEY}&i=${id}`)
    const data = await response.json()

    if (data.Response === "True") {
      return convertOMDbToMovie(data, 1)
    }

    return null
  } catch (error) {
    console.error("Error getting movie details:", error)
    return null
  }
}
