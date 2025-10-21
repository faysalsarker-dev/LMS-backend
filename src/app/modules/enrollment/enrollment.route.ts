import express from "express";
import * as EnrollmentController from "./enrollment.controller";
import { checkAuth } from "../../middleware/CheckAuth";

const router = express.Router();

router.post("/", checkAuth(), EnrollmentController.createEnrollment);

router.get("/", checkAuth(), EnrollmentController.getAllEnrollments);
router.get("/:id", checkAuth(), EnrollmentController.getEnrollmentById);
router.patch("/:id", checkAuth(), EnrollmentController.updateEnrollment);
router.delete("/:id", checkAuth(), EnrollmentController.deleteEnrollment);

const EnrollmentRoutes = router;
export default EnrollmentRoutes;
