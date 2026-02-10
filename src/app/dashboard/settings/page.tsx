import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingsContent } from "@/components/dashboard/settings-content";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true },
  });

  const business = await prisma.business.findFirst({
    where: { userId: session.user.id },
  });

  if (!user) redirect("/login");

  return <SettingsContent user={user} business={business} />;
}
