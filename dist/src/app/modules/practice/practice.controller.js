"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const practice_service_1 = __importDefault(require("./practice.service"));
class PracticeController {
    constructor() {
        // Create practice
        this.createPractice = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            const practice = await practice_service_1.default.createPractice(req.body);
            (0, sendResponse_1.default)(res, {
                statusCode: 201,
                success: true,
                message: 'Practice created successfully',
                data: practice
            });
        });
        // Get all practices
        this.getAllPractices = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            const result = await practice_service_1.default.getAllPractices(req.query);
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: 'Practices retrieved successfully',
                data: result.practices,
                meta: result.meta
            });
        });
        // Get single practice
        this.getPractice = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            const practice = await practice_service_1.default.getPracticeById(req.params.id);
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: 'Practice retrieved successfully',
                data: practice
            });
        });
        // Update practice
        this.updatePractice = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            const practice = await practice_service_1.default.updatePractice(req.params.id, req.body);
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: 'Practice updated successfully',
                data: practice
            });
        });
        // Delete practice
        this.deletePractice = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            await practice_service_1.default.deletePractice(req.params.id);
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: 'Practice deleted successfully',
                data: null
            });
        });
        // Add items to practice
        this.addItems = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            const practice = await practice_service_1.default.addItemsToPractice(req.params.id, req.body.items);
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: 'Items added successfully',
                data: practice
            });
        });
        // Remove item from practice
        this.removeItem = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            const practice = await practice_service_1.default.removeItemFromPractice(req.params.id, Number(req.params.itemIndex));
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: 'Item removed successfully',
                data: practice
            });
        });
        // Update practice item
        this.updateItem = (0, catchAsync_1.catchAsync)(async (req, res, next) => {
            const practice = await practice_service_1.default.updatePracticeItem(req.params.id, Number(req.params.itemIndex), req.body);
            (0, sendResponse_1.default)(res, {
                statusCode: 200,
                success: true,
                message: 'Item updated successfully',
                data: practice
            });
        });
    }
}
exports.default = new PracticeController();
