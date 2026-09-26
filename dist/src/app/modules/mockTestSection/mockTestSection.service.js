"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMockTestSection = exports.updateMockTestSection = exports.getMockTestSectionById = exports.getAllMockTestSections = exports.createMockTestSection = void 0;
const mongoose_1 = require("mongoose");
const mockTestSection_model_1 = __importDefault(require("./mockTestSection.model"));
const ApiError_1 = require("../../errors/ApiError");
const http_status_1 = __importDefault(require("http-status"));
const mockTest_model_1 = __importDefault(require("../mockTest/mockTest.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const fileDelete_1 = require("../../utils/fileDelete");
const createMockTestSection = async (payload) => {
    const mockTest = await mockTest_model_1.default.findById(payload.mockTest);
    if (!mockTest) {
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Associated MockTest not found");
    }
    const section = await mockTestSection_model_1.default.create(payload);
    // Link the section back to the MockTest container
    const updateField = payload.name;
    await mockTest_model_1.default.findByIdAndUpdate(payload.mockTest, {
        [updateField]: section._id,
    });
    return section;
};
exports.createMockTestSection = createMockTestSection;
const getAllMockTestSections = async (query) => {
    const sectionQuery = new QueryBuilder_1.default(mockTestSection_model_1.default.find().populate("mockTest"), query)
        .search(["name"])
        .filter()
        .sort()
        .paginate();
    const result = await sectionQuery.modelQuery;
    const meta = await sectionQuery.countTotal();
    return {
        meta,
        result,
    };
};
exports.getAllMockTestSections = getAllMockTestSections;
const getMockTestSectionById = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid Section ID");
    const section = await mockTestSection_model_1.default.findById(id).populate("mockTest");
    if (!section)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Section not found");
    return section;
};
exports.getMockTestSectionById = getMockTestSectionById;
const updateMockTestSection = async (id, payload) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid Section ID");
    const section = await mockTestSection_model_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!section)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Section not found");
    section.totalMarks = section.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
    await section.save();
    return section;
};
exports.updateMockTestSection = updateMockTestSection;
const deleteMockTestSection = async (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        throw new ApiError_1.ApiError(http_status_1.default.BAD_REQUEST, "Invalid Section ID");
    const section = await mockTestSection_model_1.default.findById(id);
    if (!section)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Section not found");
    const intl = section.isInternational ?? true;
    for (const question of section.questions || []) {
        if (question.audioUrl) {
            try {
                await (0, fileDelete_1.deleteFile)(question.audioUrl, intl);
            }
            catch (error) {
                console.error(`Failed to delete section question audio for ${id}:`, error.message);
            }
        }
        for (const imageUrl of question.images || []) {
            if (imageUrl) {
                try {
                    await (0, fileDelete_1.deleteFile)(imageUrl, intl);
                }
                catch (error) {
                    console.error(`Failed to delete section question image for ${id}:`, error.message);
                }
            }
        }
    }
    const deleted = await mockTestSection_model_1.default.findByIdAndDelete(id);
    if (!deleted)
        throw new ApiError_1.ApiError(http_status_1.default.NOT_FOUND, "Section not found");
    if (deleted.mockTest && deleted.name) {
        await mockTest_model_1.default.findByIdAndUpdate(deleted.mockTest, {
            $unset: { [deleted.name]: "" },
        });
    }
    return deleted;
};
exports.deleteMockTestSection = deleteMockTestSection;
