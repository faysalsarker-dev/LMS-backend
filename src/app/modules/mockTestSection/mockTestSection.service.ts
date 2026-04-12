import { Types } from "mongoose";
import MockTestSection from "./mockTestSection.model";
import { IMockTestSection } from "./mockTestSection.interface";
import { ApiError } from "../../errors/ApiError";
import httpStatus from "http-status";
import MockTest from "../mockTest/mockTest.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { deleteFile } from "../../utils/fileDelete";

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

  const section = await MockTestSection.findById(id);
  if (!section) throw new ApiError(httpStatus.NOT_FOUND, "Section not found");

  const intl = section.isInternational ?? true;
  for (const question of section.questions || []) {
    if (question.audioUrl) {
      try {
        await deleteFile(question.audioUrl, intl);
      } catch (error: any) {
        console.error(`Failed to delete section question audio for ${id}:`, error.message);
      }
    }
    for (const imageUrl of question.images || []) {
      if (imageUrl) {
        try {
          await deleteFile(imageUrl, intl);
        } catch (error: any) {
          console.error(`Failed to delete section question image for ${id}:`, error.message);
        }
      }
    }
  }

  const deleted = await MockTestSection.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(httpStatus.NOT_FOUND, "Section not found");

  if (deleted.mockTest && deleted.name) {
    await MockTest.findByIdAndUpdate(deleted.mockTest, {
      $unset: { [deleted.name]: "" },
    });
  }

  return deleted;
};

