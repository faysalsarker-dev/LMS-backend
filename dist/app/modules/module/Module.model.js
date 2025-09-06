"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const moduleSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, required: false },
    milestone: { type: mongoose_1.Schema.Types.ObjectId, ref: "Milestone", required: true },
    type: {
        type: String,
        enum: ["video", "quiz", "document", "note"],
        required: true,
    },
    videoUrl: { type: String },
    documentUrl: { type: String },
    notes: { type: String },
    quiz: { type: mongoose_1.Schema.Types.ObjectId, ref: "Quiz" },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
}, { timestamps: true });
moduleSchema.pre("save", async function (next) {
    if (!this.order || this.order === 0) {
        const lastModule = await Module.findOne({ milestone: this.milestone })
            .sort({ order: -1 })
            .select("order");
        this.order = lastModule ? lastModule.order + 1 : 1;
    }
    next();
});
const Module = (0, mongoose_1.model)("Module", moduleSchema);
exports.default = Module;
