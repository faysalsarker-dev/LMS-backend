"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const optionSchema = new mongoose_1.Schema({
    label: { type: String, required: true },
    text: { type: String, required: true },
}, { _id: false });
const quizSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [optionSchema],
        required: true,
        validate: {
            validator: (val) => val.length >= 2,
            message: "At least two options are required",
        },
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    explanation: {
        type: String,
    },
    module: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Module",
        required: true,
    },
    timer: {
        type: Number,
        default: null,
    },
}, {
    timestamps: true,
});
const Quiz = (0, mongoose_1.model)("Quiz", quizSchema);
exports.default = Quiz;
