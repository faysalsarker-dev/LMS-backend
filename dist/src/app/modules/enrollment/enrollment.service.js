"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnrollment = exports.updateEnrollment = exports.getEnrollmentById = exports.getAllEnrollments = exports.createEnrollment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_model_1 = __importDefault(require("../auth/User.model"));
const Enrollment_model_1 = __importDefault(require("./Enrollment.model"));
const progress_model_1 = __importDefault(require("../progress/progress.model"));
const Course_model_1 = __importDefault(require("../course/Course.model"));
const createEnrollment = async (data) => {
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const enrollment = await new Enrollment_model_1.default(data).save({ session });
        await User_model_1.default.findByIdAndUpdate(data.user, { $push: { courses: data.course } }, { new: true, session });
        await Course_model_1.default.findByIdAndUpdate(data.course, { $inc: { totalEnrolled: 1 } }, { new: true, session });
        const newProgress = new progress_model_1.default({
            student: data.user,
            course: data.course,
            completedLessons: [],
            progressPercentage: 0,
            isCompleted: false,
        });
        await newProgress.save({ session });
        await session.commitTransaction();
        session.endSession();
        return enrollment;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
exports.createEnrollment = createEnrollment;
const getAllEnrollments = async () => {
    return await Enrollment_model_1.default.find().populate("user course");
};
exports.getAllEnrollments = getAllEnrollments;
const getEnrollmentById = async (id) => {
    return await Enrollment_model_1.default.findById(id).populate("user course");
};
exports.getEnrollmentById = getEnrollmentById;
const updateEnrollment = async (id, data) => {
    return await Enrollment_model_1.default.findByIdAndUpdate(id, data, { new: true }).populate("user course");
};
exports.updateEnrollment = updateEnrollment;
const deleteEnrollment = async (id) => {
    return await Enrollment_model_1.default.findByIdAndDelete(id);
};
exports.deleteEnrollment = deleteEnrollment;
