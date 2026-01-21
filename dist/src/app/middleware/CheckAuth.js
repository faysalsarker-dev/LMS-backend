"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const ApiError_1 = require("../errors/ApiError");
const jwt_1 = require("../utils/jwt");
const checkAuth = (authRoles) => async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw new ApiError_1.ApiError(401, "No token provided");
        }
        let verifiedToken;
        try {
            verifiedToken = (0, jwt_1.verifyToken)(accessToken);
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                return next(new ApiError_1.ApiError(401, "jwt expired"));
            }
            if (err.name === "JsonWebTokenError") {
                return next(new ApiError_1.ApiError(401, "invalid token"));
            }
            return next(new ApiError_1.ApiError(401, "Unauthorized"));
        }
        if (!verifiedToken) {
            throw new ApiError_1.ApiError(401, "Invalid token");
        }
        if (authRoles && !authRoles.includes(verifiedToken.role)) {
            throw new ApiError_1.ApiError(403, "You are not authorized to access this resource");
        }
        req.user = verifiedToken;
        next();
    }
    catch (error) {
        console.log("JWT error:", error);
        next(error);
    }
};
exports.checkAuth = checkAuth;
