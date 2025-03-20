import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client"; // Direct import of PrismaClient

const prisma = new PrismaClient(); // Initialize Prisma
// Assuming Prisma is set up

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { resumeId, userId } = req.query;

    const whereClause: any = {};
    if (resumeId) whereClause.id = resumeId;
    if (userId) whereClause.userId = userId;

    const resumes = await prisma.resume.findMany({
      where: whereClause,
      include: {
        mockInterviews: true, // Include related mock interviews
      },
    });

    return res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
