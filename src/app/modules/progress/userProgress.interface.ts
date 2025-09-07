import { Types, Document } from "mongoose";

export interface IModuleProgress {
  module: Types.ObjectId;
  videosCompleted: Types.ObjectId[];
  notesCompleted: Types.ObjectId[];
  docsCompleted: Types.ObjectId[];
  quizzesCompleted: Types.ObjectId[];
}

export interface IMilestoneProgress {
  milestone: Types.ObjectId;
  modules: IModuleProgress[];
}

export interface IUserProgress extends Document {
  user: Types.ObjectId;
  course: Types.ObjectId;
  milestones: IMilestoneProgress[];
}
