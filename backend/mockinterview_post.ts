import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { userId, resumeId, questions, answers, feedback } = req.body;

      // Validate required fields
      if (!userId || !resumeId || !questions) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create new mock interview entry
      const mockInterview = await prisma.mockInterview.create({
        data: {
          userId,
          resumeId,
          questions,
          answers,
          feedback,
        },
      });

      return res.status(201).json(mockInterview);
    } catch (error) {
      console.error("Error creating mock interview:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
