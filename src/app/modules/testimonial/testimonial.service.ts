import httpStatus from "http-status";
import Enrollment from "../enrollment/Enrollment.model";
import { ApiError } from "../../errors/ApiError";
import CourseTestimonial from "./Testimonial.model";
import Course from "../course/Course.model";


interface CreateTestimonialInput {
  userId: string;
  courseId: string;
  rating: number;
  review: string;
}



export const createOrUpdateTestimonial = async ({
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



  const testimonial = await CourseTestimonial.findOneAndUpdate(
    { user:userId, course: courseId },
    { rating, review },
    { upsert: true, new: true }
  );

  const allTestimonials = await CourseTestimonial.find({ course: courseId });

  const totalRatings = allTestimonials.reduce((sum, item) => sum + item.rating, 0);
  const averageRating = allTestimonials.length
    ? Number((totalRatings / allTestimonials.length).toFixed(1))
    : 0;

  await Course.findByIdAndUpdate(courseId, { averageRating });

  return testimonial;
};




export const getAllTestimonialsByCourse = async (courseId: string) => {
  const testimonials = await CourseTestimonial.find({ course:courseId })
    .populate("userId", "name profileImage")
    .sort({ createdAt: -1 });



  return testimonials;
};

export const deleteTestimonial = async (testimonialId: string, userId: string) => {
  const testimonial = await CourseTestimonial.findOne({
    _id: testimonialId,
    user: userId,
  });

  if (!testimonial) {
    throw new ApiError(httpStatus.NOT_FOUND, "Testimonial not found or unauthorized.");
  }

  await testimonial.deleteOne();
  return testimonialId;
};
