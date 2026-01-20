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
const PracticeItemSchema = new mongoose_1.Schema({
    content: { type: String, required: true, trim: true },
    pronunciation: { type: String, trim: true },
    audioUrl: { type: String },
    imageUrl: { type: String },
    description: { type: String, maxlength: 500 },
    order: { type: Number, required: true, default: 0 }
}, { _id: false });
const PracticeSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    type: {
        type: String,
        enum: ['pronunciation', 'vocabulary', 'grammar', 'exercise', 'quiz', 'other'],
        default: 'other',
        required: true
    },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' },
    items: [PracticeItemSchema],
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    estimatedTime: { type: String, default: '' },
    tags: [{ type: String, trim: true, index: true }],
    thumbnail: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    totalItems: { type: Number, default: 0 },
    usageCount: { type: Number, default: 0 }
}, { timestamps: true });
// Auto-generate slug from title
PracticeSchema.pre('save', async function (next) {
    if (!this.isModified('title'))
        return next();
    let baseSlug = (0, slugify_1.default)(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    while (await mongoose_1.default.models.Practice.findOne({ slug, _id: { $ne: this._id } })) {
        slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
    next();
});
// Auto-update totalItems count
PracticeSchema.pre('save', function (next) {
    this.totalItems = this.items.length;
    next();
});
// Indexes for performance
PracticeSchema.index({ slug: 1 });
PracticeSchema.index({ type: 1, isActive: 1 });
PracticeSchema.index({ category: 1 });
PracticeSchema.index({ tags: 1 });
const Practice = mongoose_1.default.model('Practice', PracticeSchema);
exports.default = Practice;
