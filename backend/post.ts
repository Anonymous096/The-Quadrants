import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { postId, userId, type, title } = req.query;

    let whereCondition: any = {};

    if (postId) whereCondition.id = postId;
    if (userId) whereCondition.userId = userId;
    if (type) whereCondition.type = type;
    if (title) whereCondition.title = { contains: title, mode: "insensitive" }; // Case-insensitive search

    const posts = await prisma.post.findMany({
      where: whereCondition,
      include: {
        user: true,       // Include user details
        comments: true,   // Include comments
        likes: true       // Include likes
      },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts." });
  }
}
