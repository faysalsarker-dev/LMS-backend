"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTO_MARKED_TYPES = exports.MockQuestionType = void 0;
// ─── Question type enum ───────────────────────────────────────
var MockQuestionType;
(function (MockQuestionType) {
    // Listening
    MockQuestionType["L_PICTURE_MATCHING"] = "L_PICTURE_MATCHING";
    MockQuestionType["L_AUDIO_MCQ"] = "L_AUDIO_MCQ";
    MockQuestionType["L_LONG_DIALOGUE_MATCHING"] = "L_LONG_DIALOGUE_MATCHING";
    // Reading
    MockQuestionType["R_SENTENCE_TO_PICTURE"] = "R_SENTENCE_TO_PICTURE";
    MockQuestionType["R_FILL_IN_THE_GAP"] = "R_FILL_IN_THE_GAP";
    MockQuestionType["R_REARRANGE_PASSAGE"] = "R_REARRANGE_PASSAGE";
    MockQuestionType["R_PASSAGE_MCQ"] = "R_PASSAGE_MCQ";
    // Writing
    MockQuestionType["W_PICTURE_TO_WORD"] = "W_PICTURE_TO_WORD";
    MockQuestionType["W_WORD_TO_SENTENCE"] = "W_WORD_TO_SENTENCE";
    MockQuestionType["W_PINYIN_TO_CHARACTER"] = "W_PINYIN_TO_CHARACTER";
    MockQuestionType["W_COMPOSITION_PICTURES"] = "W_COMPOSITION_PICTURES";
    MockQuestionType["W_COMPOSITION_TOPIC"] = "W_COMPOSITION_TOPIC";
    // Speaking
    MockQuestionType["S_REPEAT_AFTER_LISTENING"] = "S_REPEAT_AFTER_LISTENING";
    MockQuestionType["S_SPEAK_ON_PICTURE"] = "S_SPEAK_ON_PICTURE";
    MockQuestionType["S_ANSWER_QUESTION"] = "S_ANSWER_QUESTION";
})(MockQuestionType || (exports.MockQuestionType = MockQuestionType = {}));
/**
 * Question types the system marks automatically.
 * Derived from MockQuestionType — never set manually on a question document.
 * The pre-validate hook on mockQuestionSchema uses this to set isAutoMarked.
 */
exports.AUTO_MARKED_TYPES = new Set([
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
