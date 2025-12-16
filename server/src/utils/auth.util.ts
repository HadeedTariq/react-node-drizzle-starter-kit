import otpGenerator from "otp-generator";
import { env } from "@/common/utils/envConfig";
import nodemailer from "nodemailer";
import { sign } from "jsonwebtoken";
import { logger } from "@/common/middleware/requestLogger";
import { users } from "@/db";

export function generateOTP() {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });

  return otp;
}

export const sendOTPEmail = async (
  to: string,
  otp: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: String(env.NODE_MAILER_USER),
        pass: String(env.NODE_MAILER_PASSWORD),
      },
    });
    const mailOptions = {
      from: `"React Starter Kit" <${env.NODE_MAILER_USER}>`,
      to,
      subject: "Verify Your React Starter Kit Account – OTP Inside",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 8px;">
          <h2 style="color: #2c3e50;">Hello from <span style="color: #0070f3;">React Starter Kit</span> 👋</h2>
          <p style="font-size: 16px; color: #333;">
            To keep your account secure, we’ve generated a One-Time Password (OTP) for you.
          </p>
          <p style="font-size: 16px; color: #333; margin-bottom: 8px;">
            Please use the following OTP to complete your verification:
          </p>
          <div style="font-size: 28px; font-weight: bold; color: #0070f3; padding: 12px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #666;">
            This OTP is valid for <strong>5 minutes</strong>. Do not share this code with anyone—even if they claim to be from Accoswap.
          </p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">
            If you didn’t request this OTP, please ignore this email or contact our support team.
          </p>
          <p style="font-size: 12px; color: #999;">— The Accoswap Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    logger.error({
      event: "email_otp_sending_failed",
      error: error?.message,
      code: error.code,
      metadata: { email: to },
    });

    return { success: false, error: error.message || "Email sending failed" };
  }
};

export const generateAccessAndRefreshToken = function (user: any) {
  const refreshToken = sign({ id: user.id }, env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "15d",
  });
  const accessToken = sign(
    {
      id: user.id,
      user_name: user.userName || "",
      email: user.email || "",
      role: user.role || "customer",
      gender: user.gender || "male",
    },
    env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  return { refreshToken, accessToken };
};
