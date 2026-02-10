import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { PromptsContent } from "@/components/dashboard/prompts-content";

export default async function PromptsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!business) redirect("/onboarding");

  const prompts = await prisma.prompt.findMany({
    where: { businessId: business.id },
    orderBy: [{ category: "asc" }, { isCustom: "asc" }],
  });

  return <PromptsContent prompts={prompts} businessId={business.id} />;
}
