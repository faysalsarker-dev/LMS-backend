import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AssignmentSubmissionService } from "./agt.service";
import sendResponse from "../../utils/sendResponse";
import  StatusCodes  from "http-status";

export const AssignmentSubmissionController = {

  createSubmission: catchAsync(async (req: Request, res: Response) => {

const file = req.file;
if (file) {
  req.body.fileUrl = file.path; 
}

    const data = { ...req.body, student: req.user._id };
    const submission = await AssignmentSubmissionService.createSubmission(data);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Submission created successfully",
      data: submission,
    });
  }),

  // ---------------------------
  // Get single submission
  // ---------------------------
  getSubmission: catchAsync(async (req: Request, res: Response) => {
    const submission = await AssignmentSubmissionService.getSubmissionById(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Submission retrieved successfully",
      data: submission,
    });
  }),

  // ---------------------------
  // Get all submissions
  // ---------------------------

getAllSubmissions: catchAsync(async (req: Request, res: Response) => {
  const result = await AssignmentSubmissionService.getAllSubmissions(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Submissions retrieved successfully",
    data: result.submissions,
    meta: result.pagination,
  });
}),

getStudentAssignmentByLesson: catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user._id;
  const result = await AssignmentSubmissionService.getStudentAssignmentByLesson(studentId, req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Submissions retrieved successfully",
    data: result,
  
  });
}),




  // ---------------------------
  // Update submission
  // ---------------------------
  updateSubmission: catchAsync(async (req: Request, res: Response) => {
    const updated = await AssignmentSubmissionService.updateSubmission(req.params.id, req.body);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Submission updated successfully",
      data: updated,
    });
  }),

  // ---------------------------
  // Delete submission
  // ---------------------------
  deleteSubmission: catchAsync(async (req: Request, res: Response) => {
    const deleted = await AssignmentSubmissionService.deleteSubmission(req.params.id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Submission deleted successfully",
      data: deleted,
    });
  }),

  // ---------------------------
  // Admin review (marks & feedback)
  // ---------------------------
  adminReview: catchAsync(async (req: Request, res: Response) => {
    const { marks, feedback, status } = req.body;
    const submission = await AssignmentSubmissionService.reviewSubmission(
      req.params.id,
      marks,
      feedback,
      status
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Submission reviewed successfully",
      data: submission,
    });
  }),
};
