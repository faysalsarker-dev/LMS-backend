import express from "express";
import * as EnrollmentController from "./enrollment.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { rateLimit } from "../../middleware/rateLimiter";
import { UserRoles } from "../auth/auth.interface";

const router = express.Router();


// ── Admin analytics ────────────────────────────────────────────────
router.get(
  "/analytics/total-earnings",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  rateLimit("admin"),
  EnrollmentController.getTotalEarningsController,
);

router.get(
  "/analytics/monthly-earnings/:year",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  rateLimit("admin"),
  EnrollmentController.getMonthlyEarningsController,
);

// ── Payment callbacks (no auth, called by SSL gateway) ──────────────────
router.post("/success", EnrollmentController.paymentSSlSuccessController);
router.post("/cancel",  EnrollmentController.paymentSSlCancelController);
router.post("/fail",    EnrollmentController.paymentSSlFailedController);

// ── Enrollment CRUD ────────────────────────────────────────────────
router.post("/",    checkAuth(), rateLimit("write"),  EnrollmentController.createEnrollmentController);
router.get("/",     checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]), rateLimit("admin"),  EnrollmentController.getAllEnrollmentsController);
router.get("/:id",  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]), rateLimit("admin"),  EnrollmentController.getEnrollmentByIdController);
router.patch("/:id", checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]), rateLimit("write"),  EnrollmentController.updateEnrollmentController);
router.delete("/:id", checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]), rateLimit("admin"), EnrollmentController.deleteEnrollmentController);

const EnrollmentRoutes = router;
export default EnrollmentRoutes;