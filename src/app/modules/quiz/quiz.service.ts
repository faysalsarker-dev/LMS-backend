import  Quiz  from "./quiz.model";
import { IQuiz } from "./quiz.interface";

// Create quiz
export const createQuiz = async (payload: IQuiz): Promise<IQuiz> => {
  const quiz = await Quiz.create(payload);
  return quiz;
};

// Get all quizzes
export const getAllQuizzes = async (): Promise<IQuiz[]> => {
  return Quiz.find().populate("module");
};

// Get quiz by id
export const getQuizById = async (id: string): Promise<IQuiz | null> => {
  return Quiz.findById(id).populate("module");
};

// Update quiz
export const updateQuiz = async (
  id: string,
  payload: Partial<IQuiz>
): Promise<IQuiz | null> => {
  return Quiz.findByIdAndUpdate(id, payload, { new: true });
};

// Delete quiz
export const deleteQuiz = async (id: string): Promise<IQuiz | null> => {
  return Quiz.findByIdAndDelete(id);
};
