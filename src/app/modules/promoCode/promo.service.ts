import { IPromoCode } from "./promo.interface";
import { ApiError } from "../../errors/ApiError";
import PromoCode from "./Promo.model";
import { Types } from "mongoose";

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

  let promo = await PromoCode.findOne({ createdBy: userId }).lean();





  if (!promo) throw new ApiError(404, "Promo not found");



  return promo
};

// --------------------------
// Update promo
// --------------------------
const updatePromo = async (id: string, data: Partial<IPromoCode>) => {
  const promo = await PromoCode.findById(id);
  if (!promo) throw new ApiError(404, "Promo not found");
console.log(data);
  Object.assign(promo, data);
  await promo.save();

  return promo;
};

// --------------------------
// Soft delete promo
// --------------------------
const deletePromo = async (id: string) => {

  const result = await PromoCode.findByIdAndDelete(id)
  if (!result) throw new ApiError(404, "Promo not found");



  return result;
};



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

// Service 2: Get monthly usage chart data with filters
// const getPromoMonthlyChart = async (query: any) => {
//   const {
//     year = new Date().getFullYear(),
//     status, // active | inactive
//     code,
//   } = query;

//   // Base filter
//   const matchFilter: any = {
//     isDeleted: false,
//     createdAt: {
//       $gte: new Date(`${year}-01-01T00:00:00.000Z`),
//       $lte: new Date(`${year}-12-31T23:59:59.999Z`)
//     }
//   };

//   // Filter by status
//   if (status) {
//     matchFilter.isActive = status === "active";
//   }

//   // Filter by code
//   if (code) {
//     matchFilter.code = { $regex: code, $options: "i" };
//   }

//   // MONTHLY CHART PIPELINE
//   const monthlyData = await PromoCode.aggregate([
//     { $match: matchFilter },

//     // flatten usedBy array so we can count usage per month
//     { $unwind: { path: "$usedBy", preserveNullAndEmptyArrays: true } },

//     {
//       $group: {
//         _id: {
//           month: { $month: "$createdAt" }
//         },
//         promoCount: { $sum: 1 },
//         usage: {
//           $sum: {
//             $cond: [
//               { $gte: ["$usedBy.usedAt", new Date(`${year}-01-01`)] },
//               1,
//               0
//             ]
//           }
//         }
//       }
//     },

//     { $sort: { "_id.month": 1 } }
//   ]);

//   const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

//   const chartData = monthNames.map((month, idx) => {
//     const m = monthlyData.find(x => x._id.month === idx + 1);
//     return {
//       month,
//       usage: m?.usage ?? 0,
//       promoCount: m?.promoCount ?? 0
//     };
//   });

//   return {
//     year: Number(year),
//     chartData,
//     filters: {
//       status: status ?? null,
//       code: code ?? null
//     }
//   };
// };



interface MonthlyChartData {
  month: string;
  used: number;
}

/**
 * Get monthly promo code usage chart data
 * @param query - Contains year, status (active/inactive), and optional code filter
 * @returns Array of 12 months with usage counts
 */
//  const getPromoMonthlyChart = async (query: any): Promise<MonthlyChartData[]> => {
//   const {
//     year = new Date().getFullYear(),
//     status, // "active" | "inactive"
//     code,
//   } = query;

//   // Create date range for the specified year
//   const start = new Date(year, 0, 1); // January 1st, local time
//   const end = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st, local time

//   // Build the initial match conditions
//   const initialMatch: any = {
//     isDeleted: false,
//   };

//   // Add status filter if provided
//   if (status === "active") {
//     initialMatch.isActive = true;
//   } else if (status === "inactive") {
//     initialMatch.isActive = false;
//   }

//   // Add code filter if provided
//   if (code) {
//     initialMatch.code = code;
//   }

//   const pipeline: any[] = [
//     // First match: filter promo codes
//     { $match: initialMatch },

//     // Unwind the usedBy array to process each usage separately
//     {
//       $unwind: {
//         path: "$usedBy",
//         preserveNullAndEmptyArrays: false,
//       },
//     },

//     // Second match: filter by date range
//     {
//       $match: {
//         "usedBy.usedAt": { $gte: start, $lte: end },
//       },
//     },

//     // Group by month
//     {
//       $group: {
//         _id: { $month: "$usedBy.usedAt" },
//         usageCount: { $sum: 1 },
//       },
//     },

//     // Sort by month
//     { $sort: { _id: 1 } },
//   ];

//   // Execute aggregation
//   const result = await PromoCode.aggregate(pipeline);

