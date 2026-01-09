import express from "express";
import { checkAuth } from "../../middleware/CheckAuth";
import { AssignmentSubmissionController } from "./agt.controller";
import { multerUpload, multerVideoUpload } from "../../config/multer.config";


const router = express.Router();

// ---------------------------
// Student routes
// ---------------------------
router.post(
  "/",
  checkAuth(),
 multerVideoUpload.single("file"),
  AssignmentSubmissionController.createSubmission
);

router.get("/:id", checkAuth(), AssignmentSubmissionController.getSubmission);
router.get("/", checkAuth(), AssignmentSubmissionController.getAllSubmissions);

// ---------------------------
// Admin routes
// ---------------------------
router.patch("/review/:id", checkAuth(), AssignmentSubmissionController.adminReview);

router.patch("/:id", checkAuth(), multerUpload.single("file"), AssignmentSubmissionController.updateSubmission);
router.delete("/:id", checkAuth(), AssignmentSubmissionController.deleteSubmission);
router.get("/lesson-assignment/:id", checkAuth(), AssignmentSubmissionController.getStudentAssignmentByLesson);

export default router;
