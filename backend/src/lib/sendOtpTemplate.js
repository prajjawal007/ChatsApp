export const sendOtpTemplate = ({ otp }) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; border: 1px solid #ddd; background-color: #f4f7fc;">
        <h2 style="color: #007bff; text-align: center;">🔐 Your OTP Code</h2>
        <p style="font-size: 16px; text-align: center; color: #333;">
          Use the following OTP to verify your identity. This code is valid for <strong>5 minutes</strong>.
        </p>
        <div style="font-size: 28px; font-weight: bold; color: #ffffff; background-color: #007bff; padding: 10px 20px; text-align: center; border-radius: 8px; display: inline-block; margin: 10px auto;">
          ${otp}
        </div>
        <p style="font-size: 14px; text-align: center; color: #666;">
          If you didn’t request this, please ignore this email or contact support.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 14px; text-align: center; color: #666;">
          Thanks, <br> <strong>ChatsApp Team</strong>
        </p>
      </div>
    `;
  };
  