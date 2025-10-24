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
exports.deleteEnrollment = exports.updateEnrollment = exports.getEnrollmentById = exports.getAllEnrollments = exports.createEnrollment = void 0;
const http_status_1 = __importDefault(require("http-status"));
const EnrollmentService = __importStar(require("./enrollment.service"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const ApiError_1 = require("../../errors/ApiError");
exports.createEnrollment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const userId = req.user._id;
    if (!userId) {
        throw new ApiError_1.ApiError(401, 'user not found');
    }
    const payload = {
        ...req.body,
        user: userId
    };
    const result = await EnrollmentService.createEnrollment(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Enrollment created successfully",
        data: result,
    });
});
exports.getAllEnrollments = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await EnrollmentService.getAllEnrollments();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Enrollments fetched successfully",
        data: result,
    });
});
exports.getEnrollmentById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await EnrollmentService.getEnrollmentById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Enrollment fetched successfully",
        data: result,
    });
});
exports.updateEnrollment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await EnrollmentService.updateEnrollment(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Enrollment updated successfully",
        data: result,
    });
});
exports.deleteEnrollment = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await EnrollmentService.deleteEnrollment(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Enrollment deleted successfully",
        data: result,
    });
});
