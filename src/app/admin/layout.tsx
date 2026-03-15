import type { Metadata } from "next";
import ChakraWrapper from "@/components/admin/ChakraWrapper";
import AdminLayout from "@/components/admin/AdminLayout";

export const metadata: Metadata = {
  title: "Ankhoptics Admin",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ChakraWrapper>
      <AdminLayout>{children}</AdminLayout>
    </ChakraWrapper>
  );
}

