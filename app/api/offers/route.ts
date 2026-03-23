import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST create an offer
export async function POST(req: NextRequest) {
  const { title, description, type, companyId } = await req.json();
  const offer = await prisma.offer.create({
    data: { title, description, type, companyId },
  });
  return NextResponse.json(offer);
}

// GET all offers
export async function GET() {
  const offers = await prisma.offer.findMany({
    include: { company: true },
  });
  return NextResponse.json(offers);
}

// POST get offers of a specific company
export async function POST_my(req: NextRequest) {
  const { companyId } = await req.json();
  const offers = await prisma.offer.findMany({
    where: { companyId },
  });
  return NextResponse.json(offers);
}