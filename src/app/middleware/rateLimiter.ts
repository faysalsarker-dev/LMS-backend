/**
 * ============================================================
 *  Centralized Rate Limiter — LMS Backend
 * ============================================================
 *
 *  HOW TO USE IN ROUTES
 *  ─────────────────────
 *  import { rateLimit } from "../../middleware/rateLimiter";
 *
 *  router.post("/login",   rateLimit("auth"),   AuthController.login);
 *  router.post("/submit",  rateLimit("quiz"),   SubmissionController.submit);
 *
 *  PROFILES (edit the config object below to tune limits)
 *  ────────────────────────────────────────────────────────
 *  auth     → login / register          10 req / 15 min
 *  otp      → otp, forget/reset pwd      5 req / 15 min
 *  refresh  → refresh-token             20 req / 15 min
 *  content  → lesson/course GET        300 req / 15 min
 *  write    → create/update content     60 req / 15 min
 *  quiz     → mock-test / practice      30 req / 15 min
 *  upload   → video / audio upload      15 req / 60 min
 *  admin    → admin CRUD / analytics   120 req / 15 min
 *  public   → catch-all safety net     200 req / 15 min
 *
 *  REDIS UPGRADE PATH (multi-instance / Vercel)
 *  ──────────────────────────────────────────────
 *  1. npm install rate-limit-redis ioredis
 *  2. Uncomment the REDIS STORE block below and set REDIS_URL in .env
 *  3. Pass `store` into buildLimiter — nothing else changes.
 * ============================================================
 */

import _expressRateLimit, {
  Options,
  RateLimitRequestHandler,
  ipKeyGenerator,
} from "express-rate-limit";
import { Request } from "express";

// ─── Profile type ────────────────────────────────────────────────────────────

type RateLimitProfile =
  | "auth"
  | "otp"
  | "refresh"
  | "content"
  | "write"
  | "quiz"
  | "upload"
  | "admin"
  | "public";

interface ProfileConfig {
  /** Rolling window in milliseconds */
  windowMs: number;
  /** Maximum requests per window */
  limit: number;
  /** Human-readable message returned on 429 */
  message: string;
}

// ─── Centralized config ───────────────────────────────────────────────────────
//  Edit THIS object to tune every rate limit from one place.

const RATE_LIMIT_CONFIG: Record<RateLimitProfile, ProfileConfig> = {
  // Credential endpoints — tight to block brute-force
  auth: {
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },

  // OTP / password-reset — even tighter to prevent OTP enumeration
  otp: {
    windowMs: 15 * 60 * 1000,
    limit: 5,
    message: "Too many OTP requests. Please wait 15 minutes before retrying.",
  },

  // Token refresh — slightly looser; apps refresh silently
  refresh: {
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: "Too many token refresh requests. Please slow down.",
  },

  // Read-heavy content — generous for smooth learning experience
  content: {
    windowMs: 15 * 60 * 1000,
    limit: 300,
    message: "You're requesting content too frequently. Please slow down.",
  },

  // Mutations (create / update / delete) — moderate
  write: {
    windowMs: 15 * 60 * 1000,
    limit: 60,
    message: "Too many write operations. Please slow down.",
  },

  // Quiz / mock-test — prevents cheating by re-submission flood
  quiz: {
    windowMs: 15 * 60 * 1000,
    limit: 30,
    message: "Too many quiz submissions. Please wait before retrying.",
  },

  // File / video uploads — heavy on storage/bandwidth; keep very low
  upload: {
    windowMs: 60 * 60 * 1000,
    limit: 15,
    message:
      "Upload limit reached. You can upload up to 15 files per hour.",
  },

  // Admin dashboards / analytics — higher than write, lower than content
  admin: {
    windowMs: 15 * 60 * 1000,
    limit: 120,
    message: "Too many admin requests. Please slow down.",
  },

  // Global catch-all safety net applied at app level
  public: {
    windowMs: 15 * 60 * 1000,
    limit: 200,
    message: "Too many requests. Please try again later.",
  },
};

// ─── Key generator ────────────────────────────────────────────────────────────
//  Authenticated requests → rate-limit per user ID (fairer, per-account).
//  Unauthenticated requests → rate-limit per IP (standard brute-force guard).

const keyGenerator = (req: Request): string => {
  const userId = (req as any).user?.id as string | undefined;
  if (userId) return `user:${userId}`;

  // Handles proxies: req.ip already resolves correctly because
  // app.set('trust proxy', 1) is set in app.ts.
  return `ip:${ipKeyGenerator(req.ip ?? "unknown")}`;
};

// ─── Builder ──────────────────────────────────────────────────────────────────

function buildLimiter(profile: ProfileConfig): RateLimitRequestHandler {
  const options: Partial<Options> = {
    windowMs: profile.windowMs,
    limit: profile.limit,
    standardHeaders: "draft-8", // RateLimit-* headers (RFC 6585 / draft-8)
    legacyHeaders: false,
    keyGenerator,
    message: {
      success: false,
      status: 429,
      message: profile.message,
    },

    // ── REDIS STORE (uncomment to enable) ──────────────────────────────
    // import RedisStore from "rate-limit-redis";
    // import { createClient } from "redis";
    // const redisClient = createClient({ url: process.env.REDIS_URL });
    // await redisClient.connect();
    //
    // store: new RedisStore({
    //   sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    // }),
    // ───────────────────────────────────────────────────────────────────
  };

  return _expressRateLimit(options);
}

// ─── Cache (one instance per profile, created lazily) ────────────────────────

const _limiterCache = new Map<RateLimitProfile, RateLimitRequestHandler>();

/**
 * Returns a configured `express-rate-limit` middleware for the given profile.
 *
 * @example
 * router.post("/login", rateLimit("auth"), AuthController.login);
 */
export function rateLimit(
  profile: RateLimitProfile
): RateLimitRequestHandler {
  if (!_limiterCache.has(profile)) {
    _limiterCache.set(profile, buildLimiter(RATE_LIMIT_CONFIG[profile]));
  }
  return _limiterCache.get(profile)!;
}

// ─── Global safety-net limiter (used in app.ts) ───────────────────────────────

export const globalRateLimiter: RateLimitRequestHandler =
  buildLimiter(RATE_LIMIT_CONFIG.public);

// ─── Legacy named exports (kept for backward-compat; prefer rateLimit()) ─────

/** @deprecated Use rateLimit("auth") instead */
export const authRateLimiter = rateLimit("auth");

/** @deprecated Use rateLimit("otp") instead */
export const sensitiveRateLimiter = rateLimit("otp");

/** @deprecated Use rateLimit("public") instead */
export const publicRateLimiter = rateLimit("public");