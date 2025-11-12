"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CheckAuth_1 = require("../../middleware/CheckAuth");
const agt_controller_1 = require("./agt.controller");
const multer_config_1 = require("../../config/multer.config");
const router = express_1.default.Router();
// ---------------------------
// Student routes
// ---------------------------
router.post("/", (0, CheckAuth_1.checkAuth)(), multer_config_1.multerUpload.single("file"), agt_controller_1.AssignmentSubmissionController.createSubmission);
router.get("/:id", (0, CheckAuth_1.checkAuth)(), agt_controller_1.AssignmentSubmissionController.getSubmission);
router.get("/", (0, CheckAuth_1.checkAuth)(), agt_controller_1.AssignmentSubmissionController.getAllSubmissions);
// ---------------------------
// Admin routes
// ---------------------------
router.patch("/review/:id", (0, CheckAuth_1.checkAuth)(), agt_controller_1.AssignmentSubmissionController.adminReview);
router.patch("/:id", (0, CheckAuth_1.checkAuth)(), multer_config_1.multerUpload.single("file"), agt_controller_1.AssignmentSubmissionController.updateSubmission);
router.delete("/:id", (0, CheckAuth_1.checkAuth)(), agt_controller_1.AssignmentSubmissionController.deleteSubmission);
exports.default = router;
