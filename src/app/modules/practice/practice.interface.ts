import { Document, Types } from 'mongoose';

export interface IPracticeItem {
  content: string; // e.g., "A", "B", "Apple"
  pronunciation?: string; // Phonetic text: /eɪ/, /biː/
  audioUrl?: string; // URL to audio file
  imageUrl?: string; // Optional image
  description?: string;
  order: number;
}

export interface IPractice extends Document {
  _id: Types.ObjectId;
  title: string; // e.g., "English Alphabet Pronunciation"
  slug: string;
  description?: string;
  type: 'pronunciation' | 'vocabulary' | 'grammar' | 'exercise' | 'quiz' | 'other';
  category?: Types.ObjectId; // Reference to Category
  items: IPracticeItem[]; // Array of practice items
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime?: string; // e.g., "15 minutes"
  tags?: string[];
  thumbnail?: string;
  isActive: boolean;
  createdBy?: Types.ObjectId; // Admin/Instructor who created it
  totalItems: number;
  usageCount: number; // Track how many courses use this
  createdAt: Date;
  updatedAt: Date;
}