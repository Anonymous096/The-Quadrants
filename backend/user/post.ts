import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { clerkId, email, name, profileImage } = req.body;

      // Validate required fields
      if (!clerkId || !email || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create new user
      const user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
          profileImage,
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
