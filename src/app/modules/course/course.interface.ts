import { Document, Types } from "mongoose";

export interface ICourse extends Document {
  title: string;
  slug: string;
  description?: string;
  instructor: Types.ObjectId;
  milestones: Types.ObjectId[];
  thumbnail?: string | null;
  tags: string[];
  skills: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  prerequisites: string[];
  requirements: string[];
  price: number;
  currency: string;
  isDiscounted: boolean;
  discountPrice: number;
  status: "draft" | "published" | "archived";
  averageRating: number;
  totalEnrolled: number;
  enrolledStudents: Types.ObjectId[];
  duration: string; 
  totalLectures: number;
  certificateAvailable: boolean;
  resources: string[]; 
  isFeatured:boolean;
  createdAt: Date;
  updatedAt: Date;
}



export interface ICourseFilters {
status?: "draft" | "published" | "archived" | "all";
level?: "beginner" | "intermediate" | "advanced" | "all";  
isFeatured?:boolean;
  isDiscounted?: boolean;
  certificateAvailable?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

 export interface IPaginatedResponse<T> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data: T[];
}