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
exports.getMyEnrolledCourses = exports.getLessonContentFromDB = exports.getCurriculumFromDB = exports.deleteCourse = exports.updateCourse = exports.getAllCourses = exports.getCourseById = exports.getCourseBySlug = exports.createCourse = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Course_model_1 = __importDefault(require("./Course.model"));
const Category_model_1 = require("../category/Category.model");
const progress_model_1 = __importDefault(require("../progress/progress.model"));
const ApiError_1 = require("../../errors/ApiError");
const Lesson_model_1 = __importDefault(require("../lesson/Lesson.model"));
const User_model_1 = __importDefault(require("../auth/User.model"));
const createCourse = async (data) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const course = new Course_model_1.default(data);
        const result = await course.save({ session });
        if (result.category) {
            await Category_model_1.Category.findByIdAndUpdate(result.category, { $inc: { totalCourse: 1 } }, { new: true, session });
        }
        await session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
exports.createCourse = createCourse;
const getCourseBySlug = async (slug) => {
    return Course_model_1.default.findOne({ slug }).populate("category").populate("milestones");
};
exports.getCourseBySlug = getCourseBySlug;
const getCourseById = async (id) => {
    const course = await Course_model_1.default.findById(id)
        .select("_id title slug milestones")
        .populate({
        path: "milestones",
        match: { status: "active" },
        options: { sort: { order: 1 } },
        select: "_id title order lesson status",
        populate: {
            path: "lesson",
            match: { status: "active" },
            options: { sort: { order: 1 } },
            model: "Lesson",
            select: "_id quiz title order contentType videoUrl status docContent",
        },
    })
        .lean();
    return course;
};
exports.getCourseById = getCourseById;
const getAllCourses = async (filters) => {
    const { level, status, sortBy, sortOrder = "desc", page = 1, limit = 10, search, isFeatured, category, } = filters;
    const query = {};
    // 🎯 Filtering
    if (level && level !== "all")
        query.level = level;
    if (status && status !== "all")
        query.status = status;
    if (isFeatured !== undefined)
        query.isFeatured = isFeatured;
    if (category && category !== "all") {
        if (mongoose_1.default.Types.ObjectId.isValid(category)) {
            query.category = new mongoose_1.default.Types.ObjectId(category);
        }
    }
    // 🔍 Search by title
    if (search)
        query.title = { $regex: search, $options: "i" };
    // 🔽 Sorting
    const sortOptions = {};
    if (sortBy) {
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
    }
    else {
        sortOptions.createdAt = -1;
    }
    // 📄 Pagination
    const skip = (Number(page) - 1) * Number(limit);
    // 🧵 Parallel queries
    const [data, total] = await Promise.all([
        Course_model_1.default.find(query)
            .populate("instructor", "name email")
            .populate("milestones")
            .populate("category")
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Course_model_1.default.countDocuments(query),
    ]);
    // 📦 Response
    return {
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(total / Number(limit)),
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
// =========== Additional  functions ===========
const getCurriculumFromDB = async (courseId, userId) => {
    console.log("Fetching curriculum for courseId:", courseId, "and userId:", userId);
    const [course, progress] = await Promise.all([
        Course_model_1.default.findById(courseId)
            .select("title slug milestones")
            .populate({
            path: "milestones",
            match: { status: "active" },
            options: { sort: { order: 1 } },
            select: "title order lessons",
            populate: {
                path: "lesson",
                match: { status: "published" },
                options: { sort: { order: 1 } },
                select: "title order type",
            },
        })
            .lean(),
        progress_model_1.default.findOne({ student: userId, course: courseId })
            .select("completedLessons quizResults")
            .lean(),
    ]);
    if (!course) {
        throw new ApiError_1.ApiError(404, "Course not found");
    }
    const completedIds = new Set(progress?.completedLessons?.map((id) => id.toString()) || []);
    const quizResultsMap = new Map(progress?.quizResults?.map((qr) => [
        qr.lesson.toString(),
        qr.passed
    ]) || []);
    // Formatting the curriculum structure
    // const curriculum = course?.milestones?.map((milestone: any) => ({
    //   _id: milestone._id,
    //   title: milestone.title,
    //   order: milestone.order,
    //   lessons: milestone.lesson?.map((lesson: any) => ({
    //     _id: lesson._id,
    //     title: lesson.title,
    //     order: lesson.order,
    //     contentType: lesson.contentType,
    //     isCompleted: completedIds.has(lesson._id.toString()),
    //   })),
    // }));
    const curriculum = course?.milestones?.map((milestone) => ({
        _id: milestone._id,
        title: milestone.title,
        order: milestone.order,
        lessons: milestone.lesson?.map((lesson) => {
            const baseLesson = {
                _id: lesson._id,
                title: lesson.title,
                order: lesson.order,
                type: lesson.type,
                isCompleted: completedIds.has(lesson._id.toString()),
            };
            if (lesson.type === "quiz") {
                return {
                    ...baseLesson,
                    passed: quizResultsMap.get(lesson._id.toString()) ?? null,
                };
            }
            return baseLesson;
        }),
    }));
    return {
        _id: course._id,
        title: course.title,
        curriculum,
    };
};
exports.getCurriculumFromDB = getCurriculumFromDB;
const getLessonContentFromDB = async (lessonId) => {
    const lesson = await Lesson_model_1.default.findOne({ _id: lessonId, status: "published" })
        .select("+videoUrl +docContent +quiz")
        .lean();
    if (!lesson) {
        throw new ApiError_1.ApiError(404, "Lesson not found or inactive");
    }
    return lesson;
};
exports.getLessonContentFromDB = getLessonContentFromDB;
const getMyEnrolledCourses = async (userId) => {
    const user = await User_model_1.default.findById(userId).select("courses").lean();
    if (!user) {
        throw new ApiError_1.ApiError(404, "User not found");
    }
    if (!user.courses || user.courses.length === 0) {
        return [];
    }
    const [courses, progressList] = await Promise.all([
        Course_model_1.default.find({ _id: { $in: user.courses } })
            .select("title slug description thumbnail")
            .lean(),
        progress_model_1.default.find({
            student: userId,
            course: { $in: user.courses },
        })
            .select("course progressPercentage")
            .lean(),
    ]);
    const progressMap = new Map(progressList.map((p) => [p.course.toString(), p.progressPercentage]));
    const enrolledCourses = courses.map((course) => ({
        _id: course._id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnail: course.thumbnail,
        progress: progressMap.get(course._id.toString()) || 0,
    }));
    return enrolledCourses;
};
exports.getMyEnrolledCourses = getMyEnrolledCourses;
