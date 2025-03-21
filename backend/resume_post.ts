import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { userId, fileUrl, content, atsScore, feedback, improvements } = req.body;

      // Validate required fields
      if (!userId || !fileUrl || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create new resume entry
      const resume = await prisma.resume.create({
        data: {
          userId,
          fileUrl,
          content,
          atsScore,
          feedback,
          improvements,
        },
      });

      return res.status(201).json(resume);
    } catch (error) {
      console.error("Error creating resume:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
