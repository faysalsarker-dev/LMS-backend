"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = require("../errors/ApiError");
const validateRequest = (schema) => async (req, res, next) => {
    try {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        console.log('Validation error:', error);
        next(new ApiError_1.ApiError(400, error.errors?.map((e) => e.message).join(', ') || 'Validation error'));
    }
};
exports.default = validateRequest;
