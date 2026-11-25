"use client";

import { authClient } from "@/lib/auth-client";

const API_URL = (
  process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export async function getStudioAccessToken() {
  const { data, error } = await authClient.$fetch<{ token: string }>("/token", {
    method: "GET",
  });

  if (error || !data?.token) {
    throw new Error(error?.message || "Please sign in to manage studios.");
  }

  return data.token;
}

export async function studioRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const method = (init.method || "GET").toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const { data: session, error } = await authClient.getSession();
    if (error || !session?.user) {
      throw new Error("Please sign in to manage studios.");
    }
  }

  const token = await getStudioAccessToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
  });

  const result: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof result === "object" &&
      result !== null &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : `Studio request failed (${response.status})`;
    throw new Error(message);
  }

  return result as T;
}
