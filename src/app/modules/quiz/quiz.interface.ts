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
  module: Types.ObjectId; 
  timer?: number; 
  createdAt?: Date;
  updatedAt?: Date;
}
