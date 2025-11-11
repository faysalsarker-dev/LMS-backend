import express from "express";
import * as testimonialController from "./testimonial.controller";
import { checkAuth } from "../../middleware/CheckAuth";

const router = express.Router();

// ✅ Create testimonial
router.post("/", checkAuth(), testimonialController.createTestimonial);

// ✅ Update testimonial
router.patch("/:testimonialId", checkAuth(), testimonialController.updateTestimonial);

// ✅ Public course review summary
router.get("/course/:courseId", testimonialController.getCourseReviewSummary);

// ✅ Admin all testimonials with pagination/sorting
router.get("/admin",  testimonialController.getAllTestimonialsAdmin);

// ✅ Public top 20
router.get("/top", testimonialController.getTopTestimonials);
router.get("/my-review/:courseId",checkAuth(), testimonialController.getMyReview);

// ✅ Delete testimonial
router.delete("/:testimonialId", checkAuth(), testimonialController.deleteTestimonial);

export default router;
