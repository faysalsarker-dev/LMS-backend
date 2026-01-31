"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLesson = exports.updateLesson = exports.getSingleLesson = exports.getAllLessons = exports.createLesson = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Lesson_model_1 = __importDefault(require("./Lesson.model"));
const Milestone_model_1 = __importDefault(require("../milestone/Milestone.model"));
const ApiError_1 = require("../../errors/ApiError");
// Create
const createLesson = async (payload) => {
    console.log(payload, 'data');
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        if (payload.questions && typeof payload.questions === 'string') {
            payload.questions = JSON.parse(payload.questions);
        }
        if (payload.type === "assignment" && typeof payload.assignment === "string") {
            payload.assignment = JSON.parse(payload.assignment);
        }
        const lesson = new Lesson_model_1.default(payload);
        const result = await lesson.save({ validateBeforeSave: true, session });
        if (payload.milestone) {
            await Milestone_model_1.default.findByIdAndUpdate(payload.milestone, { $push: { lesson: result._id } }, { new: true, session });
        }
        await session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new ApiError_1.ApiError(401, `Failed to create lesson: ${error.message}`);
    }
};
exports.createLesson = createLesson;
const getAllLessons = async (params) => {
    const { milestone = '', search = '', status = 'all', course = 'all', page = 1, limit = 10, type } = params;
    // Build filter object
    const filter = {};
    // Milestone filter
    if (milestone && milestone !== 'all') {
        filter.milestone = milestone;
    }
    // Course filter
    if (course && course !== 'all') {
        filter.course = course;
    }
    if (search && search.trim() !== '') {
        filter.$or = [
            { title: { $regex: search.trim(), $options: 'i' } }
        ];
    }
    if (type && type !== 'all') {
        filter.type = type;
    }
    if (status && status !== 'all') {
        filter.status = status;
    }
    // Calculate pagination
    const skip = (page - 1) * limit;
    // Execute query with pagination
    const [lessons, total] = await Promise.all([
        Lesson_model_1.default.find(filter)
            .populate('milestone', 'title')
            .sort({ order: 1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Lesson_model_1.default.countDocuments(filter)
    ]);
    // Calculate meta information
    const totalPages = Math.ceil(total / limit);
    return {
        data: lessons,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};
exports.getAllLessons = getAllLessons;
// Get Single
const getSingleLesson = async (id) => {
    const lesson = await Lesson_model_1.default.findById(id);
    return lesson;
};
exports.getSingleLesson = getSingleLesson;
// Update
const updateLesson = async (id, payload) => {
    const lesson = await Lesson_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    return lesson;
};
exports.updateLesson = updateLesson;
// Delete
const deleteLesson = async (id) => {
    const lesson = await Lesson_model_1.default.findByIdAndDelete(id);
    return lesson;
};
exports.deleteLesson = deleteLesson;
