import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await prisma.business.findFirst({
      where: { id: params.id, userId: session.user.id },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, website, location, specialty } = body;

    const updated = await prisma.business.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(website && { website }),
        ...(location && { location }),
        ...(specialty && { specialty }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Business update error:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}
