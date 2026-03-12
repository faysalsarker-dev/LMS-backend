"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMilestone = exports.updateMilestone = exports.getMilestoneById = exports.getAllMilestones = exports.createMilestone = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Course_model_1 = __importDefault(require("../course/Course.model"));
const Milestone_model_1 = __importDefault(require("./Milestone.model"));
const ApiError_1 = require("../../errors/ApiError");
const http_status_1 = __importDefault(require("http-status"));
const createMilestone = async (data) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const milestone = new Milestone_model_1.default(data);
        const result = await milestone.save({ session });
        if (data.course) {
            await Course_model_1.default.findByIdAndUpdate(data.course, { $push: { milestones: result._id } }, { new: true, session });
        }
        else {
            throw new ApiError_1.ApiError(404, "Course ID is missing in milestone data");
        }
        await session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("❌ Transaction failed:", error.message);
        throw new ApiError_1.ApiError(http_status_1.default.FAILED_DEPENDENCY, "Failed to create milestone and update course");
    }
};
exports.createMilestone = createMilestone;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const getAllMilestones = async (course, search, status) => {
    const searchableFields = ["title"];
    const queryParams = {};
    // Handle course filtering natively
    if (course && course !== "all") {
        queryParams.course = course;
    }
    else if (course === "all") {
        queryParams.course = { $exists: true };
    }
    // Handle status natively
    if (status && status !== "all") {
        queryParams.status = status;
    }
    else if (status === "all") {
        queryParams.status = { $exists: true };
    }
    if (search)
        queryParams.search = search;
    const milestoneQuery = new QueryBuilder_1.default(Milestone_model_1.default.find().populate("course", "title").lean(), queryParams)
        .search(searchableFields)
        .filter()
        .sort();
    milestoneQuery.modelQuery = milestoneQuery.modelQuery.sort({ order: 1 });
    return milestoneQuery.modelQuery;
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
