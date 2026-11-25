import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";
import type { RequireAuthProps } from "@/lib/types";

export default async function RequireAuth({
  children,
  callbackUrl,
}: RequireAuthProps) {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return children;
}
