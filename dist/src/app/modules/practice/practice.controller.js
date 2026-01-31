"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeController = void 0;
const practice_service_1 = require("./practice.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
/* =====================
   CREATE PRACTICE
===================== */
const createPractice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file?.path;
    if (file) {
        req.body.thumbnail = file;
    }
    const result = await practice_service_1.PracticeService.createPractice(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Practice created successfully',
        data: result,
    });
});
/* =====================
   GET ALL PRACTICES (FILTER + SORT)
===================== */
const getAllPractices = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { courseId, isActive, sortBy, sortOrder, page, limit } = req.query;
    const { data, meta } = await practice_service_1.PracticeService.getAllPractices({
        courseId: courseId,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Practices fetched successfully',
        data: data,
        meta,
    });
});
/* =====================
   GET SINGLE PRACTICE BY ID
===================== */
const getSinglePractice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const result = await practice_service_1.PracticeService.getPracticeById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Practice fetched successfully',
        data: result,
    });
});
/* =====================
   UPDATE PRACTICE
===================== */
const updatePractice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const file = req.file?.path;
    if (file) {
        req.body.thumbnail = file;
    }
    const result = await practice_service_1.PracticeService.updatePractice(req.params.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Practice updated successfully',
        data: result,
    });
});
/* =====================
   DELETE PRACTICE
===================== */
const deletePractice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await practice_service_1.PracticeService.deletePractice(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Practice deleted successfully',
        data: null,
    });
});
/* =====================
   ADD ITEM TO PRACTICE
===================== */
const addItemToPractice = (0, catchAsync_1.catchAsync)(async (req, res) => {
    // Extract files from multer
    const files = req.files;
    console.log(files, 'files ');
    console.log(req.body, 'body ');
    // Check for audio file
    if (files?.audio && files.audio[0]?.path) {
        req.body.audioUrl = files.audio[0].path;
    }
    // Check for image file
    if (files?.image && files.image[0]?.path) {
        req.body.imageUrl = files.image[0].path;
    }
    const { practiceId, content, pronunciation, audioUrl, imageUrl } = req.body;
    const result = await practice_service_1.PracticeService.addItemToPractice(practiceId, {
        content,
        pronunciation,
        audioUrl: req.body.audioUrl || audioUrl,
        imageUrl: req.body.imageUrl || imageUrl,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: 'Item added to practice successfully',
        data: result,
    });
});
/* =====================
   UPDATE PRACTICE ITEM
===================== */
const updatePracticeItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { practiceId, itemId } = req.params;
    // Extract files from multer
    const files = req.files;
    // Check for audio file
    if (files?.audio && files.audio[0]?.path) {
        req.body.audioUrl = files.audio[0].path;
    }
    // Check for image file
    if (files?.image && files.image[0]?.path) {
        req.body.imageUrl = files.image[0].path;
    }
    const { content, pronunciation, audioUrl, imageUrl } = req.body;
    const result = await practice_service_1.PracticeService.updatePracticeItem(practiceId, itemId, {
        content,
        pronunciation,
        audioUrl,
        imageUrl,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Practice item updated successfully',
        data: result,
    });
});
/* =====================
   DELETE PRACTICE ITEM
===================== */
const deletePracticeItem = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { practiceId, itemId } = req.params;
    await practice_service_1.PracticeService.deleteItemFromPractice(practiceId, itemId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Practice item deleted successfully',
        data: null,
    });
});
/* =====================
   REORDER PRACTICE ITEMS
===================== */
const reorderPracticeItems = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { practiceId } = req.params;
    const { itemOrders } = req.body; // Expected: [{ itemId: string, order: number }]
    await practice_service_1.PracticeService.reorderPracticeItems(practiceId, itemOrders);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'Practice items reordered successfully',
        data: null,
    });
});
exports.PracticeController = {
    createPractice,
    getAllPractices,
    getSinglePractice,
    updatePractice,
    deletePractice,
    // Item management
    addItemToPractice,
    updatePracticeItem,
    deletePracticeItem,
    reorderPracticeItems,
};
