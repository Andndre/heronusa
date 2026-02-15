import { createClient } from "redis";
import { NextResponse } from "next/server";

const RATE_LIMIT_LIMIT = Number.parseInt(process.env.RATE_LIMIT_LIMIT || "100", 10);
const RATE_LIMIT_WINDOW = Number.parseInt(process.env.RATE_LIMIT_WINDOW || "10", 10);
const WINDOW_MS = RATE_LIMIT_WINDOW * 1000;

const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => console.error("[RateLimit] Redis Error:", err));

async function getRedis() {
  if (!redis.isOpen) await redis.connect();
  return redis;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  limit: number;
}

/**
 * Memeriksa dan memberlakukan rate limit untuk kunci tertentu menggunakan Redis.
 * @param {string} key - Parameter `key` dalam fungsi `checkRateLimit` adalah string yang
 * mewakili pengidentifikasi unik untuk memeriksa rate limit. Digunakan untuk melacak
 * rate limit untuk entitas atau sumber daya tertentu.
 * @returns `Promise` yang resolve ke objek `RateLimitResult`.
 * Objek `RateLimitResult` berisi properti berikut:
 * - `success`: Boolean yang menunjukkan apakah pemeriksaan rate limit berhasil.
 * - `remaining`: Jumlah permintaan yang tersisa dalam jendela rate limit.
 * - `reset`: Waktu ketika jendela rate limit direset.
 * - `limit`: Jumlah maksimum permintaan yang diizinkan dalam jendela rate limit.
 */
export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  try {
    const client = await getRedis();
    const now = Date.now();
    const currentWindow = Math.floor(now / WINDOW_MS) * WINDOW_MS;
    const windowKey = `ratelimit:${key}:${currentWindow}`;

    const count = await client.incr(windowKey);
    if (count === 1) await client.expire(windowKey, RATE_LIMIT_WINDOW);

    const success = count <= RATE_LIMIT_LIMIT;
    return {
      success,
      remaining: Math.max(0, RATE_LIMIT_LIMIT - count),
      reset: currentWindow + WINDOW_MS,
      limit: RATE_LIMIT_LIMIT,
    };
  } catch (error) {
    console.error(`[RateLimit] Error for ${key}:`, error);
    return {
      success: true,
      remaining: RATE_LIMIT_LIMIT,
      reset: Date.now() + WINDOW_MS,
      limit: RATE_LIMIT_LIMIT,
    };
  }
}

/**
 * Menetapkan header terkait rate limit dalam objek respons berdasarkan
 * hasil rate limit yang diberikan.
 * @param {NextResponse} response - Parameter `response` dalam fungsi `applyRateLimitHeaders` adalah
 * tipe `NextResponse`, yang merupakan objek yang mewakili respons untuk dikirim kembali ke
 * klien dalam aplikasi Next.js. Objek ini biasanya berisi informasi seperti headers,
 * status code, dan konten body respons.
 * @param {RateLimitResult} result - Parameter `result` dalam fungsi `applyRateLimitHeaders`
 * berisi informasi terkait rate limiting, seperti limit, permintaan yang tersisa, waktu reset,
 * dan apakah permintaan berhasil atau tidak. Ini adalah tipe `RateLimitResult`.
 * @returns Objek `response` yang telah diperbarui dengan
 * header rate limit yang ditetapkan berdasarkan `RateLimitResult` yang diberikan sebagai input.
 */
export function applyRateLimitHeaders(response: NextResponse, result: RateLimitResult) {
  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", new Date(result.reset).toISOString());
  if (!result.success) {
    response.headers.set("Retry-After", Math.ceil((result.reset - Date.now()) / 1000).toString());
  }
  return response;
}

export function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
