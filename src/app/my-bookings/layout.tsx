import type { ReactNode } from "react";
import RequireAuth from "@/components/RequireAuth";

export default function MyBookingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireAuth callbackUrl="/my-bookings">{children}</RequireAuth>
  );
}
