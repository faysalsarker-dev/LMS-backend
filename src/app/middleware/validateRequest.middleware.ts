import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/ApiError';
import { ZodObject }  from 'zod';






 const validateRequest = (zodSchema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data)
        }
        req.body = await zodSchema.parseAsync(req.body)
        next()
    } catch (error) {
        next(error)
    }
}


export default validateRequest;
