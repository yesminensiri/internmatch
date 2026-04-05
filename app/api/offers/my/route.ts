import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Offer, Application } from "@prisma/client";

// Type for one offer including applications with students
type OfferWithApplications = Offer & {
  applications: (Application & {
    student: { id: number; name: string; email: string };
  })[];
};

export async function POST(req: NextRequest) {
  try {
    const { companyId } = await req.json();

    if (!companyId) {
      return NextResponse.json({ error: "Missing companyId" }, { status: 400 });
    }

    // Fetch offers with explicit type
    const offers: OfferWithApplications[] = await prisma.offer.findMany({
      where: { companyId },
      include: {
        applications: {
          include: {
            student: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    // Map offers safely — TypeScript now knows 'o' type
    const offersWithCount = offers.map((o: OfferWithApplications) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      type: o.type,
      companyId: o.companyId,
      stageApplicants: o.applications.length,
      applications: o.applications,
    }));

    return NextResponse.json(offersWithCount);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}