import { Schema, model } from "mongoose";
import { IMilestone } from "./milestone.interface";

const milestoneSchema = new Schema<IMilestone>(
  {
    title: { type: String, required: true, trim: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, default: 1, min: 1 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    lesson:[{ type: Schema.Types.ObjectId, ref: "Lesson", default:[]}],
  },
  { timestamps: true }
);

milestoneSchema.index({ course: 1, order: 1 });

milestoneSchema.pre<IMilestone>("save", async function (next) {
  try {
    if (!this.order || this.order === 0) {
      const lastMilestone = await Milestone.findOne({ course: this.course })
        .sort({ order: -1 })
        .select("order");
      this.order = lastMilestone ? lastMilestone.order + 1 : 1;
    }
    next();
  } catch (err) {
    next(err as any);
  }
});

const Milestone = model<IMilestone>("Milestone", milestoneSchema);
export default Milestone;
