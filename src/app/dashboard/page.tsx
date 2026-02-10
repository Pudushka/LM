import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
    include: {
      scans: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          results: {
            include: { prompt: true },
          },
        },
      },
      prompts: { where: { isActive: true } },
    },
  });

  if (!business) {
    redirect("/onboarding");
  }

  return <DashboardContent business={JSON.parse(JSON.stringify(business))} />;
}
