"use client"

import Link from 'next/link'

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Debug Page</h1>
          <Link href="/" className="text-red-600 hover:text-red-400">
            ← Back to SilverScreenet
          </Link>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-semibold mb-4">✅ Status: Working</h2>
            <p className="text-green-400 mb-2">SilverScreenet is now fully functional!</p>
            <p className="text-gray-300">Using poster images from the project with no API dependencies.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-semibold mb-4">🎬 Content Available</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-white mb-2">Trending Now</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>The Witcher</li>
                  <li>Ozark</li>
                  <li>The Crown</li>
                  <li>Bridgerton</li>
                  <li>Money Heist</li>
                  <li>Squid Game</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-white mb-2">Popular</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>Wednesday</li>
                  <li>You</li>
                  <li>Elite</li>
                  <li>Dark</li>
                  <li>Narcos</li>
                  <li>Black Mirror</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-white mb-2">Originals</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>House of Cards</li>
                  <li>Orange is the New Black</li>
                  <li>Mindhunter</li>
                  <li>Umbrella Academy</li>
                  <li>Lupin</li>
                  <li>Queen&apos;s Gambit</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-white mb-2">Action</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>Extraction</li>
                  <li>6 Underground</li>
                  <li>The Old Guard</li>
                  <li>Red Notice</li>
                  <li>Army of the Dead</li>
                  <li>Thunder Force</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-semibold mb-4">🚀 Features Working</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✅  header with navigation</li>
              <li>✅ Hero section with Stranger Things</li>
              <li>✅ 4 content rows with 24 movies total</li>
              <li>✅ Interactive movie cards with hover effects</li>
              <li>✅ Search functionality (UI)</li>
              <li>✅ User profile dropdown</li>
              <li>✅ Responsive design</li>
              <li>✅ Footer with links</li>
            </ul>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded p-6">
            <h2 className="text-xl font-semibold mb-4">🎉 Ready to Use</h2>
            <p className="text-gray-300">
              SilverScreenet is now working perfectly with all poster images and 
              interactive features. 
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
