"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
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

// Rich mock data that looks like real Netflix content
const featuredContent = {
  id: 1,
  title: "Stranger Things",
  overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
  backdrop_path: "/placeholder.svg?height=720&width=1280&text=Stranger+Things+Hero",
  vote_average: 8.7,
  release_date: "2016-07-15",
  genre_ids: [18, 14, 27]
}

const contentRows = [
  {
    title: "Trending Now",
    items: [
      { id: 1, title: "The Witcher", poster_path: "/placeholder.svg?height=600&width=400&text=The+Witcher", vote_average: 8.2, genre_ids: [14, 18, 28] },
      { id: 2, title: "Ozark", poster_path: "/placeholder.svg?height=600&width=400&text=Ozark", vote_average: 8.4, genre_ids: [80, 18] },
      { id: 3, title: "The Crown", poster_path: "/placeholder.svg?height=600&width=400&text=The+Crown", vote_average: 8.6, genre_ids: [18, 36] },
      { id: 4, title: "Bridgerton", poster_path: "/placeholder.svg?height=600&width=400&text=Bridgerton", vote_average: 7.3, genre_ids: [18, 10749] },
      { id: 5, title: "Money Heist", poster_path: "/placeholder.svg?height=600&width=400&text=Money+Heist", vote_average: 8.3, genre_ids: [80, 18, 53] },
      { id: 6, title: "Squid Game", poster_path: "/placeholder.svg?height=600&width=400&text=Squid+Game", vote_average: 8.0, genre_ids: [18, 53, 28] },
    ]
  },
  {
    title: "Popular Movies",
    items: [
      { id: 7, title: "The Dark Knight", poster_path: "/placeholder.svg?height=600&width=400&text=The+Dark+Knight", vote_average: 9.0, genre_ids: [28, 80, 18] },
      { id: 8, title: "Inception", poster_path: "/placeholder.svg?height=600&width=400&text=Inception", vote_average: 8.8, genre_ids: [28, 878, 53] },
      { id: 9, title: "Interstellar", poster_path: "/placeholder.svg?height=600&width=400&text=Interstellar", vote_average: 8.6, genre_ids: [18, 878] },
      { id: 10, title: "The Matrix", poster_path: "/placeholder.svg?height=600&width=400&text=The+Matrix", vote_average: 8.7, genre_ids: [28, 878] },
      { id: 11, title: "Pulp Fiction", poster_path: "/placeholder.svg?height=600&width=400&text=Pulp+Fiction", vote_average: 8.9, genre_ids: [80, 18] },
      { id: 12, title: "Fight Club", poster_path: "/placeholder.svg?height=600&width=400&text=Fight+Club", vote_average: 8.8, genre_ids: [18] },
    ]
  },
  {
    title: "Netflix Originals",
    items: [
      { id: 13, title: "House of Cards", poster_path: "/placeholder.svg?height=600&width=400&text=House+of+Cards", vote_average: 8.7, genre_ids: [18] },
      { id: 14, title: "Orange is the New Black", poster_path: "/placeholder.svg?height=600&width=400&text=Orange+is+the+New+Black", vote_average: 8.1, genre_ids: [35, 80, 18] },
      { id: 15, title: "Mindhunter", poster_path: "/placeholder.svg?height=600&width=400&text=Mindhunter", vote_average: 8.6, genre_ids: [80, 18, 53] },
      { id: 16, title: "The Umbrella Academy", poster_path: "/placeholder.svg?height=600&width=400&text=The+Umbrella+Academy", vote_average: 8.0, genre_ids: [28, 35, 18] },
      { id: 17, title: "Lupin", poster_path: "/placeholder.svg?height=600&width=400&text=Lupin", vote_average: 7.5, genre_ids: [80, 18, 9648] },
      { id: 18, title: "The Queen's Gambit", poster_path: "/placeholder.svg?height=600&width=400&text=The+Queens+Gambit", vote_average: 8.6, genre_ids: [18] },
    ]
  },
  {
    title: "Action & Adventure",
    items: [
      { id: 19, title: "Extraction", poster_path: "/placeholder.svg?height=600&width=400&text=Extraction", vote_average: 6.8, genre_ids: [28, 53] },
      { id: 20, title: "6 Underground", poster_path: "/placeholder.svg?height=600&width=400&text=6+Underground", vote_average: 6.1, genre_ids: [28, 53] },
      { id: 21, title: "The Old Guard", poster_path: "/placeholder.svg?height=600&width=400&text=The+Old+Guard", vote_average: 6.6, genre_ids: [28, 14] },
      { id: 22, title: "Red Notice", poster_path: "/placeholder.svg?height=600&width=400&text=Red+Notice", vote_average: 6.4, genre_ids: [28, 35, 80] },
      { id: 23, title: "Army of the Dead", poster_path: "/placeholder.svg?height=600&width=400&text=Army+of+the+Dead", vote_average: 5.8, genre_ids: [28, 27, 878] },
      { id: 24, title: "Thunder Force", poster_path: "/placeholder.svg?height=600&width=400&text=Thunder+Force", vote_average: 4.5, genre_ids: [28, 35, 878] },
    ]
  }
]

const genres = [
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

function getGenreNames(genreIds: number[]): string {
  return genreIds
    .map(id => genres.find(genre => genre.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3)
    .join(' • ') || 'Drama'
}

function MovieCard({ 
  item, 
  isHovered, 
  onHover, 
  onLeave 
}: { 
  item: { id: number; title: string; poster_path: string; vote_average: number; genre_ids: number[] }
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}) {
  return (
    <div 
      className="relative group cursor-pointer transition-transform duration-300 hover:scale-110 hover:z-10"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="aspect-[2/3] relative rounded-md overflow-hidden">
        <Image
          src={item.poster_path || "/placeholder.svg"}
          alt={item.title}
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
            <div className="text-xs text-gray-400">2024</div>
          </div>
          <div className="text-xs text-zinc-400">
            {getGenreNames(item.genre_ids)}
          </div>
        </div>
      )}
    </div>
  )
}

function ContentRow({ 
  title, 
  items 
}: { 
  title: string
  items: Array<{ id: number; title: string; poster_path: string; vote_average: number; genre_ids: number[] }>
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
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function NetflixFallback() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between px-4 md:px-12 py-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-red-600 text-2xl font-bold">
              NETFLIX
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
                  Sign out of Netflix
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
            src={featuredContent.backdrop_path || "/placeholder.svg"}
            alt={featuredContent.title}
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
                {new Date(featuredContent.release_date).getFullYear()}
              </span>
              <span className="text-gray-400">
                {getGenreNames(featuredContent.genre_ids)}
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
            © 2024 Netflix Clone. This is a demo project with mock data.
          </div>
        </div>
      </footer>
    </div>
  )
}
