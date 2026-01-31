import { Request, Response } from 'express';
import { PracticeService } from './practice.service';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

/* =====================
   CREATE PRACTICE
===================== */
const createPractice = catchAsync(async (req: Request, res: Response) => {
  const file = req.file?.path;
  if (file) {
    req.body.thumbnail = file;
  }

  const result = await PracticeService.createPractice(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Practice created successfully',
    data: result,
  });
});

/* =====================
   GET ALL PRACTICES (FILTER + SORT)
===================== */
const getAllPractices = catchAsync(async (req: Request, res: Response) => {
  const { courseId, isActive, sortBy, sortOrder, page, limit } = req.query;

  const { data, meta } = await PracticeService.getAllPractices({
    courseId: courseId as string,
    isActive: isActive !== undefined ? isActive === 'true' : undefined,
    sortBy: sortBy as string,
    sortOrder: sortOrder as 'asc' | 'desc',
    page: page ? parseInt(page as string) : undefined,
    limit: limit ? parseInt(limit as string) : undefined,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Practices fetched successfully',
    data: data,
    meta,
  });
});



const getUserPractices = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const practices = await PracticeService.getUserEnrolledCoursePractices(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User practices fetched successfully',
    data: practices,
  });
});



/* =====================
   GET SINGLE PRACTICE BY ID
===================== */
const getSinglePractice = catchAsync(async (req: Request, res: Response) => {
  const result = await PracticeService.getPracticeById(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Practice fetched successfully',
    data: result,
  });
});

/* =====================
   UPDATE PRACTICE
===================== */
const updatePractice = catchAsync(async (req: Request, res: Response) => {
  const file = req.file?.path;
  if (file) {
    req.body.thumbnail = file;
  }

  const result = await PracticeService.updatePractice(req.params.id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Practice updated successfully',
    data: result,
  });
});

/* =====================
   DELETE PRACTICE
===================== */
const deletePractice = catchAsync(async (req: Request, res: Response) => {
  await PracticeService.deletePractice(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Practice deleted successfully',
    data: null,
  });
});

/* =====================
   ADD ITEM TO PRACTICE
===================== */
const addItemToPractice = catchAsync(async (req: Request, res: Response) => {
  // Extract files from multer
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
console.log(files,'files ');
console.log(req.body,'body ');

  // Check for audio file
  if (files?.audio && files.audio[0]?.path) {
    req.body.audioUrl = files.audio[0].path;
  }

  // Check for image file
  if (files?.image && files.image[0]?.path) {
    req.body.imageUrl = files.image[0].path;
  }

  const { practiceId, content, pronunciation, audioUrl, imageUrl } = req.body;

  const result = await PracticeService.addItemToPractice(practiceId, {
    content,
    pronunciation,
    audioUrl: req.body.audioUrl || audioUrl,
    imageUrl: req.body.imageUrl || imageUrl,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Item added to practice successfully',
    data: result,
  });
});

/* =====================
   UPDATE PRACTICE ITEM
===================== */
const updatePracticeItem = catchAsync(async (req: Request, res: Response) => {
  const { practiceId, itemId } = req.params;

  // Extract files from multer
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // Check for audio file
  if (files?.audio && files.audio[0]?.path) {
    req.body.audioUrl = files.audio[0].path;
  }

  // Check for image file
  if (files?.image && files.image[0]?.path) {
    req.body.imageUrl = files.image[0].path;
  }

  const { content, pronunciation, audioUrl, imageUrl } = req.body;

  const result = await PracticeService.updatePracticeItem(practiceId, itemId, {
    content,
    pronunciation,
    audioUrl,
    imageUrl,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Practice item updated successfully',
    data: result,
  });
});

/* =====================
   DELETE PRACTICE ITEM
===================== */
const deletePracticeItem = catchAsync(async (req: Request, res: Response) => {
  const { practiceId, itemId } = req.params;

  await PracticeService.deleteItemFromPractice(practiceId, itemId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Practice item deleted successfully',
    data: null,
  });
});

const getPracticeByIdForUser = catchAsync(async (req: Request, res: Response) => {
  const { slug } = req.params;

 const result = await PracticeService.getPracticeByIdForUser(slug);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Practice item fetched successfully',
    data: result,
  });
});

/* =====================
   REORDER PRACTICE ITEMS
===================== */
const reorderPracticeItems = catchAsync(async (req: Request, res: Response) => {
  const { practiceId } = req.params;
  const { itemOrders } = req.body; // Expected: [{ itemId: string, order: number }]

  await PracticeService.reorderPracticeItems(practiceId, itemOrders);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Practice items reordered successfully',
    data: null,
  });
});

export const PracticeController = {
  createPractice,
  getAllPractices,
  getSinglePractice,
  updatePractice,
  deletePractice,
  getUserPractices,
  // Item management
  addItemToPractice,
  updatePracticeItem,
  deletePracticeItem,
  reorderPracticeItems,
  getPracticeByIdForUser
};