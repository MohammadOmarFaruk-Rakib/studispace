import type { StudioAdminIdentity } from "@/lib/types";

const studioAdminEmail = process.env.NEXT_PUBLIC_STUDIO_ADMIN_EMAIL
  ?.trim()
  .toLowerCase();

export function isStudioAdmin(
  user: StudioAdminIdentity | null | undefined,
): boolean {
  return Boolean(
    studioAdminEmail &&
      user?.email?.trim().toLowerCase() === studioAdminEmail,
  );
}
