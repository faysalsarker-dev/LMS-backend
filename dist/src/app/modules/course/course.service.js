"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.getAllCourses = exports.getCourseBySlug = exports.createCourse = void 0;
const mongoose_1 = require("mongoose");
const Course_model_1 = __importDefault(require("./Course.model"));
const createCourse = async (data) => {
    const course = new Course_model_1.default(data);
    return course.save();
};
exports.createCourse = createCourse;
const getCourseBySlug = async (slug) => {
    return Course_model_1.default.findOne({ slug }).populate("milestones");
};
exports.getCourseBySlug = getCourseBySlug;
const getAllCourses = async (filters) => {
    const { level, status, sortBy, sortOrder, page = 1, limit = 10, search, isFeatured } = filters;
    const query = {};
    // Filtering
    if (level && level !== "all")
        query.level = level;
    if (status && status !== "all")
        query.status = status;
    if (isFeatured !== undefined)
        query.isFeatured = isFeatured === true;
    // Search by title
    if (search) {
        query.title = { $regex: search, $options: "i" };
    }
    // Sorting
    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    }
    else {
        sortOptions.createdAt = -1;
    }
    // Pagination
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
        Course_model_1.default.find(query)
            .populate("instructor", "name email")
            .populate("milestones")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit),
        Course_model_1.default.countDocuments(query),
    ]);
    return {
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
        data,
    };
};
exports.getAllCourses = getAllCourses;
const updateCourse = async (id, data) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    return Course_model_1.default.findByIdAndUpdate(id, data, { new: true }).exec();
};
exports.updateCourse = updateCourse;
const deleteCourse = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    return Course_model_1.default.findByIdAndDelete(id).exec();
};
exports.deleteCourse = deleteCourse;
