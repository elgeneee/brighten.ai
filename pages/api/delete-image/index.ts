// import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const imageID = req.body;
    imageID.forEach(async (id: string) => {
      try {
        const resp = await cloudinary.uploader.destroy(id);
        console.log(resp);
      } catch (err) {
        console.log(err);
      }
    });
    res.status(200).json({ message: "OK" });
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
}
