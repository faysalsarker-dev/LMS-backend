"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMockTest = exports.updateMockTest = exports.getMockTestBySlug = exports.getMockTestById = exports.getAllMockTests = exports.createMockTest = exports.getMocktestForUser = void 0;
const mongoose_1 = require("mongoose");
const mockTest_model_1 = __importDefault(require("./mockTest.model"));
const ApiError_1 = require("../../errors/ApiError");
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const User_model_1 = __importDefault(require("../auth/User.model"));
const getMocktestForUser = async (userId) => {
    const user = await User_model_1.default.findById(userId).select("courses");
    if (!user) {
        return [];
    }
    const courseIds = user.courses || [];
    const mockTests = await mockTest_model_1.default.find({
        course: { $in: courseIds },
        status: "published",
    }).populate("course", "title slug");
    return mockTests;
};
exports.getMocktestForUser = getMocktestForUser;
const createMockTest = async (payload) => {
    const mockTest = await mockTest_model_1.default.create(payload);
    return mockTest;
};
exports.createMockTest = createMockTest;
const getAllMockTests = async (query) => {
    const mockTestQuery = new QueryBuilder_1.default(mockTest_model_1.default.find().populate("course", "title slug"), query)
        .search(["title"])
        .filter()
        .sort()
        .paginate();
    const [data, metaInfo] = await Promise.all([
        mockTestQuery.modelQuery,
        mockTestQuery.countTotal(),
    ]);
    return {
        meta: metaInfo,
        data,
    };
};
exports.getAllMockTests = getAllMockTests;
const getMockTestById = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid ID");
    const mockTest = await mockTest_model_1.default.findById(id)
        .populate("course", "title slug")
        .populate("listening")
        .populate("reading")
        .populate("writing")
        .populate("speaking");
    if (!mockTest)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "MockTest not found");
    return mockTest;
};
exports.getMockTestById = getMockTestById;
const getMockTestBySlug = async (slug) => {
    const mockTest = await mockTest_model_1.default.findOne({ slug })
        .populate("course", "title slug")
        .populate("listening")
        .populate("reading")
        .populate("writing")
        .populate("speaking");
    if (!mockTest)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "MockTest not found");
    return mockTest;
};
exports.getMockTestBySlug = getMockTestBySlug;
const updateMockTest = async (id, payload) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid ID");
    const mockTest = await mockTest_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!mockTest)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "MockTest not found");
    return mockTest;
};
exports.updateMockTest = updateMockTest;
const deleteMockTest = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid ID");
    // TODO: Make sure to implement logic later to delete the associated MockTestSections
    const mockTest = await mockTest_model_1.default.findByIdAndDelete(id);
    if (!mockTest)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "MockTest not found");
    return mockTest;
};
exports.deleteMockTest = deleteMockTest;
