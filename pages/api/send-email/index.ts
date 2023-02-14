import type { NextApiRequest, NextApiResponse } from "next";
import Email from "../../../emails";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? "");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const data = JSON.parse(req.body);
    if (data.email !== "null") {
      const emailHtml = render(
        Email({ recipient: data.email, image: data.img_output }),
      );
      const options = {
        from: "eedren@gmail.com",
        to: data.email,
        subject: "Download Your Results Now!",
        html: emailHtml,
      };
      sendgrid
        .send(options)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    res.status(200).json({ message: "Success" });
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
}
