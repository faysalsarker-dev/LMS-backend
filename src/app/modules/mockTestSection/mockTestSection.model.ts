import mongoose, { Schema } from "mongoose";
import { IMockTestSection, IMockQuestion, MockQuestionType } from "./mockTestSection.interface";

const optionSchema = new Schema(
  {
    text: { type: String },
    imageUrl: { type: String }
  }
);

const segmentSchema = new Schema(
  {
    text: { type: String, required: true }
  }
);

const subQuestionSchema = new Schema(
  {
    questionText: { type: String, required: true },
    options: [optionSchema],
    correctOptionId: { type: Schema.Types.Mixed }, // String or ObjectId
    marks: { type: Number, default: 1 }
  }
);

const mockQuestionSchema = new Schema<IMockQuestion>(
  {
    type: { 
      type: String, 
      enum: Object.values(MockQuestionType), 
      required: true 
    },
    marks: { type: Number, required: true, default: 1 },
    isAutoMarked: { type: Boolean, required: true, default: true },
    
    instruction: { type: String },
    questionText: { type: String },
    
    audioUrl: { type: String },
    imageUrl: { type: String },
    images: [{ type: String }],
    
    passage: { type: String },
    pinyin: { type: String },
    topic: { type: String },
    minWordCount: { type: Number },
    
    options: [optionSchema],
    correctOptionId: { type: Schema.Types.Mixed },
    
    wordPool: [optionSchema],
    correctGaps: {
      type: Map,
      of: String 
    },
    
    segments: [segmentSchema],
    correctSegmentOrder: [{ type: String }],
    
    subQuestions: [subQuestionSchema],
    
    wordTokens: [{ type: String }],
    correctSentence: { type: String },
    
    allowedRecordingTime: { type: Number }
  },
  { _id: true } 
);

const MockTestSectionSchema: Schema<IMockTestSection> = new Schema(
  {
    mockTest: { type: Schema.Types.ObjectId, ref: "MockTest", required: true },
    name: { 
      type: String, 
      enum: ["listening", "reading", "writing", "speaking"], 
      required: true 
    },
    timeLimit: { type: Number, required: true }, // in minutes
    instruction: { type: String },
    questions: [mockQuestionSchema],
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  },
  { timestamps: true }
);

const MockTestSection = mongoose.model<IMockTestSection>("MockTestSection", MockTestSectionSchema);
export default MockTestSection;
