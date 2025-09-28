"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const optionSchema = new mongoose_1.Schema({ text: { type: String, required: true } }, { _id: false } // optional: _id: true if you need option stats
);
const quizSchema = new mongoose_1.Schema({
    question: { type: String, required: true, trim: true },
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
        message: "Correct answer must be one of the options",
    },
    explanation: { type: String },
    lesson: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lesson", required: true },
    timer: { type: Number, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });
quizSchema.index({ lesson: 1 });
const Quiz = (0, mongoose_1.model)("Quiz", quizSchema);
exports.default = Quiz;
