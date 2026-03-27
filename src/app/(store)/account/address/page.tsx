import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import MyAddress from "@/components/store/profile/MyAddress";

export default async function AddressPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { userType?: string } | undefined;
  if (!user || user.userType !== "customer") redirect("/account/login");
  return <MyAddress />;
}
