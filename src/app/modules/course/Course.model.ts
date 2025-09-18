import mongoose, { Schema } from "mongoose";
import { ICourse } from "./course.interface";

const CourseSchema: Schema<ICourse> = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 400, index: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 4000 },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    milestones: [{ type: Schema.Types.ObjectId, ref: "Milestone", default: [] }],
    thumbnail: { type: String, default: null },
    tags: [{ type: String, trim: true, index: true }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    averageRating: { type: Number, default: 0 },
    totalEnrolled: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Course = mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
