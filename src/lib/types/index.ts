import type { ReactNode } from "react";

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Completed"
  | "Cancelled";

export interface StudioBooking {
  id: string;
  studioId: string;
  title: string;
  image: string;
  category: string;
  hourlyRate: number;
  securityDeposit: number;
  city: string;
  area: string;
  startsAt: string;
  durationHours: number;
  totalPrice: number;
  createdAt: string;
  status: BookingStatus;
}

export type BookingApiResponse = {
  data?: unknown;
};

export type SaveStudioBookingInput = {
  studioId: string;
  startsAt: string;
  durationHours: number;
};

export interface StudioRecord {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  categoryName?: string;
  image: string;
  gallery?: string[];
  hourlyRate: number;
  securityDeposit?: number;
  rating: number;
  totalReviews: number;
  location: {
    city: string;
    area: string;
    country: string;
  };
  capacity: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  ownerEmail?: string | null;
  ownerId?: string;
  amenities?: string[];
  host?: {
    name?: string;
    email?: string | null;
    avatar?: string;
  };
  reviews?: Array<{
    name: string;
    date: string;
    rating: number;
    comment: string;
  }>;
  isDatabaseRecord?: boolean;
}

export type StudioAdminIdentity = {
  email?: string | null;
};

export type SlideImage = {
  src: string;
  alt: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export type HeroProps = {
  images: SlideImage[];
  delay?: number; // Delay between slides in milliseconds.
};

export type BookableStudio = {
  id: string;
  title: string;
  image: string;
  category: string;
  hourlyRate: number;
  city: string;
  area: string;
};

export type BookWorkspaceButtonProps = {
  studio: BookableStudio;
  available: boolean;
};

export type RequireAuthProps = {
  children: ReactNode;
  callbackUrl: string;
};

export type DashboardData = {
  studios: StudioRecord[];
  bookings: StudioBooking[];
};

export interface ExploreStudio {
  _id?: string;
  isDatabaseRecord?: boolean;
  title: string;
  slug: string;
  description: string;
  category: string;
  categoryName?: string;
  image: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  location: {
    city: string;
    area: string;
    country: string;
  };
  capacity: number;
  isAvailable: boolean;
  ownerId?: string;
}

export interface ExploreStudiosPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export interface StudioListing {
  _id: string;
  ownerId?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  categoryName?: string;
  image: string;
  hourlyRate: number;
  securityDeposit?: number;
  maxCapacity?: number;
  capacity: number;
  location: {
    city: string;
    area: string;
    country: string;
  };
  isAvailable: boolean;
  isFeatured?: boolean;
  createdAt?: string;
}

export type StudioListingFilter =
  | "all"
  | "available"
  | "unavailable"
  | "featured";

export type StudioListingFilterOption = {
  key: StudioListingFilter;
  label: string;
};

export type StudioForm = {
  title: string;
  category: string;
  hourlyRate: string;
  securityDeposit: string;
  maxCapacity: string;
  location: string;
  image: string;
  galleryUrls: string;
  amenities: string[];
  overview: string;
};

export type EditableStudio = StudioRecord & { _id: string };

export interface StudioDetail {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  categoryName?: string;
  image: string;
  gallery?: string[];
  hourlyRate: number;
  securityDeposit?: number;
  rating: number;
  totalReviews: number;
  location: {
    city: string;
    area: string;
    country: string;
  };
  capacity: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  amenities?: string[];
  host?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  reviews?: Array<{
    name: string;
    date: string;
    rating: number;
    comment: string;
  }>;
}

export type StudioCardActionStudio = {
  _id?: string;
  ownerId?: string;
  isDatabaseRecord?: boolean;
  title: string;
  slug: string;
  description: string;
  category: string;
  categoryName?: string;
  image: string;
  gallery?: string[];
  hourlyRate: number;
  securityDeposit?: number;
  location: {
    city: string;
    area: string;
    country: string;
  };
  capacity: number;
  isAvailable: boolean;
  amenities?: string[];
  ownerEmail?: string | null;
  host?: {
    name?: string;
    email?: string | null;
  };
};

export type StudioCardActionsProps = {
  studio: StudioCardActionStudio;
  onChanged?: () => void;
  canManage?: boolean;
  autoEdit?: boolean;
  showDelete?: boolean;
  editLabel?: string;
  editClassName?: string;
};

export type StudioGalleryProps = {
  title: string;
  images: string[];
};

export type ProfileDropdownProps = {
  name: string;
  email: string;
};

export interface StudioCardStudio {
  _id?: string;
  title: string;
  isDatabaseRecord?: boolean;
  slug: string;
  description: string;
  category: string;
  image: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  location: {
    city: string;
    area: string;
    country: string;
  };
  capacity: number;
  isAvailable: boolean;
  isFeatured?: boolean;
  ownerId?: string;
}

export type StudioCardProps = {
  studio: StudioCardStudio;
};

export interface StudiosProps {
  category?: string;
  featuredOnly?: boolean;
}

export interface StudioDetailsPageProps {
  params: Promise<{ id: string }>;
}
