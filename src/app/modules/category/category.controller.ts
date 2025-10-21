import { Request, Response } from "express";
import { CategoryService } from "./category.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";


export const CategoryController = {
  create: catchAsync(async (req: Request, res: Response) => {


if(req.file){
  req.body.thumbnail = req.file?.path
}

   const category = await CategoryService.createCategory(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Category created successfully",
      data: category,
    });
  }),

  getAll: catchAsync(async (_req: Request, res: Response) => {
    const categories = await CategoryService.getAllCategories();
    sendResponse(res, {
      statusCode:200,
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const category = await CategoryService.getCategoryById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode:200,
      message: "Category retrieved successfully",
      data: category,
    });
  }),

  update: catchAsync(async (req: Request, res: Response) => {

if(req.file){
  req.body.thumbnail = req.file?.path
}


    const updated = await CategoryService.updateCategory(req.params.id, req.body);
    sendResponse(res, {
      statusCode:200,
      success: true,
      message: "Category updated successfully",
      data: updated,
    });
  }),

  delete: catchAsync(async (req: Request, res: Response) => {
    const deleted = await CategoryService.deleteCategory(req.params.id);
    sendResponse(res, {
      statusCode:201,
      success: true,
      message: "Category deleted successfully",
      data: deleted,
    });
  }),
};
