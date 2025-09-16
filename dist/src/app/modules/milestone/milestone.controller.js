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
exports.deleteMilestone = exports.updateMilestone = exports.getMilestone = exports.getAllMilestones = exports.createMilestone = void 0;
const milestoneService = __importStar(require("./milestone.service"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
// Create milestone
exports.createMilestone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const milestone = await milestoneService.createMilestone(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Milestone created successfully",
        data: milestone,
    });
});
// Get all milestones
exports.getAllMilestones = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId } = req.query;
    const milestones = await milestoneService.getAllMilestones(courseId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Milestones retrieved successfully",
        data: milestones,
    });
});
// Get single milestone
exports.getMilestone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const milestone = await milestoneService.getMilestoneById(req.params.id);
    if (!milestone)
        throw new Error("Milestone not found");
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Milestone retrieved successfully",
        data: milestone,
    });
});
// Update milestone
exports.updateMilestone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const milestone = await milestoneService.updateMilestone(req.params.id, req.body);
    if (!milestone)
        throw new Error("Milestone not found");
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Milestone updated successfully",
        data: milestone,
    });
});
// Delete milestone
exports.deleteMilestone = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const milestone = await milestoneService.deleteMilestone(req.params.id);
    if (!milestone)
        throw new Error("Milestone not found");
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Milestone deleted successfully",
        data: milestone,
    });
});
