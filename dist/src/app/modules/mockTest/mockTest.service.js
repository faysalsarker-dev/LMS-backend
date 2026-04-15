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
const mockTestSection_model_1 = __importDefault(require("../mockTestSection/mockTestSection.model"));
const fileDelete_1 = require("../../utils/fileDelete");
const getMocktestForUser = async (userId) => {
    const user = await User_model_1.default.findById(userId).select("courses");
    if (!user || (!user.courses || user.courses.length === 0)) {
        return [];
    }
    const courseIds = user.courses;
    const mockTests = await mockTest_model_1.default.find({
        course: { $in: courseIds },
        status: "published",
    }).select("title slug thumbnail _id course").populate("course", "title slug");
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
    const mockTest = await mockTest_model_1.default.findById(id);
    if (!mockTest)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "MockTest not found");
    const intl = mockTest.isInternational ?? true;
    if (mockTest.thumbnail) {
        try {
            await (0, fileDelete_1.deleteFile)(mockTest.thumbnail, intl);
        }
        catch (error) {
            console.error(`Failed to delete mock test thumbnail for ${id}:`, error.message);
        }
    }
    const sectionIds = [mockTest.listening, mockTest.reading, mockTest.writing, mockTest.speaking].filter(Boolean);
    for (const sectionId of sectionIds) {
        const section = await mockTestSection_model_1.default.findById(sectionId);
        if (!section)
            continue;
        const sectionIntl = section.isInternational ?? intl;
        for (const question of section.questions || []) {
            if (question.audioUrl) {
                try {
                    await (0, fileDelete_1.deleteFile)(question.audioUrl, sectionIntl);
                }
                catch (error) {
                    console.error(`Failed to delete section question audio for section ${sectionId}:`, error.message);
                }
            }
            for (const imageUrl of question.images || []) {
                if (imageUrl) {
                    try {
                        await (0, fileDelete_1.deleteFile)(imageUrl, sectionIntl);
                    }
                    catch (error) {
                        console.error(`Failed to delete section question image for section ${sectionId}:`, error.message);
                    }
                }
            }
        }
        await mockTestSection_model_1.default.findByIdAndDelete(sectionId);
    }
    return mockTest_model_1.default.findByIdAndDelete(id).exec();
};
exports.deleteMockTest = deleteMockTest;
