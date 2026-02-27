"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionId = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateTransactionId = () => {
    const brand = "HLC";
    const randomStr = crypto_1.default.randomBytes(3).toString('hex').toUpperCase();
    const date = new Date();
    const timestamp = date.getTime().toString().slice(-4);
    return `TNXOF${brand}-${randomStr}${timestamp}`;
};
exports.generateTransactionId = generateTransactionId;
