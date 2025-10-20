/**
 * Performance optimization utilities
 * Utilities for debouncing, throttling, and memoization
 */

// Debounce function - delays execution until after wait time has elapsed
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle function - limits execution to once per wait time
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastResult: ReturnType<T>;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      lastResult = func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
    return lastResult;
  };
}

// Simple cache implementation
class SimpleCache<T> {
  private cache: Map<string, { value: T; timestamp: number }>;
  private ttl: number;

  constructor(ttlInMs: number = 5 * 60 * 1000) {
    // Default 5 minutes
    this.cache = new Map();
    this.ttl = ttlInMs;
  }

  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const createCache = <T>(ttlInMs?: number) => new SimpleCache<T>(ttlInMs);

// FlatList optimization props
export const FLATLIST_OPTIMIZATION_PROPS = {
  windowSize: 10,
  maxToRenderPerBatch: 10,
  updateCellsBatchingPeriod: 50,
  initialNumToRender: 10,
  removeClippedSubviews: true,
  getItemLayout: (data: any, index: number) => ({
    length: 80, // Approximate item height
    offset: 80 * index,
    index,
  }),
};

// Memoization helper for expensive calculations
export function memoize<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// Check if object is deeply equal (for React.memo comparison)
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

// Image optimization helper
export const optimizeImageUri = (
  uri: string,
  width?: number,
  height?: number
): string => {
  // Add query params for image optimization if your backend supports it
  if (width && height) {
    const separator = uri.includes("?") ? "&" : "?";
    return `${uri}${separator}w=${width}&h=${height}&fit=cover`;
  }
  return uri;
};
