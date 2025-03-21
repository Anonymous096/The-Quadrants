import { db } from "@/lib/db";
import { busSchedules } from "@/lib/db/schema";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const scheduleData = await db
      .select()
      .from(busSchedules)
      .orderBy(busSchedules.sequence);

    return NextResponse.json(scheduleData);
  } catch (error) {
    console.error("Error fetching bus schedules:", error);
    return NextResponse.json(
      { error: "Failed to fetch bus schedules" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'routeName',
      'stopName',
      'location',
      'arrivalTime',
      'departureTime',
      'sequence'
    ];
    
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Insert the schedule directly
    const [newSchedule] = await db
      .insert(busSchedules)
      .values({
        routeName: data.routeName,
        stopName: data.stopName,
        location: data.location,
        arrivalTime: data.arrivalTime,
        departureTime: data.departureTime,
        sequence: data.sequence,
      })
      .returning();

    return NextResponse.json({ success: true, data: newSchedule });
  } catch (error) {
    console.error("Error adding bus schedule:", error);
    return NextResponse.json(
      { error: "Failed to add bus schedule" },
      { status: 500 }
    );
  }
} 