import express from "express";
import * as submissionController from "./mockTestSubmission.controller";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "../auth/auth.interface";
import { multerVideoUpload } from "../../config/multer.config";
import { rateLimit } from "../../middleware/rateLimiter";

const router = express.Router();

// ── Student submission ────────────────────────────────────────────
router.post(
  "/submit",
  checkAuth(),
  rateLimit("quiz"),
  submissionController.handleSubmitMockTest,
);

router.post(
  "/submit-speaking",
  checkAuth(),
  rateLimit("upload"),
  multerVideoUpload.single("audio"),
  submissionController.handleSubmitSpeakingMockTest,
);

// ── Student reads ─────────────────────────────────────────────────
router.get(
  "/my-submissions/:courseId",
  checkAuth(),
  rateLimit("content"),
  submissionController.handleGetStudentSubmissions,
);

router.get(
  "/my-mocktest-progress/:mockTestId",
  checkAuth(),
  rateLimit("content"),
  submissionController.handleGetMockTestProgress,
);

// ── Admin / Instructor review ─────────────────────────────────────
router.get(
  "/pending",
  checkAuth([UserRoles.INSTRUCTOR, UserRoles.SUPER_ADMIN]),
  rateLimit("admin"),
  submissionController.handleGetPendingSubmissions,
);

router.get(
  "/:submissionId",
  checkAuth([UserRoles.INSTRUCTOR, UserRoles.SUPER_ADMIN]),
  rateLimit("admin"),
  submissionController.handleGetSubmissionById,
);

router.patch(
  "/:submissionId/grade",
  checkAuth([UserRoles.INSTRUCTOR, UserRoles.SUPER_ADMIN]),
  rateLimit("admin"),
  submissionController.handleGradeSubmission,
);

export default router;
