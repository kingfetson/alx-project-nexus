"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Play, Info, Search, Bell, ChevronDown, Plus, ThumbsUp } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Movie {
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

interface Genre {
  id: number
  name: string
}

interface ContentRow {
  title: string
  items: Movie[]
}

interface NetflixClientProps {
  featuredContent: Movie
  contentRows: ContentRow[]
  genres: Genre[]
}

// Fallback data using the existing poster images
const fallbackMovies: Movie[] = [
  {
    id: 1,
    title: "The Witcher",
    overview: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
    poster_path: "witcher-inspired-poster.png",
    backdrop_path: "witcher-inspired-poster.png",
    release_date: "2019-12-20",
    vote_average: 8.2,
    genre_ids: [14, 18, 28],
    adult: false,
    original_language: "en",
    popularity: 123.456
  },
  {
    id: 2,
    title: "Ozark",
    overview: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years to appease a Mexican drug cartel.",
    poster_path: "ozark-tv-show-poster.png",
    backdrop_path: "ozark-tv-show-poster.png",
    release_date: "2017-07-21",
    vote_average: 8.4,
    genre_ids: [80, 18],
    adult: false,
    original_language: "en",
    popularity: 98.765
  },
  {
    id: 3,
    title: "The Crown",
    overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    poster_path: "the-crown-inspired-poster.png",
    backdrop_path: "the-crown-inspired-poster.png",
    release_date: "2016-11-04",
    vote_average: 8.6,
    genre_ids: [18, 36],
    adult: false,
    original_language: "en",
    popularity: 87.321
  },
  {
    id: 4,
    title: "Bridgerton",
    overview: "Wealth, lust, and betrayal set in the backdrop of Regency era England, seen through the eyes of the powerful Bridgerton family.",
    poster_path: "bridgerton-inspired-poster.png",
    backdrop_path: "bridgerton-inspired-poster.png",
    release_date: "2020-12-25",
    vote_average: 7.3,
    genre_ids: [18, 10749],
    adult: false,
    original_language: "en",
    popularity: 76.543
  },
  {
    id: 5,
    title: "Money Heist",
    overview: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    poster_path: "money-heist-inspired-poster.png",
    backdrop_path: "money-heist-inspired-poster.png",
    release_date: "2017-05-02",
    vote_average: 8.3,
    genre_ids: [80, 18, 53],
    adult: false,
    original_language: "es",
    popularity: 65.432
  },
  {
    id: 6,
    title: "Squid Game",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize, but the stakes are deadly.",
    poster_path: "generic-survival-game-poster.png",
    backdrop_path: "generic-survival-game-poster.png",
    release_date: "2021-09-17",
    vote_average: 8.0,
    genre_ids: [18, 53, 28],
    adult: false,
    original_language: "ko",
    popularity: 54.321
  }
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
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" }
]

