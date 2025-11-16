import { Router } from "express";
import {
  createPromo,
  getMyPromo,
  getMyPromoUsageStats,
  updatePromo,
  deletePromo,
  getPromoById,
  getAllPromosAdmin,
} from "./promo.controller";
import { checkAuth } from "../../middleware/CheckAuth";


const router = Router();



router.post(
  "/create",
  checkAuth(), 
  createPromo
);

router.get(
  "/mine",
    checkAuth(), 
  getMyPromo
);

router.get(
  "/mine/stats",
   checkAuth(), 
  getMyPromoUsageStats
);



router.patch(
  "/update/:id",
  checkAuth(), 
  updatePromo
);

router.delete(
  "/delete/:id",
   checkAuth(), 
  deletePromo
);

/**
 * ADMIN ROUTES
 */

router.get(
  "/admin/all",
  checkAuth(), 
  getAllPromosAdmin
);

router.get(
  "/admin/:id",
  checkAuth(), 
  getPromoById
);

export default router;
