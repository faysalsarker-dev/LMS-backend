# Mock Test Section Module

This module manages the individual parts of a Mock Test (Listening, Reading, Writing, and Speaking) and handles the diverse range of 14 question types.

## 1. Schema Design

The `MockTestSection` is a container for `questions`. Each question is an embedded sub-document of type `IMockQuestion`.

### Core Fields
- `mockTest`: Reference to the parent `MockTest` container.
- `name`: One of `"listening"`, `"reading"`, `"writing"`, `"speaking"`.
- `timeLimit`: The duration allowed for this section (in minutes).
- `questions`: An array of `IMockQuestion` objects.

## 2. Question Types Reference

The system supports 14 distinct types. Each type uses a specific subset of fields in the `IMockQuestion` schema.

| Type | Category | Key Fields Used |
| :--- | :--- | :--- |
| `L_PICTURE_MATCHING` | Listening | `audioUrl`, `options` (with `imageUrl`), `correctOptionId` |
| `L_AUDIO_MCQ` | Listening | `audioUrl`, `options` (with `text`), `correctOptionId` |
| `L_LONG_DIALOGUE_MATCHING` | Listening | `audioUrl`, `options`, `correctOptionId` |
| `R_SENTENCE_TO_PICTURE` | Reading | `questionText`, `options` (with `imageUrl`), `correctOptionId` |
| `R_FILL_IN_THE_GAP` | Reading | `passageText` (uses `{{gap_n}}`), `wordPool`, `correctGaps` |
| `R_REARRANGE_PASSAGE` | Reading | `segments` (text + `correctPosition`) |
| `R_PASSAGE_MCQ` | Reading | `passage`, `subQuestions` |
| `W_PICTURE_TO_WORD` | Writing | `images`[0], `options` (with `text`), `correctOptionId` |
| `W_WORD_TO_SENTENCE` | Writing | `wordTokens`, `correctSentence` |
| `W_PINYIN_TO_CHARACTER` | Writing | `pinyin` |
| `W_COMPOSITION_PICTURES` | Writing | `images` (array of 4) |
| `W_COMPOSITION_TOPIC` | Writing | `topic`, `minWordCount` |
| `S_REPEAT_AFTER_LISTENING`| Speaking | `audioUrl`, `allowedRecordingTime` |
| `S_SPEAK_ON_PICTURE` | Speaking | `images`[0], `allowedRecordingTime` |
| `S_ANSWER_QUESTION` | Speaking | `questionText`, `audioUrl` (optional), `allowedRecordingTime` |

## 3. Auto-Marking Logic

The field `isAutoMarked` is managed by a `pre-validate` hook in the Mongoose model. 
- **Auto-Marked**: All Listening and Reading types, plus `W_PICTURE_TO_WORD` and `W_WORD_TO_SENTENCE`.
- **Manual Review**: `W_PINYIN_TO_CHARACTER`, `W_COMPOSITION_*`, and all Speaking types.

## 4. Admin Workflow (Management)

### Creating a Section
`POST /api/v1/mock-test-section`
```json
{
  "mockTest": "MOCK_TEST_ID",
  "name": "listening",
  "timeLimit": 30
}
```

### Adding Questions
`PUT /api/v1/mock-test-section/:id`
```json
{
  "questions": [
    {
      "type": "L_AUDIO_MCQ",
      "marks": 1,
      "instruction": "Listen and choose the correct job.",
      "audioUrl": "https://...",
      "options": [
        { "optionId": "A", "text": "Doctor" },
        { "optionId": "B", "text": "Teacher" }
      ],
      "correctOptionId": "A"
    }
  ]
}
```

## 5. Implementation Notes
- **IDs**: Use stable string IDs (`optionId`, `segmentId`, `subQuestionId`) for easier mapping between student answers and the question key.
- **Media**: All images are stored in the `images[]` array field to reduce schema clutter.

---

## 6. Frontend UI/Layout Guidelines (AI Prompt Reference)

Use these guidelines when instructing an AI to build the question components:

### A. General Question Layout (Wrap all questions in this)
- **Top Bar**: Question Number (e.g., 5/10), Type Badge (Listening, Reading, etc.), Points, and Section Timer.
- **Main Area**: Stimulus (Audio/Passage/Image) followed by the Interaction Space (Options/Input).
- **Bottom Bar**: Next/Previous buttons and a "Submit Section" button.

### B. Specific Layouts by Type
1.  **L_PICTURE_MATCHING**: 
    - Layout: Audio player on top. Grid of 3-4 images below.
    - Behavior: User clicks an image to select. Highlight the border on selection.
2.  **L_AUDIO_MCQ**: 
    - Layout: Audio player on top. Vertical list of text radio buttons.
3.  **R_FILL_IN_THE_GAP**:
    - Layout: Passage centered. Gaps are designated as `____` or boxes. A "Word Bank" persists at the bottom.
    - Behavior: Drag words from the bank into gaps. Once used, gray out the word in the bank.
4.  **R_REARRANGE_PASSAGE**:
    - Layout: Vertical list of draggable blocks.
    - Behavior: Use `dnd-kit` or `react-beautiful-dnd` to allow reordering.
5.  **W_COMPOSITION_* / W_PINYIN_TO_CHARACTER**:
    - Layout: Large `textarea` with a `spellcheck="false"`.
    - Behavior: Live word count indicator. For topic composition, disable "Submit" until the word count threshold is met.
6.  **S_* (Speaking)**:
    - Layout: Large central microphone icon. Visualizer for audio input.
    - Behavior: Show countdown record time (e.g., 90s). Automatically stop recording and upload when time expires.
