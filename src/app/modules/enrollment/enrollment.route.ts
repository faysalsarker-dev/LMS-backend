import express from "express";
import * as EnrollmentController from "./enrollment.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { rateLimit } from "../../middleware/rateLimiter";

const router = express.Router();


// ── Admin analytics ────────────────────────────────────────────────
router.get(
  "/analytics/total-earnings",
  checkAuth(),
  rateLimit("admin"),
  EnrollmentController.getTotalEarningsController,
);

router.get(
  "/analytics/monthly-earnings/:year",
  checkAuth(),
  rateLimit("admin"),
  EnrollmentController.getMonthlyEarningsController,
);

// ── Payment callbacks (no auth, called by SSL gateway) ──────────────────
router.post("/success", EnrollmentController.paymentSSlSuccessController);
router.post("/cancel",  EnrollmentController.paymentSSlCancelController);
router.post("/fail",    EnrollmentController.paymentSSlFailedController);

// ── Enrollment CRUD ────────────────────────────────────────────────
router.post("/",    checkAuth(), rateLimit("write"),  EnrollmentController.createEnrollmentController);
router.get("/",     checkAuth(), rateLimit("admin"),  EnrollmentController.getAllEnrollmentsController);
router.get("/:id",  checkAuth(), rateLimit("admin"),  EnrollmentController.getEnrollmentByIdController);
router.patch("/:id", checkAuth(), rateLimit("write"),  EnrollmentController.updateEnrollmentController);
router.delete("/:id", checkAuth(), rateLimit("admin"), EnrollmentController.deleteEnrollmentController);

const EnrollmentRoutes = router;
export default EnrollmentRoutes;