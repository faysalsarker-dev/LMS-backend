import { Request, Response } from "express";
import * as AppConfigService from "./appConfig.service";

export const getConfig = async (req: Request, res: Response) => {
  try {
    const config = await AppConfigService.getAppConfig();
    if (!config) return res.status(404).json({ message: "Config not found" });
    res.json(config);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const createConfig = async (req: Request, res: Response) => {
  try {
    const config = await AppConfigService.createAppConfig(req.body);
    res.status(201).json(config);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const config = await AppConfigService.updateAppConfig(req.body);
    res.json(config);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
