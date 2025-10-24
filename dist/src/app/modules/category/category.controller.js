"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("./category.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
exports.CategoryController = {
    create: (0, catchAsync_1.catchAsync)(async (req, res) => {
        if (req.file) {
            req.body.thumbnail = req.file?.path;
        }
        const category = await category_service_1.CategoryService.createCategory(req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Category created successfully",
            data: category,
        });
    }),
    getAll: (0, catchAsync_1.catchAsync)(async (_req, res) => {
        const categories = await category_service_1.CategoryService.getAllCategories();
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Categories retrieved successfully",
            data: categories,
        });
    }),
    getById: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const category = await category_service_1.CategoryService.getCategoryById(req.params.id);
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: 200,
            message: "Category retrieved successfully",
            data: category,
        });
    }),
    update: (0, catchAsync_1.catchAsync)(async (req, res) => {
        if (req.file) {
            req.body.thumbnail = req.file?.path;
        }
        const updated = await category_service_1.CategoryService.updateCategory(req.params.id, req.body);
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Category updated successfully",
            data: updated,
        });
    }),
    delete: (0, catchAsync_1.catchAsync)(async (req, res) => {
        const deleted = await category_service_1.CategoryService.deleteCategory(req.params.id);
        (0, sendResponse_1.default)(res, {
            statusCode: 201,
            success: true,
            message: "Category deleted successfully",
            data: deleted,
        });
    }),
};
