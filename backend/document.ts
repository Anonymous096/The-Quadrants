import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client"; // Direct import

const prisma = new PrismaClient(); // Initialize Prisma

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { documentId, userId, type } = req.query;

    const whereClause: any = {};
    if (documentId) whereClause.id = documentId;
    if (userId) whereClause.userId = userId;
    if (type) whereClause.type = type;

    const documents = await prisma.document.findMany({
      where: whereClause,
      include: {
        chats: true, // Include related chats
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
