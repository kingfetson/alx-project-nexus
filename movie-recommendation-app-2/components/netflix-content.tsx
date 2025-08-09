import { getPopularMovies, getTrendingMovies, getMovieGenres, type Movie, type Genre } from "@/lib/omdb"
import NetflixClient from "./netflix-client"

// Fallback data in case API fails
const fallbackMovies: Movie[] = [
  {
    id: 1,
    title: "Stranger Things",
    overview:
      "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    poster_path: "stranger-things-dark-scene.png",
    backdrop_path: "stranger-things-dark-scene.png",
    release_date: "2016-07-15",
    vote_average: 8.7,
    genre_ids: [18, 9648, 878],
    adult: false,
    original_language: "en",
    popularity: 200.0,
  },
  {
    id: 2,
    title: "The Witcher",
    overview:
      "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
    poster_path: "witcher-inspired-poster.png",
    backdrop_path: "witcher-inspired-poster.png",
    release_date: "2019-12-20",
    vote_average: 8.2,
    genre_ids: [10759, 18, 14],
    adult: false,
    original_language: "en",
    popularity: 190.0,
  },
  {
    id: 3,
    title: "Ozark",
    overview:
      "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years to appease a drug boss.",
    poster_path: "ozark-tv-show-poster.png",
    backdrop_path: "ozark-tv-show-poster.png",
    release_date: "2017-07-21",
    vote_average: 8.4,
    genre_ids: [80, 18],
    adult: false,
    original_language: "en",
    popularity: 180.0,
  },
  {
    id: 4,
    title: "The Queen's Gambit",
    overview:
      "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.",
    poster_path: "queens-gambit-poster.png",
    backdrop_path: "queens-gambit-poster.png",
    release_date: "2020-10-23",
    vote_average: 8.5,
    genre_ids: [18],
    adult: false,
    original_language: "en",
    popularity: 170.0,
  },
  {
    id: 5,
    title: "Dark",
    overview:
      "A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.",
    poster_path: "dark-netflix-poster.png",
    backdrop_path: "dark-netflix-poster.png",
    release_date: "2017-12-01",
    vote_average: 8.8,
    genre_ids: [80, 18, 9648],
    adult: false,
    original_language: "de",
    popularity: 160.0,
  },
  {
    id: 6,
    title: "The Umbrella Academy",
    overview:
      "A dysfunctional family of superheroes comes together to solve the mystery of their father's death, the threat of the apocalypse and more.",
    poster_path: "umbrella-academy-inspired-poster.png",
    backdrop_path: "umbrella-academy-inspired-poster.png",
    release_date: "2019-02-15",
    vote_average: 7.9,
    genre_ids: [10759, 35, 18],
    adult: false,
    original_language: "en",
    popularity: 150.0,
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
]

export default async function NetflixContent() {
  console.log("🎬 Loading Netflix content...")

  // Try to fetch data from OMDb API
  let apiMovies: Movie[] = []
  let trendingMovies: Movie[] = []
  let usingAPI = false

  if (process.env.NEXT_PUBLIC_OMDB_API_KEY) {
    try {
      // Get different types of content
      const [popular, trending] = await Promise.allSettled([getPopularMovies(), getTrendingMovies()])

      if (popular.status === "fulfilled" && popular.value.results.length > 0) {
        apiMovies = popular.value.results
        usingAPI = true
      }

      if (trending.status === "fulfilled" && trending.value.results.length > 0) {
        trendingMovies = trending.value.results
      }

      console.log("✅ Loaded content from OMDb API:", apiMovies.length)
    } catch (error) {
      console.warn("Failed to load content from API:", error)
    }
  }

  // Use API data if available, otherwise fallback
  const movies = usingAPI ? apiMovies : fallbackMovies
  const featuredMovie = movies[0]

  const contentRows = [
    {
      title: "Popular on Netflix",
      items: movies.slice(0, 12),
    },
    {
      title: "Trending Now",
      items: trendingMovies.length > 0 ? trendingMovies.slice(0, 12) : movies.slice(2, 8),
    },
    {
      title: "Netflix Originals",
      items: movies.filter((movie) => movie.popularity > 150).slice(0, 12),
    },
    {
      title: "Action & Adventure",
      items: movies.filter((movie) => movie.genre_ids.includes(28) || movie.genre_ids.includes(12)).slice(0, 12),
    },
    {
      title: "Dramas",
      items: movies.filter((movie) => movie.genre_ids.includes(18)).slice(0, 12),
    },
    {
      title: "Sci-Fi & Fantasy",
      items: movies.filter((movie) => movie.genre_ids.includes(878) || movie.genre_ids.includes(14)).slice(0, 12),
    },
  ].filter((row) => row.items.length > 0)

  const genres = await getMovieGenres()

  return (
    <div className="relative">
      <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-3 py-2 rounded shadow-lg text-sm">
        🏠 Home
        <div className="text-xs opacity-75">{usingAPI ? "OMDb API" : "Local Data"}</div>
      </div>
      <NetflixClient featuredContent={featuredMovie} contentRows={contentRows} genres={genres.genres} />
    </div>
  )
}
