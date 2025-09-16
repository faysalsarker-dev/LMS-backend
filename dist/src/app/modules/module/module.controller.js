"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const module_service_1 = require("./module.service");
const createModule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await module_service_1.ModuleService.createModule(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Module created successfully",
        data: result,
    });
});
const getAllModules = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await module_service_1.ModuleService.getAllModules();
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Modules fetched successfully",
        data: result,
    });
});
const getModuleById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await module_service_1.ModuleService.getModuleById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Module fetched successfully",
        data: result,
    });
});
const updateModule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await module_service_1.ModuleService.updateModule(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Module updated successfully",
        data: result,
    });
});
const deleteModule = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await module_service_1.ModuleService.deleteModule(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Module deleted successfully",
        data: result,
    });
});
exports.ModuleController = {
    createModule,
    getAllModules,
    getModuleById,
    updateModule,
    deleteModule,
};
