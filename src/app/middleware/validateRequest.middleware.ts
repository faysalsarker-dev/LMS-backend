import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { ApiError } from '../errors/ApiError';



const validateRequest = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error: any) {
    console.log('Validation error:', error);
    next(new ApiError(400, error.errors?.map((e: any) => e.message).join(', ') || 'Validation error'));
  }
};

export default validateRequest;
