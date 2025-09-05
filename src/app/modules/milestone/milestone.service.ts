
import { IMilestone } from "./milestone.interface";
import Milestone from "./milestone.model";

export const createMilestone = async (data: Partial<IMilestone>): Promise<IMilestone> => {
  const milestone = new Milestone(data);
  return milestone.save();
};

export const getAllMilestones = async (courseId?: string): Promise<IMilestone[]> => {
  const filter = courseId ? { course: courseId } : {};
  return Milestone.find(filter).sort({ order: 1 });
};

export const getMilestoneById = async (id: string): Promise<IMilestone | null> => {
  return Milestone.findById(id);
};

export const updateMilestone = async (id: string, data: Partial<IMilestone>): Promise<IMilestone | null> => {
  return Milestone.findByIdAndUpdate(id, data, { new: true });
};

export const deleteMilestone = async (id: string): Promise<IMilestone | null> => {
  return Milestone.findByIdAndDelete(id);
};
