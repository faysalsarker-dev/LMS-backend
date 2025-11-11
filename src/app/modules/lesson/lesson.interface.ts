import { Document, Types } from "mongoose";

export interface IAudio {
    url: string;
  duration?: number;
  transcripts:{
    language: string;
  text: string;
  }[]
  
}




// ---- Question ----
export interface IQuestion {
  type: "mcq" | "true_false" | "fill_blank" | "short_answer"  | "audio";
  questionText: string;
  audio?:string | null;
  options?: { text: string }[];
  correctAnswer?: string | string[] | Boolean | Record<string, any>;
  explanation?: string;
  timer?: number | null;
}

export interface IVideo {
  url: string;
  duration?: number;
}



// ---- Lesson ----
export interface ILesson extends Document {
  title: string;
  slug: string;
  milestone: Types.ObjectId;
  course: Types.ObjectId;
  order?: number;

  type:
    | "video"
    | "doc"
    | "quiz"
    | "audio"


  content?: string;
  questions?: IQuestion[] | null;
  video?: IVideo | null;
audio?: IAudio | null;

  status?: "active" | "inactive";
  viewCount?: number;

  createdAt?: Date;
  updatedAt?: Date;
}
