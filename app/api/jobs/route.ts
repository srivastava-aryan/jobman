import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const CreateJobSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  source: z.string().optional(),
  jdRaw: z.string().min(1),
});

export async function GET() {
  const jobs = await prisma.jobApplication.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateJobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const job = await prisma.jobApplication.create({
    data: {
      company: parsed.data.company,
      role: parsed.data.role,
      source: parsed.data.source || null,
      jdRaw: parsed.data.jdRaw,
      status: "DRAFT",
    },
  });

  return NextResponse.json(job, { status: 201 });
}
