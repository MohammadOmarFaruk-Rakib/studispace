import type { ReactNode } from "react";
import RequireAuth from "@/components/RequireAuth";

export default async function EditStudioLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RequireAuth callbackUrl={`/studios/edit/${encodeURIComponent(id)}`}>
      {children}
    </RequireAuth>
  );
}
