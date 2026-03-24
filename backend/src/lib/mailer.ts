import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER!,
    pass: process.env.MAIL_PASS!, // Gmail App Password
  },
});

export const sendOtpEmail = async (
  email: string,
  otp: string,
): Promise<void> => {
  await transporter.sendMail({
    from: `"PayYou" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Your PayYou Verification OTP",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">PayYou Verification</h2>
        <p>Your One-Time Password is:</p>
        <h1 style="letter-spacing: 8px; color: #4F46E5; font-size: 36px;">${otp}</h1>
        <p style="color: #6B7280;">This OTP expires in <strong>5 minutes</strong>.</p>
        <p style="color: #9CA3AF; font-size: 12px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};
