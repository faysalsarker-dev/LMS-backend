"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const generateToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(payload, config_1.default.jwt.secret, {
        expiresIn: config_1.default.jwt.expires_in
    });
    return token;
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    const verifiedToken = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    return verifiedToken;
};
exports.verifyToken = verifyToken;
