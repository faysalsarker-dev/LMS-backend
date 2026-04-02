import { Router } from "express";
import {
  createPromo,
  getMyPromo,
  getMyPromoUsageStats,
  updatePromo,
  deletePromo,
  getPromoById,
  getAllPromosAdmin,
  getAnalytics,
  redeemPromo,
  checkPromo,
} from "./promo.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { rateLimit } from "../../middleware/rateLimiter";


const router = Router();



// ── Instructor / creator promo management ──────────────────────────────
router.post("/",      checkAuth(), rateLimit("write"), createPromo);
router.get("/mine",   checkAuth(), rateLimit("admin"), getMyPromo);
router.get("/my-promo", checkAuth(), rateLimit("admin"), getMyPromoUsageStats);
router.put("/:id",    checkAuth(), rateLimit("write"), updatePromo);
router.delete("/:id", checkAuth(), rateLimit("admin"), deletePromo);

// ── Admin routes ────────────────────────────────────────────────────
router.get("/admin/all",  rateLimit("admin"), getAllPromosAdmin);
router.get("/admin/:id",  checkAuth(), rateLimit("admin"), getPromoById);
router.get("/analytics", checkAuth(), rateLimit("admin"), getAnalytics);

// ── Student promo redemption (tighter — prevents code enumeration) ────────
router.post("/validate", checkAuth(), rateLimit("write"), checkPromo);
router.post("/redeem",   checkAuth(), rateLimit("write"), redeemPromo);

export default router;
