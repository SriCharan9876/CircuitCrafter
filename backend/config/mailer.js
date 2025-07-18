// mailer.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // App password from Gmail
  },
});

const sendOTP = async (to, otp) => {
  const mailOptions = {
    from: `"Circuit Crafter" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Code",
    html: `<h3>Your OTP is <strong>${otp}</strong></h3>`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOTP;
