"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleService = void 0;
const Module_model_1 = __importDefault(require("./Module.model"));
const createModule = async (payload) => {
    const result = await Module_model_1.default.create(payload);
    return result;
};
const getAllModules = async () => {
    const result = await Module_model_1.default.find().populate("milestone");
    return result;
};
const getModuleById = async (id) => {
    const result = await Module_model_1.default.findById(id).populate("milestone");
    return result;
};
const updateModule = async (id, payload) => {
    const result = await Module_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
};
const deleteModule = async (id) => {
    const result = await Module_model_1.default.findByIdAndDelete(id);
    return result;
};
exports.ModuleService = {
    createModule,
    getAllModules,
    getModuleById,
    updateModule,
    deleteModule,
};
