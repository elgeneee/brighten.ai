import type { NextApiRequest, NextApiResponse } from "next";
import Email from "../../../emails";
import { render } from "@react-email/render";
import sendgrid from "@sendgrid/mail";
sendgrid.setApiKey(
  "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",
);
// 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
// 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
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
    // const response = await fetch("https://api.replicate.com/v1/predictions", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     version:
    //       "2349ec8d0a40cf4ca6ba62fa2d8239e14cd2e1535e4aafefabe09dd6b7992dd5",
    //     input: {
    //       image: req.body,
    //     },
    //   }),
    // });
    // if (response.status !== 201) {
    //   let error = await response.json();
    //   res.statusCode = 500;
    //   res.end(JSON.stringify({ detail: error.detail }));
    //   return;
    // }
    // const prediction = await response.json();
    // res.statusCode = 201;
    // res.end(JSON.stringify(prediction));
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
