import express from "express";
import {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "./quiz.controller";
import validateRequest from "../../middleware/validateRequest.middleware";
import { iQuizSchema } from "./quiz.validation";


const router = express.Router();

router.post("/", validateRequest(iQuizSchema), createQuiz);
router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
router.put("/:id", validateRequest(iQuizSchema), updateQuiz);
router.delete("/:id", deleteQuiz);

const QuizRoutes = router;
export default QuizRoutes
