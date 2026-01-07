import { Router } from "express";
import * as CourseController from './course.controller';
import validateRequest from "../../middleware/validateRequest.middleware";
import { iCourseSchema } from "./course.validation";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/CheckAuth";




const router = Router();

// Public routes
router.get("/", CourseController.getAllCourses);

// Protected routes
router.post(
  "/",
multerUpload.single("file"),
  CourseController.createCourse
);


router.get("/my-enrolled-courses",checkAuth(),  CourseController.getMyEnrolledCourses);
router.get("/my-course/:id", CourseController.getCourseById);
router.get("/:slug", CourseController.getCourseBySlug);
router.get(
  "/:courseId/curriculum",
  checkAuth(), 
  CourseController.getCourseCurriculum
);

router.get(
  "/lessons/:lessonId",
  checkAuth(),
  CourseController.getLessonContent
);





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
