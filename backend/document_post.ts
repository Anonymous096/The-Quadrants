import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { userId, title, type, fileUrl, content, embeddings } = req.body;

      // Validate required fields
      if (!userId || !title || !type || !fileUrl || !content) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Ensure document type is valid
      if (!["pdf", "ppt"].includes(type)) {
        return res.status(400).json({ error: "Invalid document type. Allowed: 'pdf' or 'ppt'" });
      }

      // Create new document
      const document = await prisma.document.create({
        data: {
          userId,
          title,
          type,
          fileUrl,
          content,
          embeddings, // Optional field
        },
      });

      return res.status(201).json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
