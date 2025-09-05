import { Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  realName?: string;
  idCardNumber?: string;
  wechatOpenId?: string; 
  alipayUserId?: string; 
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
  displayName?: string;
  photoURL?: string;
  roles: string[];
  enrollments: string[];
}
