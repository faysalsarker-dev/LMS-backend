import { Document } from "mongoose";

export const UserRoles = {
  USER: 'user',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;


export type UserRole = 'admin' | 'instructor' | 'super_admin' | 'user';

export interface IUser extends Document {
  name: string;
  username: string;
  phone?: string;

  password: string;
  role: UserRole;
  status: "active" | "inactive" | "banned";

  currentToken?: string;
  refreshToken?: string;
  lastLogin?: Date;
  loginDevice?: {
    ip: string;
    userAgent: string;
  };

  image?: string;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}