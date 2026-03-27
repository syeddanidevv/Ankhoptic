import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import MyOrderDetail from "@/components/store/profile/MyOrderDetail";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { userType?: string } | undefined;
  if (!user || user.userType !== "customer") redirect("/account/login");
  const { id } = await params;
  return <MyOrderDetail orderId={id} />;
}
