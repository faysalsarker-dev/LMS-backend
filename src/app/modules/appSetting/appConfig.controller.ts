import { Request, Response } from "express";
import * as AppConfigService from "./appConfig.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ApiError } from "../../errors/ApiError";


export const getConfig = catchAsync(async (req: Request, res: Response) => {
  const config = await AppConfigService.getAppConfig();

  if (!config) {
    const seededConfig = await AppConfigService.seedAppConfigFromEnv();

    if (!seededConfig) {
      throw new ApiError(404, "App configuration not found and seeding failed.");
    }

    return sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "App configuration seeded from environment successfully.",
      data: seededConfig,
    });
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "App configuration fetched successfully.",
    data: config,
  });
});

export const createConfig = catchAsync(async (req: Request, res: Response) => {
  const config = await AppConfigService.createAppConfig(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "App configuration created successfully.",
    data: config,
  });
});

export const updateConfig = catchAsync(async (req: Request, res: Response) => {
  const config = await AppConfigService.updateAppConfig(req.params.id,req.body);

  if (!config) {
    throw new ApiError(404, "App configuration not found.");
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "App configuration updated successfully.",
    data: config,
  });
});
