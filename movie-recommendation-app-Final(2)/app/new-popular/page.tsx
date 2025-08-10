import {
  getTrendingMovies,
  getPopularMovies,
  getTrendingTVShows,
  getMovieGenres,
  type Movie,
  type TVShow,
  type Genre,
} from "@/lib/omdb"
import NetflixClient from "@/components/net-client"

// Mixed content fallback data
const fallbackContent: (Movie | TVShow)[] = [
  {
    id: 1,
    title: "Red Notice",
    overview:
      "An Interpol-issued Red Notice is a global alert to hunt and capture the world's most wanted. But when a daring heist brings together the FBI's top profiler and two rival criminals, there's no telling what will happen.",
    poster_path: "red-notice-inspired-poster.png",
    backdrop_path: "red-notice-inspired-poster.png",
    release_date: "2021-11-05",
    vote_average: 6.4,
    genre_ids: [28, 35, 80],
    adult: false,
    original_language: "en",
    popularity: 250.0,
  },
  {
    id: 2,
    name: "Squid Game",
    overview:
      "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    poster_path: "generic-survival-game-poster.png",
    backdrop_path: "generic-survival-game-poster.png",
    first_air_date: "2021-09-17",
    vote_average: 8.0,
    genre_ids: [18, 53, 9648],
    adult: false,
    original_language: "ko",
    popularity: 240.0,
  },
  {
    id: 3,
    title: "The Old Guard",
    overview:
      "A covert team of immortal mercenaries is suddenly exposed and must now fight to keep their identity a secret just as an unexpected new member is discovered.",
    poster_path: "the-old-guard-poster.png",
    backdrop_path: "the-old-guard-poster.png",
    release_date: "2020-07-10",
    vote_average: 6.6,
    genre_ids: [28, 14, 878],
    adult: false,
    original_language: "en",
    popularity: 230.0,
  },
  {
    id: 4,
    name: "You",
    overview:
      "A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into the lives of those he is transfixed by.",
    poster_path: "you-netflix-series-poster.png",
    backdrop_path: "you-netflix-series-poster.png",
    first_air_date: "2018-09-09",
    vote_average: 7.7,
    genre_ids: [80, 18, 53],
    adult: false,
    original_language: "en",
    popularity: 220.0,
  },
  {
    id: 5,
    title: "Army of the Dead",
    overview:
      "Following a zombie outbreak in Las Vegas, a group of mercenaries take the ultimate gamble, venturing into the quarantine zone to pull off the greatest heist ever attempted.",
    poster_path: "army-of-the-dead-poster.png",
    backdrop_path: "army-of-the-dead-poster.png",
    release_date: "2021-05-21",
    vote_average: 5.8,
    genre_ids: [28, 27, 878],
    adult: false,
    original_language: "en",
    popularity: 210.0,
  },
  {
    id: 6,
    name: "Elite",
    overview:
      "When three working-class teens enroll in an exclusive private school in Spain, the clash between them and the wealthy students leads to murder.",
    poster_path: "elite-netflix-poster.png",
    backdrop_path: "elite-netflix-poster.png",
    first_air_date: "2018-10-05",
    vote_average: 8.0,
    genre_ids: [80, 18, 9648],
    adult: false,
    original_language: "es",
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
]

export default async function NewPopularPage() {
  console.log("🔥 Loading New & Popular page...")

  // Try to fetch trending content from OMDb API
  let apiContent: (Movie | TVShow)[] = []
  let trendingMovies: Movie[] = []
  let trendingTVShows: TVShow[] = []
  let usingAPI = false

  if (process.env.NEXT_PUBLIC_OMDB_API_KEY) {
    try {
      // Get trending content
      const [movies, tvShows, popular] = await Promise.allSettled([
        getTrendingMovies(),
        getTrendingTVShows(),
        getPopularMovies(),
      ])

      if (movies.status === "fulfilled" && movies.value.results.length > 0) {
        trendingMovies = movies.value.results
        apiContent = [...apiContent, ...movies.value.results.slice(0, 5)]
        usingAPI = true
      }

      if (tvShows.status === "fulfilled" && tvShows.value.results.length > 0) {
        trendingTVShows = tvShows.value.results
        apiContent = [...apiContent, ...tvShows.value.results.slice(0, 5)]
        usingAPI = true
      }

      if (popular.status === "fulfilled" && popular.value.results.length > 0) {
        apiContent = [...apiContent, ...popular.value.results.slice(0, 5)]
        usingAPI = true
      }

      console.log("✅ Loaded trending content from OMDb API:", apiContent.length)
    } catch (error) {
      console.warn("Failed to load trending content from API:", error)
    }
  }

  // Use API data if available, otherwise fallback
  const content = usingAPI ? apiContent : fallbackContent
  const featuredContent = content[0]

  const contentRows = [
    {
      title: "New Releases",
      items: content.slice(0, 10),
    },
    {
      title: "Trending Now",
      items: trendingMovies.length > 0 ? trendingMovies.slice(0, 10) : content.slice(2, 8),
    },
    {
      title: "Popular This Week",
      items: content.slice(1, 11),
    },
    {
      title: "Netflix Originals",
      items: content.filter((item) => item.popularity > 200).slice(0, 10),
    },
    {
      title: "Top 10 in Your Country",
      items: content.slice(0, 10),
    },
  ].filter((row) => row.items.length > 0)

  const genres = await getMovieGenres()

  return (
    <div className="relative">
      <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-3 py-2 rounded shadow-lg text-sm">
        🔥 New & Popular
        <div className="text-xs opacity-75">{usingAPI ? "OMDb API" : "Local Data"}</div>
      </div>
      <NetflixClient featuredContent={featuredContent} contentRows={contentRows} genres={genres.genres} />
    </div>
  )
}
