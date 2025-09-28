import { Router } from "express";
import * as CourseController from './course.controller';
import validateRequest from "../../middleware/validateRequest.middleware";
import { iCourseSchema } from "./course.validation";
import { multerUpload } from "../../config/multer.config";




const router = Router();

// Public routes
router.get("/", CourseController.getAllCourses);

// Protected routes
router.post(
  "/",
multerUpload.single("file"),
  CourseController.createCourse
);


router.get("/:slug", CourseController.getCourseBySlug);



router.put(
  "/:id",
multerUpload.single("file"),
  CourseController.updateCourse
);

router.delete(
  "/:id",

  CourseController.deleteCourse
);

export default router;
