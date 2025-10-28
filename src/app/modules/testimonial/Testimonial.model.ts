import { model, Schema } from "mongoose";
import { ICourseTestimonial } from "./testimonial.interface";

const courseTestimonialSchema = new Schema<ICourseTestimonial>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure one review per user per course
courseTestimonialSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseTestimonial = model<ICourseTestimonial>(
  "CourseTestimonial",
  courseTestimonialSchema
);

export default CourseTestimonial;