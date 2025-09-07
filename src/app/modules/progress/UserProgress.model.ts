import { Schema, model, Types } from "mongoose";
import { IUserProgress } from "./userProgress.interface";

const ModuleProgressSchema = new Schema({
  module: { type: Types.ObjectId, ref: "Module", required: true },
  videosCompleted: [{ type: Types.ObjectId }],
  notesCompleted: [{ type: Types.ObjectId }],
  docsCompleted: [{ type: Types.ObjectId }],
  quizzesCompleted: [{ type: Types.ObjectId, ref: "Quiz" }],
});

const MilestoneProgressSchema = new Schema({
  milestone: { type: Types.ObjectId, ref: "Milestone", required: true },
  modules: [ModuleProgressSchema],
});

const UserProgressSchema = new Schema<IUserProgress>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    course: { type: Types.ObjectId, ref: "Course", required: true },
    milestones: [MilestoneProgressSchema],
  },
  { timestamps: true }
);

const UserProgress = model<IUserProgress>(
  "UserProgress",
  UserProgressSchema
);


export default UserProgress;