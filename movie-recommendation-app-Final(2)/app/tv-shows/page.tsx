import {
  getPopularTVShows,
  getTrendingTVShows,
  getTopRatedTVShows,
  getTVGenres,
  type TVShow,
  type Genre,
} from "@/lib/omdb"
import NetClient from "@/components/net-client"

// TV Show fallback data
const fallbackTVShows: TVShow[] = [
  {
    id: 1,
    name: "Stranger Things",
    overview:
      "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    poster_path: "stranger-things-dark-scene.png",
    backdrop_path: "stranger-things-dark-scene.png",
    first_air_date: "2016-07-15",
    vote_average: 8.7,
    genre_ids: [18, 9648, 878],
    adult: false,
    original_language: "en",
    popularity: 200.0,
  },
  {
    id: 2,
    name: "The Witcher",
    overview:
      "Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.",
    poster_path: "witcher-inspired-poster.png",
    backdrop_path: "witcher-inspired-poster.png",
    first_air_date: "2019-12-20",
    vote_average: 8.2,
    genre_ids: [10759, 18, 14],
    adult: false,
    original_language: "en",
    popularity: 190.0,
  },
  {
    id: 3,
    name: "Ozark",
    overview:
      "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years to appease a drug boss.",
    poster_path: "ozark-tv-show-poster.png",
    backdrop_path: "ozark-tv-show-poster.png",
    first_air_date: "2017-07-21",
    vote_average: 8.4,
    genre_ids: [80, 18],
    adult: false,
    original_language: "en",
    popularity: 180.0,
  },
  {
    id: 4,
    name: "The Crown",
    overview:
      "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    poster_path: "the-crown-inspired-poster.png",
    backdrop_path: "the-crown-inspired-poster.png",
    first_air_date: "2016-11-04",
    vote_average: 8.6,
    genre_ids: [18, 36],
    adult: false,
    original_language: "en",
    popularity: 170.0,
  },
  {
    id: 5,
    name: "Bridgerton",
    overview:
      "Wealth, lust, and betrayal set in the backdrop of Regency era England, seen through the eyes of the powerful Bridgerton family.",
    poster_path: "bridgerton-inspired-poster.png",
    backdrop_path: "bridgerton-inspired-poster.png",
    first_air_date: "2020-12-25",
    vote_average: 7.3,
    genre_ids: [18, 10749],
    adult: false,
    original_language: "en",
    popularity: 160.0,
  },
  {
    id: 6,
    name: "Money Heist",
    overview:
      "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    poster_path: "money-heist-inspired-poster.png",
    backdrop_path: "money-heist-inspired-poster.png",
    first_air_date: "2017-05-02",
    vote_average: 8.2,
    genre_ids: [80, 18],
    adult: false,
    original_language: "es",
    popularity: 150.0,
  },
]

const defaultGenres: Genre[] = [
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
]

export default async function TVShowsPage() {
  console.log("📺 Loading TV Shows page...")

  // Try to fetch TV show data from OMDb API
  let apiTVShows: TVShow[] = []
  let trendingTVShows: TVShow[] = []
  let topRatedTVShows: TVShow[] = []
  let usingAPI = true

  if (process.env.NEXT_PUBLIC_OMDB_API_KEY) {
    try {
      // Get different types of TV shows
      const [popular, trending, topRated] = await Promise.allSettled([
        getPopularTVShows(),
        getTrendingTVShows(),
        getTopRatedTVShows(),
      ])

      if (popular.status === "fulfilled" && popular.value.results.length > 0) {
        apiTVShows = popular.value.results
        usingAPI = true
      }

      if (trending.status === "fulfilled" && trending.value.results.length > 0) {
        trendingTVShows = trending.value.results
      }

      if (topRated.status === "fulfilled" && topRated.value.results.length > 0) {
        topRatedTVShows = topRated.value.results
      }

      console.log("✅ Loaded TV shows from OMDb API:", apiTVShows.length)
    } catch (error) {
      console.warn("Failed to load TV shows from API:", error)
    }
  }

  // Use API data if available, otherwise fallback
  const tvShows = usingAPI ? apiTVShows : fallbackTVShows
  const featuredTVShow = tvShows[0]

  const contentRows = [
    {
      title: "Popular TV Shows",
      items: tvShows.slice(0, 10),
    },
    {
      title: "Trending TV Shows",
      items: trendingTVShows.length > 0 ? trendingTVShows.slice(0, 10) : tvShows.slice(2, 8),
    },
    {
      title: "Top Rated TV Shows",
      items: topRatedTVShows.length > 0 ? topRatedTVShows.slice(0, 10) : tvShows.slice(1, 7),
    },
    {
      title: "Drama Series",
      items: tvShows.filter((show) => show.genre_ids.includes(18)).slice(0, 10),
    },
    {
      title: "Crime Series",
      items: tvShows.filter((show) => show.genre_ids.includes(80)).slice(0, 10),
    },
  ].filter((row) => row.items.length > 0)

  const genres = await getTVGenres()

  return (
    <div className="relative">
      <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white px-3 py-2 rounded shadow-lg text-sm">
        📺 TV Shows
        <div className="text-xs opacity-75">{usingAPI ? "OMDb API" : "Local Data"}</div>
      </div>
      <NetClient featuredContent={featuredTVShow} contentRows={contentRows} genres={genres.genres} />
    </div>
  )
}
