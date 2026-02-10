import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ReportsContent } from "@/components/dashboard/reports-content";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    include: {
      scans: {
        where: { status: "completed" },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          results: {
            include: { prompt: true },
          },
        },
      },
    },
  });

  if (!business) redirect("/onboarding");

  return <ReportsContent business={JSON.parse(JSON.stringify(business))} />;
}
