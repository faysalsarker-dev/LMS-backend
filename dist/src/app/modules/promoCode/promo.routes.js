"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const promo_controller_1 = require("./promo.controller");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const router = (0, express_1.Router)();
router.post("/create", (0, CheckAuth_1.checkAuth)(), promo_controller_1.createPromo);
router.get("/mine", (0, CheckAuth_1.checkAuth)(), promo_controller_1.getMyPromo);
router.get("/mine/stats", (0, CheckAuth_1.checkAuth)(), promo_controller_1.getMyPromoUsageStats);
router.patch("/update/:id", (0, CheckAuth_1.checkAuth)(), promo_controller_1.updatePromo);
router.delete("/delete/:id", (0, CheckAuth_1.checkAuth)(), promo_controller_1.deletePromo);
/**
 * ADMIN ROUTES
 */
router.get("/admin/all", (0, CheckAuth_1.checkAuth)(), promo_controller_1.getAllPromosAdmin);
router.get("/admin/:id", (0, CheckAuth_1.checkAuth)(), promo_controller_1.getPromoById);
exports.default = router;
