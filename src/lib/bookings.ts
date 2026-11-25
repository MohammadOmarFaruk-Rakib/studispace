import { studioRequest } from "@/lib/studio-api";
import type {
  BookingApiResponse,
  BookingStatus,
  SaveStudioBookingInput,
  StudioBooking,
} from "@/lib/types";

function isBookingStatus(value: unknown): value is BookingStatus {
  return ["Pending", "Confirmed", "Completed", "Cancelled"].includes(
    String(value),
  );
}

function parseBooking(value: unknown): StudioBooking {
  if (typeof value !== "object" || value === null) {
    throw new Error("The bookings API returned invalid booking data.");
  }

  const booking = value as Record<string, unknown>;
  const id =
    typeof booking._id === "string"
      ? booking._id
      : typeof booking.id === "string"
        ? booking.id
        : null;

  if (
    !id ||
    typeof booking.studioId !== "string" ||
    typeof booking.title !== "string" ||
    typeof booking.image !== "string" ||
    typeof booking.category !== "string" ||
    typeof booking.hourlyRate !== "number" ||
    typeof booking.city !== "string" ||
    typeof booking.area !== "string" ||
    typeof booking.startsAt !== "string" ||
    typeof booking.durationHours !== "number" ||
    typeof booking.totalPrice !== "number" ||
    typeof booking.createdAt !== "string" ||
    !isBookingStatus(booking.status)
  ) {
    throw new Error("The bookings API returned invalid booking data.");
  }

  return {
    id,
    studioId: booking.studioId,
    title: booking.title,
    image: booking.image,
    category: booking.category,
    hourlyRate: booking.hourlyRate,
    securityDeposit:
      typeof booking.securityDeposit === "number"
        ? booking.securityDeposit
        : 0,
    city: booking.city,
    area: booking.area,
    startsAt: booking.startsAt,
    durationHours: booking.durationHours,
    totalPrice: booking.totalPrice,
    createdAt: booking.createdAt,
    status: booking.status,
  };
}

function getResponseData(response: BookingApiResponse): unknown {
  if (!Array.isArray(response.data)) {
    throw new Error("The bookings API returned invalid booking data.");
  }
  return response.data;
}

export async function getStudioBookings(): Promise<StudioBooking[]> {
  const response = await studioRequest<BookingApiResponse>("/my-bookings");
  return (getResponseData(response) as unknown[]).map(parseBooking);
}

export async function saveStudioBooking(
  input: SaveStudioBookingInput,
): Promise<StudioBooking> {
  const response = await studioRequest<BookingApiResponse>("/Bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return parseBooking(response.data);
}

export async function cancelStudioBooking(bookingId: string): Promise<void> {
  await studioRequest(`/Bookings/${encodeURIComponent(bookingId)}/cancel`, {
    method: "PATCH",
    body: JSON.stringify({}),
  });
}
