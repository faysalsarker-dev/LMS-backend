import nodemailer from "nodemailer";
import config from "../config/config";
import OTPEmail from "./otpTamplate";
import ResetPasswordEmail from "./ResetPasswordEmail";
import InviteEmail from "./InviteEmail";


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
    from: `<${config.user}>`,
    to,
    subject: "Your OTP Code - Humanistic Language Center",
    html:OTPEmail(otp)
  };

  await transporter.sendMail(mailOptions);
};


export const sendLinkEmail = async (to: string, link: string): Promise<void> => {
  const mailOptions = {
    from: `<${config.user}>`,
    to,
    subject: "Your OTP Code - Humanistic Language Center",
    html:ResetPasswordEmail(link)
  };

  await transporter.sendMail(mailOptions);
};

export const sendInviteEmail = async (to: string, obj: { name: string; role: string; email: string; password: string | undefined }): Promise<void> => {
  const mailOptions = {
    from: `<${config.user}>`,
    to,
    subject: "Your Invite Link - Humanistic Language Center",
    html:InviteEmail({ ...obj, password: obj.password || '' })
  };

  await transporter.sendMail(mailOptions);
};
