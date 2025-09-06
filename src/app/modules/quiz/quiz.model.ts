import { Schema, model } from "mongoose";
import { IQuiz, IQuizOption } from "./quiz.interface";

const optionSchema = new Schema<IQuizOption>(
  {
    label: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);



const quizSchema = new Schema<IQuiz>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
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
    },
    explanation: {
      type: String,
    },
    module: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    timer: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);



const Quiz = model<IQuiz>("Quiz", quizSchema);

export default Quiz;
