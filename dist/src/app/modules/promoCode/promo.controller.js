"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPromoById = exports.getAllPromosAdmin = exports.deletePromo = exports.updatePromo = exports.getMyPromoUsageStats = exports.getMyPromo = exports.createPromo = void 0;
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const promo_service_1 = require("./promo.service");
const catchAsync_1 = require("../../utils/catchAsync");
// -------------------------- CREATE --------------------------
exports.createPromo = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            message: "Unauthorized",
            data: null,
        });
    }
    const result = await promo_service_1.PromoService.createPromo(userId, req.body);
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
    const result = await promo_service_1.PromoService.getAllPromosAdmin(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Promos fetched (admin)",
        data: result,
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
