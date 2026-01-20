import Practice from './practice.model';
import { IPractice } from './practice.interface';
import { Types } from 'mongoose';
import { ApiError } from '../../errors/ApiError';

class PracticeService {
  // Create new practice
  async createPractice(data: Partial<IPractice>): Promise<IPractice> {
    const practice = await Practice.create(data);
    return practice;
  }

  // Get all practices with filters and pagination
  async getAllPractices(query: any) {
    const {
      page = 1,
      limit = 10,
      type,
      difficulty,
      category,
      isActive,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const filter: any = {};

    if (type) filter.type = type;
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = new Types.ObjectId(category);
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: any = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const practices = await Practice.find(filter)
      .populate('category', 'name')
      .populate('createdBy', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Practice.countDocuments(filter);

    return {
      practices,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  // Get single practice by ID or slug
  async getPracticeById(identifier: string): Promise<IPractice> {
    const isObjectId = Types.ObjectId.isValid(identifier);
    
    const practice = await Practice.findOne(
      isObjectId ? { _id: identifier } : { slug: identifier }
    )
      .populate('category', 'name')
      .populate('createdBy', 'name email');

    if (!practice) {
      throw new ApiError(404, 'Practice not found');
    }

    return practice;
  }

  // Update practice
  async updatePractice(id: string, data: Partial<IPractice>): Promise<IPractice> {
    const practice = await Practice.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .populate('category', 'name')
      .populate('createdBy', 'name email');

    if (!practice) {
      throw new ApiError(404, 'Practice not found');
    }

    return practice;
  }

  // Delete practice
  async deletePractice(id: string): Promise<void> {
    const practice = await Practice.findById(id);

    if (!practice) {
      throw new ApiError(404, 'Practice not found');
    }

    // Check if practice is being used in any courses
    if (practice.usageCount > 0) {
      throw new ApiError(
        400,
        `Cannot delete practice. It is currently used in ${practice.usageCount} course(s)`
      );
    }

    await Practice.findByIdAndDelete(id);
  }

  // Add items to practice
  async addItemsToPractice(id: string, items: any[]): Promise<IPractice> {
    const practice = await Practice.findById(id);

    if (!practice) {
      throw new ApiError(404, 'Practice not found');
    }

    practice.items.push(...items);
    await practice.save();

    return practice;
  }

  // Remove item from practice
  async removeItemFromPractice(practiceId: string, itemIndex: number): Promise<IPractice> {
    const practice = await Practice.findById(practiceId);

    if (!practice) {
      throw new ApiError(404, 'Practice not found');
    }

    if (itemIndex < 0 || itemIndex >= practice.items.length) {
      throw new ApiError(400, 'Invalid item index');
    }

    practice.items.splice(itemIndex, 1);
    await practice.save();

    return practice;
  }

  // Update practice item
  async updatePracticeItem(
    practiceId: string,
    itemIndex: number,
    itemData: any
  ): Promise<IPractice> {
    const practice = await Practice.findById(practiceId);

    if (!practice) {
      throw new ApiError(404, 'Practice not found');
    }

    if (itemIndex < 0 || itemIndex >= practice.items.length) {
      throw new ApiError(400, 'Invalid item index');
    }

    practice.items[itemIndex] = { ...practice.items[itemIndex], ...itemData };
    await practice.save();

    return practice;
  }

  // Increment usage count (called when practice is added to a course)
  async incrementUsageCount(id: string): Promise<void> {
    await Practice.findByIdAndUpdate(id, { $inc: { usageCount: 1 } });
  }

  // Decrement usage count (called when practice is removed from a course)
  async decrementUsageCount(id: string): Promise<void> {
    await Practice.findByIdAndUpdate(id, { $inc: { usageCount: -1 } });
  }
}

export default new PracticeService();

