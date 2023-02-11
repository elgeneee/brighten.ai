import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const submissions = await prisma.submission.findMany();
  const currDate = new Date().getTime();
  let submissionID: string[] = [];
  let imageID: string[] = [];
  submissions.forEach((submission) => {
    if (Math.abs(currDate - submission.createdAt.getTime()) / 36e5 > 24) {
      submissionID.push(submission.id);
      imageID.push(submission.img_public_id);
    }
  });

  //delete images from cloudinary
  await fetch(
    process.env.NODE_ENV === "production"
      ? "https://brighten.ai/api/delete-image"
      : "http://localhost:3000/api/delete-image",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(imageID),
    },
  );

  const updatedSubmissions = await prisma.submission.deleteMany({
    where: {
      id: {
        in: submissionID,
      },
    },
  });
  res.status(200).json(updatedSubmissions);
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
