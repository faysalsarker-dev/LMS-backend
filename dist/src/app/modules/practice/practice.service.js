"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const practice_model_1 = __importDefault(require("./practice.model"));
const mongoose_1 = require("mongoose");
const ApiError_1 = require("../../errors/ApiError");
class PracticeService {
    // Create new practice
    async createPractice(data) {
        const practice = await practice_model_1.default.create(data);
        return practice;
    }
    // Get all practices with filters and pagination
    async getAllPractices(query) {
        const { page = 1, limit = 10, course, isActive, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const filter = {};
        if (course && course !== 'all')
            filter.course = new mongoose_1.Types.ObjectId(course);
        if (isActive !== undefined)
            filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } }
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
        const practices = await practice_model_1.default.find(filter)
            .populate('course', 'name')
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
            .lean();
        const total = await practice_model_1.default.countDocuments(filter);
        return {
            practices,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / Number(limit))
            }
        };
    }
    // Get single practice by ID or slug
    async getPracticeById(identifier) {
        const isObjectId = mongoose_1.Types.ObjectId.isValid(identifier);
        const practice = await practice_model_1.default.findOne(isObjectId ? { _id: identifier } : { slug: identifier })
            .populate('course', 'name');
        if (!practice) {
            throw new ApiError_1.ApiError(404, 'Practice not found');
        }
        return practice;
    }
    // Update practice
    async updatePractice(id, data) {
        const practice = await practice_model_1.default.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
            .populate('course', 'name');
        if (!practice) {
            throw new ApiError_1.ApiError(404, 'Practice not found');
        }
        return practice;
    }
    // Delete practice
    async deletePractice(id) {
        const practice = await practice_model_1.default.findById(id);
        if (!practice) {
            throw new ApiError_1.ApiError(404, 'Practice not found');
        }
        // Check if practice is being used in any courses
        if (practice.usageCount > 0) {
            throw new ApiError_1.ApiError(400, `Cannot delete practice. It is currently used in ${practice.usageCount} course(s)`);
        }
        await practice_model_1.default.findByIdAndDelete(id);
    }
    // Add items to practice
    async addItemsToPractice(id, items) {
        const practice = await practice_model_1.default.findById(id);
        if (!practice) {
            throw new ApiError_1.ApiError(404, 'Practice not found');
        }
        practice.items.push(...items);
        await practice.save();
        return practice;
    }
    // Remove item from practice
    async removeItemFromPractice(practiceId, itemIndex) {
        const practice = await practice_model_1.default.findById(practiceId);
        if (!practice) {
            throw new ApiError_1.ApiError(404, 'Practice not found');
        }
        if (itemIndex < 0 || itemIndex >= practice.items.length) {
            throw new ApiError_1.ApiError(400, 'Invalid item index');
        }
        practice.items.splice(itemIndex, 1);
        await practice.save();
        return practice;
    }
    // Update practice item
    async updatePracticeItem(practiceId, itemIndex, itemData) {
        const practice = await practice_model_1.default.findById(practiceId);
        if (!practice) {
            throw new ApiError_1.ApiError(404, 'Practice not found');
        }
        if (itemIndex < 0 || itemIndex >= practice.items.length) {
            throw new ApiError_1.ApiError(400, 'Invalid item index');
        }
        practice.items[itemIndex] = { ...practice.items[itemIndex], ...itemData };
        await practice.save();
        return practice;
    }
    // Increment usage count (called when practice is added to a course)
    async incrementUsageCount(id) {
        await practice_model_1.default.findByIdAndUpdate(id, { $inc: { usageCount: 1 } });
    }
    // Decrement usage count (called when practice is removed from a course)
    async decrementUsageCount(id) {
        await practice_model_1.default.findByIdAndUpdate(id, { $inc: { usageCount: -1 } });
    }
}
exports.default = new PracticeService();
