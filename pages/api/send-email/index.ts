import type { NextApiRequest, NextApiResponse } from "next";
import Email from "../../../emails";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? '');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    console.log(req.body);
    const emailHtml = render(Email());
    const options = {
      from: "eedren@gmail.com",
      to: "zolous.official@gmail.com",
      subject: "Download Your Results Now!",
      html: emailHtml,
    };
    sendgrid
      .send(options)
      .then(() => {
        console.log("Email sent");
      })
      .catch((err) => {
        console.log(err);
      });

    res.status(200).json({ message: "Success" });
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8MB",
    },
  },
};
