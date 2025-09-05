import { Request, Response } from "express";
import * as milestoneService from "./milestone.service";
import { IMilestone } from "./milestone.interface";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Create milestone
export const createMilestone = catchAsync(async (req: Request, res: Response) => {
  const milestone: IMilestone = await milestoneService.createMilestone(req.body);
  sendResponse<IMilestone>(res, {
    statusCode: 201,
    success: true,
    message: "Milestone created successfully",
    data: milestone,
  });
});

// Get all milestones
export const getAllMilestones = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.query;
  const milestones: IMilestone[] = await milestoneService.getAllMilestones(courseId as string);
  sendResponse<IMilestone[]>(res, {
    statusCode: 200,
    success: true,
    message: "Milestones retrieved successfully",
    data: milestones,
  });
});

// Get single milestone
export const getMilestone = catchAsync(async (req: Request, res: Response) => {
  const milestone: IMilestone | null = await milestoneService.getMilestoneById(req.params.id);
  if (!milestone) throw new Error("Milestone not found");
  sendResponse<IMilestone>(res, {
    statusCode: 200,
    success: true,
    message: "Milestone retrieved successfully",
    data: milestone,
  });
});

// Update milestone
export const updateMilestone = catchAsync(async (req: Request, res: Response) => {
  const milestone: IMilestone | null = await milestoneService.updateMilestone(req.params.id, req.body);
  if (!milestone) throw new Error("Milestone not found");
  sendResponse<IMilestone>(res, {
    statusCode: 200,
    success: true,
    message: "Milestone updated successfully",
    data: milestone,
  });
});

// Delete milestone
export const deleteMilestone = catchAsync(async (req: Request, res: Response) => {
  const milestone: IMilestone | null = await milestoneService.deleteMilestone(req.params.id);
  if (!milestone) throw new Error("Milestone not found");
  sendResponse<IMilestone>(res, {
    statusCode: 200,
    success: true,
    message: "Milestone deleted successfully",
    data: milestone,
  });
});
