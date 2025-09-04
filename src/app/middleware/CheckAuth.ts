import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/ApiError";
import { verifyToken } from "../utils/jwt";
import {  JwtPayload } from 'jsonwebtoken';

export const checkAuth = (authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            throw new ApiError(403, "No Token Recieved")
        }


        const verifiedToken = verifyToken(accessToken) as JwtPayload;

        if (!verifiedToken) {
            throw new ApiError(403, "Invalid Token")
        }
        if (authRoles && !authRoles.includes(verifiedToken._doc.role)) {
            throw new ApiError(403, "You are not authorized to access this resource");
        }


        req.user = verifiedToken._doc;
        next();

    } catch (error) {
        console.log("jwt error", error);
        next(error)
    }
}