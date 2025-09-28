"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const quiz_controller_1 = require("./quiz.controller");
const validateRequest_middleware_1 = __importDefault(require("../../middleware/validateRequest.middleware"));
const quiz_validation_1 = require("./quiz.validation");
const router = express_1.default.Router();
router.post("/", (0, validateRequest_middleware_1.default)(quiz_validation_1.iQuizSchema), quiz_controller_1.createQuiz);
router.get("/", quiz_controller_1.getAllQuizzes);
router.get("/:id", quiz_controller_1.getQuizById);
router.put("/:id", (0, validateRequest_middleware_1.default)(quiz_validation_1.iQuizSchema), quiz_controller_1.updateQuiz);
router.delete("/:id", quiz_controller_1.deleteQuiz);
const QuizRoutes = router;
exports.default = QuizRoutes;
