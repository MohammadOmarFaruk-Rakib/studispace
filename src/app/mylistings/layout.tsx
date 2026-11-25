import type { ReactNode } from "react";
import RequireAuth from "@/components/RequireAuth";

export default function MyListingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireAuth callbackUrl="/my-listings">{children}</RequireAuth>
  );
}
