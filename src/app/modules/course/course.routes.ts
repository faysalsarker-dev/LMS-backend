import { Router } from "express";
import * as CourseController from './course.controller';
import validateRequest from "../../middleware/validateRequest.middleware";
import { iCourseSchema } from "./course.validation";




const router = Router();

// Public routes
router.get("/", CourseController.getAllCourses);

// Protected routes
router.post(
  "/",
validateRequest(iCourseSchema),
  CourseController.createCourse
);


router.get("/:id", CourseController.getCourseById);



router.put(
  "/:id",

  CourseController.updateCourse
);

router.delete(
  "/:id",

  CourseController.deleteCourse
);

export default router;
