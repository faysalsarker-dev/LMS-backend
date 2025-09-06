"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.getAllCourses = exports.getCourseById = exports.createCourse = void 0;
const mongoose_1 = require("mongoose");
const Course_model_1 = __importDefault(require("./Course.model"));
const createCourse = async (data) => {
    const course = new Course_model_1.default(data);
    return course.save();
};
exports.createCourse = createCourse;
const getCourseById = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    return Course_model_1.default.findById(id).populate("milestones");
};
exports.getCourseById = getCourseById;
const getAllCourses = async () => {
    return Course_model_1.default.find().populate("instructor", "name username").populate("milestones");
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
