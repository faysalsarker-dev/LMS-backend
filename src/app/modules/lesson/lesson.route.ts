import express from "express";
import * as LessonController from "./lesson.controller";
import { dynamicFileUploadMiddleware } from "../../middleware/fileUpload.middleware";
import { rateLimit } from "../../middleware/rateLimiter";

const router = express.Router();

// ── Lesson CRUD ──────────────────────────────────────────────────
router.post(
  "/",
  rateLimit("upload"),
  dynamicFileUploadMiddleware(["video", "audioFile"]),
  LessonController.createLessonController,
);
router.get("/",     rateLimit("content"), LessonController.getAllLessonsController);
router.get("/:id", rateLimit("content"), LessonController.getSingleLessonController);
router.patch("/:id",  rateLimit("write"),   LessonController.updateLessonController);
router.delete("/:id", rateLimit("admin"),   LessonController.deleteLessonController);

export default router;
