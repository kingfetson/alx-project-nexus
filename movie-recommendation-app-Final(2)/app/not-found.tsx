import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl text-gray-300 mb-6">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the
          wrong URL.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/movies"
            className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded font-semibold transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    </div>
  )
}
