import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  bullets: z.array(z.string()),
  techStack: z.array(z.string()),
  link: z.string().optional(),
});

const ExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  title: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  bullets: z.array(z.string()),
  techStack: z.array(z.string()),
});

const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  year: z.string(),
});

const ResumeContentSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  projects: z.array(ProjectSchema),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const parsed = ResumeContentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid resume content" },
      { status: 400 }
    );
  }

  const updated = await prisma.resume.update({
    where: { id: params.id },
    data: {
      summary: parsed.data.summary,
      skills: parsed.data.skills,
      projects: parsed.data.projects,
      experience: parsed.data.experience,
      education: parsed.data.education,
    },
  });

  return NextResponse.json(updated);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const resume = await prisma.resume.findUnique({ where: { id: params.id } });
  if (!resume) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(resume);
}
