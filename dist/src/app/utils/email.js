"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInviteEmail = exports.sendLinkEmail = exports.sendOtpEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const otpTamplate_1 = __importDefault(require("./otpTamplate"));
const ResetPasswordEmail_1 = __importDefault(require("./ResetPasswordEmail"));
const InviteEmail_1 = __importDefault(require("./InviteEmail"));
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
        from: `<${config_1.default.user}>`,
        to,
        subject: "Your OTP Code - Humanistic Language Center",
        html: (0, otpTamplate_1.default)(otp)
    };
    await transporter.sendMail(mailOptions);
};
exports.sendOtpEmail = sendOtpEmail;
const sendLinkEmail = async (to, link) => {
    const mailOptions = {
        from: `<${config_1.default.user}>`,
        to,
        subject: "Your OTP Code - Humanistic Language Center",
        html: (0, ResetPasswordEmail_1.default)(link)
    };
    await transporter.sendMail(mailOptions);
};
exports.sendLinkEmail = sendLinkEmail;
const sendInviteEmail = async (to, obj) => {
    const mailOptions = {
        from: `<${config_1.default.user}>`,
        to,
        subject: "Your Invite Link - Humanistic Language Center",
        html: (0, InviteEmail_1.default)({ ...obj, password: obj.password || '' })
    };
    await transporter.sendMail(mailOptions);
};
exports.sendInviteEmail = sendInviteEmail;
