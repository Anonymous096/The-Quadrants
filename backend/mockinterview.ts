import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { mockInterviewId, userId, resumeId } = req.query;

    let whereCondition: any = {};

    if (mockInterviewId) whereCondition.id = mockInterviewId;
    if (userId) whereCondition.userId = userId;
    if (resumeId) whereCondition.resumeId = resumeId;

    const mockInterviews = await prisma.mockInterview.findMany({
      where: whereCondition,
      include: {
        resume: true, // Include resume details
      },
    });

    res.status(200).json(mockInterviews);
  } catch (error) {
    console.error("Error fetching mock interviews:", error);
    res.status(500).json({ error: "Failed to fetch mock interviews." });
  }
}
