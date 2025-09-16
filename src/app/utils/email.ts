import nodemailer from "nodemailer";
import config from "../config/config";
import OTPEmail from "./otpTamplate";
import ResetPasswordEmail from "./ResetPasswordEmail";


// Transporter configuration
const transporter = nodemailer.createTransport({
  host: config.host, 
  port: Number(config.smtp_port) || 587,
  secure: false, 
  auth: {
    user: config.user,
    pass: config.pass, 
  },
});


export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: `"EduPlatform" <${config.user}>`,
    to,
    subject: "Your OTP Code - EduPlatform",
    html:OTPEmail(otp)
  };

  await transporter.sendMail(mailOptions);
};


export const sendLinkEmail = async (to: string, link: string): Promise<void> => {
  const mailOptions = {
    from: `"Reset Password" <${config.user}>`,
    to,
    subject: "Your OTP Code - EduPlatform",
    html:ResetPasswordEmail(link)
  };

  await transporter.sendMail(mailOptions);
};
