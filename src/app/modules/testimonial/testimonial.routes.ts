import express from "express";

import {
  createOrUpdateTestimonial,
  getCourseTestimonials,
  deleteTestimonial,
} from "./testimonial.controller";
import { checkAuth } from "../../middleware/CheckAuth";

const router = express.Router();

router.post("/", checkAuth(), createOrUpdateTestimonial);

router.get("/:courseId", getCourseTestimonials);

router.delete("/:id", checkAuth(), deleteTestimonial);

const testimonialRoutes = router;

export default testimonialRoutes; 