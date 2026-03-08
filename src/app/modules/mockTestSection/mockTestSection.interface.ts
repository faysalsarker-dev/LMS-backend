import { Document, Types } from "mongoose";

export enum MockQuestionType {
  // Listening
  L_PICTURE_MATCHING = "L_PICTURE_MATCHING",
  L_AUDIO_MCQ = "L_AUDIO_MCQ",
  L_LONG_DIALOGUE_MATCHING = "L_LONG_DIALOGUE_MATCHING",
  // Reading
  R_SENTENCE_TO_PICTURE = "R_SENTENCE_TO_PICTURE",
  R_FILL_IN_THE_GAP = "R_FILL_IN_THE_GAP",
  R_REARRANGE_PASSAGE = "R_REARRANGE_PASSAGE",
  R_PASSAGE_MCQ = "R_PASSAGE_MCQ",
  // Writing
  W_PICTURE_TO_WORD = "W_PICTURE_TO_WORD",
  W_WORD_TO_SENTENCE = "W_WORD_TO_SENTENCE",
  W_PINYIN_TO_CHARACTER = "W_PINYIN_TO_CHARACTER",
  W_COMPOSITION_PICTURES = "W_COMPOSITION_PICTURES",
  W_COMPOSITION_TOPIC = "W_COMPOSITION_TOPIC",
  // Speaking
  S_REPEAT_AFTER_LISTENING = "S_REPEAT_AFTER_LISTENING",
  S_SPEAK_ON_PICTURE = "S_SPEAK_ON_PICTURE",
  S_ANSWER_QUESTION = "S_ANSWER_QUESTION",
}

export interface IOption {
  _id?: Types.ObjectId;
  text?: string;
  imageUrl?: string;
}

export interface ISegment {
  _id?: Types.ObjectId;
  text: string;
}

export interface ISubQuestion {
  _id?: Types.ObjectId;
  questionText: string;
  options: IOption[];
  correctOptionId: Types.ObjectId | string;
  marks: number;
}

export interface IMockQuestion {
  type: MockQuestionType;
  marks: number; // Max marks achievable for this question
  isAutoMarked: boolean;
  
  // Generic fields
  instruction?: string;
  questionText?: string;
  
  // Media
  audioUrl?: string; // For Listening, Speaking
  imageUrl?: string; // For Picture Matching, Speak on Picture, etc.
  images?: string[]; // For W_COMPOSITION_PICTURES
  
  // Reading/Writing Text blocks
  passage?: string; // For R_FILL_IN_THE_GAP, R_PASSAGE_MCQ
  pinyin?: string; // For W_PINYIN_TO_CHARACTER
  topic?: string; // For W_COMPOSITION_TOPIC
  minWordCount?: number; // For W_COMPOSITION_TOPIC
  
  // Options for MCQ & Matching
  options?: IOption[]; 
  correctOptionId?: Types.ObjectId | string;
  
  // R_FILL_IN_THE_GAP
  wordPool?: IOption[]; 
  correctGaps?: Map<string, string>; // Map of gap identifier {{gap_1}} to correct optionId
  
  // R_REARRANGE_PASSAGE
  segments?: ISegment[];
  correctSegmentOrder?: string[]; // Array of segment IDs in correct order
  
  // R_PASSAGE_MCQ
  subQuestions?: ISubQuestion[];
  
  // W_WORD_TO_SENTENCE
  wordTokens?: string[];
  correctSentence?: string;
  
  // Speaking constraints
  allowedRecordingTime?: number; // in seconds (10, 15, 40, 90, 120, 150)
}

export interface IMockTestSection extends Document {
  mockTest: Types.ObjectId;
  name: "listening" | "reading" | "writing" | "speaking";
  timeLimit: number; // Duration of the test section in minutes
  instruction?: string;
  questions: IMockQuestion[];
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
