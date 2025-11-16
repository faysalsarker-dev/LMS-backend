import { IPromoCode } from "./promo.interface";
import { ApiError } from "../../errors/ApiError";
import PromoCode from "./Promo.model";

// --------------------------
// Create promo (User can create only ONE)
// --------------------------
const createPromo = async (userId: string, data: IPromoCode) => {
  const exist = await PromoCode.findOne({ createdBy: userId, isDeleted: false });
  if (exist) throw new ApiError(400, "You already created a promo");

  const promo = await PromoCode.create({ ...data, createdBy: userId });
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
    filter.code = { $regex: search, $options: "i" };
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

export const PromoService = {
  createPromo,
  getMyPromo,
  getMyPromoUsageStats,
  updatePromo,
  deletePromo,
  getAllPromosAdmin,
  getPromoById,
};
