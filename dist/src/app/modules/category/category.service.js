"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const Category_model_1 = require("./Category.model");
exports.CategoryService = {
    async createCategory(data) {
        return await Category_model_1.Category.create(data);
    },
    async getAllCategories() {
        return await Category_model_1.Category.find().sort({ createdAt: -1 });
    },
    async getAllCategoriesForSelecting() {
        return await Category_model_1.Category.find().sort({ createdAt: -1 }).select('_id title ');
    },
    async getCategoryById(id) {
        return await Category_model_1.Category.findById(id);
    },
    async updateCategory(id, data) {
        return await Category_model_1.Category.findByIdAndUpdate(id, data, { new: true });
    },
    async deleteCategory(id) {
        return await Category_model_1.Category.findByIdAndDelete(id);
    },
};
