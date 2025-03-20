import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client"; // Direct import of PrismaClient

const prisma = new PrismaClient(); // Initialize Prisma

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, email, clerkId } = req.query;

    const whereClause: any = {};
    if (userId) whereClause.id = userId;
    if (email) whereClause.email = email as string;
    if (clerkId) whereClause.clerkId = clerkId as string;

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        documents: true,
        resumes: true,
        posts: true,
        comments: true,
        likes: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
