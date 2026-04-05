import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Student applies to an offer
export async function POST(req: NextRequest) {
  try {
    const { studentId, offerId } = await req.json();
    if (!studentId || !offerId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Prevent duplicate applications
    const existing = await prisma.application.findFirst({
      where: { studentId, offerId },
    });
    if (existing) {
      return NextResponse.json({ message: "Already applied" });
    }

    // Create the application
    await prisma.application.create({
      data: { studentId, offerId },
    });

    // Return the updated offer with applications count
    const updatedOffer = await prisma.offer.findUnique({
      where: { id: offerId },
      include: {
        applications: { include: { student: true } },
      },
    });

    const response = {
      ...updatedOffer,
      stageApplicants: updatedOffer?.applications.length || 0,
    };

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
// Get all applications of a student
export async function POST_my(req: NextRequest) {
  const { studentId } = await req.json();
  const applications = await prisma.application.findMany({
    where: { studentId },
    include: { offer: true },
  });
  return NextResponse.json(applications);
}
// Update application status (accept / reject)
export async function PUT(req: NextRequest) {
  try {
    const { applicationId, status } = await req.json();

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}