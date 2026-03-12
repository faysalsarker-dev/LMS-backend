import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import MockTest from "./mockTest.model";
import MockTestSection from "../mockTestSection/mockTestSection.model";
import { MockQuestionType } from "../mockTestSection/mockTestSection.interface";

// Load environment variables
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
const COURSE_ID = "68ed070d222776684082ffec";

async function seedData() {
  if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to database...");
    await mongoose.connect(DATABASE_URL);
    console.log("✅ Database connected.");

    // 1. Create Mock Test Container
    const mockTest = await MockTest.create({
      title: "HSK 4 Full Mock Test - Demo",
      course: new mongoose.Types.ObjectId(COURSE_ID),
      status: "published",
      thumbnail: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=2071&auto=format&fit=crop",
    });

    console.log(`✅ Mock Test created: ${mockTest._id}`);

    // 2. Listening Section
    const listeningSection = await MockTestSection.create({
      mockTest: mockTest._id,
      name: "listening",
      timeLimit: 30,
      instruction: "Please listen carefully and answer the following questions.",
      questions: [
        {
          type: MockQuestionType.L_PICTURE_MATCHING,
          marks: 2,
          instruction: "Listen and choose the correct picture.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
          options: [
            { optionId: "A", imageUrl: "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=500&auto=format&fit=crop" }, // Orange
            { optionId: "B", imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?w=500&auto=format&fit=crop" }, // Apple
            { optionId: "C", imageUrl: "https://images.unsplash.com/photo-1550258114-b8a27a03f198?w=500&auto=format&fit=crop" }, // Pineapple
          ],
          correctOptionId: "B",
        },
        {
          type: MockQuestionType.L_AUDIO_MCQ,
          marks: 3,
          instruction: "Listen to the dialogue and choose the best answer.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
          questionText: "What are they talking about?",
          options: [
            { optionId: "A", text: "Going to the cinema" },
            { optionId: "B", text: "Planning a dinner" },
            { optionId: "C", text: "Buying a gift" },
          ],
          correctOptionId: "A",
        },
        {
          type: MockQuestionType.L_LONG_DIALOGUE_MATCHING,
          marks: 5,
          instruction: "Listen to the long conversation and match the speakers to their actions.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
          options: [
            { optionId: "A", text: "Xiao Ming - Running" },
            { optionId: "B", text: "Xiao Hua - Swimming" },
            { optionId: "C", text: "Lao Wang - Dancing" },
          ],
          correctOptionId: "C",
        }
      ]
    });
    console.log("✅ Listening section created.");

    // 3. Reading Section
    const readingSection = await MockTestSection.create({
      mockTest: mockTest._id,
      name: "reading",
      timeLimit: 40,
      instruction: "Read the passages and answer the questions.",
      questions: [
        {
          type: MockQuestionType.R_SENTENCE_TO_PICTURE,
          marks: 2,
          instruction: "Read the sentence and choose the matching picture.",
          questionText: "The children are playing hide and seek in the garden.",
          options: [
            { optionId: "A", imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea2443d844c?w=500&auto=format&fit=crop" }, // Garden
            { optionId: "B", imageUrl: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=500&auto=format&fit=crop" }, // Playing
            { optionId: "C", imageUrl: "https://images.unsplash.com/photo-1464398580738-2ee30248644d?w=500&auto=format&fit=crop" }, // Office
          ],
          correctOptionId: "B",
        },
        {
          type: MockQuestionType.R_FILL_IN_THE_GAP,
          marks: 4,
          instruction: "Choose the correct words to fill the gaps.",
          passageText: "Learning Chinese is not as {{gap_1}} as it seems. If you {{gap_2}} every day, you will improve quickly.",
          wordPool: [
            { optionId: "W1", text: "hard" },
            { optionId: "W2", text: "practice" },
            { optionId: "W3", text: "sleep" },
            { optionId: "W4", text: "easy" },
          ],
          correctGaps: new Map([
            ["gap_1", "W1"],
            ["gap_2", "W2"],
          ]),
        },
        {
          type: MockQuestionType.R_REARRANGE_PASSAGE,
          marks: 5,
          instruction: "Rearrange the segments to form a logical passage.",
          segments: [
            { segmentId: "S1", text: "Finally, he reached the summit.", correctPosition: 3 },
            { segmentId: "S2", text: "He started climbing early in the morning.", correctPosition: 1 },
            { segmentId: "S3", text: "The weather was cold but clear.", correctPosition: 2 },
          ],
        },
        {
          type: MockQuestionType.R_PASSAGE_MCQ,
          marks: 6,
          instruction: "Read the passage and answer the sub-questions.",
          passage: "Beijing is the capital of China. It has a long history and many cultural sites like the Great Wall and the Forbidden City. Millions of tourists visit every year.",
          subQuestions: [
            {
              subQuestionId: "SQ1",
              questionText: "What is the capital of China?",
              options: [
                { optionId: "A", text: "Shanghai" },
                { optionId: "B", text: "Beijing" },
                { optionId: "C", text: "Guangzhou" },
              ],
              correctOptionId: "B",
              marks: 3,
            },
            {
              subQuestionId: "SQ2",
              questionText: "Which landmark is mentioned?",
              options: [
                { optionId: "A", text: "Yellow River" },
                { optionId: "B", text: "Great Wall" },
                { optionId: "C", text: "Mount Tai" },
              ],
              correctOptionId: "B",
              marks: 3,
            }
          ]
        }
      ]
    });
    console.log("✅ Reading section created.");

    // 4. Writing Section
    const writingSection = await MockTestSection.create({
      mockTest: mockTest._id,
      name: "writing",
      timeLimit: 25,
      instruction: "Write your answers in the provided spaces.",
      questions: [
        {
          type: MockQuestionType.W_PICTURE_TO_WORD,
          marks: 2,
          instruction: "Write the name of the object in the picture.",
          images: ["https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&auto=format&fit=crop"], // Laptop
          correctOptionId: "laptop", // Simple string for validation
          options: [{ optionId: "hidden", text: "laptop" }]
        },
        {
          type: MockQuestionType.W_WORD_TO_SENTENCE,
          marks: 3,
          instruction: "Rearrange the words to make a correct sentence.",
          wordTokens: ["delicious", "is", "this", "food"],
          correctSentence: "this food is delicious",
        },
        {
          type: MockQuestionType.W_PINYIN_TO_CHARACTER,
          marks: 2,
          instruction: "Write the Chinese character for the pinyin.",
          pinyin: "nǐ hǎo",
          questionText: "Write 'Hello' in Chinese characters.",
        },
        {
          type: MockQuestionType.W_COMPOSITION_PICTURES,
          marks: 10,
          instruction: "Write a short story (80 words) based on the 4 pictures.",
          images: [
            "https://images.unsplash.com/photo-1526733158272-6048a8ed5c8c?w=500&auto=format&fit=crop", // Wake up
            "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=500&auto=format&fit=crop", // Coffee
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&auto=format&fit=crop", // Office
            "https://images.unsplash.com/photo-1544333331-411a768e98bc?w=500&auto=format&fit=crop", // Sleeping
          ],
        },
        {
          type: MockQuestionType.W_COMPOSITION_TOPIC,
          marks: 15,
          instruction: "Write an essay on the given topic.",
          topic: "The importance of environmental protection.",
          minWordCount: 150,
        }
      ]
    });
    console.log("✅ Writing section created.");

    // 5. Speaking Section
    const speakingSection = await MockTestSection.create({
      mockTest: mockTest._id,
      name: "speaking",
      timeLimit: 15,
      instruction: "Record your voice for the following tasks.",
      questions: [
        {
          type: MockQuestionType.S_REPEAT_AFTER_LISTENING,
          marks: 5,
          instruction: "Listen and repeat the sentence exactly.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
          allowedRecordingTime: 15,
        },
        {
          type: MockQuestionType.S_SPEAK_ON_PICTURE,
          marks: 10,
          instruction: "Describe the picture in detail for 2 minutes.",
          images: ["https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=500&auto=format&fit=crop"], // Bridge
          allowedRecordingTime: 120,
        },
        {
          type: MockQuestionType.S_ANSWER_QUESTION,
          marks: 5,
          instruction: "Answer the following question orally.",
          questionText: "Tell us about your favorite holiday trip.",
          audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
          allowedRecordingTime: 60,
        }
      ]
    });
    console.log("✅ Speaking section created.");

    // 6. Link sections to Mock Test
    mockTest.listening = listeningSection._id as any;
    mockTest.reading = readingSection._id as any;
    mockTest.writing = writingSection._id as any;
    mockTest.speaking = speakingSection._id as any;
    await mockTest.save();

    console.log("🚀 All data seeded successfully!");
    console.log(`Mock Test ID: ${mockTest._id}`);

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("👋 Disconnected from database.");
  }
}

seedData();
