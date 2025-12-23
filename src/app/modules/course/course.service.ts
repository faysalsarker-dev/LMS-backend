
import mongoose, { Types } from "mongoose";
import Course from "./Course.model";
import { ICourse, ICourseFilters, IPaginatedResponse } from "./course.interface";
import { Category } from "../category/Category.model";
import Progress from "../progress/progress.model";
import { ApiError } from "../../errors/ApiError";
import Lesson from "../lesson/Lesson.model";



export const createCourse = async (data: Partial<ICourse>): Promise<ICourse> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const course = new Course(data);
    const result = await course.save({ session });
    if (result.category) {
      await Category.findByIdAndUpdate(
        result.category,
        { $inc: { totalCourse: 1 } },
        { new: true, session }
      );
    }
    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};


export const getCourseBySlug = async (slug: string): Promise<ICourse | null> => {
  return Course.findOne({ slug }).populate("category").populate("milestones");
};


export const getCourseById = async (id: string): Promise<ICourse | null> => {
  const course = await Course.findById(id)
    .select("_id title slug milestones")
    .populate({
      path: "milestones",
      match: { status: "active" }, 
      options: { sort: { order: 1 } },
      select: "_id title order lesson status",
      populate: {
        path: "lesson",
        match: { status: "active" },
        options: { sort: { order: 1 } }, 
        model: "Lesson",
        select:
          "_id quiz title order contentType videoUrl status docContent",
      },
    })
    .lean(); 

  return course;
};







export const getAllCourses = async (
  filters: Partial<ICourseFilters> & {
    page?: number;
    limit?: number;
    search?: string;
  }
): Promise<IPaginatedResponse<ICourse>> => {
  const {
    level,
    status,
    sortBy,
    sortOrder = "desc",
    page = 1,
    limit = 10,
    search,
    isFeatured,
    category,
  } = filters;

  const query: Record<string, any> = {};

  // 🎯 Filtering
  if (level && level !== "all") query.level = level;
  if (status && status !== "all") query.status = status;
  if (isFeatured !== undefined) query.isFeatured = isFeatured;
 if (category && category !== "all") {
  if (mongoose.Types.ObjectId.isValid(category)) {
    query.category = new mongoose.Types.ObjectId(category);
  }
}

  // 🔍 Search by title
  if (search) query.title = { $regex: search, $options: "i" };

  // 🔽 Sorting
  const sortOptions: Record<string, 1 | -1> = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1;
  }

  // 📄 Pagination
  const skip = (Number(page) - 1) * Number(limit);

  // 🧵 Parallel queries
  const [data, total] = await Promise.all([
    Course.find(query)
      .populate("instructor", "name email")
      .populate("milestones")
      .populate("category")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Course.countDocuments(query),
  ]);

  // 📦 Response
  return {
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
    data,
  };
};




export const updateCourse = async (id: string, data: Partial<ICourse>): Promise<ICourse | null> => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Course.findByIdAndUpdate(id, data, { new: true }).exec();
};

export const deleteCourse = async (id: string): Promise<ICourse | null> => {
  if (!Types.ObjectId.isValid(id)) return null;
  return Course.findByIdAndDelete(id).exec();
};










// =========== Additional  functions ===========
export const getCurriculumFromDB = async (courseId: string, userId: string) => {
  const [course, progress] = await Promise.all([
    Course.findById(courseId)
      .select("title slug milestones")
      .populate({
        path: "milestones",
        match: { status: "active" },
        options: { sort: { order: 1 } },
        select: "title order lessons",
        populate: {
          path: "lesson",
          match: { status: "active" },
          options: { sort: { order: 1 } },
          select: "title order contentType",
        },
      })
      .lean(),
    Progress.findOne({ student: userId, course: courseId })
      .select("completedLessons")
      .lean(),
  ]);

  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const completedIds = new Set(
    progress?.completedLessons?.map((id) => id.toString()) || []
  );

  // Formatting the curriculum structure
  const curriculum = course?.milestones?.map((milestone: any) => ({
    _id: milestone._id,
    title: milestone.title,
    order: milestone.order,
    lessons: milestone.lesson?.map((lesson: any) => ({
      _id: lesson._id,
      title: lesson.title,
      order: lesson.order,
      contentType: lesson.contentType,
      isCompleted: completedIds.has(lesson._id.toString()),
    })),
  }));

  return {
    _id: course._id,
    title: course.title,
    curriculum,
  };
};

export const getLessonContentFromDB = async (lessonId: string) => {
  const lesson = await Lesson.findOne({ _id: lessonId, status: "active" })
    .select("+videoUrl +docContent +quiz") 
    .lean();

  if (!lesson) {
    throw new ApiError(404, "Lesson not found or inactive");
  }

  return lesson;
};