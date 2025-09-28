
import { Types } from "mongoose";
import Course from "./Course.model";
import { ICourse, ICourseFilters, IPaginatedResponse } from "./course.interface";

export const createCourse = async (data: Partial<ICourse>): Promise<ICourse> => {
  const course = new Course(data);
  return course.save();
};

export const getCourseBySlug = async (slug: string): Promise<ICourse | null> => {
  return Course.findOne({ slug }).populate("milestones");
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
    isDiscounted,
    certificateAvailable,
    sortBy,
    sortOrder,
    page = 1,
    limit = 10,
    search,
    isFeatured
  } = filters;

  const query: any = {};

  // Filtering
  if (level && level !== "all") query.level = level;
  if (status && status !== "all") query.status = status;
  if (isDiscounted !== undefined) query.isDiscounted = isDiscounted === true;
  if (certificateAvailable !== undefined)
    query.certificateAvailable = certificateAvailable === true;
if(isFeatured !== undefined)
query.isFeatured=isFeatured===true;
  // Search by title
  if (search) {
    query.title = { $regex: search, $options: "i" }; // case-insensitive
  }

  // Sorting
  const sortOptions: any = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  } else {
    sortOptions.createdAt = -1; // default: newest first
  }

  // Pagination
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Course.find(query)
      .populate("instructor", "name email")
      .populate("milestones")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit),
    Course.countDocuments(query),
  ]);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
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
