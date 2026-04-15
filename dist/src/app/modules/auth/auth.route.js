"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CheckAuth_1 = require("../../middleware/CheckAuth");
const auth_interface_1 = require("./auth.interface");
const auth_controller_1 = require("./auth.controller");
const fileUpload_middleware_1 = require("../../middleware/fileUpload.middleware");
const rateLimiter_1 = require("../../middleware/rateLimiter");
const router = (0, express_1.Router)();
router.get("/", auth_controller_1.AuthController.getAll);
// ── Credential endpoints ──────────────────────────────────────────
router.post("/register", (0, rateLimiter_1.rateLimit)("auth"), auth_controller_1.AuthController.register);
router.post("/login", (0, rateLimiter_1.rateLimit)("auth"), auth_controller_1.AuthController.login);
// ── OTP / password recovery ───────────────────────────────────────
router.post("/send-otp", (0, rateLimiter_1.rateLimit)("otp"), auth_controller_1.AuthController.sendOtp);
router.put("/verify-otp", (0, rateLimiter_1.rateLimit)("otp"), auth_controller_1.AuthController.verifyOtp);
router.post("/forget-password", (0, rateLimiter_1.rateLimit)("otp"), auth_controller_1.AuthController.forgetPassword);
router.put("/reset-password", (0, rateLimiter_1.rateLimit)("otp"), auth_controller_1.AuthController.resetPassword);
// ── Token management ──────────────────────────────────────────────
router.post("/refresh-token", (0, rateLimiter_1.rateLimit)("refresh"), auth_controller_1.AuthController.getNewAccessToken);
// ── Authenticated user actions ────────────────────────────────────
router.post("/logout", (0, CheckAuth_1.checkAuth)(), auth_controller_1.AuthController.logout);
router.post("/logout-all", auth_controller_1.AuthController.logoutFromOthers);
router.put("/addToWishlist", (0, CheckAuth_1.checkAuth)(), auth_controller_1.AuthController.addToWishlist);
router.get("/me", (0, CheckAuth_1.checkAuth)([
    auth_interface_1.UserRoles.ADMIN,
    auth_interface_1.UserRoles.INSTRUCTOR,
    auth_interface_1.UserRoles.SUPER_ADMIN,
    auth_interface_1.UserRoles.STUDENT,
]), auth_controller_1.AuthController.me);
router.put("/update-password", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("write"), auth_controller_1.AuthController.updatePassword);
router.put("/update", (0, CheckAuth_1.checkAuth)(), (0, rateLimiter_1.rateLimit)("write"), (0, fileUpload_middleware_1.dynamicFileUploadMiddleware)("file"), auth_controller_1.AuthController.updateProfile);
// ── Admin user management ─────────────────────────────────────────
router.put("/update-user/:id", (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.ADMIN, auth_interface_1.UserRoles.SUPER_ADMIN]), (0, rateLimiter_1.rateLimit)("admin"), auth_controller_1.AuthController.updateUser);
router.delete("/delete/:id", (0, CheckAuth_1.checkAuth)([auth_interface_1.UserRoles.SUPER_ADMIN]), (0, rateLimiter_1.rateLimit)("admin"), auth_controller_1.AuthController.deleteUser);
exports.default = router;
