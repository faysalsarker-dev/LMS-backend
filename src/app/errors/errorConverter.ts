import { Request, Response, NextFunction } from 'express';
import { ApiError } from './ApiError';

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;

  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

export default errorConverter;
