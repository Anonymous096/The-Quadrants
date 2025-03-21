import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { userId, documentId, question, answer } = req.body;

      // Validate required fields
      if (!userId || !question || !answer) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create new chat entry
      const chat = await prisma.chat.create({
        data: {
          userId,
          documentId, // Optional field
          question,
          answer,
        },
      });

      return res.status(201).json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
