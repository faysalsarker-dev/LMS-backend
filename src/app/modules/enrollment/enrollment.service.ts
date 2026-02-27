import mongoose from "mongoose";
import User from "../auth/User.model";
import Course from "../course/Course.model";
import Progress from "../progress/progress.model";
import Enrollment from "./Enrollment.model";
import { IEnrollment } from "./enrollment.interface";
import { ApiError } from "../../errors/ApiError";
import PromoCode from "../promoCode/Promo.model";
import { SSLService } from "../sslCommersz/sslCommersz.service";
import { generateTransactionId } from "../../utils/transactionId";

// Create enrollment with payment
export const createEnrollment = async (data: {
  user: string;
  course: string;
  originalPrice: number;
  promoCode?: string;
}): Promise<string> => { 
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user: data.user,
      course: data.course,
      paymentStatus: "completed",
    }).session(session);

    if (existingEnrollment) {
      throw new ApiError(400, "User is already enrolled in this course");
    }


    const course = await Course.findById(data.course).session(session);
    if (!course) throw new ApiError(404, "Course not found");

    const user = await User.findById(data.user).session(session);
    if (!user) throw new ApiError(404, "User not found");


    let finalAmount = course.price; 
    let appliedPromo = null;

    if (data.promoCode) {
      const validation = await PromoCode.validatePromo({
        code: data.promoCode,
        userId: data.user,
        originalPrice: course.price,
      });
      
      finalAmount = validation.finalAmount;
      appliedPromo = validation.promoCode;
    }

    const transactionId = generateTransactionId();

   await Enrollment.create(
      [
        {
          user: data.user,
          course: data.course,
          amount: finalAmount,
          currency: course.currency || "BDT",
          paymentStatus: "pending",
          promoCode: appliedPromo,
          transactionId: transactionId,
          paymentDate: new Date(),
        },
      ],
      { session }
    );

   
    const paymentData = {
      amount: finalAmount,
      courseId: course._id.toString(),
      transactionId: transactionId,
      name: user.name,
      email: user.email,
      phoneNumber: user.phone || "01700000000",
      city: user.address?.city || "Dhaka",
      country: user.address?.country || "Bangladesh",
    };

    const sslPayment = await SSLService.sslPaymentInit(paymentData);

    await session.commitTransaction();
    return sslPayment.GatewayPageURL;

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// Handle successful payment
export const handleSuccessPayment = async (query: Record<string, any>): Promise<IEnrollment> => {
  const {transactionId ,  promoCode} = query; 
  
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Find the pending enrollment
    const enrollment = await Enrollment.findOne({ transactionId }).session(session);
    if (!enrollment) throw new ApiError(404, "Enrollment record not found");

    if (enrollment.paymentStatus === "completed") {
        return enrollment;
    }
    enrollment.paymentStatus = "completed";
    await enrollment.save({ session });

    await User.findByIdAndUpdate(
      enrollment.user,
      { $addToSet: { courses: enrollment.course } },
      { session }
    );



  await Course.findByIdAndUpdate(
      enrollment.course,
      {
        $inc: { totalEnrolled: 1 },
        $addToSet: { enrolledStudents: enrollment.user },
      },
      { session }
    );





    if (promoCode) {

      await PromoCode.usePromo({
        promoCode: promoCode,
        userId: enrollment.user,
        courseId: enrollment.course,
        price: enrollment.amount,
      });
    }


 await Progress.create(
      [
        {
          student: enrollment.user,
          course: enrollment.course,
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
    return enrollment;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};






// Handle failed payment
export const handleFailedPayment = async (query: Record<string, any>) => {
  const {transactionId } = query; 

  const session = await mongoose.startSession();





  // 1. Find the pending enrollment
    const enrollment = await Enrollment.findOne({ transactionId }).session(session);
    if (!enrollment) throw new ApiError(404, "Enrollment record not found");

    if (enrollment.paymentStatus === "failed") {
        return enrollment;
    }
    enrollment.paymentStatus = "failed";
    await enrollment.save({ session });





    
return enrollment;

};

// Handle cancelled payment
export const handleCancelledPayment = async (query: Record<string, any>) => {
  const session = await mongoose.startSession();
  const {transactionId } = query; 



    const enrollment = await Enrollment.findOne({ transactionId });
    if (!enrollment) throw new ApiError(404, "Enrollment record not found");

    if (enrollment.paymentStatus === "cancelled") {
        return enrollment;
    }
    enrollment.paymentStatus = "cancelled";
    await enrollment.save({ session });
    return enrollment;

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