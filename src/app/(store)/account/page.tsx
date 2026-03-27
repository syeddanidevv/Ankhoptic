import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import MyAccount from "@/components/store/profile/MyAccount";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { userType?: string } | undefined;
  if (!user || user.userType !== "customer") redirect("/account/login");
  return <MyAccount />;
}
