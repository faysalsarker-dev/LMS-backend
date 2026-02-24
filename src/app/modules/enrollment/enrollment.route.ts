import express from "express";
import * as EnrollmentController from "./enrollment.controller";
import { checkAuth } from "../../middleware/CheckAuth";

const router = express.Router();


router.get(
  "/analytics/total-earnings",
  checkAuth(),
  EnrollmentController.getTotalEarningsController
);

router.get(
  "/analytics/monthly-earnings/:year",
  checkAuth(),
  EnrollmentController.getMonthlyEarningsController
);


router.post(
  "/success",
EnrollmentController.paymentSSlSuccessController

);
router.post(
  "/cancel",


);
router.post(
  "/failed",



);

// Create enrollment (Student enrolls in course)
router.post("/", checkAuth(), EnrollmentController.createEnrollmentController);

// Get all enrollments (Admin - with filters)
router.get("/", checkAuth(), EnrollmentController.getAllEnrollmentsController);

// Get enrollment by ID
router.get("/:id", checkAuth(), EnrollmentController.getEnrollmentByIdController);

// Update enrollment
router.patch("/:id", checkAuth(), EnrollmentController.updateEnrollmentController);

// Delete enrollment
router.delete("/:id", checkAuth(), EnrollmentController.deleteEnrollmentController);

const EnrollmentRoutes = router;
export default EnrollmentRoutes;