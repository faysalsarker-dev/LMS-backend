
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ModuleService } from "./module.service";

const createModule = catchAsync(async (req:Request, res:Response) => {
  const result = await ModuleService.createModule(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Module created successfully",
    data: result,
  });
});

const getAllModules = catchAsync(async (req:Request, res:Response) => {
  const result = await ModuleService.getAllModules();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Modules fetched successfully",
    data: result,
  });
});

const getModuleById = catchAsync(async (req:Request, res:Response) => {
  const result = await ModuleService.getModuleById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Module fetched successfully",
    data: result,
  });
});

const updateModule = catchAsync(async (req:Request, res:Response) => {
  const result = await ModuleService.updateModule(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Module updated successfully",
    data: result,
  });
});

const deleteModule = catchAsync(async (req:Request, res:Response) => {
  const result = await ModuleService.deleteModule(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Module deleted successfully",
    data: result,
  });
});

export const ModuleController = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
};
