import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client"; // Direct import of PrismaClient

const prisma = new PrismaClient(); // Initialize Prisma

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { chatId, userId, documentId } = req.query;

    const whereClause: any = {};
    if (chatId) whereClause.id = chatId;
    if (userId) whereClause.userId = userId;
    if (documentId) whereClause.documentId = documentId;

    const chats = await prisma.chat.findMany({
      where: whereClause,
      include: {
        document: true, // Include related document details
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
