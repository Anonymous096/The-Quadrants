//npm install next @prisma/client
//npx prisma generate

import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const method = req.method ?? ""; // Ensure it's always a string
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { likeId, postId, userId } = req.query;

    let whereCondition: any = {};

    if (likeId) whereCondition.id = likeId;
    if (postId) whereCondition.postId = postId;
    if (userId) whereCondition.userId = userId;

    const likes = await prisma.like.findMany({
      where: whereCondition,
      include: {
        post: true, // Include post details
        user: true  // Include user details
      },
    });

    res.status(200).json(likes);
  } catch (error) {
    console.error("Error fetching likes:", error);
    res.status(500).json({ error: "Failed to fetch likes." });
  }
}
