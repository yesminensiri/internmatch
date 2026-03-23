import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { companyId } = await req.json();
    if (!companyId) {
      return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
    }

    // fetch offers with applications including students
    const offers = await prisma.offer.findMany({
      where: { companyId },
      include: {
        applications: {
          include: {
            student: { select: { id: true, name: true } },
          },
        },
      },
    });

    // map offers with stageApplicants count
    const offersWithCount = offers.map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      type: o.type,
      companyId: o.companyId,
      stageApplicants: o.applications.length,
      applications: o.applications,
    }));

    return NextResponse.json(offersWithCount);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}