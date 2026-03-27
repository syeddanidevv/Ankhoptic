import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import MyOrder from "@/components/store/profile/MyOrder";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { userType?: string } | undefined;
  if (!user || user.userType !== "customer") redirect("/account/login");
  return <MyOrder />;
}
