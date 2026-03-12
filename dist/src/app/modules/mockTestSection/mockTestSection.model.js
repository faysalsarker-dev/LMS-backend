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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mockTestSection_interface_1 = require("./mockTestSection.interface");
// ─────────────────────────────────────────────────────────────
//  SUB-SCHEMAS
// ─────────────────────────────────────────────────────────────
/**
 * IOption — one selectable answer choice.
 *
 * optionId  →  what gets stored as correctOptionId and as the student's answer.
 *              Keeps answer-checking simple: student.selectedOptionId === question.correctOptionId
 *
 * text     →  used when the option is a word / sentence  (L_AUDIO_MCQ, W_PICTURE_TO_WORD …)
 * imageUrl →  used when the option is a picture          (L_PICTURE_MATCHING …)
 * Both can be present together for mixed option types.
 */
const optionSchema = new mongoose_1.Schema({
    optionId: { type: String, required: true }, // "A" | "B" | "opt_1" …
    text: { type: String, default: null },
    imageUrl: { type: String, default: null },
}, { _id: false } // no extra _id on each option
);
/**
 * ISegment — one piece of a rearrange-passage question.
 *
 * segmentId       →  stable ID used in the student's answer array
 * correctPosition →  1-based index of where this segment belongs
 *
 * Student's answer = segmentOrder: ["seg_3","seg_1","seg_2"] (their drag order)
 * Auto-marker compares each position against correctPosition.
 */
const segmentSchema = new mongoose_1.Schema({
    segmentId: { type: String, required: true },
    text: { type: String, required: true },
    correctPosition: { type: Number, required: true }, // 1-based
}, { _id: false });
/**
 * ISubQuestion — one MCQ inside a reading-passage block.
 *
 * subQuestionId →  stable ID used in the student's answer map
 * Student's answer = subQuestionSelections: { "sq_1": "B", "sq_2": "A" }
 */
const subQuestionSchema = new mongoose_1.Schema({
    subQuestionId: { type: String, required: true },
    questionText: { type: String, required: true },
    options: { type: [optionSchema], default: [] },
    correctOptionId: { type: String, default: null }, // String — never Mixed
    marks: { type: Number, default: 1 },
}, { _id: false });
// ─────────────────────────────────────────────────────────────
//  QUESTION SCHEMA
// ─────────────────────────────────────────────────────────────
/**
 * One question of ANY of the 14 types.
 *
 * Design rule — only populate the fields relevant to your type.
 * All unused fields default to null / []. The frontend can safely
 * ignore null fields and render only what is present.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │  FIELD USAGE BY TYPE                                        │
 * │                                                             │
 * │  L_PICTURE_MATCHING       audioUrl, options(img), correctOptionId        │
 * │  L_AUDIO_MCQ              audioUrl, options(txt), correctOptionId        │
 * │  L_LONG_DIALOGUE_MATCHING audioUrl, options(img/txt), correctOptionId    │
 * │                                                             │
 * │  R_SENTENCE_TO_PICTURE    questionText, options(img), correctOptionId    │
 * │  R_FILL_IN_THE_GAP        passageText(with gaps), wordPool, correctGaps  │
 * │  R_REARRANGE_PASSAGE      segments[]                                     │
 * │  R_PASSAGE_MCQ            passage, subQuestions[]                        │
 * │                                                             │
 * │  W_PICTURE_TO_WORD        images[0], options(txt), correctOptionId       │
 * │  W_WORD_TO_SENTENCE       wordTokens[], correctSentence                  │
 * │  W_PINYIN_TO_CHARACTER    pinyin                                         │
 * │  W_COMPOSITION_PICTURES   images[0..3]                                   │
 * │  W_COMPOSITION_TOPIC      topic, minWordCount                            │
 * │                                                             │
 * │  S_REPEAT_AFTER_LISTENING audioUrl, allowedRecordingTime                 │
 * │  S_SPEAK_ON_PICTURE       images[0], allowedRecordingTime                │
 * │  S_ANSWER_QUESTION        questionText, audioUrl?, allowedRecordingTime  │
 * └─────────────────────────────────────────────────────────────┘
 */
const mockQuestionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(mockTestSection_interface_1.MockQuestionType),
        required: true,
    },
    marks: { type: Number, required: true, default: 1, min: 0 },
    isAutoMarked: { type: Boolean, required: true, default: true },
    instruction: { type: String, default: null },
    // ── Stimulus ────────────────────────────────────────────
    questionText: { type: String, default: null },
    audioUrl: { type: String, default: null },
    // Single images[] for ALL image needs.
    // Single-image types  → use images[0]
    // W_COMPOSITION_PICTURES → use images[0..3]
    images: { type: [String], default: [] },
    // ── Reading ─────────────────────────────────────────────
    passage: { type: String, default: null }, // R_PASSAGE_MCQ full text
    passageText: { type: String, default: null }, // R_FILL_IN_THE_GAP with {{gap_n}}
    // ── Writing ─────────────────────────────────────────────
    pinyin: { type: String, default: null },
    topic: { type: String, default: null },
    minWordCount: { type: Number, default: null },
    // ── MCQ / matching options ───────────────────────────────
    // Used by: all Listening types, R_SENTENCE_TO_PICTURE, W_PICTURE_TO_WORD
    options: { type: [optionSchema], default: [] },
    correctOptionId: { type: String, default: null }, // String — never Schema.Types.Mixed
    // ── Fill-in-the-gap ──────────────────────────────────────
    wordPool: { type: [optionSchema], default: [] }, // shuffled pool shown to student
    correctGaps: { type: Map, of: String, default: {} }, // { "gap_1": "opt_1" }
    // ── Rearrange passage ────────────────────────────────────
    segments: { type: [segmentSchema], default: [] },
    // ── Passage MCQ ──────────────────────────────────────────
    subQuestions: { type: [subQuestionSchema], default: [] },
    // ── Word to sentence ─────────────────────────────────────
    wordTokens: { type: [String], default: [] },
    correctSentence: { type: String, default: null },
    // ── Speaking ─────────────────────────────────────────────
    allowedRecordingTime: { type: Number, default: null }, // seconds
}, { _id: true } // keep _id so frontend can reference individual questions
);
// ─────────────────────────────────────────────────────────────
//  PRE-VALIDATE: derive isAutoMarked from type automatically
//  Admin never has to set this manually — it is always correct.
// ─────────────────────────────────────────────────────────────
mockQuestionSchema.pre("validate", function (next) {
    this.isAutoMarked = mockTestSection_interface_1.AUTO_MARKED_TYPES.has(this.type);
    next();
});
// ─────────────────────────────────────────────────────────────
//  SECTION SCHEMA
// ─────────────────────────────────────────────────────────────
const MockTestSectionSchema = new mongoose_1.Schema({
    mockTest: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "MockTest",
        required: true,
        index: true,
    },
    name: {
        type: String,
        enum: ["listening", "reading", "writing", "speaking"],
        required: true,
    },
    timeLimit: { type: Number, default: 20, required: true }, // minutes
    instruction: { type: String, default: null },
    questions: { type: [mockQuestionSchema], default: [] },
    // status removed — controlled by parent MockTest only
}, { timestamps: true });
// Compound index — fast lookup: "give me the listening section for this test"
MockTestSectionSchema.index({ mockTest: 1, name: 1 }, { unique: true });
const MockTestSection = mongoose_1.default.model("MockTestSection", MockTestSectionSchema);
exports.default = MockTestSection;
