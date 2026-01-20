import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import practiceService from './practice.service';

class PracticeController {
  // Create practice
  createPractice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const practice = await practiceService.createPractice(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Practice created successfully',
      data: practice
    });
  });

  // Get all practices
  getAllPractices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await practiceService.getAllPractices(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Practices retrieved successfully',
      data: result.practices,
      meta: result.meta
    });
  });

  // Get single practice
  getPractice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const practice = await practiceService.getPracticeById(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Practice retrieved successfully',
      data: practice
    });
  });

  // Update practice
  updatePractice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const practice = await practiceService.updatePractice(req.params.id, req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Practice updated successfully',
      data: practice
    });
  });

  // Delete practice
  deletePractice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await practiceService.deletePractice(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Practice deleted successfully',
      data: null
    });
  });

  // Add items to practice
  addItems = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const practice = await practiceService.addItemsToPractice(
      req.params.id,
      req.body.items
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Items added successfully',
      data: practice
    });
  });

  // Remove item from practice
  removeItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const practice = await practiceService.removeItemFromPractice(
      req.params.id,
      Number(req.params.itemIndex)
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Item removed successfully',
      data: practice
    });
  });

  // Update practice item
  updateItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const practice = await practiceService.updatePracticeItem(
      req.params.id,
      Number(req.params.itemIndex),
      req.body
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Item updated successfully',
      data: practice
    });
  });
}

export default new PracticeController();
