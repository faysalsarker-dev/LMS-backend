import mongoose, { Schema } from "mongoose";
import { IMockTest } from "./mockTest.interface";
import slugify from "slugify";

const MockTestSchema: Schema<IMockTest> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    thumbnail: { type: String, default: null },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    
    // The 4 test parts. We will use a unified 'MockTestSection' model to avoid code repeating.
    listening: { type: Schema.Types.ObjectId, ref: "MockTestSection" },
    reading: { type: Schema.Types.ObjectId, ref: "MockTestSection" },
    writing: { type: Schema.Types.ObjectId, ref: "MockTestSection" },
    speaking: { type: Schema.Types.ObjectId, ref: "MockTestSection" },

    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  },
  { timestamps: true }
);

// Pre-save hook to generate unique slug based on title
MockTestSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  // Ensure slug is unique
  while (await mongoose.models.MockTest?.findOne({ slug })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

const MockTest = mongoose.model<IMockTest>("MockTest", MockTestSchema);
export default MockTest;
