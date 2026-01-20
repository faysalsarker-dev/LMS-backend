import { Request, Response } from "express";
import OverviewService from "./overview.service";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

class AdminDashboardController {
  /**
   * GET /api/admin/dashboard
   * Returns complete dashboard overview with all stats
   */
  getDashboard = catchAsync(async (req: Request, res: Response) => {
    const overview = await OverviewService.getDashboardOverview();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Dashboard overview fetched successfully",
      data: overview.data,
    });
  });
}




export default new AdminDashboardController();