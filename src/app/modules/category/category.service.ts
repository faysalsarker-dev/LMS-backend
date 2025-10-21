import { ICategory } from "./category.interface";
import { Category } from "./Category.model";


export const CategoryService = {
  async createCategory(data: ICategory) {
    return await Category.create(data);
  },

  async getAllCategories() {
    return await Category.find().sort({ createdAt: -1 });
  },

  async getCategoryById(id: string) {
    return await Category.findById(id);
  },

  async updateCategory(id: string, data: Partial<ICategory>) {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteCategory(id: string) {
    return await Category.findByIdAndDelete(id);
  },
};
