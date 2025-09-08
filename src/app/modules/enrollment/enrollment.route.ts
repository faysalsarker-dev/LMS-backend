import express from "express";
import * as EnrollmentController from "./enrollment.controller";
import validateRequest from "../../middleware/validateRequest.middleware";
import { iEnrollmentSchema } from "./enrollment.validation";


const router = express.Router();

router.post(
  "/",
  validateRequest(iEnrollmentSchema),
  EnrollmentController.createEnrollment
);

router.get("/", EnrollmentController.getAllEnrollments);
router.get("/:id", EnrollmentController.getEnrollmentById);
router.patch("/:id", EnrollmentController.updateEnrollment);
router.delete("/:id", EnrollmentController.deleteEnrollment);


const EnrollmentRoutes = router;
export default EnrollmentRoutes;