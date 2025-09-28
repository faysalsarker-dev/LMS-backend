import { Document, Types } from "mongoose";

export interface IQuizOption {
  text: string;
}

export interface IQuiz {
  question: string;
  options: IQuizOption[];
  correctAnswer: string;
  explanation?: string;
  timer?: number | null;
}

export interface ILesson extends Document {
  title: string;
  slug: string;
  milestone: Types.ObjectId;
  course: Types.ObjectId;
  order?: number;

  contentType: "video" | "doc" | "quiz" | "assignment";

  videoUrl?: string;
  docContent?: string;
  quiz?: IQuiz;

  status?: "active" | "inactive";
  viewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
