// Enterprise Caching Layer (In-Memory)
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttlTimers = new Map();
  }

  // Set с TTL (Time To Live)
  set(key, value, ttlSeconds = 300) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });

    // Clear existing timer
    if (this.ttlTimers.has(key)) {
      clearTimeout(this.ttlTimers.get(key));
    }

    // Set new TTL timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttlSeconds * 1000);

    this.ttlTimers.set(key, timer);
  }

  // Get от cache
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    return item.value;
  }

  // Delete
  delete(key) {
    this.cache.delete(key);
    if (this.ttlTimers.has(key)) {
      clearTimeout(this.ttlTimers.get(key));
      this.ttlTimers.delete(key);
    }
  }

  // Clear all
  clear() {
    this.ttlTimers.forEach(timer => clearTimeout(timer));
    this.cache.clear();
    this.ttlTimers.clear();
  }

  // Get cache size
  size() {
    return this.cache.size;
  }

  // Cache statistics
  stats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Singleton instance
const cache = new CacheManager();

// Cache middleware за GET requests
export const cacheMiddleware = (ttlSeconds = 60) => {
  return (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = `cache:${req.originalUrl}:${req.user?.id || 'anonymous'}`;
    const cached = cache.get(key);

    if (cached) {
      console.log(`✅ Cache HIT: ${key}`);
      return res.json(cached);
    }

    console.log(`❌ Cache MISS: ${key}`);
    
    // Override res.json to cache response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      cache.set(key, data, ttlSeconds);
      return originalJson(data);
    };

    next();
  };
};

// Invalidate cache по pattern
export const invalidateCache = (pattern) => {
  const keys = Array.from(cache.cache.keys());
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  });
};

export default cache;
