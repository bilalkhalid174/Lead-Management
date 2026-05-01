type RateLimitEntry = {
  count: number;
  timestamp: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60;

export function rateLimit(key: string) {
  const now = Date.now();

  const entry = rateLimitMap.get(key);

  if (!entry) {
    rateLimitMap.set(key, {
      count: 1,
      timestamp: now,
    });

    return { allowed: true };
  }

  // reset window if expired
  if (now - entry.timestamp > WINDOW_MS) {
    rateLimitMap.set(key, {
      count: 1,
      timestamp: now,
    });

    return { allowed: true };
  }

  // check limit
  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((WINDOW_MS - (now - entry.timestamp)) / 1000),
    };
  }

  // increment
  entry.count += 1;
  rateLimitMap.set(key, entry);

  return { allowed: true };
}