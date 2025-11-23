import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { PromoService } from "./promo.service";
import { catchAsync } from "../../utils/catchAsync";

// -------------------------- CREATE --------------------------
export const createPromo = catchAsync(
  async (req: Request, res: Response) => {

    const result = await PromoService.createPromo(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Promo code created successfully",
      data: result,
    });
  }
);

// -------------------------- GET MY PROMO --------------------------
export const getMyPromo = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  const result = await PromoService.getMyPromo(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User promo fetched",
    data: result,
  });
});

// -------------------------- MY PROMO USAGE STATS (chart) --------------------------
export const getMyPromoUsageStats = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return sendResponse(res, {
        statusCode: 401,
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const result = await PromoService.getMyPromoUsageStats(userId);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Promo usage stats fetched",
      data: result,
    });
  }
);

// -------------------------- UPDATE --------------------------
export const updatePromo = catchAsync(async (req: Request, res: Response) => {
  const promoId = req.params.id;
  const result = await PromoService.updatePromo(promoId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promo updated successfully",
    data: result,
  });
});

// -------------------------- DELETE (soft) --------------------------
export const deletePromo = catchAsync(async (req: Request, res: Response) => {
  const promoId = req.params.id;
  const result = await PromoService.deletePromo(promoId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promo deleted (soft)",
    data: result,
  });
});

// -------------------------- ADMIN: GET ALL (pagination + filter + sort) --------------------------
export const getAllPromosAdmin = catchAsync(
  async (req: Request, res: Response) => {
    // optional: you can validate admin role here if not done in middleware
    const {data , meta} = await PromoService.getAllPromosAdmin(req.query);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Promos fetched (admin)",
      data: data,
      meta:meta
    });
  }
);

// -------------------------- ADMIN: GET SINGLE --------------------------
export const getPromoById = catchAsync(async (req: Request, res: Response) => {
  const promoId = req.params.id;
  const result = await PromoService.getPromoById(promoId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promo fetched",
    data: result,
  });
});


export const getAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await PromoService.getPromoStatistics();
// const meta = await PromoService.getPromoMonthlyChart(req.query)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promo Analytics fetched",
    data: result,
    meta:null
  });
});


export const checkPromo = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
    const { code, orderAmount } = req.body;

 


   
  const result = await PromoService.validatePromoService({
      code,
      userId,
      orderAmount,
    });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promo Checked successfully",
    data: result,
    
  });
});


export const redeemPromo = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { code, orderAmount } = req.body;
 


   
  const result = await PromoService.validatePromoService({
      code,
      userId,
      orderAmount,
    });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Promo applied successfully",
    data: result,
    
  });
});

