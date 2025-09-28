
import { IMilestone } from "./milestone.interface";
import Milestone from "./Milestone.model";

export const createMilestone = async (data: Partial<IMilestone>): Promise<IMilestone> => {
  const milestone = new Milestone(data);
  return milestone.save();
};

export const getAllMilestones = async (course?: string, search?: string, status?: string): Promise<IMilestone[]> => {
  const filter: any = {};
  if (course) filter.course = course !== 'all' ? course : { $exists: true };
  if (search) filter.title = { $regex: search, $options: "i" }; 
  if (status) filter.status = status !== 'all' ? status : { $exists: true };
const result = await Milestone.find(filter).populate('course','title').sort({ order: 1 });

  return result; 
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
