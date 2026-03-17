import nodemailer from "nodemailer";
import { env } from "@chomuon/env/server";

// 1. Tạo transporter dùng Mailtrap SMTP
const transporter = nodemailer.createTransport({
  host: env.MAILTRAP_HOST,
  port: env.MAILTRAP_PORT,
  auth: {
    user: env.MAILTRAP_USER,
    pass: env.MAILTRAP_PASS,
  },
});

// 2. Hàm gửi email
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  await transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
  });
}

// 3. Email templates (đơn giản, inline HTML)
export function verifyEmailTemplate(url: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Xác minh email ChoMuon</h2>
      <p>Click vào link bên dưới để xác minh email của bạn:</p>
      <a href="${url}" style="display:inline-block; padding: 12px 24px; background: #4f46e5; color: white; border-radius: 6px; text-decoration: none;">
        Xác minh Email
      </a>
      <p style="color: #666; font-size: 12px; margin-top: 16px;">Link hết hạn sau 24 giờ.</p>
    </div>
  `;
}

export function resetPasswordTemplate(url: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2>Đặt lại mật khẩu ChoMuon</h2>
      <p>Click vào link bên dưới để đặt lại mật khẩu:</p>
      <a href="${url}" style="display:inline-block; padding: 12px 24px; background: #4f46e5; color: white; border-radius: 6px; text-decoration: none;">
        Đặt lại mật khẩu
      </a>
      <p style="color: #666; font-size: 12px; margin-top: 16px;">Nếu bạn không yêu cầu, hãy bỏ qua email này. Link hết hạn sau 1 giờ.</p>
    </div>
  `;
}
