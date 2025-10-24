import { IProgress } from "./progress.interface";
import { Schema, model } from "mongoose";

const progressSchema = new Schema<IProgress>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
      },
    ],
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

progressSchema.index({ student: 1, course: 1 }, { unique: true });

progressSchema.methods.addCompletedLesson = async function (lessonId: string) {
  if (!this.completedLessons.some((l: any) => l.toString() === lessonId)) {
    this.completedLessons.push(lessonId);
    await this.save();
  }
  return this;
};

const Progress = model<IProgress>("Progress", progressSchema);
export default Progress;
