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
        subject: "Brighten.ai - Your Image Has Been Processed",
        html: emailHtml,
      };

      try {
        const sendGridResp = await sendgrid.send(options);
        return res.status(200).json({ message: sendGridResp });
      } catch (err) {
        return res.status(500).json({ message: err });
      }
    }
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
}
