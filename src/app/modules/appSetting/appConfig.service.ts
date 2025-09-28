import { IAppConfig } from "./app.interface";
import AppConfig from "./App.model";

export const getAppConfig = async (): Promise<IAppConfig | null> => {
  return await AppConfig.findOne();
};

export const createAppConfig = async (payload: Partial<IAppConfig>): Promise<IAppConfig> => {
  const existing = await AppConfig.findOne();
  if (existing) {
    throw new Error("AppConfig already exists. Please update instead.");
  }
  const config = new AppConfig(payload);
  return await config.save();
};

export const updateAppConfig = async (payload: Partial<IAppConfig>): Promise<IAppConfig | null> => {
  const config = await AppConfig.findOne();
  if (!config) throw new Error("No config found. Create one first.");

  Object.assign(config, payload);
  return await config.save();
};
