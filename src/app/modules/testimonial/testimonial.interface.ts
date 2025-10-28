import { Types } from "mongoose";

export interface ICourseTestimonial {
  user: Types.ObjectId;
  course: Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}


