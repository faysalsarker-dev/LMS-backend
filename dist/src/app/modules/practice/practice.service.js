"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeService = void 0;
const ApiError_1 = require("../../errors/ApiError");
const practice_model_1 = __importDefault(require("./practice.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createPractice = async (payload) => {
    return practice_model_1.default.create(payload);
};
const getAllPractices = async (options = {}) => {
    const { courseId, isActive, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10, } = options;
    const filters = {};
    if (courseId)
        filters.course = courseId;
    if (typeof isActive === 'boolean')
        filters.isActive = isActive;
    const sort = {
        [sortBy]: sortOrder === 'asc' ? 1 : -1,
    };
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        practice_model_1.default.find()
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .populate('course', 'title'),
        practice_model_1.default.countDocuments(filters),
    ]);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data,
    };
};
const getPracticeById = async (id) => {
    const practice = await practice_model_1.default.findById(id).populate('course');
    if (!practice) {
        throw new ApiError_1.ApiError(404, 'Practice not found');
    }
    return practice;
};
const updatePractice = async (id, payload) => {
    const updated = await practice_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!updated)
        throw new ApiError_1.ApiError(404, 'Practice not found');
    return updated;
};
const deletePractice = async (id) => {
    const deleted = await practice_model_1.default.findByIdAndDelete(id);
    if (!deleted)
        throw new ApiError_1.ApiError(404, 'Practice not found');
};
// ============== NEW: Item Management Methods ==============
const addItemToPractice = async (practiceId, itemData) => {
    // Validate practiceId
    if (!mongoose_1.default.Types.ObjectId.isValid(practiceId)) {
        throw new ApiError_1.ApiError(400, 'Invalid practice ID');
    }
    // Find the practice
    const practice = await practice_model_1.default.findById(practiceId);
    if (!practice) {
        throw new ApiError_1.ApiError(404, 'Practice not found');
    }
    // Calculate the order for the new item (last position)
    const order = practice.items.length > 0
        ? Math.max(...practice.items.map(item => item.order || 0)) + 1
        : 1;
    // Create the new item
    const newItem = {
        content: itemData.content,
        pronunciation: itemData.pronunciation,
        audioUrl: itemData.audioUrl,
        imageUrl: itemData.imageUrl,
        order: order
    };
    // Push the new item to the practice
    practice.items.push(newItem);
    // Save the practice
    await practice.save();
    // Return the newly added item (last item in array)
    return practice.items[practice.items.length - 1];
};
const updatePracticeItem = async (practiceId, itemId, updateData) => {
    // Validate IDs
    if (!mongoose_1.default.Types.ObjectId.isValid(practiceId)) {
        throw new ApiError_1.ApiError(400, 'Invalid practice ID');
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(itemId)) {
        throw new ApiError_1.ApiError(400, 'Invalid item ID');
    }
    // Find the practice
    const practice = await practice_model_1.default.findById(practiceId);
    if (!practice) {
        throw new ApiError_1.ApiError(404, 'Practice not found');
    }
    // Find the item index
    const itemIndex = practice.items.findIndex(item => item._id?.toString() === itemId);
    if (itemIndex === -1) {
        throw new ApiError_1.ApiError(404, 'Item not found in practice');
    }
    // Update the item fields
    if (updateData.content !== undefined) {
        practice.items[itemIndex].content = updateData.content;
    }
    if (updateData.pronunciation !== undefined) {
        practice.items[itemIndex].pronunciation = updateData.pronunciation;
    }
    if (updateData.audioUrl !== undefined) {
        practice.items[itemIndex].audioUrl = updateData.audioUrl;
    }
    if (updateData.imageUrl !== undefined) {
        practice.items[itemIndex].imageUrl = updateData.imageUrl;
    }
    if (updateData.order !== undefined) {
        practice.items[itemIndex].order = updateData.order;
    }
    // Save the practice
    await practice.save();
    return practice.items[itemIndex];
};
const deleteItemFromPractice = async (practiceId, itemId) => {
    // Validate IDs
    if (!mongoose_1.default.Types.ObjectId.isValid(practiceId)) {
        throw new ApiError_1.ApiError(400, 'Invalid practice ID');
    }
    if (!mongoose_1.default.Types.ObjectId.isValid(itemId)) {
        throw new ApiError_1.ApiError(400, 'Invalid item ID');
    }
    // Find and update the practice
    const result = await practice_model_1.default.findByIdAndUpdate(practiceId, { $pull: { items: { _id: itemId } } }, { new: true });
    if (!result) {
        throw new ApiError_1.ApiError(404, 'Practice not found');
    }
};
const reorderPracticeItems = async (practiceId, itemOrders) => {
    // Validate practiceId
    if (!mongoose_1.default.Types.ObjectId.isValid(practiceId)) {
        throw new ApiError_1.ApiError(400, 'Invalid practice ID');
    }
    // Find the practice
    const practice = await practice_model_1.default.findById(practiceId);
    if (!practice) {
        throw new ApiError_1.ApiError(404, 'Practice not found');
    }
    // Update the order of each item
    itemOrders.forEach(({ itemId, order }) => {
        const itemIndex = practice.items.findIndex(item => item._id?.toString() === itemId);
        if (itemIndex !== -1) {
            practice.items[itemIndex].order = order;
        }
    });
    // Save the practice
    await practice.save();
};
exports.PracticeService = {
    createPractice,
    getAllPractices,
    getPracticeById,
    updatePractice,
    deletePractice,
    addItemToPractice,
    updatePracticeItem,
    deleteItemFromPractice,
    reorderPracticeItems,
};
