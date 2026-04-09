import { Request, Response, NextFunction } from 'express';
import { deleteImageFromCLoudinary } from '../config/cloudinary.config';
import { deleteFileFromBunny } from '../config/bunny.config';
import { TErrorSources } from '../interfaces/error.types';
import { handlerDuplicateError } from '../helpers/handleDuplicateError';
import { handleCastError } from '../helpers/handleCastError';
import { handlerZodError } from '../helpers/handlerZodError';
import { handlerValidationError } from '../helpers/handlerValidationError';
import { ApiError } from '../errors/ApiError';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('🔥 Global Error Handler:', err);

  // Fire-and-forget: cleanup uploaded files without blocking the error response
  const cleanupUrl = async (url: string) => {
    if (url.includes('cloudinary.com')) {
      return deleteImageFromCLoudinary(url);
    }
    return deleteFileFromBunny(url);
  };

  if (req.file) {
    cleanupUrl(req.file.path).catch((e) =>
      console.error('Failed to delete uploaded file:', e)
    );
  }

  if (req.files && Array.isArray(req.files) && req.files.length) {
    const fileUrls = (req.files as Express.Multer.File[]).map((file) => file.path);
    Promise.all(fileUrls.map((url) => cleanupUrl(url))).catch((e) =>
      console.error('Failed to delete uploaded files:', e)
    );
  }


 let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = "Something Went Wrong!!"

    //Duplicate error
    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    // Object ID error / Cast Error
    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }
    else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }
    else if (err instanceof ApiError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    }



  res.status(statusCode).json({
    success: false,
    message: message,
    ...(errorSources.length > 0 && { errorSources }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
