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
const lessonSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, trim: true, required: true },
    milestone: { type: mongoose_1.Schema.Types.ObjectId, ref: "Milestone", required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, min: 1 },
    contentType: {
        type: String,
        enum: ["video", "doc", "quiz", "assignment"],
        default: "video"
    },
    videoUrl: {
        type: String,
        validate: {
            validator: function (v) {
                return this.contentType !== "video" || !!v;
            },
            message: "videoUrl is required for video lessons",
        },
    },
    docContent: {
        type: String,
        validate: {
            validator: function (v) {
                return this.contentType !== "doc" || !!v;
            },
            message: "docContent is required for doc lessons",
        },
    },
    quiz: {
        question: { type: String, trim: true },
        options: [{ text: { type: String } }],
        correctAnswer: { type: String },
        explanation: { type: String },
        timer: { type: Number, default: null },
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    viewCount: { type: Number, default: 0 },
}, { timestamps: true });
// Generate slug before save
lessonSchema.pre("save", async function (next) {
    if (!this.isModified("title"))
        return next();
    let baseSlug = (0, slugify_1.default)(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    while (await mongoose_1.default.models.Lesson.findOne({ slug, course: this.course })) {
        slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
    next();
});
// Indexes
lessonSchema.index({ milestone: 1, slug: 1, course: 1 }, { unique: true });
lessonSchema.index({ course: 1, order: 1 });
const Lesson = (0, mongoose_1.model)("Lesson", lessonSchema);
exports.default = Lesson;
