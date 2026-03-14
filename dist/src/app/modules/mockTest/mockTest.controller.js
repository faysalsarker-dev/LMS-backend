"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMocktestForUser = exports.deleteMockTest = exports.updateMockTest = exports.getMockTestBySlug = exports.getMockTestById = exports.getAllMockTests = exports.createMockTest = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const MockTestService = __importStar(require("./mockTest.service"));
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = require("../../errors/ApiError");
exports.createMockTest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = {
        ...req.body,
        thumbnail: req?.file?.path || req.body.thumbnail,
    };
    const result = await MockTestService.createMockTest(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "MockTest created successfully",
        data: result,
    });
});
exports.getAllMockTests = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await MockTestService.getAllMockTests(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "MockTests retrieved successfully",
        data: result,
    });
});
exports.getMockTestById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await MockTestService.getMockTestById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "MockTest retrieved successfully",
        data: result,
    });
});
exports.getMockTestBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await MockTestService.getMockTestBySlug(req.params.slug);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "MockTest retrieved successfully",
        data: result,
    });
});
exports.updateMockTest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const payload = {
        ...req.body,
        ...(req?.file?.path && { thumbnail: req.file.path }),
    };
    const result = await MockTestService.updateMockTest(req.params.id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "MockTest updated successfully",
        data: result,
    });
});
exports.deleteMockTest = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await MockTestService.deleteMockTest(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "MockTest deleted successfully",
        data: result,
    });
});
exports.getMocktestForUser = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    console.log(userId, 'request');
    if (!userId) {
        throw new ApiError_1.ApiError(http_status_1.default.UNAUTHORIZED, "User not found in request");
    }
    const result = await MockTestService.getMocktestForUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User MockTests retrieved successfully",
        data: result,
    });
});
