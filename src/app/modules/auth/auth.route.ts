import { Router } from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "./auth.interface";
import { AuthController } from "./auth.controller";
import { dynamicFileUploadMiddleware } from "../../middleware/fileUpload.middleware";
import { rateLimit } from "../../middleware/rateLimiter";

const router = Router();

router.get("/", AuthController.getAll);

// ── Credential endpoints ──────────────────────────────────────────
router.post("/register", rateLimit("auth"), AuthController.register);
router.post("/login",    rateLimit("auth"), AuthController.login);

// ── OTP / password recovery ───────────────────────────────────────
router.post("/send-otp",         rateLimit("otp"), AuthController.sendOtp);
router.put("/verify-otp",        rateLimit("otp"), AuthController.verifyOtp);
router.post("/forget-password",  rateLimit("otp"), AuthController.forgetPassword);
router.put("/reset-password",    rateLimit("otp"), AuthController.resetPassword);

// ── Token management ──────────────────────────────────────────────
router.post("/refresh-token", rateLimit("refresh"), AuthController.getNewAccessToken);

// ── Authenticated user actions ────────────────────────────────────
router.post("/logout",      checkAuth(), AuthController.logout);
router.post("/logout-all",  AuthController.logoutFromOthers);
router.put("/addToWishlist", checkAuth(), AuthController.addToWishlist);

router.get(
  "/me",
  checkAuth([
    UserRoles.ADMIN,
    UserRoles.INSTRUCTOR,
    UserRoles.SUPER_ADMIN,
    UserRoles.STUDENT,
  ]),
  AuthController.me,
);

router.put("/update-password", checkAuth(), rateLimit("write"), AuthController.updatePassword);

router.put(
  "/update",
  checkAuth(),
  rateLimit("write"),
  dynamicFileUploadMiddleware("file"),
  AuthController.updateProfile,
);

// ── Admin user management ─────────────────────────────────────────
router.put(
  "/update-user/:id",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  rateLimit("admin"),
  AuthController.updateUser,
);
router.delete(
  "/delete/:id",
  checkAuth([UserRoles.SUPER_ADMIN]),
  rateLimit("admin"),
  AuthController.deleteUser,
);

export default router;
