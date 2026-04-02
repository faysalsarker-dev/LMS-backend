import { Types } from "mongoose";
import MockTestSection from "./mockTestSection.model";
import { IMockTestSection } from "./mockTestSection.interface";
import { ApiError } from "../../errors/ApiError";
import httpStatus from "http-status";
import MockTest from "../mockTest/mockTest.model";
import QueryBuilder from "../../builder/QueryBuilder";

export const createMockTestSection = async (payload: Partial<IMockTestSection>): Promise<IMockTestSection> => {
  const mockTest = await MockTest.findById(payload.mockTest);
  if (!mockTest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Associated MockTest not found");
  }

  const section = await MockTestSection.create(payload);

  // Link the section back to the MockTest container
  const updateField = payload.name as string;
  await MockTest.findByIdAndUpdate(payload.mockTest, {
    [updateField]: section._id,
  });

  return section;
};

export const getAllMockTestSections = async (query: Record<string, unknown>) => {
  const sectionQuery = new QueryBuilder(
    MockTestSection.find().populate("mockTest"),
    query
  )
    .search(["name"])
    .filter()
    .sort()
    .paginate();

  const result = await sectionQuery.modelQuery;
  const meta = await sectionQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const getMockTestSectionById = async (id: string): Promise<IMockTestSection | null> => {
  if (!Types.ObjectId.isValid(id)) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Section ID");
  const section = await MockTestSection.findById(id).populate("mockTest");
  if (!section) throw new ApiError(httpStatus.NOT_FOUND, "Section not found");
  return section;
};

export const updateMockTestSection = async (id: string, payload: Partial<IMockTestSection>): Promise<IMockTestSection | null> => {
  if (!Types.ObjectId.isValid(id)) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Section ID");
  const section = await MockTestSection.findByIdAndUpdate(id, payload, { new: true });
  if (!section) throw new ApiError(httpStatus.NOT_FOUND, "Section not found");
  section.totalMarks = section.questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  await section.save();


  return section;
};

export const deleteMockTestSection = async (id: string): Promise<IMockTestSection | null> => {
  if (!Types.ObjectId.isValid(id)) throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Section ID");
  const section = await MockTestSection.findByIdAndDelete(id);
  if (!section) throw new ApiError(httpStatus.NOT_FOUND, "Section not found");

  // Remove reference from MockTest
  if (section.mockTest && section.name) {
    await MockTest.findByIdAndUpdate(section.mockTest, {
      $unset: { [section.name]: "" },
    });
  }
  section.totalMarks = section.questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  await section.save();
  return section;
};

