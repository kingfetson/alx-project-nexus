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

interface Movie {
  id: number
  title: string
  poster: string
}

export default function NetflixWithComponents() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null)

  const movies: Movie[] = [
    { id: 1, title: "The Witcher", poster: "/witcher-inspired-poster.png" },
    { id: 2, title: "Ozark", poster: "/ozark-tv-show-poster.png" },
    { id: 3, title: "The Crown", poster: "/the-crown-inspired-poster.png" },
    { id: 4, title: "Bridgerton", poster: "/bridgerton-inspired-poster.png" },
    { id: 5, title: "Money Heist", poster: "/money-heist-inspired-poster.png" },
    { id: 6, title: "Squid Game", poster: "/generic-survival-game-poster.png" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with UI Components */}
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
            src="/stranger-things-dark-scene.png"
            alt="Stranger Things"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 px-4 md:px-12 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Stranger Things</h1>
          <p className="text-lg md:text-xl mb-8 text-gray-200 line-clamp-3">
            When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.
          </p>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-green-400 font-semibold">87% Match</span>
            <span className="text-gray-400">2016</span>
            <span className="text-gray-400">Drama • Fantasy • Horror</span>
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

      {/* Movies Section */}
      <main className="relative z-10 -mt-32 px-4 md:px-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Trending Now</h2>
          <div className="flex gap-2 overflow-x-auto pb-4">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="flex-none w-48 cursor-pointer transition-transform duration-300 hover:scale-110 relative"
                onMouseEnter={() => setHoveredMovie(movie.id)}
                onMouseLeave={() => setHoveredMovie(null)}
              >
                <div className="aspect-[2/3] relative rounded-md overflow-hidden">
                  <Image
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                {hoveredMovie === movie.id && (
                  <div className="absolute top-full left-0 right-0 bg-zinc-900 rounded-b-md p-3 shadow-xl border border-zinc-700 z-10 min-w-[300px]">
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
                    <div className="text-sm font-medium text-white mb-1">{movie.title}</div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs text-green-400">85% Match</div>
                      <div className="text-xs text-gray-400">2024</div>
                    </div>
                    <div className="text-xs text-zinc-400">Drama • Action • Thriller</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 md:px-12 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-gray-400 text-sm">
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white">FAQ</Link></li>
                <li><Link href="#" className="hover:text-white">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white">Account</Link></li>
                <li><Link href="#" className="hover:text-white">Media Center</Link></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white">Investor Relations</Link></li>
                <li><Link href="#" className="hover:text-white">Jobs</Link></li>
                <li><Link href="#" className="hover:text-white">Ways to Watch</Link></li>
                <li><Link href="#" className="hover:text-white">Terms of Use</Link></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white">Cookie Preferences</Link></li>
                <li><Link href="#" className="hover:text-white">Corporate Information</Link></li>
                <li><Link href="#" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white">Speed Test</Link></li>
                <li><Link href="#" className="hover:text-white">Legal Notices</Link></li>
                <li><Link href="#" className="hover:text-white">Only on Netflix</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-gray-500 text-sm">
            © 2024 Netflix Clone. Demo project with UI components.
          </div>
        </div>
      </footer>
    </div>
  )
}
