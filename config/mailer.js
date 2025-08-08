const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST, // e.g. smtp.gmail.com
  port: process.env.MAIL_PORT, // e.g. 465 (SSL) or 587 (TLS)
  secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw error;
  }
}

module.exports = sendEmail;
