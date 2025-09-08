import { IEnrollment } from "./enrollment.interface";
import Enrollment from './Enrollment.model';

export const createEnrollment = async (data: IEnrollment): Promise<IEnrollment> => {
  return await Enrollment.create(data);
};

export const getAllEnrollments = async (): Promise<IEnrollment[]> => {
  return await Enrollment.find().populate("user course");
};

export const getEnrollmentById = async (id: string): Promise<IEnrollment | null> => {
  return await Enrollment.findById(id).populate("user course");
};

export const updateEnrollment = async (
  id: string,
  data: Partial<IEnrollment>
): Promise<IEnrollment | null> => {
  return await Enrollment.findByIdAndUpdate(id, data, { new: true }).populate("user course");
};

export const deleteEnrollment = async (id: string): Promise<IEnrollment | null> => {
  return await Enrollment.findByIdAndDelete(id);
};
