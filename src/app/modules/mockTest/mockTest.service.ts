import mongoose, { Types } from "mongoose";
import MockTest from "./mockTest.model";
import { IMockTest } from "./mockTest.interface";
import { ApiError } from "../../errors/ApiError";
import httpStatus from "http-status";
import QueryBuilder from "../../builder/QueryBuilder";
import User from "../auth/User.model";

export const getMocktestForUser = async (
  userId: string,
): Promise<IMockTest[]> => {
  const user = await User.findById(userId).select("courses");

  if (!user || (!user.courses || user.courses.length === 0)) {
    return [];
  }

  const courseIds = user.courses;
  const mockTests = await MockTest.find({
    course: { $in: courseIds },
    status: "published",
  }).select("title slug thumbnail _id course").populate("course", "title slug");

  return mockTests;
};

export const createMockTest = async (
  payload: Partial<IMockTest>,
): Promise<IMockTest> => {
  const mockTest = await MockTest.create(payload);
  return mockTest;
};

export const getAllMockTests = async (query: Record<string, unknown>) => {
  const mockTestQuery = new QueryBuilder(
    MockTest.find().populate("course", "title slug"),
    query,
  )
    .search(["title"])
    .filter()
    .sort()
    .paginate();

  const [data, metaInfo] = await Promise.all([
    mockTestQuery.modelQuery,
    mockTestQuery.countTotal(),
  ]);

  return {
    meta: metaInfo,
    data,
  };
};

export const getMockTestById = async (
  id: string,
): Promise<IMockTest | null> => {
  if (!Types.ObjectId.isValid(id))
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid ID");

  const mockTest = await MockTest.findById(id)
    .populate("course", "title slug")
    .populate("listening")
    .populate("reading")
    .populate("writing")
    .populate("speaking");

  if (!mockTest) throw new ApiError(httpStatus.NOT_FOUND, "MockTest not found");
  return mockTest;
};

export const getMockTestBySlug = async (
  slug: string,
): Promise<IMockTest | null> => {
  const mockTest = await MockTest.findOne({ slug })
    .populate("course", "title slug")
    .populate("listening")
    .populate("reading")
    .populate("writing")
    .populate("speaking");

  if (!mockTest) throw new ApiError(httpStatus.NOT_FOUND, "MockTest not found");
  return mockTest;
};

export const updateMockTest = async (
  id: string,
  payload: Partial<IMockTest>,
): Promise<IMockTest | null> => {
  if (!Types.ObjectId.isValid(id))
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid ID");

  const mockTest = await MockTest.findByIdAndUpdate(id, payload, { new: true });
  if (!mockTest) throw new ApiError(httpStatus.NOT_FOUND, "MockTest not found");

  return mockTest;
};

export const deleteMockTest = async (id: string): Promise<IMockTest | null> => {
  if (!Types.ObjectId.isValid(id))
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid ID");

  // TODO: Make sure to implement logic later to delete the associated MockTestSections
  const mockTest = await MockTest.findByIdAndDelete(id);
  if (!mockTest) throw new ApiError(httpStatus.NOT_FOUND, "MockTest not found");

  return mockTest;
};
