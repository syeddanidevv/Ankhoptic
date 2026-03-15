/**
 * Rate Limiter — auto-switches based on REDIS_URL env variable
 *
 * Development / Windows (no REDIS_URL):  → in-memory Map
 * Production  / VPS    (REDIS_URL set):  → Redis via ioredis
 *
 * .env:
 *   # local dev — leave blank or omit
 *   REDIS_URL=
 *
 *   # VPS production
 *   REDIS_URL=redis://localhost:6379
 */

const MAX_ATTEMPTS = 5;
const WINDOW_SEC   = 15 * 60;   // 15 minutes
const BLOCK_SEC    = 15 * 60;   // block duration

/* ─────────────────────────────────────────────
   IN-MEMORY fallback (no Redis)
───────────────────────────────────────────── */
interface Attempt { count: number; firstAttempt: number; blockedUntil?: number }
const memStore = new Map<string, Attempt>();

function memCheck(ip: string): { allowed: true } | { allowed: false; retryAfterMs: number } {
  const now   = Date.now();
  const entry = memStore.get(ip);

  if (entry?.blockedUntil && now < entry.blockedUntil)
    return { allowed: false, retryAfterMs: entry.blockedUntil - now };

  if (!entry || now - entry.firstAttempt > WINDOW_SEC * 1000) {
    memStore.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_SEC * 1000;
    memStore.set(ip, entry);
    return { allowed: false, retryAfterMs: BLOCK_SEC * 1000 };
  }

  memStore.set(ip, entry);
  return { allowed: true };
}

function memClear(ip: string) { memStore.delete(ip); }

// Cleanup stale entries every 30 min
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, e] of memStore.entries()) {
      if ((!e.blockedUntil && now - e.firstAttempt > WINDOW_SEC * 1000) ||
          (e.blockedUntil && now > e.blockedUntil))
        memStore.delete(ip);
    }
  }, 30 * 60 * 1000);
}

/* ─────────────────────────────────────────────
   REDIS backend (when REDIS_URL is set)
───────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let redisClient: any = null;

async function getRedis() {
  if (!process.env.REDIS_URL) return null;
  if (redisClient) return redisClient;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore — ioredis is optional; install it on VPS: npm install ioredis
    const { default: Redis } = await import("ioredis");
    redisClient = new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
    return redisClient;
  } catch {
    return null;   // ioredis not installed — fall back to memory
  }
}

async function redisCheck(ip: string): Promise<{ allowed: true } | { allowed: false; retryAfterMs: number }> {
  const redis = await getRedis();
  if (!redis) return memCheck(ip);   // fallback if Redis unreachable

  const blockKey  = `rl:block:${ip}`;
  const countKey  = `rl:count:${ip}`;

  const blocked = await redis.get(blockKey);
  if (blocked) {
    const ttl = await redis.ttl(blockKey);
    return { allowed: false, retryAfterMs: ttl * 1000 };
  }

  const count = await redis.incr(countKey);
  if (count === 1) await redis.expire(countKey, WINDOW_SEC);

  if (count > MAX_ATTEMPTS) {
    await redis.set(blockKey, "1", "EX", BLOCK_SEC);
    await redis.del(countKey);
    return { allowed: false, retryAfterMs: BLOCK_SEC * 1000 };
  }

  return { allowed: true };
}

async function redisClear(ip: string) {
  const redis = await getRedis();
  if (redis) { await redis.del(`rl:block:${ip}`, `rl:count:${ip}`); }
  else memClear(ip);
}

/* ─────────────────────────────────────────────
   PUBLIC API — same interface regardless of backend
───────────────────────────────────────────── */
export async function checkRateLimit(ip: string) {
  return process.env.REDIS_URL ? redisCheck(ip) : memCheck(ip);
}

export async function clearRateLimit(ip: string) {
  return process.env.REDIS_URL ? redisClear(ip) : memClear(ip);
}
