import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { Request, Response } from "express";
import { ApiError } from "../../errors/ApiError";
import { createEnrollment, deleteEnrollment, getAllEnrollments, getEnrollmentById, getMonthlyEarnings, getTotalEarnings, handleCancelledPayment, handleFailedPayment, handleSuccessPayment, updateEnrollment } from "./enrollment.service";
import config from "../../config/config";

export const createEnrollmentController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user._id;
    if (!userId) {
      throw new ApiError(401, "User not found");
    }

    const payload = {
      user: userId,
      course: req.body.course,
      originalPrice: req.body.originalPrice,
      discountAmount: req.body.discountAmount || 0,
      finalAmount: req.body.finalAmount,
      promoCode: req.body.promoCode,
    };

    const result = await createEnrollment(payload);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Enrollment created successfully",
      data: result,
    });
  }
);

export const getAllEnrollmentsController = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      paymentStatus: req.query.paymentStatus as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
    };

    const result = await getAllEnrollments(filters);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Enrollments fetched successfully",
      data: result,
    });
  }
);

export const getEnrollmentByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getEnrollmentById(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Enrollment fetched successfully",
      data: result,
    });
  }
);

export const updateEnrollmentController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await updateEnrollment(req.params.id, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Enrollment updated successfully",
      data: result,
    });
  }
);

export const deleteEnrollmentController = catchAsync(
  async (req: Request, res: Response) => {
    await deleteEnrollment(req.params.id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Enrollment deleted successfully",
      data: null,
    });
  }
);

// Analytics controllers
export const getTotalEarningsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await getTotalEarnings();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Total earnings fetched successfully",
      data: result,
    });
  }
);

export const getMonthlyEarningsController = catchAsync(
  async (req: Request, res: Response) => {
    const year = parseInt(req.params.year) || new Date().getFullYear();
    const result = await getMonthlyEarnings(year);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Monthly earnings fetched successfully",
      data: result,
    });
  }
);



export const paymentSSlSuccessController = catchAsync(
  async (req: Request, res: Response) => {
const result = await handleSuccessPayment(req.query);

res.redirect(`${config.ssl.sslSuccessFrontendUrl}?transactionId=${result.transactionId}&amount=${result.amount}&currency=${result.currency}`);

  }
);

export const paymentSSlCancelController = catchAsync(
  async (req: Request, res: Response) => {
   const result = await handleCancelledPayment(req.query);

res.redirect(`${config.ssl.sslCancelFrontendUrl}?transactionId=${result.transactionId}&amount=${result.amount}&currency=${result.currency}`);

  }
);
export const paymentSSlFailedController = catchAsync(
  async (req: Request, res: Response) => {
   const result = await handleFailedPayment(req.query);

res.redirect(`${config.ssl.sslFailedFrontendUrl}?transactionId=${result.transactionId}&amount=${result.amount}&currency=${result.currency}`);

  }
);