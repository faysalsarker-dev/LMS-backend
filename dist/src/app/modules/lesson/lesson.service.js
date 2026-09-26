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
const fileDelete_1 = require("../../utils/fileDelete");
// Create
const createLesson = async (payload) => {
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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const getAllLessons = async (params) => {
    const searchableFields = ["title"];
    const queryParams = {
        ...params,
        page: params.page || 1,
        limit: params.limit || 10,
    };
    if (queryParams.milestone === "all")
        delete queryParams.milestone;
    if (queryParams.course === "all")
        delete queryParams.course;
    if (queryParams.status === "all")
        delete queryParams.status;
    if (queryParams.type === "all")
        delete queryParams.type;
    const lessonQuery = new QueryBuilder_1.default(Lesson_model_1.default.find().populate("milestone", "title").lean(), queryParams)
        .search(searchableFields)
        .filter()
        .sort()
        .paginate();
    // Override sort manually for lessons to maintain original logic
    lessonQuery.modelQuery = lessonQuery.modelQuery.sort({ order: 1 });
    const [lessons, metaInfo] = await Promise.all([
        lessonQuery.modelQuery,
        lessonQuery.countTotal(),
    ]);
    return {
        data: lessons,
        meta: {
            ...metaInfo,
            hasNextPage: metaInfo.page < metaInfo.totalPages,
            hasPrevPage: metaInfo.page > 1,
        },
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
    const lesson = await Lesson_model_1.default.findById(id);
    if (!lesson)
        return null;
    const intl = lesson.isInternational ?? true;
    if (lesson.video?.url) {
        try {
            await (0, fileDelete_1.deleteFile)(lesson.video.url, intl);
        }
        catch (error) {
            console.error(`Failed to delete lesson video for ${id}:`, error.message);
        }
    }
    if (lesson.audio?.url) {
        try {
            await (0, fileDelete_1.deleteFile)(lesson.audio.url, intl);
        }
        catch (error) {
            console.error(`Failed to delete lesson audio for ${id}:`, error.message);
        }
    }
    if (lesson.questions && Array.isArray(lesson.questions)) {
        for (const question of lesson.questions) {
            if (question?.audio) {
                try {
                    await (0, fileDelete_1.deleteFile)(question.audio, intl);
                }
                catch (error) {
                    console.error(`Failed to delete lesson question audio for ${id}:`, error.message);
                }
            }
        }
    }
    return Lesson_model_1.default.findByIdAndDelete(id);
};
exports.deleteLesson = deleteLesson;
