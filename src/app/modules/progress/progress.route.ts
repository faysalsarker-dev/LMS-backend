import express from "express";
import * as progressController from "./progress.controller";
import { checkAuth } from "../../middleware/CheckAuth";

const router = express.Router();

router.post(
  "/complete-lesson",
  checkAuth(),
  progressController.handleMarkLessonComplete,
);

router.get(
  "/:courseId",
  checkAuth(),
  progressController.handleGetStudentProgress,
);

const progressRoutes = router;

export default progressRoutes
