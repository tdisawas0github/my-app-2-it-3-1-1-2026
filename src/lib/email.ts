import "server-only";
import nodemailer from "nodemailer";

const port = Number(process.env.SMTP_PORT ?? 587);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const from = process.env.SMTP_FROM;

  if (!from) {
    throw new Error("SMTP_FROM is not defined");
  }

  await transporter.sendMail({
    from,
    to,
    subject: "Reset your password",
    text: [
      "We received a request to reset your password.",
      "",
      `Reset it using the link below (valid for 1 hour):`,
      resetUrl,
      "",
      "If you did not request this, you can safely ignore this email.",
    ].join("\n"),
    html: `
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${resetUrl}">Reset your password</a>
        (valid for 1 hour)
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
}
