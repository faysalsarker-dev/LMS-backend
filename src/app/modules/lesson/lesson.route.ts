import express from "express";
import * as LessonController from "./lesson.controller";
import { multerUpload, multerVideoUpload } from "../../config/multer.config";

const router = express.Router();

// CRUD
router.post("/",
// multerVideoUpload.single("video"),
 multerVideoUpload.fields([
    { name: "video", maxCount: 1 },
    { name: "audioFile", maxCount: 1 },
  ]),
    
    LessonController.createLessonController);
router.get("/", LessonController.getAllLessonsController);
router.get("/:id", LessonController.getSingleLessonController);
router.patch("/:id", LessonController.updateLessonController);
router.delete("/:id", LessonController.deleteLessonController);

export default router;
