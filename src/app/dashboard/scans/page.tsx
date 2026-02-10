import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ScansContent } from "@/components/dashboard/scans-content";

export default async function ScansPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!business) redirect("/onboarding");

  const scans = await prisma.scan.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: {
      results: {
        include: { prompt: true },
      },
    },
  });

  return <ScansContent scans={JSON.parse(JSON.stringify(scans))} businessId={business.id} businessName={business.name} />;
}
