import { IAppConfig } from "./app.interface";
import AppConfig from "./App.model";
import config from "../../config/config";
import { ApiError } from "../../errors/ApiError";

// ✅ Get app configuration
export const getAppConfig = async (): Promise<IAppConfig | null> => {
  return await AppConfig.findOne();
};

// ✅ Create new configuration
export const createAppConfig = async (payload: Partial<IAppConfig>): Promise<IAppConfig> => {
  const existing = await AppConfig.findOne();
  if (existing) {
    throw new ApiError(400, "AppConfig already exists. Please update instead.");
  }

  const newConfig = new AppConfig(payload);
  return await newConfig.save();
};

// ✅ Update configuration
export const updateAppConfig = async (id: string , payload: Partial<IAppConfig>): Promise<IAppConfig | null> => {
  const existing = await AppConfig.findById(id);
  if (!existing) {
    throw new ApiError(404, "No AppConfig found. Please create one first.");
  }

  Object.assign(existing, payload);
  return await existing.save();
};

// ✅ Seed data from environment config if DB is empty
export const seedAppConfigFromEnv = async (): Promise<IAppConfig | null> => {
  const existing = await AppConfig.findOne();
  if (existing) return existing;

  const payload: Partial<IAppConfig> = {
    cloudinary: {
      cloudName: config.cloudinary.cloudinary_cloud_name,
      apiKey: config.cloudinary.cloudinary_api_key,
      apiSecret: config.cloudinary.cloudinary_api_secret,
    },
    smtp: {
      host: config.host,
      port: config.smtp_port,
      user: config.user,
      pass: config.pass,
    },
    jwt: {
      accessExpiresIn: config.jwt.access_expires_in,
      refreshExpiresIn: config.jwt.refresh_expires_in,
    },
    frontendUrl: config.frontend_url,
  };

  const newConfig = new AppConfig(payload);
  return await newConfig.save();
};
