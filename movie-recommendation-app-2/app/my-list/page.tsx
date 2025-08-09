import { getPopularMovies, getTrendingMovies, getMovieGenres, type Movie, type Genre } from "@/lib/omdb"
import NetflixClient from "@/components/netflix-client"

// My List fallback data (user's saved content)
const fallbackMyList: Movie[] = [
  {
    id: 1,
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
    popularity: 200.0,
  },
  {
    id: 2,
    title: "Lupin",
    overview:
      "Inspired by the adventures of Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.",
    poster_path: "lupin-netflix-poster.png",
    backdrop_path: "lupin-netflix-poster.png",
    release_date: "2021-01-08",
    vote_average: 7.5,
    genre_ids: [80, 18, 9648],
    adult: false,
    original_language: "fr",
    popularity: 190.0,
  },
  {
    id: 3,
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
    popularity: 180.0,
  },
  {
    id: 4,
    title: "Mindhunter",
    overview:
      "In the late 1970s, two FBI agents broaden the realm of criminal science by investigating the psychology behind murder and end up getting too close to real-life monsters.",
    poster_path: "mindhunter-inspired-poster.png",
    backdrop_path: "mindhunter-inspired-poster.png",
    release_date: "2017-10-13",
    vote_average: 8.6,
    genre_ids: [80, 18],
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
    title: "Black Mirror",
    overview:
      "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
    poster_path: "black-mirror-poster.png",
    backdrop_path: "black-mirror-poster.png",
    release_date: "2011-12-04",
    vote_average: 8.8,
    genre_ids: [18, 878, 53],
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

export default async function MyListPage() {
  console.log("📋 Loading My List page...")

  // Try to fetch some content from OMDb API for recommendations
  let apiContent: Movie[] = []
  let trendingMovies: Movie[] = []
  let usingAPI = false

  if (process.env.NEXT_PUBLIC_OMDB_API_KEY) {
    try {
      // Get some content for recommendations
      const [popular, trending] = await Promise.allSettled([getPopularMovies(), getTrendingMovies()])

      if (popular.status === "fulfilled" && popular.value.results.length > 0) {
        apiContent = popular.value.results
        usingAPI = true
      }

      if (trending.status === "fulfilled" && trending.value.results.length > 0) {
        trendingMovies = trending.value.results
      }

      console.log("✅ Loaded recommendations from OMDb API:", apiContent.length)
    } catch (error) {
      console.warn("Failed to load recommendations from API:", error)
    }
  }

  // Always use fallback for "My List" since it's user-specific
  const myList = fallbackMyList
  const featuredContent = myList[0]

  const contentRows = [
    {
      title: "My List",
      items: myList,
    },
    {
      title: "Recently Added to My List",
      items: myList.slice(0, 3),
    },
    {
      title: "Continue Watching",
      items: myList.slice(2, 5),
    },
    {
      title: "Recommended for You",
      items: usingAPI ? apiContent.slice(0, 10) : myList.slice(1, 6),
    },
    {
      title: "Because You Watched Dark",
      items: myList.filter((item) => item.genre_ids.includes(878) || item.genre_ids.includes(9648)).slice(0, 10),
    },
  ].filter((row) => row.items.length > 0)

  const genres = await getMovieGenres()

  return (
    <div className="relative">
      <div className="fixed top-20 right-4 z-50 bg-indigo-600 text-white px-3 py-2 rounded shadow-lg text-sm">
        📋 My List
        <div className="text-xs opacity-75">{myList.length} items saved</div>
      </div>

      {/* Custom header for My List */}
      <div className="relative bg-gradient-to-b from-black/80 to-transparent pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">My List</h1>
            <p className="text-lg text-gray-300 mb-6">
              Your personal collection of saved movies and shows. {myList.length} titles ready to watch.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>📊 {myList.length} titles</span>
              <span>⭐ Avg rating: 8.2</span>
              <span>🎭 Mixed genres</span>
            </div>
          </div>
        </div>
      </div>

      <NetflixClient featuredContent={featuredContent} contentRows={contentRows} genres={genres.genres} />
    </div>
  )
}
