"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promo_controller_1 = require("./promo.controller");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const router = (0, express_1.Router)();
router.post("/", (0, CheckAuth_1.checkAuth)(), promo_controller_1.createPromo);
router.get("/mine", (0, CheckAuth_1.checkAuth)(), promo_controller_1.getMyPromo);
router.get("/my-promo", (0, CheckAuth_1.checkAuth)(), promo_controller_1.getMyPromoUsageStats);
router.put("/:id", (0, CheckAuth_1.checkAuth)(), promo_controller_1.updatePromo);
router.delete("/:id", (0, CheckAuth_1.checkAuth)(), promo_controller_1.deletePromo);
/**
 * ADMIN ROUTES
 */
router.get("/admin/all", 
// checkAuth(), 
promo_controller_1.getAllPromosAdmin);
router.get("/admin/:id", (0, CheckAuth_1.checkAuth)(), promo_controller_1.getPromoById);
router.get("/analytics", (0, CheckAuth_1.checkAuth)(), promo_controller_1.getAnalytics);
router.post("/validate", (0, CheckAuth_1.checkAuth)(), promo_controller_1.checkPromo);
// Redeem promo (final apply)
router.post("/redeem", (0, CheckAuth_1.checkAuth)(), promo_controller_1.redeemPromo);
exports.default = router;
