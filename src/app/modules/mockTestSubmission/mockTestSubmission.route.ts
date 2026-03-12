import express from "express";
import * as submissionController from "./mockTestSubmission.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "../auth/auth.interface";

const router = express.Router();

// Student routes
router.post(
  "/submit",
  checkAuth([UserRoles.STUDENT]),
  submissionController.handleSubmitMockTest
);

router.get(
  "/my-submissions/:courseId",
  checkAuth([UserRoles.STUDENT]),
  submissionController.handleGetStudentSubmissions
);

// Admin routes
router.get(
  "/pending",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  submissionController.handleGetPendingSubmissions
);

router.patch(
  "/:submissionId/grade",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  submissionController.handleGradeSubmission
);

export const MockTestSubmissionRoutes = router;
