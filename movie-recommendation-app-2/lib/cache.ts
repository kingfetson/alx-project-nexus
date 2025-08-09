// Simple cache utility for browser storage
export class BrowserCache {
  private static CACHE_PREFIX = "netflix_cache_"
  private static DEFAULT_TTL = 1000 * 60 * 60 * 24 // 24 hours

  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        ttl,
      }
      localStorage.setItem(this.CACHE_PREFIX + key, JSON.stringify(cacheItem))
      console.log(`💾 Cached data for key: ${key}`)
    } catch (error) {
      console.warn("Failed to cache data:", error)
    }
  }

  static get<T>(key: string): T | null {
    try {
      const cached = localStorage.getItem(this.CACHE_PREFIX + key)
      if (!cached) return null

      const cacheItem = JSON.parse(cached)
      const now = Date.now()

      // Check if cache is expired
      if (now - cacheItem.timestamp > cacheItem.ttl) {
        this.remove(key)
        console.log(`🗑️ Cache expired for key: ${key}`)
        return null
      }

      console.log(`✅ Cache hit for key: ${key}`)
      return cacheItem.data
    } catch (error) {
      console.warn("Failed to get cached data:", error)
      return null
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(this.CACHE_PREFIX + key)
  }

  static clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(this.CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key))
    console.log("🧹 Cleared all cache")
  }

  static getStats(): { keys: string[]; totalSize: number } {
    const keys = Object.keys(localStorage)
      .filter((key) => key.startsWith(this.CACHE_PREFIX))
      .map((key) => key.replace(this.CACHE_PREFIX, ""))

    const totalSize = keys.reduce((size, key) => {
      const item = localStorage.getItem(this.CACHE_PREFIX + key)
      return size + (item ? item.length : 0)
    }, 0)

    return { keys, totalSize }
  }
}
