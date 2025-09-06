"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const milestoneSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    order: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
}, { timestamps: true });
milestoneSchema.pre("save", async function (next) {
    try {
        if (!this.order || this.order === 0) {
            const lastMilestone = await Milestone.findOne({ course: this.course })
                .sort({ order: -1 })
                .select("order");
            this.order = lastMilestone ? lastMilestone.order + 1 : 1;
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
const Milestone = (0, mongoose_1.model)("Milestone", milestoneSchema);
exports.default = Milestone;
