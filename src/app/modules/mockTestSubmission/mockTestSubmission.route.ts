import express from "express";
import * as submissionController from "./mockTestSubmission.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "../auth/auth.interface";

const router = express.Router();

// Student routes
router.post(
  "/submit",
  checkAuth(),
  submissionController.handleSubmitMockTest
);

router.get(
  "/my-submissions/:courseId",
  checkAuth(),
  submissionController.handleGetStudentSubmissions
);

router.get(
  "/my-mocktest-progress/:mockTestId",
  checkAuth(),
  submissionController.handleGetMockTestProgress
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

export default router;
