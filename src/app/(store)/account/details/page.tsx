import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import MyAccDetail from "@/components/store/profile/MyAccDetail";

export default async function AccountDetailsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { userType?: string } | undefined;
  if (!user || user.userType !== "customer") redirect("/account/login");
  return <MyAccDetail />;
}
