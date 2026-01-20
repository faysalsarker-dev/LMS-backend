"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overview_service_1 = __importDefault(require("./overview.service"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = require("../../utils/catchAsync");
class AdminDashboardController {
    constructor() {
        /**
         * GET /api/admin/dashboard
         * Returns complete dashboard overview with all stats
         */
        this.getDashboard = (0, catchAsync_1.catchAsync)(async (req, res) => {
            const overview = await overview_service_1.default.getDashboardOverview();
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: "Dashboard overview fetched successfully",
                data: overview.data,
            });
        });
    }
}
exports.default = new AdminDashboardController();
