import express from "express";
import * as LessonController from "./lesson.controller";
import { dynamicFileUploadMiddleware } from "../../middleware/fileUpload.middleware";
import { rateLimit } from "../../middleware/rateLimiter";
import { checkAuth } from "../../middleware/CheckAuth";
import { UserRoles } from "../auth/auth.interface";

const router = express.Router();

// ── Lesson CRUD ──────────────────────────────────────────────────
router.post(
  "/",
  checkAuth([UserRoles.INSTRUCTOR, UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  rateLimit("upload"),
  dynamicFileUploadMiddleware(["video", "audioFile"]),
  LessonController.createLessonController,
);
router.get("/",     rateLimit("content"), LessonController.getAllLessonsController);
router.get("/:id", rateLimit("content"), LessonController.getSingleLessonController);
router.patch(
  "/:id",
  checkAuth([UserRoles.INSTRUCTOR, UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  rateLimit("write"),
  LessonController.updateLessonController,
);
router.delete(
  "/:id",
  checkAuth([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]),
  rateLimit("admin"),
  LessonController.deleteLessonController,
);

export default router;
