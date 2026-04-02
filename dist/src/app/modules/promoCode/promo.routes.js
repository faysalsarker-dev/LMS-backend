"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promo_controller_1 = require("./promo.controller");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const router = (0, express_1.Router)();
// ── Instructor / creator promo management ──────────────────────────────
router.post("/", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("write"), promo_controller_1.createPromo);
router.get("/mine", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("admin"), promo_controller_1.getMyPromo);
router.get("/my-promo", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("admin"), promo_controller_1.getMyPromoUsageStats);
router.put("/:id", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("write"), promo_controller_1.updatePromo);
router.delete("/:id", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("admin"), promo_controller_1.deletePromo);
// ── Admin routes ────────────────────────────────────────────────────
router.get("/admin/all", (0, rateLimiter_1.rateLimit)("admin"), promo_controller_1.getAllPromosAdmin);
router.get("/admin/:id", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("admin"), promo_controller_1.getPromoById);
router.get("/analytics", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("admin"), promo_controller_1.getAnalytics);
// ── Student promo redemption (tighter — prevents code enumeration) ────────
router.post("/validate", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("write"), promo_controller_1.checkPromo);
router.post("/redeem", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("write"), promo_controller_1.redeemPromo);
exports.default = router;
