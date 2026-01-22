import mongoose from "mongoose";
import { ILesson } from "./lesson.interface";
import Lesson from "./Lesson.model";
import Milestone from "../milestone/Milestone.model";
import { ApiError } from "../../errors/ApiError";

// Create
export const createLesson = async (payload: Partial<ILesson>) => {
  console.log(payload,'data');
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

  if (payload.questions && typeof payload.questions === 'string') {
    payload.questions = JSON.parse(payload.questions);
  }
  
if (payload.type === "assignment" && typeof payload.assignment === "string") {
  payload.assignment = JSON.parse(payload.assignment);
}

    const lesson = new Lesson(payload);
    const result = await lesson.save({ validateBeforeSave: true, session });

    if (payload.milestone) {
     await Milestone.findByIdAndUpdate(
        payload.milestone,
        { $push: { lesson: result._id } },
        { new: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(401,`Failed to create lesson: ${(error as Error).message}`);
  }
};





interface GetAllLessonsParams {
  milestone?: string;
    course?: string;
type?:string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const getAllLessons = async (params: GetAllLessonsParams) => {
  const {
    milestone = '',
    search = '',
    status = 'all',
    course='all',
    page = 1,
    limit = 10,
    type
  } = params;
  // Build filter object
  const filter: any = {};

  // Milestone filter
  if (milestone && milestone !== 'all') {
    filter.milestone = milestone;
  }
  // Course filter
  if (course && course !== 'all') {
    filter.course = course;
  }
  if (search && search.trim() !== '') {
    filter.$or = [
      { title: { $regex: search.trim(), $options: 'i' } }
    ];
  }

 if(type && type !== 'all'){
  filter.type = type
 }

  if (status && status !== 'all') {
    filter.status = status;
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Execute query with pagination
  const [lessons, total] = await Promise.all([
    Lesson.find(filter)
      .populate('milestone', 'title') 
      .sort({ order: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Lesson.countDocuments(filter)
  ]);

  // Calculate meta information
  const totalPages = Math.ceil(total / limit);

  return {
    data: lessons,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};


















// Get Single
export const getSingleLesson = async (id: string) => {
  const lesson = await Lesson.findById(id);
  return lesson;
};

// Update
export const updateLesson = async (id: string, payload: Partial<ILesson>) => {
  const lesson = await Lesson.findByIdAndUpdate(id, payload, { new: true });
  return lesson;
};

// Delete
export const deleteLesson = async (id: string) => {
  const lesson = await Lesson.findByIdAndDelete(id);
  return lesson;
};
