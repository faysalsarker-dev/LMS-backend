import { Router } from "express";
import * as CourseController from './course.controller';
import validateRequest from "../../middleware/validateRequest.middleware";
import { iCourseSchema } from "./course.validation";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/CheckAuth";
import { rateLimit } from "../../middleware/rateLimiter";




const router = Router();

// ── Public content reads ──────────────────────────────────────────
router.get("/",       rateLimit("content"), CourseController.getAllCourses);
router.get("/select", rateLimit("content"), CourseController.getAllCoursesForSelecting);
router.get("/my-course/:id", rateLimit("content"), CourseController.getCourseById);
router.get("/:slug",         rateLimit("content"), CourseController.getCourseBySlug);

// ── Authenticated reads ───────────────────────────────────────────
router.get("/my-enrolled-courses", checkAuth(), rateLimit("content"), CourseController.getMyEnrolledCourses);
router.get("/my-wishlist-courses", checkAuth(), rateLimit("content"), CourseController.getMyWishlistCourses);

router.get(
  "/:courseId/curriculum",
  checkAuth(),
  rateLimit("content"),
  CourseController.getCourseCurriculum,
);

router.get(
  "/lessons/:lessonId",
  checkAuth(),
  rateLimit("content"),
  CourseController.getLessonContent,
);

// ── Mutations ─────────────────────────────────────────────────────
router.post(
  "/",
  rateLimit("write"),
  multerUpload.single("file"),
  CourseController.createCourse,
);

router.put(
  "/:id",
  rateLimit("write"),
  multerUpload.single("file"),
  CourseController.updateCourse,
);

router.delete(
  "/:id",
  rateLimit("admin"),
  CourseController.deleteCourse,
);




export default router;
