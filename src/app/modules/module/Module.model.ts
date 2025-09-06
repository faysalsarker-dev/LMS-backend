import { Schema, model } from "mongoose";
import { IModule } from "./module.interface";

const moduleSchema = new Schema<IModule>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, required: false },
    milestone: { type: Schema.Types.ObjectId, ref: "Milestone", required: true },
    type: {
      type: String,
      enum: ["video", "quiz", "document", "note"],
      required: true,
    },
    videoUrl: { type: String },
    documentUrl: { type: String },
    notes: { type: String },
    quiz: { type: Schema.Types.ObjectId, ref: "Quiz" },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

moduleSchema.pre<IModule>("save", async function (next) {
  if (!this.order || this.order === 0) {
    const lastModule = await Module.findOne({ milestone: this.milestone })
      .sort({ order: -1 })
      .select("order");
    this.order = lastModule ? lastModule.order + 1 : 1;
  }
  next();
});

const Module = model<IModule>("Module", moduleSchema);
export default Module;