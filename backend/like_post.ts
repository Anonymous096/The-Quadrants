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

    const likes = await prisma.like.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true } }, // Fetch user details
        post: { select: { title: true } }, // Fetch post title
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(likes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
