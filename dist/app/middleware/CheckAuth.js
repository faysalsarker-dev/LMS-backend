"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const ApiError_1 = require("../errors/ApiError");
const jwt_1 = require("../utils/jwt");
const checkAuth = (authRoles) => async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            throw new ApiError_1.ApiError(403, "No Token Recieved");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accessToken);
        if (!verifiedToken) {
            throw new ApiError_1.ApiError(403, "Invalid Token");
        }
        if (authRoles && !authRoles.includes(verifiedToken._doc.role)) {
            throw new ApiError_1.ApiError(403, "You are not authorized to access this resource");
        }
        req.user = verifiedToken._doc;
        next();
    }
    catch (error) {
        console.log("jwt error", error);
        next(error);
    }
};
exports.checkAuth = checkAuth;
