import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

interface Submission {
  email?: string;
  image_input: string;
  image_output: string;
  image_public_id: string;
}

const uploadSubmission = async (data: Submission) => {
  try {
    const newSubmission = await prisma.submission.create({
      data: {
        email: data.email,
        img_input: data.image_input,
        img_output: data.image_output,
        img_public_id: data.image_public_id,
      },
    });
    return newSubmission;
  } catch (err) {
    console.log(err);
    setTimeout(uploadSubmission, 1000, data);
  }
};

//upload to prisma
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const newSubmission = await uploadSubmission(req.body);
    res.status(200).json(newSubmission);
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
}
