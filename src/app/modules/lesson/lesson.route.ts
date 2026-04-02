import express from "express";
import * as LessonController from "./lesson.controller";
import { multerUpload, multerVideoUpload } from "../../config/multer.config";
import { rateLimit } from "../../middleware/rateLimiter";

const router = express.Router();

// ── Lesson CRUD ──────────────────────────────────────────────────
router.post(
  "/",
  rateLimit("upload"),
  multerVideoUpload.fields([
    { name: "video", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
  LessonController.createLessonController,
);
router.get("/",     rateLimit("content"), LessonController.getAllLessonsController);
router.get("/:id", rateLimit("content"), LessonController.getSingleLessonController);
router.patch("/:id",  rateLimit("write"),   LessonController.updateLessonController);
router.delete("/:id", rateLimit("admin"),   LessonController.deleteLessonController);

export default router;
