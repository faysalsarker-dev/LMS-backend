"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redeemPromo = exports.checkPromo = exports.getAnalytics = exports.getPromoById = exports.getAllPromosAdmin = exports.deletePromo = exports.updatePromo = exports.getMyPromoUsageStats = exports.getMyPromo = exports.createPromo = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const promo_service_1 = require("./promo.service");
const catchAsync_1 = require("../../utils/catchAsync");
// -------------------------- CREATE --------------------------
exports.createPromo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await promo_service_1.PromoService.createPromo(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Promo code created successfully",
        data: result,
    });
});
// -------------------------- GET MY PROMO --------------------------
exports.getMyPromo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized",
            data: null,
        });
    }
    const result = await promo_service_1.PromoService.getMyPromo(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User promo fetched",
        data: result,
    });
});
// -------------------------- MY PROMO USAGE STATS (chart) --------------------------
exports.getMyPromoUsageStats = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized",
            data: null,
        });
    }
    const result = await promo_service_1.PromoService.getMyPromoUsageStats(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Promo usage stats fetched",
        data: result,
    });
});
// -------------------------- UPDATE --------------------------
exports.updatePromo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const promoId = req.params.id;
    const result = await promo_service_1.PromoService.updatePromo(promoId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Promo updated successfully",
        data: result,
    });
});
// -------------------------- DELETE (soft) --------------------------
exports.deletePromo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const promoId = req.params.id;
    const result = await promo_service_1.PromoService.deletePromo(promoId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Promo deleted (soft)",
        data: result,
    });
});
// -------------------------- ADMIN: GET ALL (pagination + filter + sort) --------------------------
exports.getAllPromosAdmin = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // optional: you can validate admin role here if not done in middleware
    const { data, meta } = await promo_service_1.PromoService.getAllPromosAdmin(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Promos fetched (admin)",
        data: data,
        meta: meta
    });
});
// -------------------------- ADMIN: GET SINGLE --------------------------
exports.getPromoById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const promoId = req.params.id;
    const result = await promo_service_1.PromoService.getPromoById(promoId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Promo fetched",
        data: result,
    });
});
exports.getAnalytics = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await promo_service_1.PromoService.getPromoStatistics();
    // const meta = await PromoService.getPromoMonthlyChart(req.query)
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Promo Analytics fetched",
        data: result,
        meta: null
    });
});
exports.checkPromo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const { code, orderAmount } = req.body;
    const result = await promo_service_1.PromoService.validatePromoService({
        code,
        userId,
        orderAmount,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Promo Checked successfully",
        data: result,
    });
});
exports.redeemPromo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const { code, orderAmount } = req.body;
    console.log(code, orderAmount, 'redeem controller');
    const result = await promo_service_1.PromoService.redeemPromoService({
        code,
        userId,
        orderAmount,
    });
    console.log(result, 'redeem');
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Promo applied successfully",
        data: result,
    });
});
