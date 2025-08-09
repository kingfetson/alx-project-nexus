"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CacheManager } from "@/lib/omdb-cached"

export default function CacheManagerComponent() {
  const [cacheStats, setCacheStats] = useState({ keys: [], totalSize: 0 })
  const [isVisible, setIsVisible] = useState(false)

  const updateStats = () => {
    const stats = CacheManager.getStats()
    setCacheStats(stats)
  }

  useEffect(() => {
    updateStats()
  }, [])

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 hover:bg-gray-700 text-white text-xs px-3 py-2"
        size="sm"
      >
        📊 Cache ({cacheStats.keys.length})
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 border border-gray-600 rounded-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold text-sm">Cache Manager</h3>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white p-1 h-auto"
        >
          ✕
        </Button>
      </div>

      <div className="space-y-2 text-xs text-gray-300">
        <div className="flex justify-between">
          <span>Cached Items:</span>
          <span className="text-white">{cacheStats.keys.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Size:</span>
          <span className="text-white">{formatSize(cacheStats.totalSize)}</span>
        </div>
      </div>

      {cacheStats.keys.length > 0 && (
        <div className="mt-3 max-h-32 overflow-y-auto">
          <div className="text-xs text-gray-400 mb-1">Cached Keys:</div>
          {cacheStats.keys.map((key, index) => (
            <div key={index} className="text-xs text-gray-300 truncate">
              • {key}
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <Button
          onClick={() => {
            updateStats()
          }}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 h-auto"
        >
          Refresh
        </Button>
        <Button
          onClick={() => {
            CacheManager.clearExpired()
            updateStats()
          }}
          size="sm"
          className="bg-yellow-600 hover:bg-yellow-700 text-xs px-2 py-1 h-auto"
        >
          Clear Expired
        </Button>
        <Button
          onClick={() => {
            CacheManager.clearAll()
            updateStats()
          }}
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 h-auto"
        >
          Clear All
        </Button>
      </div>
    </div>
  )
}
