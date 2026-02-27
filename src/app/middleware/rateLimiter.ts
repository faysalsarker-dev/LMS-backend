import rateLimit, { Options, RateLimitRequestHandler } from "express-rate-limit";


const DEFAULT_LIMIT_OPTIONS: Partial<Options> = {
  windowMs: 15 * 60 * 1000, 
  limit: 100,              
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    status: 429,
    message: "Too many requests, please try again later.",
  },
};


export const globalRateLimiter: RateLimitRequestHandler =
  rateLimit(DEFAULT_LIMIT_OPTIONS);


export const createRateLimiter = (
  overrides: Partial<Options> = {}
): RateLimitRequestHandler =>
  rateLimit({
    ...DEFAULT_LIMIT_OPTIONS,
    ...overrides,
  });


export const authRateLimiter     = createRateLimiter({ limit: 10,  windowMs: 15 * 60 * 1000 }); 
export const sensitiveRateLimiter = createRateLimiter({ limit: 5,  windowMs: 60 * 60 * 1000 }); 
export const publicRateLimiter   = createRateLimiter({ limit: 200, windowMs: 15 * 60 * 1000 }); 