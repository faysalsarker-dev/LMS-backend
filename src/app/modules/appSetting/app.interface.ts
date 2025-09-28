import { Document } from "mongoose";

export interface IAppConfig extends Document {
  cloudinary?: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  smtp?: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
  jwt?: {
    accessExpiresIn: string;
    refreshExpiresIn: string;
  };
  frontendUrl?: string;
}