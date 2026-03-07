import mongoose from "mongoose";
import { ILesson } from "./lesson.interface";
import Lesson from "./Lesson.model";
import Milestone from "../milestone/Milestone.model";
import { ApiError } from "../../errors/ApiError";

// Create
export const createLesson = async (payload: Partial<ILesson>) => {
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

import QueryBuilder from "../../builder/QueryBuilder";

export const getAllLessons = async (params: GetAllLessonsParams) => {
  const searchableFields = ["title"];

  const queryParams: Record<string, unknown> = {
    ...params,
    page: params.page || 1,
    limit: params.limit || 10,
  };

  if (queryParams.milestone === "all") delete queryParams.milestone;
  if (queryParams.course === "all") delete queryParams.course;
  if (queryParams.status === "all") delete queryParams.status;
  if (queryParams.type === "all") delete queryParams.type;

  const lessonQuery = new QueryBuilder(
    Lesson.find().populate("milestone", "title").lean(),
    queryParams
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate();

  // Override sort manually for lessons to maintain original logic
  lessonQuery.modelQuery = lessonQuery.modelQuery.sort({ order: 1 });

  const [lessons, metaInfo] = await Promise.all([
    lessonQuery.modelQuery,
    lessonQuery.countTotal(),
  ]);

  return {
    data: lessons,
    meta: {
      ...metaInfo,
      hasNextPage: metaInfo.page < metaInfo.totalPages,
      hasPrevPage: metaInfo.page > 1,
    },
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
