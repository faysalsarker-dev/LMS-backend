import mongoose, { Schema } from "mongoose";
import { ICourse } from "./course.interface";
import slugify from "slugify";

const CourseSchema: Schema<ICourse> = new Schema(
  {
    title: { type: String, required: true, trim: true},
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 4000 },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: false },
    milestones: [{ type: Schema.Types.ObjectId, ref: "Milestone", default: [] }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required:true },
    thumbnail: { type: String, default: null },
    tags: [{ type: String, trim: true, index: true }],
    skills: [{ type: String }],
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    prerequisites: [{ type: String }],
    requirements: [{ type: String }],
    price: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    isDiscounted: { type: Boolean, default: false },
    discountPrice: { type: Number, default: 0 },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    averageRating: { type: Number, default: 0 },
    totalEnrolled: { type: Number, default: 0 },
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    duration: { type: String, default: "" },
    totalLectures: { type: Number, default: 0 },
    certificateAvailable: { type: Boolean, default: false },
    resources: [{ type: String }],
    isFeatured:{type:Boolean,default:false}
  
  },
  { timestamps: true }
);

// 🔹 Pre-save hook to generate unique slug
CourseSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  // Ensure slug is unique
  while (await mongoose.models.Course.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const Course = mongoose.model<ICourse>("Course", CourseSchema);
export default Course;
