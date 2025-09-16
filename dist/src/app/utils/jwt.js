"use strict";
// import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
// import config from "../config/config"
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
// export const generateToken = (payload: JwtPayload, expire_in: string) => {
//     const token = jwt.sign(payload, config.jwt.secret, {
//         expiresIn: expire_in
//     } as SignOptions)
//     return token
// }
// export const verifyToken = (token: string) => {
//     const verifiedToken = jwt.verify(token, config.jwt.secret);
//     return verifiedToken
// }
// export const getTokenFromHeader = (authHeader?: string): string | null => {
//   if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
//   return authHeader.split(" ")[1];
// };
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const generateToken = (payload, expiresIn) => {
    return jsonwebtoken_1.default.sign(payload, config_1.default.jwt.secret, { expiresIn });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    }
    catch (err) {
        return null;
    }
};
exports.verifyToken = verifyToken;
