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

// Working data using the existing poster images
const featuredContent = {
  id: 1,
  title: "Stranger Things",
  overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
  backdrop_path: "stranger-things-dark-scene.png",
  vote_average: 8.7,
  release_date: "2016-07-15",
  genre_ids: [18, 14, 27]
}

const contentRows = [
  {
    title: "Trending Now",
    items: [
      { 
        id: 1, 
        title: "The Witcher", 
        poster_path: "witcher-inspired-poster.png", 
        vote_average: 8.2, 
        genre_ids: [14, 18, 28],
        overview: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts."
      },
      { 
        id: 2, 
        title: "Ozark", 
        poster_path: "ozark-tv-show-poster.png", 
        vote_average: 8.4, 
        genre_ids: [80, 18],
        overview: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money for a Mexican drug cartel."
      },
      { 
        id: 3, 
        title: "The Crown", 
        poster_path: "the-crown-inspired-poster.png", 
        vote_average: 8.6, 
        genre_ids: [18, 36],
        overview: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped Britain."
      },
      { 
        id: 4, 
        title: "Bridgerton", 
        poster_path: "bridgerton-inspired-poster.png", 
        vote_average: 7.3, 
        genre_ids: [18, 10749],
        overview: "Wealth, lust, and betrayal set against the backdrop of Regency-era England, seen through the Bridgerton family."
      },
      { 
        id: 5, 
        title: "Money Heist", 
        poster_path: "money-heist-inspired-poster.png", 
        vote_average: 8.3, 
        genre_ids: [80, 18, 53],
        overview: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history."
      },
      { 
        id: 6, 
        title: "Squid Game", 
        poster_path: "generic-survival-game-poster.png", 
        vote_average: 8.0, 
        genre_ids: [18, 53, 28],
        overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games."
      },
    ]
  },
  {
    title: "Popular on Netflix",
    items: [
      { 
        id: 7, 
        title: "Wednesday", 
        poster_path: "netflix-inspired-poster.png", 
        vote_average: 8.1, 
        genre_ids: [35, 80, 18],
        overview: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree at Nevermore Academy."
      },
      { 
        id: 8, 
        title: "You", 
        poster_path: "you-netflix-series-poster.png", 
        vote_average: 7.7, 
        genre_ids: [80, 18, 53],
        overview: "A dangerously charming, intensely obsessive young man goes to extreme measures to insert himself into lives."
      },
      { 
        id: 9, 
        title: "Elite", 
        poster_path: "elite-netflix-poster.png", 
        vote_average: 7.5, 
        genre_ids: [18, 53],
        overview: "When three working-class teens enroll in an exclusive private school, the clash leads to murder."
      },
      { 
        id: 10, 
        title: "Dark", 
        poster_path: "dark-netflix-poster.png", 
        vote_average: 8.8, 
        genre_ids: [18, 9648, 878],
        overview: "A family saga with a supernatural twist, set in a German town where children's disappearance exposes secrets."
      },
      { 
        id: 11, 
        title: "Narcos", 
        poster_path: "generic-drug-poster.png", 
        vote_average: 8.8, 
        genre_ids: [80, 18],
        overview: "A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar and other kingpins."
      },
      { 
        id: 12, 
        title: "Black Mirror", 
        poster_path: "black-mirror-poster.png", 
        vote_average: 8.8, 
        genre_ids: [18, 878, 53],
        overview: "An anthology series exploring a twisted, high-tech multiverse where humanity's innovations collide with instincts."
      },
    ]
  },
  {
    title: "Netflix Originals",
    items: [
      { 
        id: 13, 
        title: "House of Cards", 
        poster_path: "house-of-cards-inspired-poster.png", 
        vote_average: 8.7, 
        genre_ids: [18],
        overview: "A Congressman works with his equally conniving wife to exact revenge on the people who betrayed him."
      },
      { 
        id: 14, 
        title: "Orange is the New Black", 
        poster_path: "generic-prison-poster.png", 
        vote_average: 8.1, 
        genre_ids: [35, 80, 18],
        overview: "A privileged New Yorker ends up in a women's prison when a past crime catches up with her."
      },
      { 
        id: 15, 
        title: "Mindhunter", 
        poster_path: "mindhunter-inspired-poster.png", 
        vote_average: 8.6, 
        genre_ids: [80, 18, 53],
        overview: "In the late 1970s, two FBI agents broaden criminal science by investigating the psychology behind murder."
      },
      { 
        id: 16, 
        title: "The Umbrella Academy", 
        poster_path: "umbrella-academy-inspired-poster.png", 
        vote_average: 8.0, 
        genre_ids: [28, 35, 18],
        overview: "A dysfunctional family of superheroes comes together to solve their father's death and prevent the apocalypse."
      },
      { 
        id: 17, 
        title: "Lupin", 
        poster_path: "lupin-netflix-poster.png", 
        vote_average: 7.5, 
        genre_ids: [80, 18, 9648],
        overview: "Inspired by Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father's injustice."
      },
      { 
        id: 18, 
        title: "The Queen's Gambit", 
        poster_path: "queens-gambit-poster.png", 
        vote_average: 8.6, 
        genre_ids: [18],
        overview: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey."
      },
    ]
  },
  {
    title: "Action & Adventure",
    items: [
      { 
        id: 19, 
        title: "Extraction", 
        poster_path: "generic-action-movie-poster.png", 
        vote_average: 6.8, 
        genre_ids: [28, 53],
        overview: "A black-market mercenary is hired to rescue the kidnapped son of an imprisoned crime lord."
      },
      { 
        id: 20, 
        title: "6 Underground", 
        poster_path: "6-underground-poster.png", 
        vote_average: 6.1, 
        genre_ids: [28, 53],
        overview: "After faking his death, a tech billionaire recruits operatives for a mission to take down a dictator."
      },
      { 
        id: 21, 
        title: "The Old Guard", 
        poster_path: "the-old-guard-poster.png", 
        vote_average: 6.6, 
        genre_ids: [28, 14],
        overview: "A covert team of immortal mercenaries is exposed and must fight to keep their identity secret."
      },
      { 
        id: 22, 
        title: "Red Notice", 
        poster_path: "red-notice-inspired-poster.png", 
        vote_average: 6.4, 
        genre_ids: [28, 35, 80],
        overview: "An Interpol Red Notice brings together the FBI's top profiler and two rival criminals."
      },
      { 
        id: 23, 
        title: "Army of the Dead", 
        poster_path: "army-of-the-dead-poster.png", 
        vote_average: 5.8, 
        genre_ids: [28, 27, 878],
        overview: "Following a zombie outbreak in Las Vegas, mercenaries venture into the quarantine zone for a heist."
      },
      { 
        id: 24, 
        title: "Thunder Force", 
        poster_path: "thunder-force-poster.png", 
        vote_average: 4.5, 
        genre_ids: [28, 35, 878],
        overview: "Two estranged friends reunite after one devises a treatment that gives them powers to protect their city."
      },
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
  item: any
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
          src={`/${item.poster_path}`}
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

function ContentRow({ title, items }: { title: string; items: any[] }) {
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

export default function NetflixWorking() {
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
            src={`/${featuredContent.backdrop_path}`}
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
            © 2024 Netflix Clone. Using poster images from the project.
          </div>
        </div>
      </footer>
    </div>
  )
}
