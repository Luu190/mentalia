import nodemailer from "nodemailer";

export default async function sendEmail({ to, subject, html }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_HOST,
      port: Number(process.env.BREVO_SMTP_PORT) || 587,
      secure: false, // 587 = STARTTLS
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log("📨 Correo enviado correctamente a:", to);
  } catch (error) {
    console.error("❌ Error enviando correo Brevo:", error);
  }
}
