import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
import { ApiError } from '../errors/ApiError';



const validateRequest =(schema: ZodObject) =>  async(req: Request, res: Response, next: NextFunction) => {
  try {
     if (req.body.data) {
            req.body = JSON.parse(req.body.data)
        }
        req.body = await schema.parseAsync(req.body)
        next()
  } catch (error: any) {
    console.log('Validation error:', error);
    next(new ApiError(400, error.errors?.map((e: any) => e.message).join(', ') || 'Validation error'));
  }
};

export default validateRequest;
