import { Document, Types } from 'mongoose';

export interface IPracticeItem {
  content: string; 
  pronunciation?: string; 
  audioUrl?: string;
  imageUrl?: string;
  description?: string;
  order: number;
}

export interface IPractice extends Document {
  _id: Types.ObjectId;
  title: string; // e.g., "English Alphabet Pronunciation"
  slug: string;
  description?: string;
  
  course: Types.ObjectId; 
  items: IPracticeItem[]; 
  thumbnail?: string;
  isActive: boolean;
  totalItems: number;
  usageCount: number; 
  createdAt: Date;
  updatedAt: Date;
}