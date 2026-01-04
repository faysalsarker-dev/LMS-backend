import mongoose from "mongoose";
import User from "../auth/User.model";
import Course from "../course/Course.model";
import Progress from "../progress/progress.model";
import Enrollment from "./Enrollment.model";
import { IEnrollment } from "./enrollment.interface";
import { ApiError } from "../../errors/ApiError";
import PromoCode from "../promoCode/Promo.model";

// Create enrollment with payment
export const createEnrollment = async (data: {
  user: string;
  course: string;
  originalPrice: number;
  discountAmount?: number;
  finalAmount: number;
  promoCode?: string; 
  paymentMethod: "alipay" | "wechat" | "stripe" | "paypal";
  transactionId?: string;
}): Promise<IEnrollment> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: data.user,
      course: data.course,
    });

    if (existingEnrollment) {
      throw new ApiError(400, "User is already enrolled in this course");
    }

    // Verify course exists
    const course = await Course.findById(data.course).session(session);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    // Handle promo code if provided
    let promoCodeId = null;
    if (data.promoCode) {
      const promo = await PromoCode.findOne({
        code: data.promoCode,
        isActive: true,
      }).session(session);

      if (promo) {
        // Check if user already used this promo
        const userUsedPromo = promo.usedBy.some(
          (usage: any) => usage.user.toString() === data.user
        );

        if (userUsedPromo) {
          throw new ApiError(400, "You have already used this promo code");
        }

        // Update promo usage
        await PromoCode.findByIdAndUpdate(
          promo._id,
          {
            $inc: { currentUsageCount: 1 },
            $push: { usedBy: { user: data.user, usedAt: new Date() } },
          },
          { session }
        );

        promoCodeId = promo._id;
      }
    }

    // Create enrollment
    const enrollment = await Enrollment.create(
      [
        {
          user: data.user,
          course: data.course,
          originalPrice: data.originalPrice,
          discountAmount: data.discountAmount || 0,
          finalAmount: data.finalAmount,
          promoCode: promoCodeId,
          promoCodeUsed: data.promoCode || null,
          paymentMethod: data.paymentMethod,
          paymentStatus: "completed",
          transactionId: data.transactionId,
          paymentDate: new Date(),
          status: "active",
        },
      ],
      { session }
    );

    // Add course to user's courses
    await User.findByIdAndUpdate(
      data.user,
      { $addToSet: { courses: data.course } },
      { session }
    );

    // Update course enrollment stats
    await Course.findByIdAndUpdate(
      data.course,
      {
        $inc: { totalEnrolled: 1 },
        $addToSet: { enrolledStudents: data.user },
      },
      { session }
    );

    // Create progress document
    await Progress.create(
      [
        {
          student: data.user,
          course: data.course,
          completedLessons: [],
          quizResults: [],
          assignmentSubmissions: [],
          progressPercentage: 0,
          isCompleted: false,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return enrollment[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Get all enrollments (Admin)
export const getAllEnrollments = async (filters?: {
  paymentStatus?: string;
  startDate?: Date;
  endDate?: Date;
}): Promise<IEnrollment[]> => {
  const query: any = {};

  if (filters?.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }

  if (filters?.startDate || filters?.endDate) {
    query.paymentDate = {};
    if (filters.startDate) query.paymentDate.$gte = filters.startDate;
    if (filters.endDate) query.paymentDate.$lte = filters.endDate;
  }

  return await Enrollment.find(query)
    .populate("user", "name email")
    .populate("course", "title slug")
    .sort({ createdAt: -1 });
};

// Get enrollment by ID
export const getEnrollmentById = async (id: string): Promise<IEnrollment | null> => {
  const enrollment = await Enrollment.findById(id)
    .populate("user", "name email phone")
    .populate("course", "title slug description thumbnail");

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  return enrollment;
};

// Update enrollment status
export const updateEnrollment = async (
  id: string,
  data: Partial<IEnrollment>
): Promise<IEnrollment | null> => {
  const enrollment = await Enrollment.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("user", "name email")
    .populate("course", "title slug");

  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  return enrollment;
};

// Delete enrollment (Admin only - careful!)
export const deleteEnrollment = async (id: string): Promise<void> => {
  const enrollment = await Enrollment.findById(id);
  if (!enrollment) {
    throw new ApiError(404, "Enrollment not found");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Remove from user's courses
    await User.findByIdAndUpdate(
      enrollment.user,
      { $pull: { courses: enrollment.course } },
      { session }
    );

    // Update course stats
    await Course.findByIdAndUpdate(
      enrollment.course,
      {
        $inc: { totalEnrolled: -1 },
        $pull: { enrolledStudents: enrollment.user },
      },
      { session }
    );

    // Delete progress
    await Progress.findOneAndDelete(
      { student: enrollment.user, course: enrollment.course },
      { session }
    );

    // Delete enrollment
    await Enrollment.findByIdAndDelete(id, { session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// ========================================
// ANALYTICS SERVICES
// ========================================

// Get total earnings
export const getTotalEarnings = async (): Promise<{
  totalEarnings: number;
  totalEnrollments: number;
  totalDiscounts: number;
}> => {
  const result = await Enrollment.aggregate([
    { $match: { paymentStatus: "completed" } },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$finalAmount" },
        totalEnrollments: { $count: {} },
        totalDiscounts: { $sum: "$discountAmount" },
      },
    },
  ]);

  return (
    result[0] || { totalEarnings: 0, totalEnrollments: 0, totalDiscounts: 0 }
  );
};

// Get monthly earnings for a year
export const getMonthlyEarnings = async (
  year: number
): Promise<Array<{ month: number; earnings: number; count: number }>> => {
  const result = await Enrollment.aggregate([
    {
      $match: {
        paymentStatus: "completed",
        paymentDate: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$paymentDate" },
        earnings: { $sum: "$finalAmount" },
        count: { $count: {} },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill all 12 months
  const monthlyData = Array(12)
    .fill(0)
    .map((_, i) => ({ month: i + 1, earnings: 0, count: 0 }));

  result.forEach((item) => {
    monthlyData[item._id - 1] = {
      month: item._id,
      earnings: item.earnings,
      count: item.count,
    };
  });

  return monthlyData;
};

// Get earnings by date range
export const getEarningsByDateRange = async (
  startDate: Date,
  endDate: Date
): Promise<{ totalEarnings: number; totalEnrollments: number }> => {
  const result = await Enrollment.aggregate([
    {
      $match: {
        paymentStatus: "completed",
        paymentDate: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: "$finalAmount" },
        totalEnrollments: { $count: {} },
      },
    },
  ]);

  return result[0] || { totalEarnings: 0, totalEnrollments: 0 };
};