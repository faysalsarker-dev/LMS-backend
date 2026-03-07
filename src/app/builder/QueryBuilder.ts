import { FilterQuery, Query } from 'mongoose';

/**
 * 🛠️ QueryBuilder Utility
 * 
 * A highly reusable class designed to abstract and chain standard Mongoose queries 
 * like Pagination, Sorting, Searching, and Filtering. It ensures uniform API behavior 
 * across different modules while dramatically reducing boilerplate code.
 * 
 * @example
 * // 1. Instantiate the builder with a base Mongoose query and the incoming query payload
 * const userQuery = new QueryBuilder(User.find().lean(), req.query)
 *   .search(['name', 'email']) // 🔍 Search specified fields
 *   .filter()                  // 🎯 Filter exact matches & automatically clean up payload
 *   .sort()                    // 🔽 Apply sorting (defaults to -createdAt)
 *   .paginate();               // 📄 Apply pagination (page, limit)
 * 
 * // 2. Execute the query and simultaneously fetch pagination metadata
 * const [data, meta] = await Promise.all([
 *   userQuery.modelQuery,
 *   userQuery.countTotal()
 * ]);
 * 
 * @control Filtering Logic & Best Practices
 * - **Empty values:** Arrays containing empty strings `""`, `undefined`, or `"all"` are automatically ignored, preventing Mongoose from searching for non-existent empty entries.
 * - **Booleans:** Text equivalents like `"true"` and `"false"` are explicitly cast to standard Booleans to avoid strict-casting failures in Mongoose schemas.
 * - **Reserved Keywords:** Words like `search`, `sortBy`, `limit`, and `page` are automatically excluded from the strict `.filter()` matching process so they only affect their respective chainable methods.
 */
class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.search as string;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query }; // copy

    // Filtering out fields that are used for other purposes
    const excludeFields = ['search', 'sortBy', 'sortOrder', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle explicitly empty strings, 'all' selectors, or undefined
    Object.keys(queryObj).forEach((key) => {
      if (
        queryObj[key] === "all" ||
        queryObj[key] === "" ||
        queryObj[key] === undefined
      ) {
        delete queryObj[key];
      }

      // Handle boolean query strings explicitly to bypass strict checks
      if (queryObj[key] === "true") {
        queryObj[key] = true;
      } else if (queryObj[key] === "false") {
        queryObj[key] = false;
      }
    });

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sortBy = (this?.query?.sortBy as string) || 'createdAt';
    const sortOrder = (this?.query?.sortOrder as string) === 'asc' ? '' : '-';
    
    // Convert multiple sorts or default
    const sortValue = `${sortOrder}${sortBy}`;
    
    this.modelQuery = this.modelQuery.sort(sortValue);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export default QueryBuilder;
