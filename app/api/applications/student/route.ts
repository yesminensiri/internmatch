import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { studentId } = await req.json();

  const applications = await prisma.application.findMany({
    where: { studentId },
    include: {
      offer: {
        include: {
          company: true,
        },
      },
    },
  });

  return NextResponse.json(applications);
}