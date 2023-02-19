import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import Email from "../../../emails";
import type { NextApiRequest, NextApiResponse } from "next";

const transporter = nodemailer.createTransport({
  secure: false,
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    const emailHtml = render(
      Email({ recipient: data.email, image: data.img_output }),
    );

    const options = {
      from: process.env.NODEMAILER_EMAIL,
      to: data.email,
      subject: "Brighten.ai - Your Image Has Been Processed",
      html: emailHtml,
    };

    transporter
      .sendMail(options)
      .then((info) => {
        res.status(200).json({ message: info });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
}
