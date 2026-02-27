"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoService = void 0;
const ApiError_1 = require("../../errors/ApiError");
const Promo_model_1 = __importDefault(require("./Promo.model"));
const mongoose_1 = require("mongoose");
// --------------------------
// Create promo (User can create only ONE)
// --------------------------
const createPromo = async (data) => {
    console.log(data);
    const exist = await Promo_model_1.default.findOne({ owner: data.owner, isDeleted: false });
    if (exist)
        throw new ApiError_1.ApiError(400, "User already contain a promo");
    const promo = await Promo_model_1.default.create({ ...data });
    console.log(promo);
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
    let promo = await Promo_model_1.default.findOne({ createdBy: userId }).lean();
    if (!promo)
        throw new ApiError_1.ApiError(404, "Promo not found");
    return promo;
};
// --------------------------
// Update promo
// --------------------------
const updatePromo = async (id, data) => {
    const promo = await Promo_model_1.default.findById(id);
    if (!promo)
        throw new ApiError_1.ApiError(404, "Promo not found");
    console.log(data);
    Object.assign(promo, data);
    await promo.save();
    return promo;
};
// --------------------------
// Soft delete promo
// --------------------------
const deletePromo = async (id) => {
    const result = await Promo_model_1.default.findByIdAndDelete(id);
    if (!result)
        throw new ApiError_1.ApiError(404, "Promo not found");
    return result;
};
const getAllPromosAdmin = async (query) => {
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "desc", search = "", isActive, } = query;
    const skip = (page - 1) * limit;
    // filters
    const filter = { isDeleted: false };
    if (search) {
        filter.$or = [
            { code: { $regex: search, $options: "i" } },
            { "createdBy.name": { $regex: search, $options: "i" } },
            { "createdBy.email": { $regex: search, $options: "i" } },
        ];
    }
    if (isActive !== undefined)
        filter.isActive = isActive;
    const promos = await Promo_model_1.default.find()
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("createdBy", "name email");
    const total = await Promo_model_1.default.countDocuments(filter);
    console.log(promos, 'promos');
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
// Service 1: Get promo statistics (no filters)
const getPromoStatistics = async () => {
    // Total codes
    const totalCodes = await Promo_model_1.default.countDocuments({ isDeleted: false });
    // Active codes
    const activeCodes = await Promo_model_1.default.countDocuments({
        isDeleted: false,
        isActive: true,
    });
    // Total usage across all promos
    const usageResult = await Promo_model_1.default.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: null,
                totalUsage: { $sum: "$usageCount" },
            },
        },
    ]);
    const totalUsage = usageResult[0]?.totalUsage || 0;
    // Average discount
    const discountResult = await Promo_model_1.default.aggregate([
        { $match: { isDeleted: false, discountValue: { $exists: true, $ne: null } } },
        {
            $group: {
                _id: null,
                avgDiscount: { $avg: "$discountValue" },
                total: { $sum: "$discountValue" },
                count: { $sum: 1 }
            }
        }
    ]).exec();
    const avgDiscount = discountResult[0]?.avgDiscount ?? 0;
    return {
        totalCodes,
        activeCodes,
        totalUsage,
        avgDiscount: Math.round(avgDiscount * 100) / 100,
    };
};
const getPromoMonthlyChart = async (year) => {
    const pipeline = [
        // 1. Unwind usedBy array
        {
            $unwind: "$usedBy"
        },
        // 2. Filter by year
        {
            $match: {
                $expr: {
                    $eq: [{ $year: "$usedBy.usedAt" }, year]
                }
            }
        },
        // 3. Group by month → count usage
        {
            $group: {
                _id: { month: { $month: "$usedBy.usedAt" } },
                totalUses: { $sum: 1 }
            }
        },
        // 4. Format output
        {
            $project: {
                _id: 0,
                month: "$_id.month",
                totalUses: 1
            }
        }
    ];
    const raw = await Promo_model_1.default.aggregate(pipeline);
    // 5. Fill missing months with 0
    const final = Array.from({ length: 12 }, (_, i) => {
        const found = raw.find((r) => r.month === i + 1);
        return {
            month: i + 1,
            totalUses: found?.totalUses || 0
        };
    });
    console.log(final, 'final');
    return final;
};
const getDetailedAnalytics = async (query) => {
    const { year = new Date().getFullYear(), status, code, } = query;
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);
    const initialMatch = { isDeleted: false };
    if (status === "active") {
        initialMatch.isActive = true;
    }
    else if (status === "inactive") {
        initialMatch.isActive = false;
    }
    if (code) {
        initialMatch.code = code;
    }
    const pipeline = [
        { $match: initialMatch },
        {
            $addFields: {
                filteredUsages: {
                    $filter: {
                        input: "$usedBy",
                        as: "usage",
                        cond: {
                            $and: [
                                { $gte: ["$usage.usedAt", start] },
                                { $lte: ["$usage.usedAt", end] },
                            ],
                        },
                    },
                },
            },
        },
        {
            $addFields: {
                yearlyUsageCount: { $size: "$filteredUsages" },
            },
        },
        {
            $match: {
                yearlyUsageCount: { $gt: 0 },
            },
        },
        {
            $project: {
                code: 1,
                description: 1,
                discountType: 1,
                discountValue: 1,
                isActive: 1,
                yearlyUsageCount: 1,
                totalDiscountGiven: {
                    $cond: {
                        if: { $eq: ["$discountType", "fixed_amount"] },
                        then: { $multiply: ["$discountValue", "$yearlyUsageCount"] },
                        else: 0,
                    },
                },
            },
        },
        { $sort: { yearlyUsageCount: -1 } },
    ];
    const topPromoCodes = await Promo_model_1.default.aggregate(pipeline);
    return {
        year,
        status,
        topPromoCodes,
        summary: {
            totalPromoCodes: topPromoCodes.length,
            totalUsages: topPromoCodes.reduce((sum, promo) => sum + promo.yearlyUsageCount, 0),
        },
    };
};
const redeemPromoService = async ({ code, userId, orderAmount, }) => {
    const promo = await Promo_model_1.default.findOne({ code: code.trim().toUpperCase() });
    if (!promo)
        throw new ApiError_1.ApiError(404, "Promo code not found");
    // --- Check active ---
    if (!promo.isActive)
        throw new ApiError_1.ApiError(400, "This promo code is inactive");
    const now = new Date();
    // --- Check date validity ---
    if (promo.validFrom > now)
        throw new ApiError_1.ApiError(400, "Promo not active yet");
    if (promo.expirationDate < now)
        throw new ApiError_1.ApiError(400, "Promo has expired");
    // --- Check global usage limit ---
    if (promo.maxUsageCount && promo.currentUsageCount >= promo.maxUsageCount) {
        throw new ApiError_1.ApiError(400, "Promo usage limit reached");
    }
    // --- Check per-user usage ---
    const usedByUser = promo.usedBy.filter((u) => u.user.toString() === userId);
    if (promo.maxUsagePerUser && usedByUser.length >= promo.maxUsagePerUser) {
        throw new ApiError_1.ApiError(400, "You already used this promo");
    }
    // --- Calculate discount ---
    let discount = 0;
    if (promo.discountType === "percentage") {
        discount = (orderAmount * promo.discountValue) / 100;
    }
    else {
        discount = promo.discountValue;
    }
    const finalAmount = Math.max(orderAmount - discount, 0);
    // --- Update usage ---
    promo.usedBy.push({
        user: new mongoose_1.Types.ObjectId(userId),
        usedAt: new Date(),
    });
    promo.currentUsageCount += 1;
    await promo.save();
    return {
        discount,
        finalAmount,
        promo,
    };
};
const validatePromoService = async ({ code, userId, orderAmount, }) => {
    const promo = await Promo_model_1.default.findOne({ code: code.trim().toUpperCase() });
    if (!promo)
        throw new ApiError_1.ApiError(404, "Promo code not found");
    if (!promo.isActive)
        throw new ApiError_1.ApiError(400, "Promo is inactive");
    const now = new Date();
    if (promo.validFrom > now)
        throw new ApiError_1.ApiError(400, "Promo starts later");
    if (promo.expirationDate < now)
        throw new ApiError_1.ApiError(400, "Promo expired");
    if (promo.maxUsageCount && promo.currentUsageCount >= promo.maxUsageCount) {
        throw new ApiError_1.ApiError(400, "Promo limit reached");
    }
    const usedByUser = promo.usedBy.filter((u) => u.user.toString() === userId);
    if (promo.maxUsagePerUser && usedByUser.length >= promo.maxUsagePerUser) {
        throw new ApiError_1.ApiError(400, "You already used this promo");
    }
    // --- calculate potential discount ---
    let discount = 0;
    if (promo.discountType === "percentage") {
        discount = (orderAmount * promo.discountValue) / 100;
    }
    else {
        discount = promo.discountValue;
    }
    const finalAmount = Math.max(orderAmount - discount, 0);
    return {
        isValid: true,
        discount,
        finalAmount,
        promo,
    };
};
exports.PromoService = {
    createPromo,
    getMyPromo,
    getMyPromoUsageStats,
    updatePromo,
    deletePromo,
    getAllPromosAdmin,
    getPromoById,
    getPromoStatistics,
    getPromoMonthlyChart,
    getDetailedAnalytics,
    redeemPromoService,
    validatePromoService
};
