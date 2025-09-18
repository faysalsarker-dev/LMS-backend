import { Types } from "mongoose";

export interface IQuizOption {
  label: string; 
  text: string; 
}

export interface IQuiz {
  question: string;
  options: IQuizOption[];
  correctAnswer: string; 
  explanation?: string;
  lesson: Types.ObjectId; 
  timer?: number; 
  status:"active" | "inactive"
  createdAt?: Date;
  updatedAt?: Date;
}
