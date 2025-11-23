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


const router = Router();



router.post(
  "/",
  checkAuth(), 
  createPromo
);

router.get(
  "/mine",
    checkAuth(), 
  getMyPromo
);

router.get(
  "/my-promo",
   checkAuth(), 
  getMyPromoUsageStats
);



router.put(
  "/:id",
  checkAuth(), 
  updatePromo
);

router.delete(
  "/:id",
   checkAuth(), 
  deletePromo
);

/**
 * ADMIN ROUTES
 */

router.get(
  "/admin/all",
  // checkAuth(), 
  getAllPromosAdmin
);

router.get(
  "/admin/:id",
  checkAuth(), 
  getPromoById
);


router.get(
  "/analytics",
  checkAuth(), 
  getAnalytics
);


router.post("/validate", checkAuth(), checkPromo);

// Redeem promo (final apply)
router.post("/redeem", checkAuth(), redeemPromo);

export default router;
