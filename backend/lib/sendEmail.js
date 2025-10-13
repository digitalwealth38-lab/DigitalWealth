// utils/sendEmail.js
import nodemailer from "nodemailer";

export default async function sendEmail({ to, subject, html }) {
  // For production use SendGrid / Mailgun / SES – nodemailer with SMTP here is example
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Digital Wealth" <${process.env.FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
}
