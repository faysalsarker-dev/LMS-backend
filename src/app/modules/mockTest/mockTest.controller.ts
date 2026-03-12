import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import * as MockTestService from "./mockTest.service";
import httpStatus from "http-status";
import { ApiError } from "../../errors/ApiError";

export const createMockTest = catchAsync(
  async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      thumbnail: req?.file?.path || req.body.thumbnail,
    };

    const result = await MockTestService.createMockTest(payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "MockTest created successfully",
      data: result,
    });
  },
);

export const getAllMockTests = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MockTestService.getAllMockTests(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "MockTests retrieved successfully",
      data: result,
    });
  },
);

export const getMockTestById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MockTestService.getMockTestById(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "MockTest retrieved successfully",
      data: result,
    });
  },
);

export const getMockTestBySlug = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MockTestService.getMockTestBySlug(req.params.slug);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "MockTest retrieved successfully",
      data: result,
    });
  },
);

export const updateMockTest = catchAsync(
  async (req: Request, res: Response) => {
    const payload = {
      ...req.body,
      ...(req?.file?.path && { thumbnail: req.file.path }),
    };

    const result = await MockTestService.updateMockTest(req.params.id, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "MockTest updated successfully",
      data: result,
    });
  },
);

export const deleteMockTest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await MockTestService.deleteMockTest(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "MockTest deleted successfully",
      data: result,
    });
  },
);

export const getMocktestForUser = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
console.log(userId,'request')
    if (!userId) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User not found in request");
    }

    const result = await MockTestService.getMocktestForUser(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User MockTests retrieved successfully",
      data: result,
    });
  },
);
