import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version:
          "2349ec8d0a40cf4ca6ba62fa2d8239e14cd2e1535e4aafefabe09dd6b7992dd5",
        input: {
          image: req.body,
        },
      }),
    });
    if (response.status !== 201) {
      let error = await response.json();
      res.statusCode = 500;
      res.end(JSON.stringify({ detail: error.detail }));
      return;
    }
    const prediction = await response.json();
    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
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
