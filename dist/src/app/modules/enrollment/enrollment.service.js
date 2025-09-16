"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnrollment = exports.updateEnrollment = exports.getEnrollmentById = exports.getAllEnrollments = exports.createEnrollment = void 0;
const Enrollment_model_1 = __importDefault(require("./Enrollment.model"));
const createEnrollment = async (data) => {
    return await Enrollment_model_1.default.create(data);
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
