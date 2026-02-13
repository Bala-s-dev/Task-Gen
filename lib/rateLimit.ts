export const rateLimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? createUpstashLimiter()
    : {
        limit: async () => ({ success: true }),
      };

function createUpstashLimiter() {
  const { Ratelimit } = require('@upstash/ratelimit');
  const { Redis } = require('@upstash/redis');

  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '60 s'),
  });
}
