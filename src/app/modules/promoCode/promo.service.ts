import { IPromoCode } from "./promo.interface";
import { ApiError } from "../../errors/ApiError";
import PromoCode from "./Promo.model";

// --------------------------
// Create promo (User can create only ONE)
// --------------------------
const createPromo = async (data: IPromoCode) => {
  const exist = await PromoCode.findOne({ createdBy: data.createdBy, isDeleted: false });
  if (exist) throw new ApiError(400, "User already contain a promo");
  const promo = await PromoCode.create({ ...data });
  return promo;
};

// --------------------------
// Get user-specific promo (only their promo)
// --------------------------
const getMyPromo = async (userId: string) => {
  const promo = await PromoCode.findOne({ createdBy: userId, isDeleted: false });
  if (!promo) throw new ApiError(404, "No promo found for this user");

  return promo;
};

// --------------------------
// Get usage stats for chart
// --------------------------
const getMyPromoUsageStats = async (userId: string) => {
  const promo = await PromoCode.findOne({ createdBy: userId }).lean();
  if (!promo) throw new ApiError(404, "Promo not found");

  // chart-ready format
  const monthly = promo.usedBy.reduce((acc: any, entry: any) => {
    const month = new Date(entry.usedAt).toLocaleString("en-US", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  return { code: promo.code, stats: monthly };
};

// --------------------------
// Update promo
// --------------------------
const updatePromo = async (id: string, data: Partial<IPromoCode>) => {
  const promo = await PromoCode.findById(id);
  if (!promo) throw new ApiError(404, "Promo not found");

  Object.assign(promo, data);
  await promo.save();

  return promo;
};

// --------------------------
// Soft delete promo
// --------------------------
const deletePromo = async (id: string) => {
  const promo = await PromoCode.findById(id);
  if (!promo) throw new ApiError(404, "Promo not found");

  promo.isDeleted = true;
  promo.isActive = false;
  await promo.save();

  return { message: "Promo deleted" };
};

// --------------------------
// ADMIN — Get all promo with pagination + filter + sort
// --------------------------
// const getAllPromosAdmin = async (query: any) => {
//   const {
//     page = 1,
//     limit = 10,
//     sortBy = "createdAt",
//     sortOrder = "desc",
//     search = "",
//     isActive,
//   } = query;

// console.log(query);


//   const skip = (page - 1) * limit;

//   // filters
//   const filter: any = { isDeleted: false };

//   if (search) {
//     filter.$or = [
//       { code: { $regex: search, $options: "i" } },
//       { "createdBy.name": { $regex: search, $options: "i" } },
//       { "createdBy.email": { $regex: search, $options: "i" } },
//     ];
//   }

//   if (isActive !== undefined) filter.isActive = isActive;

//   const promos = await PromoCode.find(filter)
//     .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
//     .skip(skip)
//     .limit(Number(limit))
//     .populate("createdBy", "name email");

//   const total = await PromoCode.countDocuments(filter);

//   return {
//     data: promos,
//     meta: {
//       page: Number(page),
//       limit: Number(limit),
//       total,
//     },
//   };
// };

const getAllPromosAdmin = async (query: any) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
    isActive,
  } = query;

  const skip = (page - 1) * limit;

  // filters
  const filter: any = { isDeleted: false };

  if (search) {
    filter.$or = [
      { code: { $regex: search, $options: "i" } },
      { "createdBy.name": { $regex: search, $options: "i" } },
      { "createdBy.email": { $regex: search, $options: "i" } },
    ];
  }

  if (isActive !== undefined) filter.isActive = isActive;

  const promos = await PromoCode.find(filter)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("createdBy", "name email");

  const total = await PromoCode.countDocuments(filter);

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
const getPromoById = async (id: string) => {
  const promo = await PromoCode.findById(id);
  if (!promo) throw new ApiError(404, "Promo not found");

  return promo;
};










// Service 1: Get promo statistics (no filters)
const getPromoStatistics = async () => {
  // Total codes
  const totalCodes = await PromoCode.countDocuments({ isDeleted: false });

  // Active codes
  const activeCodes = await PromoCode.countDocuments({
    isDeleted: false,
    isActive: true,
  });

  // Total usage across all promos
  const usageResult = await PromoCode.aggregate([
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
  const discountResult = await PromoCode.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: null,
        avgDiscount: { $avg: "$discount" },
      },
    },
  ]);
  const avgDiscount = discountResult[0]?.avgDiscount || 0;

  return {
    totalCodes,
    activeCodes,
    totalUsage,
    avgDiscount: Math.round(avgDiscount * 100) / 100,
  };
};

// Service 2: Get monthly usage chart data with filters
const getPromoMonthlyChart = async (query: any) => {
  const {
    year = new Date().getFullYear(),
    isActive,
    code,
  } = query;

  // Build match filter
  const matchFilter: any = {
    isDeleted: false,
    createdAt: {
      $gte: new Date(`${year}-01-01`),
      $lte: new Date(`${year}-12-31T23:59:59.999Z`),
    },
  };

  // Apply optional filters
  if (isActive !== undefined) {
    matchFilter.isActive = isActive === 'true' || isActive === true;
  }

  if (code) {
    matchFilter.code = { $regex: code, $options: "i" };
  }

  // Aggregate monthly usage
  const monthlyData = await PromoCode.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: { $month: "$createdAt" },
        usage: { $sum: "$usageCount" },
        promoCount: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  // Month names for chart
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Fill all 12 months with data (0 if no data)
  const chartData = monthNames.map((month, index) => {
    const monthData = monthlyData.find((m) => m._id === index + 1);
    return {
      month,
      usage: monthData?.usage || 0,
      promoCount: monthData?.promoCount || 0,
    };
  });

  return {
    year: Number(year),
    chartData,
    filters: {
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : null,
      code: code || null,
    },
  };
};






















export const PromoService = {
  createPromo,
  getMyPromo,
  getMyPromoUsageStats,
  updatePromo,
  deletePromo,
  getAllPromosAdmin,
  getPromoById,
  getPromoStatistics,
  getPromoMonthlyChart
};
