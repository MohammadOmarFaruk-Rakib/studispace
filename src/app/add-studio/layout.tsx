import type { ReactNode } from "react";
import RequireAuth from "@/components/RequireAuth";

export default function AddStudioLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RequireAuth callbackUrl="/add-studio">{children}</RequireAuth>
  );
}
