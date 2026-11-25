import { redirect } from "next/navigation";

export default async function StudioDetailsAlias({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/Studiodetails/${encodeURIComponent(id)}`);
}
