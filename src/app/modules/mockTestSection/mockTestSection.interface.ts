import { Document, Types } from "mongoose";

// ─── Question type enum ───────────────────────────────────────
export enum MockQuestionType {
  // Listening
  L_PICTURE_MATCHING       = "L_PICTURE_MATCHING",
  L_AUDIO_MCQ              = "L_AUDIO_MCQ",
  L_LONG_DIALOGUE_MATCHING = "L_LONG_DIALOGUE_MATCHING",
  // Reading
  R_SENTENCE_TO_PICTURE    = "R_SENTENCE_TO_PICTURE",
  R_FILL_IN_THE_GAP        = "R_FILL_IN_THE_GAP",
  R_REARRANGE_PASSAGE      = "R_REARRANGE_PASSAGE",
  R_PASSAGE_MCQ            = "R_PASSAGE_MCQ",
  // Writing
  W_PICTURE_TO_WORD        = "W_PICTURE_TO_WORD",
  W_WORD_TO_SENTENCE       = "W_WORD_TO_SENTENCE",
  W_PINYIN_TO_CHARACTER    = "W_PINYIN_TO_CHARACTER",
  W_COMPOSITION_PICTURES   = "W_COMPOSITION_PICTURES",
  W_COMPOSITION_TOPIC      = "W_COMPOSITION_TOPIC",
  // Speaking
  S_REPEAT_AFTER_LISTENING = "S_REPEAT_AFTER_LISTENING",
  S_SPEAK_ON_PICTURE       = "S_SPEAK_ON_PICTURE",
  S_ANSWER_QUESTION        = "S_ANSWER_QUESTION",
}

/**
 * Question types the system marks automatically.
 * Derived from MockQuestionType — never set manually on a question document.
 * The pre-validate hook on mockQuestionSchema uses this to set isAutoMarked.
 */
export const AUTO_MARKED_TYPES = new Set<MockQuestionType>([
  MockQuestionType.L_PICTURE_MATCHING,
  MockQuestionType.L_AUDIO_MCQ,
  MockQuestionType.L_LONG_DIALOGUE_MATCHING,
  MockQuestionType.R_SENTENCE_TO_PICTURE,
  MockQuestionType.R_FILL_IN_THE_GAP,
  MockQuestionType.R_REARRANGE_PASSAGE,
  MockQuestionType.R_PASSAGE_MCQ,
  MockQuestionType.W_PICTURE_TO_WORD,
  MockQuestionType.W_WORD_TO_SENTENCE,
]);

export type SectionName = "listening" | "reading" | "writing" | "speaking";

// ─── Sub-document interfaces ──────────────────────────────────

/**
 * One selectable option used in MCQ and picture-matching questions.
 * optionId is what gets stored in correctOptionId and in the student's answer.
 * Either text or imageUrl is populated depending on the question type.
 */
export interface IOption {
  optionId: string;        // "A" | "B" | "C" | "D"  or  "opt_1" etc.
  text?:    string;        // text-based option (L_AUDIO_MCQ, W_PICTURE_TO_WORD …)
  imageUrl?: string;       // image-based option (L_PICTURE_MATCHING …)
}

/**
 * One segment in a rearrange-passage question.
 * correctPosition is the 1-based index this segment belongs at.
 * The student's answer is an ordered array of segmentIds.
 */
export interface ISegment {
  segmentId:       string;  // "seg_1", "seg_2" …
  text:            string;
  correctPosition: number;  // 1-based
}

/**
 * One sub-question inside a reading-passage MCQ block.
 * Has its own options and correct answer independent of the parent question.
 */
export interface ISubQuestion {
  subQuestionId:   string;   // "sq_1", "sq_2" …
  questionText:    string;
  options:         IOption[];
  correctOptionId: string;   // must match one of options[].optionId
  marks:           number;
}

// ─── Main question interface ──────────────────────────────────

/**
 * IMockQuestion — one question of ANY of the 14 types.
 *
 * Only populate the fields relevant to the question type.
 * See the field-usage table in the README for which fields each type uses.
 *
 * Fields shared by every type:
 *   type, marks, isAutoMarked, instruction
 *
 * Answer-key fields (never sent to student, used for auto-marking):
 *   correctOptionId, correctGaps, correctSegmentOrder, correctSentence
 */
export interface IMockQuestion {
  _id:          Types.ObjectId;
  type:         MockQuestionType;
  marks:        number;
  isAutoMarked: boolean;
  instruction?: string;

  // ── Stimulus fields ────────────────────────────────────────
  questionText?: string;   // text question / sentence shown to student
  audioUrl?:     string;   // Listening types + S_REPEAT_AFTER_LISTENING
  images:        string[]; // all image needs — use images[0] for single image,
                           // images[0..3] for W_COMPOSITION_PICTURES

  // ── Reading-specific ───────────────────────────────────────
  passage?:      string;   // R_PASSAGE_MCQ — the full reading passage
  passageText?:  string;   // R_FILL_IN_THE_GAP — passage with {{gap_1}} placeholders

  // ── Writing-specific ───────────────────────────────────────
  pinyin?:       string;   // W_PINYIN_TO_CHARACTER — the pinyin prompt
  topic?:        string;   // W_COMPOSITION_TOPIC   — the topic string
  minWordCount?: number;   // W_COMPOSITION_TOPIC   — minimum word count

  // ── MCQ options (Listening + R_SENTENCE_TO_PICTURE + W_PICTURE_TO_WORD) ──
  options:         IOption[];
  correctOptionId?: string;  // matches one of options[].optionId

  // ── Fill-in-the-gap (R_FILL_IN_THE_GAP) ───────────────────
  wordPool:    IOption[];              // shuffled pool shown to student
  correctGaps: Map<string, string>;    // { "gap_1": "opt_1", "gap_2": "opt_3" }

  // ── Rearrange passage (R_REARRANGE_PASSAGE) ────────────────
  segments: ISegment[];               // each segment has segmentId + correctPosition

  // ── Passage MCQ (R_PASSAGE_MCQ) ────────────────────────────
  subQuestions: ISubQuestion[];

  // ── Word to sentence (W_WORD_TO_SENTENCE) ──────────────────
  wordTokens:      string[];          // shuffled tokens shown to student
  correctSentence?: string;           // expected joined result

  // ── Speaking ───────────────────────────────────────────────
  allowedRecordingTime?: number;      // seconds: 10|40|90 / 15|120 / 90|120|150
}

// ─── Section interface ────────────────────────────────────────

export interface IMockTestSection extends Document {
  mockTest:     Types.ObjectId;
  name:         SectionName;
  timeLimit:    number;          // minutes
  instruction?: string;
  totalMarks: number;
  isInternational?: boolean;
  questions:    IMockQuestion[];
}