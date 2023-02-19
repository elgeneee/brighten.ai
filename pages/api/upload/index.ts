import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { verify } from "jsonwebtoken";

const prisma = new PrismaClient();

interface Submission {
  email?: string;
  image_input: string;
  image_output: string;
  image_public_id: string;
}

const authenticated =
  (fn: NextApiHandler) => async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization!;
      const decoded = verify(token, process.env.JWT_SECRET_KEY!);
      if (decoded) {
        return await fn(req, res);
      }
    } catch (err) {
      res.status(500).json({ message: "Authorization Error" });
      return;
    }
    res.status(500).json({ message: "No Access Allowed" });
  };

export default authenticated(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const newSubmission = await prisma.submission.create({
          data: {
            email: req.body.email,
            img_input: req.body.image_input,
            img_output: req.body.image_output,
            img_public_id: req.body.image_public_id,
          },
        });
        res.status(200).json(newSubmission);
        break;
      } catch (err) {
        retryCount++;
        if (retryCount === maxRetries) {
          res.status(500)
          throw err;
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }
  } else {
    res.status(500).json({ message: "Method not allowed" });
  }
});
