import nodemailer from "nodemailer";
import config from "../config/config";


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

/**
 * Send OTP email
 */
export const sendOtpEmail = async (to: string, otp: string): Promise<void> => {
  const mailOptions = {
    from: `"EduPlatform" <${config.user}>`,
    to,
    subject: "Your OTP Code - EduPlatform",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Verify Your Account</h2>
        <p>Use the following OTP to complete your verification:</p>
        <div style="font-size: 22px; font-weight: bold; margin: 20px 0; letter-spacing: 4px;">
          ${otp}
        </div>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
