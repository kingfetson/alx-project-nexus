import {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getMovieGenres,
  type Movie,
  type Genre,
} from "@/lib/omdb"
import NetClient from "@/components/net-client"

// Movie fallback data
const fallbackMovies: Movie[] = [
  {
    id: 1,
    title: "The Dark Knight",
    overview:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    poster_path: "generic-action-movie-poster.png",
    backdrop_path: "generic-action-movie-poster.png",
    release_date: "2008-07-18",
    vote_average: 9.0,
    genre_ids: [28, 80, 18],
    adult: false,
    original_language: "en",
    popularity: 250.0,
  },
  {
    id: 2,
    title: "Inception",
    overview:
      "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.",
    poster_path: "net-inspired-poster.png",
    backdrop_path: "net-inspired-poster.png",
    release_date: "2010-07-16",
    vote_average: 8.8,
    genre_ids: [28, 878, 53],
    adult: false,
    original_language: "en",
    popularity: 240.0,
  },
  {
    id: 3,
    title: "The Matrix",
    overview:
      "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
    poster_path: "generic-action-movie-poster.png",
    backdrop_path: "generic-action-movie-poster.png",
    release_date: "1999-03-31",
    vote_average: 8.7,
    genre_ids: [28, 878],
    adult: false,
    original_language: "en",
    popularity: 230.0,
  },
  {
    id: 4,
    title: "Pulp Fiction",
    overview:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    poster_path: "generic-action-movie-poster.png",
    backdrop_path: "generic-action-movie-poster.png",
    release_date: "1994-10-14",
    vote_average: 8.9,
    genre_ids: [80, 18],
    adult: false,
    original_language: "en",
    popularity: 220.0,
  },
  {
    id: 5,
    title: "The Godfather",
    overview:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    poster_path: "net-inspired-poster.png",
    backdrop_path: "net-inspired-poster.png",
    release_date: "1972-03-24",
    vote_average: 9.2,
    genre_ids: [80, 18],
    adult: false,
    original_language: "en",
    popularity: 210.0,
  },
  {
    id: 6,
    title: "Forrest Gump",
    overview:
      "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    poster_path: "generic-action-movie-poster.png",
    backdrop_path: "generic-action-movie-poster.png",
    release_date: "1994-07-06",
    vote_average: 8.8,
    genre_ids: [18, 10749],
    adult: false,
    original_language: "en",
    popularity: 200.0,
  },
]

const defaultGenres: Genre[] = [
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
]

export default async function MoviesPage() {
  console.log("🎬 Loading Movies page...")

  // Try to fetch movie data from OMDb API
  let apiMovies: Movie[] = []
  let trendingMovies: Movie[] = []
  let topRatedMovies: Movie[] = []
  let usingAPI = false

  if (process.env.NEXT_PUBLIC_OMDB_API_KEY) {
    try {
      // Get different types of movies
      const [popular, trending, topRated] = await Promise.allSettled([
        getPopularMovies(),
        getTrendingMovies(),
        getTopRatedMovies(),
      ])

      if (popular.status === "fulfilled" && popular.value.results.length > 0) {
        apiMovies = popular.value.results
        usingAPI = true
      }

      if (trending.status === "fulfilled" && trending.value.results.length > 0) {
        trendingMovies = trending.value.results
      }

      if (topRated.status === "fulfilled" && topRated.value.results.length > 0) {
        topRatedMovies = topRated.value.results
      }

      console.log("✅ Loaded movies from OMDb API:", apiMovies.length)
    } catch (error) {
      console.warn("Failed to load movies from API:", error)
    }
  }

  // Use API data if available, otherwise fallback
  const movies = usingAPI ? apiMovies : fallbackMovies
  const featuredMovie = movies[0]

  const contentRows = [
    {
      title: "Popular Movies",
      items: movies.slice(0, 12),
    },
    {
      title: "Trending Movies",
      items: trendingMovies.length > 0 ? trendingMovies.slice(0, 12) : movies.slice(2, 8),
    },
    {
      title: "Top Rated Movies",
      items: topRatedMovies.length > 0 ? topRatedMovies.slice(0, 12) : movies.slice(1, 7),
    },
    {
      title: "Action Movies",
      items: movies.filter((movie) => movie.genre_ids.includes(28)).slice(0, 12),
    },
    {
      title: "Drama Movies",
      items: movies.filter((movie) => movie.genre_ids.includes(18)).slice(0, 12),
    },
    {
      title: "Sci-Fi Movies",
      items: movies.filter((movie) => movie.genre_ids.includes(878)).slice(0, 12),
    },
  ].filter((row) => row.items.length > 0)

  const genres = await getMovieGenres()

  return (
    <div className="relative">
      <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-3 py-2 rounded shadow-lg text-sm">
        🎬 Movies
        <div className="text-xs opacity-75">{usingAPI ? "OMDb API" : "Local Data"}</div>
      </div>
      <NetClient featuredContent={featuredMovie} contentRows={contentRows} genres={genres.genres} />
    </div>
  )
}
