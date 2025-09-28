"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLesson = exports.updateLesson = exports.getSingleLesson = exports.getAllLessons = exports.createLesson = void 0;
const Lesson_model_1 = __importDefault(require("./Lesson.model"));
// Create
const createLesson = async (payload) => {
    const lesson = await Lesson_model_1.default.create(payload);
    return lesson;
};
exports.createLesson = createLesson;
// Get All (with milestone filter)
const getAllLessons = async (milestoneId) => {
    const filter = milestoneId ? { milestone: milestoneId } : {};
    const lessons = await Lesson_model_1.default.find(filter).sort({ order: 1 });
    return lessons;
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
