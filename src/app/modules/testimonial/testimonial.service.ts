import httpStatus from "http-status";
import { ApiError } from "../../errors/ApiError";
import Enrollment from "../enrollment/Enrollment.model";
import CourseTestimonial from "./Testimonial.model";
import Course from "../course/Course.model";

interface CreateTestimonialInput {
  userId: string;
  courseId: string;
  rating: number;
  review: string;
}

interface UpdateTestimonialInput {
  testimonialId: string;
  userId: string;
  rating?: number;
  review?: string;
}

// ✅ CREATE testimonial
export const createTestimonial = async ({
  userId,
  courseId,
  rating,
  review,
}: CreateTestimonialInput) => {
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You must enroll in this course before reviewing."
    );
  }

  // Prevent multiple reviews per course by the same user
  const existing = await CourseTestimonial.findOne({ user: userId, course: courseId });
  if (existing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You have already reviewed this course.");
  }

  const testimonial = await CourseTestimonial.create({
    user: userId,
    course: courseId,
    rating,
    review,
  });

  await recalculateCourseAverage(courseId);
  return testimonial;
};

// ✅ UPDATE testimonial
export const updateTestimonial = async ({
  testimonialId,
  userId,
  rating,
  review,
}: UpdateTestimonialInput) => {
  const testimonial = await CourseTestimonial.findById(testimonialId);
  if (!testimonial) {
    throw new ApiError(httpStatus.NOT_FOUND, "Testimonial not found or unauthorized.");
  }

  if (rating !== undefined) testimonial.rating = rating;
  if (review !== undefined) testimonial.review = review;
  await testimonial.save();

  await recalculateCourseAverage(testimonial.course.toString());
  return testimonial;
};

// Helper function — recalculate course average rating
const recalculateCourseAverage = async (courseId: string) => {
  const allTestimonials = await CourseTestimonial.find({ course: courseId });
  const totalRatings = allTestimonials.reduce((sum, t) => sum + t.rating, 0);
  const averageRating = allTestimonials.length
    ? Number((totalRatings / allTestimonials.length).toFixed(1))
    : 0;

  await Course.findByIdAndUpdate(courseId, { averageRating });
};

// ✅ Public: course details page — total count + top 10 highest ratings
export const getCourseReviewSummary = async (courseId: string) => {
  const totalReviews = await CourseTestimonial.countDocuments({ course: courseId });
  const topTestimonials = await CourseTestimonial.find({ course: courseId })
    .populate("user", "name email profileImage")
    .sort({ rating: -1 })
    .limit(10);

  return { totalReviews, topTestimonials };
};

// ✅ Admin: paginated + sorted testimonials
export const getAllTestimonialsAdmin = async (
  page: number,
  limit: number,
  sort: string
) => {
  const skip = (page - 1) * limit;

  const sortOptions: Record<string, any> = {
    highest: { rating: -1 },
    lowest: { rating: 1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };

  const testimonials = await CourseTestimonial.find()
    .populate("user", "name email profileImage")
    .populate("course", "title")
    .sort(sortOptions[sort] || { createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await CourseTestimonial.countDocuments();

  return {
    meta: { total, page, limit },
    data: testimonials,
  };
};

// ✅ Public homepage: top 20 highest-rated reviews across all courses
export const getTopTestimonials = async () => {
  const testimonials = await CourseTestimonial.find()
    .populate("user", "name profileImage")
    .populate("course", "title")
    .sort({ rating: -1 })
    .limit(20);
  return testimonials;
};

// ✅ DELETE testimonial
export const deleteTestimonial = async (testimonialId: string) => {
  const testimonial = await CourseTestimonial.findById(testimonialId);


  if (!testimonial) {
    throw new ApiError(httpStatus.NOT_FOUND, "Testimonial not found or unauthorized.");
  }

  await testimonial.deleteOne();
  await recalculateCourseAverage(testimonial.course.toString());
  return testimonialId;
};


export const getMyReview = async (userId: string, courseId: string) => {
  const testimonial = await CourseTestimonial.findOne({ user: userId, course: courseId });
  return testimonial;
}