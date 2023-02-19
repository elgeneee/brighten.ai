import type { NextApiRequest, NextApiResponse } from "next";
import { sign } from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const response = await fetch(
    "https://api.replicate.com/v1/predictions/" + req.query.id,
    {
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  const prediction = await response.json();

  if (response.status !== 200) {
    let error = await response.json();
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: error.detail }));
    return;
  } else {
    const claims = { id: prediction.id };
    const jwt = sign(claims, process.env.JWT_SECRET_KEY!, { expiresIn: "3m" });
    res.end(JSON.stringify({ jwt_token: jwt, ...prediction }));
  }
}
