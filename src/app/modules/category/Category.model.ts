import mongoose, { Schema } from "mongoose";
import { ICategory } from "./category.interface";

const CategorySchema: Schema<ICategory> = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    thumbnail: { type: String, default: null },
    totalCourse: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Category = mongoose.model<ICategory>("Category", CategorySchema);
