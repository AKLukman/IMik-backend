import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production", // true for port 465, false for other ports
    auth: {
      user: "abulkashemlukman@gmail.com",
      pass: "tqfi fmiz jgzq zjoa",
    },
  });
  await transporter.sendMail({
    from: "abulkashemlukman@gmail.com", // sender address
    to, // list of receivers
    subject: "Reset your password with in 10 minutes.", // Subject line
    text: "Reset your password with in 10 minutes.", // plain text body
    html: resetLink, // html body
  });
};
