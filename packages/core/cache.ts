/**
 * Client-Side In-Memory + SessionStorage SWR Cache System
 * 
 * Provides ultra-fast 0ms instant loading during SPA route transitions
 * with automatic background revalidation (Stale-While-Revalidate).
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes default
const CACHE_STORAGE_PREFIX = 'pxy_cache:';

class ClientCacheManager {
  private memoryCache = new Map<string, CacheEntry<any>>();

  /**
   * Retrieve cached data.
   * Returns data and whether it is stale (expired TTL).
   */
  get<T>(key: string): { data: T; isStale: boolean } | null {
    const now = Date.now();

    // 1. Check L1 In-Memory Cache first (0ms latency)
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key) as CacheEntry<T>;
      const isStale = now - entry.timestamp > entry.ttl;
      return { data: entry.data, isStale };
    }

    // 2. Check L2 SessionStorage Cache (survives tab navigation)
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const raw = window.sessionStorage.getItem(CACHE_STORAGE_PREFIX + key);
        if (raw) {
          const entry = JSON.parse(raw) as CacheEntry<T>;
          // Sync back to L1 Memory
          this.memoryCache.set(key, entry);
          const isStale = now - entry.timestamp > entry.ttl;
          return { data: entry.data, isStale };
        }
      } catch (err) {
        // Silently ignore storage parse errors or quota issues
      }
    }

    return null;
  }

  /**
   * Store data in both L1 Memory and L2 SessionStorage.
   */
  set<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };

    // Save to L1 Memory
    this.memoryCache.set(key, entry);

    // Save to L2 SessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        window.sessionStorage.setItem(CACHE_STORAGE_PREFIX + key, JSON.stringify(entry));
      } catch (err) {
        // Storage might be full or blocked; memory cache will still work
      }
    }
  }

  /**
   * Invalidate specific key or keys matching prefix.
   * Example: invalidate('activities') removes 'activities:all', etc.
   */
  invalidate(keyOrPrefix?: string): void {
    if (!keyOrPrefix) {
      this.clear();
      return;
    }

    // Invalidate L1 Memory
    for (const key of this.memoryCache.keys()) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
        this.memoryCache.delete(key);
      }
    }

    // Invalidate L2 SessionStorage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const targetPrefix = CACHE_STORAGE_PREFIX + keyOrPrefix;
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          if (key && (key === targetPrefix || key.startsWith(targetPrefix))) {
            keysToRemove.push(key);
          }
        }
        for (const key of keysToRemove) {
          window.sessionStorage.removeItem(key);
        }
      } catch (err) {
        // Ignore storage access errors
      }
    }
  }

  /**
   * Clear all cached items completely.
   */
  clear(): void {
    this.memoryCache.clear();
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < window.sessionStorage.length; i++) {
          const key = window.sessionStorage.key(i);
          if (key && key.startsWith(CACHE_STORAGE_PREFIX)) {
            keysToRemove.push(key);
          }
        }
        for (const key of keysToRemove) {
          window.sessionStorage.removeItem(key);
        }
      } catch (err) {
        // Ignore
      }
    }
  }
}

// Singleton instance
export const clientCache = new ClientCacheManager();
