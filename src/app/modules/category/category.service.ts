import { deleteFile } from "../../utils/fileDelete";
import { ICategory } from "./category.interface";
import { Category } from "./Category.model";


export const CategoryService = {
  async createCategory(data: ICategory) {
    return await Category.create(data);
  },

  async getAllCategories() {
    return await Category.find().sort({ createdAt: -1 });
  },
  async getAllCategoriesForSelecting() {
    return await Category.find().sort({ createdAt: -1 }).select('_id title ');
  },

  async getCategoryById(id: string) {
    return await Category.findById(id);
  },

  async updateCategory(id: string, data: Partial<ICategory>) {
    return await Category.findByIdAndUpdate(id, data, { new: true });
  },

  async deleteCategory(id: string) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) return null;

    if (category.thumbnail) {
      try {
        await deleteFile(category.thumbnail, category.isInternational ?? true);
      } catch (error: any) {
        console.error("Failed to delete category thumbnail:", error.message);
      }
    }

    return category;
  },
};
