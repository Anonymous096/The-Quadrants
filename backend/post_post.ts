import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { userId, type, title, content, location, eventDate, departure, destination, seats, price } = req.body;

      // Validate required fields
      if (!userId || !type || !title || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create new post entry
      const post = await prisma.post.create({
        data: {
          userId,
          type,
          title,
          content,
          location,
          eventDate: eventDate ? new Date(eventDate) : null,
          departure,
          destination,
          seats,
          price,
        },
      });

      return res.status(201).json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
