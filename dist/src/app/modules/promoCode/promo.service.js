"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoService = void 0;
const ApiError_1 = require("../../errors/ApiError");
const Promo_model_1 = __importDefault(require("./Promo.model"));
// --------------------------
// Create promo (User can create only ONE)
// --------------------------
const createPromo = async (userId, data) => {
    const exist = await Promo_model_1.default.findOne({ createdBy: userId, isDeleted: false });
    if (exist)
        throw new ApiError_1.ApiError(400, "You already created a promo");
    const promo = await Promo_model_1.default.create({ ...data, createdBy: userId });
    return promo;
};
// --------------------------
// Get user-specific promo (only their promo)
// --------------------------
const getMyPromo = async (userId) => {
    const promo = await Promo_model_1.default.findOne({ createdBy: userId, isDeleted: false });
    if (!promo)
        throw new ApiError_1.ApiError(404, "No promo found for this user");
    return promo;
};
// --------------------------
// Get usage stats for chart
// --------------------------
const getMyPromoUsageStats = async (userId) => {
    const promo = await Promo_model_1.default.findOne({ createdBy: userId }).lean();
    if (!promo)
        throw new ApiError_1.ApiError(404, "Promo not found");
    // chart-ready format
    const monthly = promo.usedBy.reduce((acc, entry) => {
        const month = new Date(entry.usedAt).toLocaleString("en-US", { month: "short" });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {});
    return { code: promo.code, stats: monthly };
};
// --------------------------
// Update promo
// --------------------------
const updatePromo = async (id, data) => {
    const promo = await Promo_model_1.default.findById(id);
    if (!promo)
        throw new ApiError_1.ApiError(404, "Promo not found");
    Object.assign(promo, data);
    await promo.save();
    return promo;
};
// --------------------------
// Soft delete promo
// --------------------------
const deletePromo = async (id) => {
    const promo = await Promo_model_1.default.findById(id);
    if (!promo)
        throw new ApiError_1.ApiError(404, "Promo not found");
    promo.isDeleted = true;
    promo.isActive = false;
    await promo.save();
    return { message: "Promo deleted" };
};
// --------------------------
// ADMIN — Get all promo with pagination + filter + sort
// --------------------------
const getAllPromosAdmin = async (query) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search = "", isActive, } = query;
    const skip = (page - 1) * limit;
    // filters
    const filter = { isDeleted: false };
    if (search) {
        filter.code = { $regex: search, $options: "i" };
    }
    if (isActive !== undefined)
        filter.isActive = isActive;
    const promos = await Promo_model_1.default.find(filter)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("createdBy", "name email");
    const total = await Promo_model_1.default.countDocuments(filter);
    return {
        data: promos,
        meta: {
            page: Number(page),
            limit: Number(limit),
            total,
        },
    };
};
// --------------------------
// ADMIN — Get single promo with info
// --------------------------
const getPromoById = async (id) => {
    const promo = await Promo_model_1.default.findById(id);
    if (!promo)
        throw new ApiError_1.ApiError(404, "Promo not found");
    return promo;
};
exports.PromoService = {
    createPromo,
    getMyPromo,
    getMyPromoUsageStats,
    updatePromo,
    deletePromo,
    getAllPromosAdmin,
    getPromoById,
};
