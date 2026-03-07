"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchableFields) {
        const searchTerm = this?.query?.search;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = { ...this.query }; // copy
        // Filtering out fields that are used for other purposes
        const excludeFields = ['search', 'sortBy', 'sortOrder', 'limit', 'page', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        // Handle 'all' explicitly by stripping those filters out
        Object.keys(queryObj).forEach((key) => {
            if (queryObj[key] === 'all') {
                delete queryObj[key];
            }
            // Handle boolean query strings
            if (queryObj[key] === 'true') {
                queryObj[key] = true;
            }
            else if (queryObj[key] === 'false') {
                queryObj[key] = false;
            }
        });
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    sort() {
        const sortBy = this?.query?.sortBy || 'createdAt';
        const sortOrder = this?.query?.sortOrder === 'asc' ? '' : '-';
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
exports.default = QueryBuilder;
