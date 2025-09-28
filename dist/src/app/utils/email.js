"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLinkEmail = exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const otpTamplate_1 = __importDefault(require("./otpTamplate"));
const ResetPasswordEmail_1 = __importDefault(require("./ResetPasswordEmail"));
// Transporter configuration
const transporter = nodemailer_1.default.createTransport({
    host: config_1.default.host,
    port: Number(config_1.default.smtp_port) || 587,
    secure: false,
    auth: {
        user: config_1.default.user,
        pass: config_1.default.pass,
    },
});
const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"EduPlatform" <${config_1.default.user}>`,
        to,
        subject: "Your OTP Code - EduPlatform",
        html: (0, otpTamplate_1.default)(otp)
    };
    await transporter.sendMail(mailOptions);
};
exports.sendOtpEmail = sendOtpEmail;
const sendLinkEmail = async (to, link) => {
    const mailOptions = {
        from: `"Reset Password" <${config_1.default.user}>`,
        to,
        subject: "Your OTP Code - EduPlatform",
        html: (0, ResetPasswordEmail_1.default)(link)
    };
    await transporter.sendMail(mailOptions);
};
exports.sendLinkEmail = sendLinkEmail;
