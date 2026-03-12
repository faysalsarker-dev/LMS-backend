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
const MockTestSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    thumbnail: { type: String, default: null },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    // The 4 test parts. We will use a unified 'MockTestSection' model to avoid code repeating.
    listening: { type: mongoose_1.Schema.Types.ObjectId, ref: "MockTestSection" },
    reading: { type: mongoose_1.Schema.Types.ObjectId, ref: "MockTestSection" },
    writing: { type: mongoose_1.Schema.Types.ObjectId, ref: "MockTestSection" },
    speaking: { type: mongoose_1.Schema.Types.ObjectId, ref: "MockTestSection" },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
}, { timestamps: true });
// Pre-save hook to generate unique slug based on title
MockTestSchema.pre("save", async function (next) {
    if (!this.isModified("title"))
        return next();
    let baseSlug = (0, slugify_1.default)(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    // Ensure slug is unique
    while (await mongoose_1.default.models.MockTest?.findOne({ slug })) {
        slug = `${baseSlug}-${count++}`;
    }
    this.slug = slug;
    next();
});
const MockTest = mongoose_1.default.model("MockTest", MockTestSchema);
exports.default = MockTest;
