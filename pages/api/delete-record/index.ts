import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

//upload to prisma
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
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
    const resp = await fetch(
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
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
}
