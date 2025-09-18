import { Schema, model } from "mongoose";
import { ILesson } from "./lesson.interface";

const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    milestone: { type: Schema.Types.ObjectId, ref: "Milestone", required: true },
    order: { type: Number, default: 1, min: 1 },
    contentType: { type: String, enum: ["video", "doc", "quiz"], default: "video" },
    videoUrl: { type: String, default: null },
    docContent: { type: String, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

lessonSchema.index({ milestone: 1, order: 1 });

const Lesson = model<ILesson>("Lesson", lessonSchema);
export default Lesson;
