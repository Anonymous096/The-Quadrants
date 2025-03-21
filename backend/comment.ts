import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { commentId, postId, userId } = req.query;

    let whereCondition: any = {};

    if (commentId) whereCondition.id = commentId;
    if (postId) whereCondition.postId = postId;
    if (userId) whereCondition.userId = userId;

    const comments = await prisma.comment.findMany({
      where: whereCondition,
      include: {
        post: true, // Include post details
        user: true  // Include user details
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
}
