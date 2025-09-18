import { Schema, model } from "mongoose";
import { IQuiz, IQuizOption } from "./quiz.interface";

const optionSchema = new Schema<IQuizOption>(
  { text: { type: String, required: true } },
  { _id: false } // optional: _id: true if you need option stats
);

const quizSchema = new Schema<IQuiz>(
  {
    question: { type: String, required: true, trim: true },
    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator: (val: IQuizOption[]) => val.length >= 2,
        message: "At least two options are required",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
  
        message: "Correct answer must be one of the options",
    
    },
    explanation: { type: String },
    lesson: { type: Schema.Types.ObjectId, ref: "Lesson", required: true },
    timer: { type: Number, default: null },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

quizSchema.index({ lesson: 1 });

const Quiz = model<IQuiz>("Quiz", quizSchema);
export default Quiz;
