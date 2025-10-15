import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";

const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err instanceof ApiError ? err.message : "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorHandler;
