import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { checkRateLimit, clearRateLimit } from "@/lib/rateLimit";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
    error:  "/admin/login",
  },
  providers: [
    /* ── Admin login ── */
    CredentialsProvider({
      id:   "credentials",
      name: "Admin",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
        ip:       { label: "IP",       type: "text"     }, // passed from client
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        /* ── Brute-force protection ── */
        const ip =
          (req?.headers?.["x-forwarded-for"] as string)?.split(",")[0]?.trim() ??
          (req?.headers?.["x-real-ip"] as string) ??
          credentials.ip ??
          "unknown";

        const limit = await checkRateLimit(ip);
        if (!limit.allowed) {
          const mins = Math.ceil(limit.retryAfterMs / 60000);
          throw new Error(`TOO_MANY:${mins}`);
        }

        const admin = await prisma.adminUser.findUnique({ where: { email: credentials.email } });
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.password);
        if (!valid) return null;

        /* ── Success — clear rate limit counter ── */
        await clearRateLimit(ip);

        return {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
          userType: "admin",
        } as never;
      },
    }),

    /* ── Customer login ── */
    CredentialsProvider({
      id:   "customer",
      name: "Customer",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const customer = await prisma.customer.findUnique({ where: { email: credentials.email } });
        if (!customer?.password) return null;
        const valid = await bcrypt.compare(credentials.password, customer.password);
        if (!valid) return null;
        return { id: customer.id, email: customer.email, name: customer.name, userType: "customer" } as never;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as unknown as { id: string; role?: string; userType?: string };
        token.id       = u.id;
        token.role     = u.role     ?? null;
        token.userType = u.userType ?? "customer";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const s = session.user as { id?: string; role?: string; userType?: string };
        s.id       = token.id       as string;
        s.role     = token.role     as string | undefined;
        s.userType = token.userType as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