function getGenreNames(genreIds: number[], genres: Genre[]): string {
  if (!genreIds || !genres) return 'Drama'
  
  return genreIds
    .map(id => genres.find(genre => genre.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(' • ') || 'Drama'
}

function getImagePath(item: Movie): string {
  // If poster_path starts with '/', it's from the API (TMDB format)
  if (item.poster_path && item.poster_path.startsWith('/')) {
    return `https://image.tmdb.org/t/p/w500${item.poster_path}`
  }
  // If poster_path doesn't start with '/', it's our local poster image
  if (item.poster_path && !item.poster_path.startsWith('/')) {
    return `/${item.poster_path}`
  }
  // Fallback to placeholder
  return '/placeholder.svg?height=600&width=400&text=No+Image'
}

function getBackdropPath(item: Movie): string {
  // If backdrop_path starts with '/', it's from the API (TMDB format)
  if (item.backdrop_path && item.backdrop_path.startsWith('/')) {
    return `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`
  }
  // If backdrop_path doesn't start with '/', it's our local image
  if (item.backdrop_path && !item.backdrop_path.startsWith('/')) {
    return `/${item.backdrop_path}`
  }
  // Fallback to placeholder
  return '/placeholder.svg?height=720&width=1280&text=Hero+Background'
}

function MovieCard({ 
  item, 
  isHovered, 
  onHover, 
  onLeave, 
  genres 
}: { 
  item: Movie
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  genres: Genre[]
}) {
  const releaseYear = new Date(item.release_date).getFullYear()

  return (
    <div 
      className="relative group cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-10"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="aspect-[2/3] relative rounded-md overflow-hidden">
        <Image
          src={getImagePath(item) || "/placeholder.svg"}
          alt={item.title || 'Movie poster'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
      
      {isHovered && (
        <div className="absolute top-full left-0 right-0 bg-zinc-900 rounded-b-md p-3 shadow-xl border border-zinc-700 min-w-[300px]">
          <div className="flex items-center gap-2 mb-2">
            <Button size="sm" className="rounded-full w-8 h-8 p-0">
              <Play className="w-4 h-4 fill-current" />
            </Button>
            <Button size="sm" variant="outline" className="rounded-full w-8 h-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="rounded-full w-8 h-8 p-0">
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" className="rounded-full w-8 h-8 p-0 ml-auto">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm font-medium text-white mb-1">{item.title}</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="text-xs text-green-400">{Math.round(item.vote_average * 10)}% Match</div>
            <div className="text-xs text-gray-400">{releaseYear}</div>
          </div>
          <div className="text-xs text-zinc-400">
            {getGenreNames(item.genre_ids, genres) || 'Drama'}
          </div>
        </div>
      )}
    </div>
  )
}

function ContentRow({ 
  title, 
  items, 
  genres 
}: { 
  title: string
  items: Movie[]
  genres: Genre[]
}) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 px-4 md:px-12">{title}</h2>
      <div className="relative group px-4 md:px-12">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4">
          {items.map((item) => (
            <div key={item.id} className="flex-none w-48">
              <MovieCard
                item={item}
                isHovered={hoveredItem === item.id}
                onHover={() => setHoveredItem(item.id)}
                onLeave={() => setHoveredItem(null)}
                genres={genres}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Content() {
  const [apiWorking, setApiWorking] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Test API on component mount
    const testAPI = async () => {
      try {
        console.log('🔍 Testing API connection...')
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        const API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY
        const API_HOST = process.env.NEXT_PUBLIC_MOVIE_API_HOST
        
        if (!API_KEY || !API_HOST) {
          console.log('⚠️ No API credentials found')
          setApiWorking(false)
          setLoading(false)
          return
        }
        
        const response = await fetch(`https://${API_HOST}/movie/popular`, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': API_HOST,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (response.ok) {
          const data = await response.json()
          if (data && data.results && data.results.length > 0) {
            console.log('✅ API is working! Found', data.results.length, 'movies')
            setApiWorking(true)
          } else {
            console.log('⚠️ API responded but no data found')
            setApiWorking(false)
          }
        } else {
          console.log('❌ API responded with error:', response.status)
          setApiWorking(false)
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
        console.log('❌ API test failed:', errorMessage)
        setApiWorking(false)
      } finally {
        setLoading(false)
      }
    }

    testAPI()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-3xl font-bold mb-4">NETFLIX</div>
          <div className="text-lg">Testing API connection...</div>
          <div className="text-sm text-gray-400 mt-2">Falling back to poster images if needed</div>
        </div>
      </div>
    )
  }

  // Prepare content data
  const featuredContent = fallbackMovies[0] // Use The Witcher as featured

  // Create content rows from fallback data
  const contentRows: ContentRow[] = [
    {
      title: "Trending Now",
      items: fallbackMovies.slice(0, 6) // First 6 movies
    }
  ]

  return (
    <div className="relative">
      {/* Status indicator */}
      {apiWorking === false && (
        <div className="fixed top-20 right-4 z-50 bg-yellow-600 text-black px-4 py-2 rounded shadow-lg">
          <div className="text-sm font-medium">📸 Using poster images</div>
          <div className="text-xs">API not available</div>
        </div>
      )}
      
      {apiWorking === true && (
        <div className="fixed top-20 right-4 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg">
          <div className="text-sm font-medium">✅ API Connected</div>
          <div className="text-xs">Using live data</div>
        </div>
      )}

      <NetflixClient 
        featuredContent={featuredContent}
        contentRows={contentRows}
        genres={defaultGenres}
      />
    </div>
  )
}

// Netflix Client Component
function NetflixClient({ featuredContent, contentRows, genres }: NetflixClientProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const featuredYear = new Date(featuredContent.release_date).getFullYear()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between px-4 md:px-12 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-red-600 text-2xl font-bold">
              SilverScreenet
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-white hover:text-gray-300 transition-colors">
                Home
              </Link>
              <Link href="/tv-shows" className="text-white hover:text-gray-300 transition-colors">
                TV Shows
              </Link>
              <Link href="/movies" className="text-white hover:text-gray-300 transition-colors">
                Movies
              </Link>
              <Link href="/new-popular" className="text-white hover:text-gray-300 transition-colors">
                New & Popular
              </Link>
              <Link href="/my-list" className="text-white hover:text-gray-300 transition-colors">
                My List
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {isSearchOpen ? (
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search movies and TV shows..."
                  className="bg-black/50 border-white/20 text-white placeholder:text-gray-400 w-64"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(true)}
                className="p-2"
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
            
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="w-5 h-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/90 border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Manage Profiles
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Help Center
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">
                  Sign out of SilverScreenet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          <Image
            src={getBackdropPath(featuredContent) || "/placeholder.svg"}
            alt={featuredContent.title || 'Featured content'}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 px-4 md:px-12 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {featuredContent.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 line-clamp-3">
            {featuredContent.overview}
          </p>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-semibold">
                {Math.round(featuredContent.vote_average * 10)}% Match
              </span>
              <span className="text-gray-400">
                {featuredYear}
              </span>
              <span className="text-gray-400">
                {getGenreNames(featuredContent.genre_ids, genres)}
              </span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold px-8">
              <Play className="w-5 h-5 mr-2 fill-current" />
              Play
            </Button>
            <Button size="lg" variant="secondary" className="bg-gray-600/70 text-white hover:bg-gray-600/90 font-semibold px-8">
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Button>
          </div>
        </div>
      </section>

      {/* Content Rows */}
      <main className="relative z-10 -mt-32">
        {contentRows.map((row, index) => (
          <ContentRow 
            key={index} 
            title={row.title} 
            items={row.items} 
            genres={genres}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400 text-sm">
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white">Investor Relations</Link></li>
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Speed Test</Link></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Jobs</Link></li>
                <li><Link href="#" className="hover:text-white">Cookie Preferences</Link></li>
                <li><Link href="#" className="hover:text-white">Legal Notices</Link></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white">Account</Link></li>
                <li><Link href="#" className="hover:text-white">Ways to Watch</Link></li>
                <li><Link href="#" className="hover:text-white">Corporate Information</Link></li>
                <li><Link href="#" className="hover:text-white">Only on Netflix</Link></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white">Media Center</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Use</Link></li>
                <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-gray-500 text-sm">
            © 2024 Netflix Clone. Using fallback poster images
          </div>
        </div>
      </footer>
    </div>
  )
}
