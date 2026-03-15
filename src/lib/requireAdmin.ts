import { getServerSession } from "next-auth";
import { authOptions }     from "@/lib/authOptions";
import { NextResponse }    from "next/server";

/**
 * Use at the top of any admin API route handler:
 *
 *   const authErr = await requireAdmin();
 *   if (authErr) return authErr;
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as { userType?: string })?.userType !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null; // all good
}
