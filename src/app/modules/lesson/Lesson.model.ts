import mongoose, { Schema, model } from "mongoose";
import slugify from "slugify";
import { ILesson } from "./lesson.interface";

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, required: true },

    milestone: { type: Schema.Types.ObjectId, ref: "Milestone", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, min: 1 },

    contentType: { 
      type: String, 
      enum: ["video", "doc", "quiz", "assignment"], 
      default: "video" 
    },

    videoUrl: {
      type: String,
      validate: {
        validator: function (this: ILesson, v: string) {
          return this.contentType !== "video" || !!v;
        },
        message: "videoUrl is required for video lessons",
      },
    },

    docContent: {
      type: String,
      validate: {
        validator: function (this: ILesson, v: string) {
          return this.contentType !== "doc" || !!v;
        },
        message: "docContent is required for doc lessons",
      },
    },

    quiz: {
      question: { type: String, trim: true },
      options: [{ text: { type: String } }],
      correctAnswer: { type: String },
      explanation: { type: String },
      timer: { type: Number, default: null },
    },

    status: { type: String, enum: ["active", "inactive"], default: "active" },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Generate slug before save
lessonSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  while (await mongoose.models.Lesson.findOne({ slug, course: this.course })) {
    slug = `${baseSlug}-${count++}`;
  }

  this.slug = slug;
  next();
});

// Indexes
lessonSchema.index({ milestone: 1, slug: 1, course: 1 }, { unique: true });
lessonSchema.index({ course: 1, order: 1 });

const Lesson = model<ILesson>("Lesson", lessonSchema);
export default Lesson;
