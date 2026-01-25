import mongoose, { Schema, model } from "mongoose";
import { ILesson, IQuestion, IVideo, IAudio, IAssignment } from "./lesson.interface";
import slugify from "slugify";

// ---------------------------
// Subschemas
// ---------------------------

// --- Video Subschema ---
const videoSchema = new Schema<IVideo>(
  {
    url: { type: String, required: true },
    duration: { type: Number, default: null },
  },
  { _id: false }
);

// --- Audio Subschema ---
const transcriptSchema = new Schema(
  {
    language: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const audioSchema = new Schema<IAudio>(
  {
    url: { type: String, required: true },
    transcripts: { type: [transcriptSchema], default: [] },
  },
  { _id: false }
);

// --- Question Subschema ---
const questionSchema = new Schema<IQuestion>(
  {
    type: {
      type: String,
      enum: ["mcq", "true_false", "fill_blank", "short_answer", "audio"],
      required: true,
    },
    questionText: {  type: Schema.Types.Mixed, required: true },
    audio: { type: String, default: null },
    options: [
      {
        text: { type: String, required: true, trim: true },
      },
    ],
    correctAnswer: { type: Schema.Types.Mixed, required: false },
    explanation: { type: String, default: null },
    timer: { type: Number, default: null },
  },
  { _id: false }
);

const assignmentSchema = new Schema<IAssignment>(
  {
    instruction: { type: String, required: true, trim: true },
    maxMarks: { type: Number, default: null },
    allowMultipleSubmissions: { type: Boolean, default: false },
    passingMarks: { type: Number, default: null },
    deadline :{type:Date ,default:null} 

  },
  { _id: false }
);






// ---------------------------
// Main Lesson Schema
// ---------------------------
const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String,  trim: true },

    milestone: { type: Schema.Types.ObjectId, ref: "Milestone", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    order: { type: Number, min: 1 },

    type: { type: String, enum: ["video", "doc", "quiz", "audio" ,"assignment"], required: true },

doc: { type: Schema.Types.Mixed, default: null },
    video: { type: videoSchema, default: null },
    audio: { type: audioSchema, default: null },
    questions: { type: [questionSchema], default: [] },
     assignment: { type: assignmentSchema, default: null },

    status: { type: String, enum: ["draft", "archived" ,"published"], default: "published" },
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ---------------------------
// Slug Generation
// ---------------------------
lessonSchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    const baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await mongoose.models.Lesson.findOne({ slug, course: this.course })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});

// ---------------------------
// Type-Based Validation
// ---------------------------
lessonSchema.pre("validate", function (next) {
  const l = this as ILesson;

 
  if (l.type === "quiz") {
    let questionsArray = l.questions;

    if (typeof questionsArray === "string") {
      try {
        questionsArray = JSON.parse(questionsArray);
        l.questions = questionsArray; 
      } catch {
        return next(new Error("Invalid questions format. Must be valid JSON array."));
      }
    }

    if (!Array.isArray(questionsArray) || questionsArray.length === 0) {
      return next(new Error("Quiz lessons must contain at least one question."));
    }
  }

  // Video lessons must have video
  if (l.type === "video" && !l.video) {
    return next(new Error("Video lessons must have a video."));
  }

  // Audio lessons must have audio
  if (l.type === "audio" && !l.audio) {
    return next(new Error("Audio lessons must have an audio resource."));
  }


 

  if (l.type === "assignment") {
    if (
      !l.assignment ||
      typeof l.assignment !== "object" ||
      !l.assignment.instruction
    ) {
      return next(new Error("Assignment instruction is required."));
    }
  }

  // Remove irrelevant fields to avoid anomalies
  if (l.type !== "quiz") l.questions = [];
  if (l.type !== "video") l.video = null;
  if (l.type !== "audio") l.audio = null;
  if (l.type !== "assignment") l.assignment = null;
 

  next();
});

// ---------------------------
// Indexes
// ---------------------------
lessonSchema.index({ milestone: 1, slug: 1, course: 1 }, { unique: true });
lessonSchema.index({ course: 1, order: 1 });

// ---------------------------
// Export
// ---------------------------
const Lesson = model<ILesson>("Lesson", lessonSchema);
export default Lesson;
