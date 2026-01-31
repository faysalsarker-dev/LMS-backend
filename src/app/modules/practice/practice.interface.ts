import { Document, Types } from 'mongoose';

export interface IPracticeItem {
  _id: Types.ObjectId;    
  content: string;        
  pronunciation?: string;  
  audioUrl: string;        
  imageUrl?: string;       
  order: number;           
}


export interface IPractice extends Document {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  course: Types.ObjectId;   
  items: IPracticeItem[];
  isActive: boolean;
  usageCount: number;      
  createdAt: Date;
  updatedAt: Date;
  totalItems: number;    
}