// Simple in-memory cache implementation
type CacheItem = {
  value: any
  expiry: number
}

class Cache {
  private cache: Map<string, CacheItem>

  constructor() {
    this.cache = new Map()
  }

  // Set a value in the cache with an expiry time in seconds
  set(key: string, value: any, ttl: number): void {
    const expiry = Date.now() + ttl * 1000
    this.cache.set(key, { value, expiry })
  }

  // Get a value from the cache
  get(key: string): any | null {
    const item = this.cache.get(key)

    // Return null if item doesn't exist
    if (!item) return null

    // Return null if item has expired and remove it from cache
    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  // Remove a value from the cache
  delete(key: string): void {
    this.cache.delete(key)
  }

  // Clear all values from the cache
  clear(): void {
    this.cache.clear()
  }

  // Get all keys in the cache
  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  // Invalidate all cache entries that match a prefix
  invalidateByPrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key)
      }
    }
  }
}

// Export a singleton instance
export const cache = new Cache()
