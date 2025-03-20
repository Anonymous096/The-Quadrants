import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { postId, userId } = req.query;

    const whereClause: any = {};
    if (postId) whereClause.postId = postId;
    if (userId) whereClause.userId = userId;

    const comments = await prisma.comment.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true } }, // Fetch user details
        post: { select: { title: true } }, // Fetch post title
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
