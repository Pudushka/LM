import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generatePrompts } from "@/lib/prompts/generator";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, website, location, specialty } = body;

    if (!name || !website || !location || !specialty) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create business
    const business = await prisma.business.create({
      data: {
        name,
        website,
        location,
        specialty,
        userId: session.user.id,
      },
    });

    // Generate and store default prompts
    const promptTemplates = generatePrompts(name, location, specialty);
    for (const template of promptTemplates) {
      await prisma.prompt.create({
        data: {
          text: template.text,
          category: template.category,
          isCustom: false,
          isActive: true,
          businessId: business.id,
        },
      });
    }

    return NextResponse.json(business, { status: 201 });
  } catch (error) {
    console.error("Business creation error:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const businesses = await prisma.business.findMany({
      where: { userId: session.user.id },
      include: { prompts: true },
    });

    return NextResponse.json(businesses);
  } catch (error) {
    console.error("Business fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}
