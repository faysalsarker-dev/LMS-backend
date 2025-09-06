import { IModule } from "./module.interface";
import Module from "./Module.model";

const createModule = async (payload: IModule): Promise<IModule> => {
  const result = await Module.create(payload);
  return result;
};

const getAllModules = async (): Promise<IModule[]> => {
  const result = await Module.find().populate("milestone");
  return result;
};

const getModuleById = async (id: string): Promise<IModule | null> => {
  const result = await Module.findById(id).populate("milestone");
  return result;
};

const updateModule = async (
  id: string,
  payload: Partial<IModule>
): Promise<IModule | null> => {
  const result = await Module.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteModule = async (id: string): Promise<IModule | null> => {
  const result = await Module.findByIdAndDelete(id);
  return result;
};

export const ModuleService = {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
};
