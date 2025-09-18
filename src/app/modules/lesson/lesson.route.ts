import express from "express";
import * as LessonController from "./lesson.controller";

const router = express.Router();

// CRUD
router.post("/", LessonController.createLessonController);
router.get("/", LessonController.getAllLessonsController);
router.get("/:id", LessonController.getSingleLessonController);
router.patch("/:id", LessonController.updateLessonController);
router.delete("/:id", LessonController.deleteLessonController);

export default router;
