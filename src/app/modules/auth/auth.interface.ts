
import { Document, Types } from "mongoose";

export const UserRoles = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;


export type UserRole = 'admin' | 'instructor' | 'super_admin' | 'student';


export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  profile?: string;
 courses: Types.ObjectId[];
 wishlist: Types.ObjectId[];
 
 address:{
  country?:string,
  city?:string

 }
  otp?: string;
  otpExpiry?: Date;


  comparePassword(candidatePassword: string): Promise<boolean>;
}