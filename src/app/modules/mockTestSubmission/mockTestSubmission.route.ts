import express from "express";
import * as submissionController from "./mockTestSubmission.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "../auth/auth.interface";
import {  multerVideoUpload } from "../../config/multer.config";

const router = express.Router();

// Student routes
router.post(
  "/submit",
  checkAuth(),
  submissionController.handleSubmitMockTest
);

router.post(
  "/submit-speaking",
  checkAuth(),
   multerVideoUpload.single("audio"),
  submissionController.handleSubmitSpeakingMockTest
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

router.get(
  "/:submissionId",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  submissionController.handleGetSubmissionById
);

router.patch(
  "/:submissionId/grade",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  submissionController.handleGradeSubmission
);

export default router;
