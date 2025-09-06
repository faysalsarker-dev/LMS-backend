import httpStatus from "http-status";

import * as QuizService from "./quiz.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";

export const createQuiz = catchAsync(async (req:Request, res:Response) => {
  const result = await QuizService.createQuiz(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Quiz created successfully",
    data: result,
  });
});

export const getAllQuizzes = catchAsync(async (req:Request, res:Response) => {
  const result = await QuizService.getAllQuizzes();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quizzes retrieved successfully",
    data: result,
  });
});

export const getQuizById = catchAsync(async (req:Request, res:Response) => {
  const result = await QuizService.getQuizById(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz retrieved successfully",
    data: result,
  });
});

export const updateQuiz = catchAsync(async (req:Request, res:Response) => {
  const result = await QuizService.updateQuiz(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz updated successfully",
    data: result,
  });
});

export const deleteQuiz = catchAsync(async (req:Request, res:Response) => {
  const result = await QuizService.deleteQuiz(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Quiz deleted successfully",
    data: result,
  });
});
