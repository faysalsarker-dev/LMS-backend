"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRateLimiter = exports.sensitiveRateLimiter = exports.authRateLimiter = exports.createRateLimiter = exports.globalRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const DEFAULT_LIMIT_OPTIONS = {
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
exports.globalRateLimiter = (0, express_rate_limit_1.default)(DEFAULT_LIMIT_OPTIONS);
const createRateLimiter = (overrides = {}) => (0, express_rate_limit_1.default)({
    ...DEFAULT_LIMIT_OPTIONS,
    ...overrides,
});
exports.createRateLimiter = createRateLimiter;
exports.authRateLimiter = (0, exports.createRateLimiter)({ limit: 10, windowMs: 15 * 60 * 1000 });
exports.sensitiveRateLimiter = (0, exports.createRateLimiter)({ limit: 5, windowMs: 60 * 60 * 1000 });
exports.publicRateLimiter = (0, exports.createRateLimiter)({ limit: 200, windowMs: 15 * 60 * 1000 });
