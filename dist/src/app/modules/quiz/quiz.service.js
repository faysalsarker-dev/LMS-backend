"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuiz = exports.updateQuiz = exports.getQuizById = exports.getAllQuizzes = exports.createQuiz = void 0;
const quiz_model_1 = __importDefault(require("./quiz.model"));
// Create quiz
const createQuiz = async (payload) => {
    const quiz = await quiz_model_1.default.create(payload);
    return quiz;
};
exports.createQuiz = createQuiz;
// Get all quizzes
const getAllQuizzes = async () => {
    return quiz_model_1.default.find().populate("module");
};
exports.getAllQuizzes = getAllQuizzes;
// Get quiz by id
const getQuizById = async (id) => {
    return quiz_model_1.default.findById(id).populate("module");
};
exports.getQuizById = getQuizById;
// Update quiz
const updateQuiz = async (id, payload) => {
    return quiz_model_1.default.findByIdAndUpdate(id, payload, { new: true });
};
exports.updateQuiz = updateQuiz;
// Delete quiz
const deleteQuiz = async (id) => {
    return quiz_model_1.default.findByIdAndDelete(id);
};
exports.deleteQuiz = deleteQuiz;
