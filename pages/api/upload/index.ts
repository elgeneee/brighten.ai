import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

//upload to prisma
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const newSubmission = await prisma.submission.create({
      data: {
        email: req.body.email,
        img_input: req.body.image_input,
        img_output: req.body.image_output,
        img_public_id: req.body.image_public_id,
      },
    });
    // console.log(newSubmission);
    res.status(200).json(newSubmission);
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
}
