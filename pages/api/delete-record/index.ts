import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { verifySignature } from "@upstash/qstash/nextjs";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getSubmissions = async () => {
  try {
    const submissions = await prisma.submission.findMany();
    return submissions;
  } catch (err) {
    setTimeout(getSubmissions, 1000);
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const submissions: any = getSubmissions();
  const currDate = new Date().getTime();

  let imageID: string[] = [];
  submissions.forEach((submission: any) => {
    if (Math.abs(currDate - submission.createdAt.getTime()) / 36e5 > 24) {
      imageID.push(submission.img_public_id);
    }
  });

  imageID.forEach(async (id: string) => {
    try {
      const resp = await cloudinary.uploader.destroy(id);
      console.log(resp);
    } catch (err) {
      console.log(err);
    }
  });

  //delete images from cloudinary
  // await fetch(
  //   process.env.NODE_ENV === "production"
  //     ? "https://brighten.ai/api/delete-image"
  //     : "http://localhost:3000/api/delete-image",
  //   {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({"imageID": imageID}),
  //   },
  // );

  // const updatedSubmissions = await prisma.submission.deleteMany({
  //   where: {
  //     id: {
  //       in: submissionID,
  //     },
  //   },
  // });
  res.status(200).json({ message: "OK" });
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
