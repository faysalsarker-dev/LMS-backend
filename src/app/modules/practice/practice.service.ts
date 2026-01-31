import { ApiError } from '../../errors/ApiError';
import Practice from './practice.model';
import { IPractice, IPracticeItem } from './practice.interface';
import mongoose, { FilterQuery, SortOrder } from 'mongoose';
import User from '../auth/User.model';

interface GetAllOptions {
  courseId?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


const createPractice = async (payload: IPractice): Promise<IPractice> => {
  return Practice.create(payload);
};



const getAllPractices = async (
  options: GetAllOptions = {}
) => {
  const {
    courseId,
    isActive,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = options;

  const filters: FilterQuery<IPractice> = {};
  if (courseId) filters.course = courseId;
  if (typeof isActive === 'boolean') filters.isActive = isActive;

  const sort: Record<string, SortOrder> = {
    [sortBy]: sortOrder === 'asc' ? 1 : -1,
  };

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Practice.find()
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('course', 'title'),
    Practice.countDocuments(filters),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data,
  };
};


const getPracticeById = async (id: string): Promise<IPractice> => {
  const practice = await Practice.findById(id).populate('course');

  if (!practice) {
    throw new ApiError(404, 'Practice not found');
  }

  return practice;
};
const getPracticeByIdForUser = async (slug: string): Promise<IPractice> => {
  const practice = await Practice.findOne({ slug, isActive: true }).populate('course');

  if (!practice) {
    throw new ApiError(404, 'Practice not found');
  }


practice.usageCount += 1;
await practice.save();

  return practice;
};








const updatePractice = async (
  id: string,
  payload: Partial<IPractice>
): Promise<IPractice> => {
  const updated = await Practice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!updated) throw new ApiError(404, 'Practice not found');

  return updated;
};

const deletePractice = async (id: string): Promise<void> => {
  const deleted = await Practice.findByIdAndDelete(id);
  if (!deleted) throw new ApiError(404, 'Practice not found');
};

// ============== NEW: Item Management Methods ==============

const addItemToPractice = async (
  practiceId: string,
  itemData: Partial<IPracticeItem>
): Promise<IPracticeItem> => {
  // Validate practiceId
  if (!mongoose.Types.ObjectId.isValid(practiceId)) {
    throw new ApiError(400, 'Invalid practice ID');
  }

  // Find the practice
  const practice = await Practice.findById(practiceId);
  
  if (!practice) {
    throw new ApiError(404, 'Practice not found');
  }

  // Calculate the order for the new item (last position)
  const order = practice.items.length > 0 
    ? Math.max(...practice.items.map(item => item.order || 0)) + 1 
    : 1;

  // Create the new item
  const newItem: Partial<IPracticeItem> = {
    content: itemData.content,
    pronunciation: itemData.pronunciation,
    audioUrl: itemData.audioUrl,
    imageUrl: itemData.imageUrl,
    order: order
  };

  // Push the new item to the practice
  practice.items.push(newItem as IPracticeItem);

  // Save the practice
  await practice.save();

  // Return the newly added item (last item in array)
  return practice.items[practice.items.length - 1];
};

const updatePracticeItem = async (
  practiceId: string,
  itemId: string,
  updateData: Partial<IPracticeItem>
): Promise<IPracticeItem> => {
  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(practiceId)) {
    throw new ApiError(400, 'Invalid practice ID');
  }
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, 'Invalid item ID');
  }

  // Find the practice
  const practice = await Practice.findById(practiceId);
  
  if (!practice) {
    throw new ApiError(404, 'Practice not found');
  }

  // Find the item index
  const itemIndex = practice.items.findIndex(
    item => item._id?.toString() === itemId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, 'Item not found in practice');
  }

  // Update the item fields
  if (updateData.content !== undefined) {
    practice.items[itemIndex].content = updateData.content;
  }
  if (updateData.pronunciation !== undefined) {
    practice.items[itemIndex].pronunciation = updateData.pronunciation;
  }
  if (updateData.audioUrl !== undefined) {
    practice.items[itemIndex].audioUrl = updateData.audioUrl;
  }
  if (updateData.imageUrl !== undefined) {
    practice.items[itemIndex].imageUrl = updateData.imageUrl;
  }
  if (updateData.order !== undefined) {
    practice.items[itemIndex].order = updateData.order;
  }

  // Save the practice
  await practice.save();

  return practice.items[itemIndex];
};

const deleteItemFromPractice = async (
  practiceId: string,
  itemId: string
): Promise<void> => {
  // Validate IDs
  if (!mongoose.Types.ObjectId.isValid(practiceId)) {
    throw new ApiError(400, 'Invalid practice ID');
  }
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, 'Invalid item ID');
  }

  // Find and update the practice
  const result = await Practice.findByIdAndUpdate(
    practiceId,
    { $pull: { items: { _id: itemId } } },
    { new: true }
  );

  if (!result) {
    throw new ApiError(404, 'Practice not found');
  }
};

const reorderPracticeItems = async (
  practiceId: string,
  itemOrders: { itemId: string; order: number }[]
): Promise<void> => {
  // Validate practiceId
  if (!mongoose.Types.ObjectId.isValid(practiceId)) {
    throw new ApiError(400, 'Invalid practice ID');
  }

  // Find the practice
  const practice = await Practice.findById(practiceId);
  
  if (!practice) {
    throw new ApiError(404, 'Practice not found');
  }

  // Update the order of each item
  itemOrders.forEach(({ itemId, order }) => {
    const itemIndex = practice.items.findIndex(
      item => item._id?.toString() === itemId
    );
    if (itemIndex !== -1) {
      practice.items[itemIndex].order = order;
    }
  });

  // Save the practice
  await practice.save();
};

const getUserEnrolledCoursePractices = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, 'Invalid user ID');
  }

  const user = await User.findById(userId).select('courses').lean();

  if (!user || !user.courses || user.courses.length === 0) {
    return [];
  }
  const practices = await Practice.find({
    course: { $in: user.courses },
    isActive: true
  })
  .populate('course', 'title')
  .select('id title description course createdAt course thumbnail slug')
    .sort({ createdAt: -1 })
    .lean();

  return practices;
};







export const PracticeService = {
  createPractice,
  getAllPractices,
  getPracticeById,
  updatePractice,
  deletePractice,
  addItemToPractice,
  updatePracticeItem,
  deleteItemFromPractice,
  reorderPracticeItems,
  getUserEnrolledCoursePractices,
  getPracticeByIdForUser
};
