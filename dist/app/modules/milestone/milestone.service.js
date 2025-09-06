"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMilestone = exports.updateMilestone = exports.getMilestoneById = exports.getAllMilestones = exports.createMilestone = void 0;
const Milestone_model_1 = __importDefault(require("./Milestone.model"));
const createMilestone = async (data) => {
    const milestone = new Milestone_model_1.default(data);
    return milestone.save();
};
exports.createMilestone = createMilestone;
const getAllMilestones = async (courseId) => {
    const filter = courseId ? { course: courseId } : {};
    return Milestone_model_1.default.find(filter).sort({ order: 1 });
};
exports.getAllMilestones = getAllMilestones;
const getMilestoneById = async (id) => {
    return Milestone_model_1.default.findById(id);
};
exports.getMilestoneById = getMilestoneById;
const updateMilestone = async (id, data) => {
    return Milestone_model_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateMilestone = updateMilestone;
const deleteMilestone = async (id) => {
    return Milestone_model_1.default.findByIdAndDelete(id);
};
exports.deleteMilestone = deleteMilestone;
