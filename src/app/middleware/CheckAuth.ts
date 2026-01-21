

import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import { verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (authRoles?: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken;

      if (!accessToken) {
        throw new ApiError(401, "No token provided");
      }

      let verifiedToken: JwtPayload;

      try {
        verifiedToken = verifyToken(accessToken) as JwtPayload;
      } catch (err: any) {
        if (err.name === "TokenExpiredError") {
          return next(new ApiError(401, "jwt expired"));
        }
        if (err.name === "JsonWebTokenError") {
          return next(new ApiError(401, "invalid token"));
        }
        return next(new ApiError(401, "Unauthorized"));
      }

      if (!verifiedToken) {
        throw new ApiError(401, "Invalid token");
      }

      if (authRoles && !authRoles.includes(verifiedToken.role)) {
        throw new ApiError(403, "You are not authorized to access this resource");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("JWT error:", error);
      next(error);
    }
  };
