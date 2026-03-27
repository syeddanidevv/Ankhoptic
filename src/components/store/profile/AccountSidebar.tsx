"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { label: "Dashboard",       href: "/account" },
  { label: "Orders",          href: "/account/orders" },
  { label: "Address",         href: "/account/address" },
  { label: "Account Details", href: "/account/details" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="wrap-sidebar-account">
      <ul className="my-account-nav">
        {navItems.map(({ label, href }) => {
          const active = pathname === href || (href !== "/account" && pathname.startsWith(href));
          return (
            <li key={href}>
              {active ? (
                <span className="my-account-nav-item active">{label}</span>
              ) : (
                <Link href={href} className="my-account-nav-item">{label}</Link>
              )}
            </li>
          );
        })}
        <li>
          <button
            className="my-account-nav-item"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", width: "100%" }}
            onClick={() => signOut({ callbackUrl: "/account/login" })}
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