//   console.log(result);
//   // Month names for chart display
//   const monthNames = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   // Build complete 12-month array with zero values for months without data
//   return monthNames.map((monthName, index) => {
//     const monthNumber = index + 1;
//     const data = result.find((x) => x._id === monthNumber);

//     console.log(data);
//     return {
//       month: monthName,
//       used: data?.usageCount || 0,
//     };
//   });
// };



const getPromoMonthlyChart = async (year: number) => {
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

  const raw = await PromoCode.aggregate(pipeline);

  // 5. Fill missing months with 0
  const final = Array.from({ length: 12 }, (_, i) => {
    const found = raw.find((r) => r.month === i + 1);
    return {
      month: i + 1,
      totalUses: found?.totalUses || 0
    };
  });


  console.log(final,'final');
  return final;
};




const getDetailedAnalytics = async (query: any) => {
  const {
    year = new Date().getFullYear(),
    status,
    code,
  } = query;

  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59, 999);

  const initialMatch: any = { isDeleted: false };

  if (status === "active") {
    initialMatch.isActive = true;
  } else if (status === "inactive") {
    initialMatch.isActive = false;
  }

  if (code) {
    initialMatch.code = code;
  }

  const pipeline: any[] = [
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

  const topPromoCodes = await PromoCode.aggregate(pipeline);

  return {
    year,
    status,
    topPromoCodes,
    summary: {
      totalPromoCodes: topPromoCodes.length,
      totalUsages: topPromoCodes.reduce(
        (sum: number, promo: any) => sum + promo.yearlyUsageCount,
        0
      ),
    },
  };
};








const redeemPromoService = async ({
  code,
  userId,
  orderAmount,
}: {
  code: string;
  userId: string;
  orderAmount: number;
}) => {
  const promo = await PromoCode.findOne({ code: code.trim().toUpperCase() });

  if (!promo) throw new ApiError(404, "Promo code not found");

  // --- Check active ---
  if (!promo.isActive) throw new ApiError(400, "This promo code is inactive");

  const now = new Date();

  // --- Check date validity ---
  if (promo.validFrom > now) throw new ApiError(400, "Promo not active yet");
  if (promo.expirationDate < now) throw new ApiError(400, "Promo has expired");

  // --- Check order amount ---
  if (orderAmount < promo.minOrderAmount) {
    throw new ApiError(
      400,
      `Minimum order amount is ${promo.minOrderAmount}`
    );
  }

  // --- Check global usage limit ---
  if (promo.maxUsageCount && promo.currentUsageCount >= promo.maxUsageCount) {
    throw new ApiError(400, "Promo usage limit reached");
  }

  // --- Check per-user usage ---
  const usedByUser = promo.usedBy.filter(
    (u) => u.user.toString() === userId
  );

  if (promo.maxUsagePerUser && usedByUser.length >= promo.maxUsagePerUser) {
    throw new ApiError(400, "You already used this promo");
  }

  // --- Calculate discount ---
  let discount = 0;
  if (promo.discountType === "percentage") {
    discount = (orderAmount * promo.discountValue) / 100;
  } else {
    discount = promo.discountValue;
  }

  const finalAmount = Math.max(orderAmount - discount, 0);

  // --- Update usage ---
  promo.usedBy.push({
    user: new Types.ObjectId(userId),
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







const validatePromoService = async ({
  code,
  userId,
  orderAmount,
}: {
  code: string;
  userId: string;
  orderAmount: number;
}) => {
  const promo = await PromoCode.findOne({ code: code.trim().toUpperCase() });

  if (!promo) throw new ApiError(404, "Promo code not found");

  if (!promo.isActive) throw new ApiError(400, "Promo is inactive");

  const now = new Date();

  if (promo.validFrom > now) throw new ApiError(400, "Promo starts later");
  if (promo.expirationDate < now) throw new ApiError(400, "Promo expired");

  if (orderAmount < promo.minOrderAmount) {
    throw new ApiError(400, `Minimum order amount: ${promo.minOrderAmount}`);
  }

  if (promo.maxUsageCount && promo.currentUsageCount >= promo.maxUsageCount) {
    throw new ApiError(400, "Promo limit reached");
  }

  const usedByUser = promo.usedBy.filter(
    (u) => u.user.toString() === userId
  );

  if (promo.maxUsagePerUser && usedByUser.length >= promo.maxUsagePerUser) {
    throw new ApiError(400, "You already used this promo");
  }

  // --- calculate potential discount ---
  let discount = 0;

  if (promo.discountType === "percentage") {
    discount = (orderAmount * promo.discountValue) / 100;
  } else {
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










export const PromoService = {
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
