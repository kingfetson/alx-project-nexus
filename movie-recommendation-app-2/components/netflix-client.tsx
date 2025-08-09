"use client"

import { useState } from "react"
import Image from "next/image"
import { Play, Plus, ThumbsUp, ChevronDown, Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Movie, TVShow, Genre } from "@/lib/omdb"

interface ContentRow {
  title: string
  items: (Movie | TVShow)[]
}

interface NetflixClientProps {
  featuredContent: Movie | TVShow
  contentRows: ContentRow[]
  genres: Genre[]
}

function isMovie(item: Movie | TVShow): item is Movie {
  return "title" in item
}

function isTVShow(item: Movie | TVShow): item is TVShow {
  return "name" in item
}

function getTitle(item: Movie | TVShow): string {
  return isMovie(item) ? item.title : item.name
}

function getReleaseDate(item: Movie | TVShow): string {
  return isMovie(item) ? item.release_date : item.first_air_date
}

function getImageUrl(path: string): string {
  // If it's a full URL (from OMDb API), use it directly
  if (path.startsWith("http")) {
    return path
  }
  // Otherwise, use local images
  return `/${path}`
}

export default function NetflixClient({ featuredContent, contentRows, genres }: NetflixClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)

  const featuredTitle = getTitle(featuredContent)
  const featuredYear = new Date(getReleaseDate(featuredContent)).getFullYear()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between px-4 md:px-12 py-4">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="text-red-600 text-2xl font-bold">NETFLIX</div>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="hover:text-gray-300 transition-colors">
                Home
              </a>
              <a href="/tv-shows" className="hover:text-gray-300 transition-colors">
                TV Shows
              </a>
              <a href="/movies" className="hover:text-gray-300 transition-colors">
                Movies
              </a>
              <a href="/new-popular" className="hover:text-gray-300 transition-colors">
                New & Popular
              </a>
              <a href="/my-list" className="hover:text-gray-300 transition-colors">
                My List
              </a>
            </nav>
          </div>

          {/* Search and User */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search titles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/50 border-gray-600 text-white placeholder-gray-400 w-64"
              />
            </div>
            <Bell className="w-6 h-6 cursor-pointer hover:text-gray-300" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black border-gray-600">
                <DropdownMenuItem className="text-white hover:bg-gray-800">Profile</DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-800">Sign Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Featured Content Hero */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0">
          <Image
            src={getImageUrl(featuredContent.backdrop_path) || "/placeholder.svg"}
            alt={featuredTitle}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        <div className="relative z-10 px-4 md:px-12 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{featuredTitle}</h1>
          <div className="flex items-center space-x-4 mb-4 text-sm">
            <span className="text-green-500 font-semibold">{Math.round(featuredContent.vote_average * 10)}% Match</span>
            <span>{featuredYear}</span>
            <span className="border border-gray-400 px-1 text-xs">HD</span>
          </div>
          <p className="text-lg mb-8 line-clamp-3">{featuredContent.overview}</p>

          <div className="flex space-x-4">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              <Play className="w-5 h-5 mr-2" />
              Play
            </Button>
            <Button size="lg" variant="secondary" className="bg-gray-600/80 hover:bg-gray-600">
              <Plus className="w-5 h-5 mr-2" />
              My List
            </Button>
          </div>
        </div>
      </section>

      {/* Genre Filter */}
      <section className="px-4 md:px-12 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <h2 className="text-xl font-semibold">Browse by Genre:</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-black border-gray-600 text-white hover:bg-gray-800">
                {selectedGenre ? genres.find((g) => g.id === selectedGenre)?.name : "All Genres"}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border-gray-600 max-h-64 overflow-y-auto">
              <DropdownMenuItem onClick={() => setSelectedGenre(null)} className="text-white hover:bg-gray-800">
                All Genres
              </DropdownMenuItem>
              {genres.map((genre) => (
                <DropdownMenuItem
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className="text-white hover:bg-gray-800"
                >
                  {genre.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>

      {/* Content Rows */}
      <section className="px-4 md:px-12 pb-20">
        {contentRows.map((row, rowIndex) => {
          // Filter items by selected genre if applicable
          const filteredItems = selectedGenre
            ? row.items.filter((item) => item.genre_ids.includes(selectedGenre))
            : row.items

          // Filter by search query if applicable
          const searchFilteredItems = searchQuery
            ? filteredItems.filter((item) => getTitle(item).toLowerCase().includes(searchQuery.toLowerCase()))
            : filteredItems

          if (searchFilteredItems.length === 0) return null

          return (
            <div key={rowIndex} className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{row.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {searchFilteredItems.slice(0, 12).map((item, itemIndex) => {
                  const title = getTitle(item)
                  const year = new Date(getReleaseDate(item)).getFullYear()

                  return (
                    <div key={itemIndex} className="group relative cursor-pointer transition-transform hover:scale-105">
                      <div className="aspect-[2/3] relative overflow-hidden rounded-md">
                        <Image
                          src={getImageUrl(item.poster_path) || "/placeholder.svg"}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{title}</h3>
                        <div className="flex items-center justify-between text-xs text-gray-300">
                          <span>{year}</span>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="p-1 h-auto">
                              <Play className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-1 h-auto">
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-1 h-auto">
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </section>

      {/* Footer */}
      <footer className="bg-black/90 px-4 md:px-12 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Manage Account
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Cookie Preferences
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">© 2024 Netflix Clone. This is a demo application.</div>
        </div>
      </footer>
    </div>
  )
}
