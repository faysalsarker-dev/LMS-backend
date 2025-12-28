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
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
// ---------------------------
// Subschemas
// ---------------------------
// --- Video Subschema ---
const videoSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    duration: { type: Number, default: null },
}, { _id: false });
// --- Audio Subschema ---
const transcriptSchema = new mongoose_1.Schema({
    language: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
}, { _id: false });
const audioSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    duration: { type: Number, default: null },
    transcripts: { type: [transcriptSchema], default: [] },
}, { _id: false });
// --- Question Subschema ---
const questionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ["mcq", "true_false", "fill_blank", "short_answer", "audio"],
        required: true,
    },
    questionText: { type: mongoose_1.Schema.Types.Mixed, required: true },
    audio: { type: String, default: null },
    options: [
        {
            text: { type: String, required: true, trim: true },
        },
    ],
    correctAnswer: { type: mongoose_1.Schema.Types.Mixed, required: false },
    explanation: { type: String, default: null },
    timer: { type: Number, default: null },
}, { _id: false });
const assignmentSchema = new mongoose_1.Schema({
    instruction: { type: String, required: true, trim: true },
    maxMarks: { type: Number, default: null },
    allowMultipleSubmissions: { type: Boolean, default: false },
    passingMarks: { type: Number, default: null },
    deadline: { type: Date, default: null }
}, { _id: false });
// ---------------------------
// Main Lesson Schema
// ---------------------------
const lessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true },
    milestone: { type: mongoose_1.Schema.Types.ObjectId, ref: "Milestone", required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, min: 1 },
    type: { type: String, enum: ["video", "doc", "quiz", "audio", "assignment"], required: true },
    doc: { type: mongoose_1.Schema.Types.Mixed, default: null },
    video: { type: videoSchema, default: null },
    audio: { type: audioSchema, default: null },
    questions: { type: [questionSchema], default: [] },
    assignment: { type: assignmentSchema, default: null },
    status: { type: String, enum: ["draft", "archived", "published"], default: "published" },
    viewCount: { type: Number, default: 0 },
}, { timestamps: true });
// ---------------------------
// Slug Generation
// ---------------------------
lessonSchema.pre("save", async function (next) {
    if (!this.slug && this.title) {
        const baseSlug = (0, slugify_1.default)(this.title, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;
        while (await mongoose_1.default.models.Lesson.findOne({ slug, course: this.course })) {
            slug = `${baseSlug}-${count++}`;
        }
        this.slug = slug;
    }
    next();
});
// ---------------------------
// Type-Based Validation
// ---------------------------
lessonSchema.pre("validate", function (next) {
    const l = this;
    // Quiz lessons must have questions
    // if (l.type === "quiz" && (!l.questions || l.questions.length === 0)) {
    //   return next(new Error("Quiz lessons must contain at least one question."));
    // }
    // ---------------------------
    // Type-Based Validation
    // ---------------------------
    // Parse questions if it's a string (coming from FormData)
    if (l.type === "quiz") {
        let questionsArray = l.questions;
        if (typeof questionsArray === "string") {
            try {
                questionsArray = JSON.parse(questionsArray);
                l.questions = questionsArray;
            }
            catch {
                return next(new Error("Invalid questions format. Must be valid JSON array."));
            }
        }
        if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
            return next(new Error("Quiz lessons must contain at least one question."));
        }
    }
    // Video lessons must have video
    if (l.type === "video" && !l.video) {
        return next(new Error("Video lessons must have a video."));
    }
    // Audio lessons must have audio
    if (l.type === "audio" && !l.audio) {
        return next(new Error("Audio lessons must have an audio resource."));
    }
    // Remove irrelevant fields to avoid anomalies
    if (l.type !== "quiz")
        l.questions = [];
    if (l.type !== "video")
        l.video = null;
    if (l.type !== "audio")
        l.audio = null;
    if (l.type !== "assignment")
        l.assignment = null;
    next();
});
// ---------------------------
// Indexes
// ---------------------------
lessonSchema.index({ milestone: 1, slug: 1, course: 1 }, { unique: true });
lessonSchema.index({ course: 1, order: 1 });
// ---------------------------
// Export
// ---------------------------
const Lesson = (0, mongoose_1.model)("Lesson", lessonSchema);
exports.default = Lesson;
