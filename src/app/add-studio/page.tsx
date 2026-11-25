"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Clock3,
  ImagePlus,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Wifi,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { studioRequest } from "@/lib/studio-api";
import type { StudioForm } from "@/lib/types";

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
  "Recording Studio",
  "Creative Workspace",
  "Event Space",
];

const availableAmenities = [
  "High-speed WiFi",
  "Free Parking",
  "Air Conditioning",
  "Lighting Equipment",
  "Soundproof Room",
  "Photography Equipment",
  "Green Screen",
  "Makeup Room",
  "Changing Room",
  "Restroom",
  "Kitchen",
  "24/7 Access",
];

const initialForm: StudioForm = {
  title: "",
  category: "",
  hourlyRate: "",
  securityDeposit: "",
  maxCapacity: "",
  location: "",
  image: "",
  galleryUrls: "",
  amenities: [],
  overview: "",
};

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [formData, setFormData] = useState<StudioForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const Onhandle_Submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gallery = formData.galleryUrls
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter(Boolean);
    setIsSubmitting(true);

    const locationParts = formData.location
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const [area = "", city = "", ...countryParts] = locationParts;
    const title = formData.title.trim();
    const categoryName = formData.category.trim();
    const payload = {
      title,
      slug:
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || `studio-${Date.now()}`,
      description: formData.overview.trim(),
      category: categoryName.toLowerCase().replace(/\s+/g, "-"),
      categoryName,
      image: formData.image.trim(),
      gallery,
      hourlyRate: Number(formData.hourlyRate),
      securityDeposit: Number(formData.securityDeposit),
      capacity: Number(formData.maxCapacity),
      location: {
        area: area || city,
        city: city || area,
        country: countryParts.join(", "),
      },
      amenities: formData.amenities,
      rating: 0,
      totalReviews: 0,
      isAvailable: true,
      isFeatured: false,
    };

    try {
      await studioRequest("/Studios", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Studio published successfully.");
      router.push("/mylistings");
    } catch (error) {
      console.error("Failed to publish studio:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to publish studio. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F2]">
        <p className="text-sm text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#F5F6F2]">
        <h2 className="text-xl font-semibold text-[#19382A]">
          Please login to continue
        </h2>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <form onSubmit={Onhandle_Submit}>
      <main className="min-h-screen bg-[#F5F6F2] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Top Navigation */}
          <div className="mb-9 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2 text-[#526158] hover:bg-white"
            >
              <ArrowLeft size={17} />
              Back
            </Button>

            <div className="flex items-center gap-2 rounded-full border border-[#DCE5DC] bg-white px-4 py-2 text-xs font-semibold text-[#26734A]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              HOST DASHBOARD
            </div>
          </div>

          {/* Hero Section */}
          <section className="relative mb-10 overflow-hidden rounded-[28px] bg-[#173D2D] p-7 text-white shadow-xl md:p-11">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-40 border-white/5" />
            <div className="absolute -bottom-32 right-40 h-64 w-64 rounded-full bg-[#B9D7A8]/10 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-[#D5E9D8]">
                <Sparkles size={14} />
                SHARE YOUR CREATIVE SPACE
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                Bring Your Space
                <br />
                <span className="text-[#B8D7A8]">To The Spotlight.</span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#D0DDD3] md:text-base">
                Turn your creative space into an opportunity. List your studio,
                connect with creators, and start earning by sharing your space.
              </p>

              <div className="mt-8 flex flex-wrap gap-6 text-sm text-[#D0DDD3]">
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-[#B8D7A8]" />
                  Easy listing
                </span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-[#B8D7A8]" />
                  Reach creators
                </span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-[#B8D7A8]" />
                  Manage bookings
                </span>
              </div>
            </div>
          </section>

          {/* Main Layout */}
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
            {/* Left Side: Form Fields */}
            <div className="space-y-6">
              {/* Basic Information */}
              <Card className="rounded-2xl border-[#E1E8DF] shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#EAF3E9] p-3 text-[#245D3B]">
                      <Building2 size={21} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#19382A]">
                        Basic Information
                      </CardTitle>
                      <CardDescription>
                        Tell us about your creative space.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Studio Name *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. The Creative House Studio"
                      required
                      className="h-12 rounded-xl border-[#DCE5DC] bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Studio Category *</Label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      required
                      className="h-12 w-full rounded-xl border border-[#DCE5DC] bg-white px-3 text-sm outline-none focus:border-[#245D3B] focus:ring-2 focus:ring-[#245D3B]/10"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                      <Input
                        id="hourlyRate"
                        name="hourlyRate"
                        type="number"
                        min="1"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        placeholder="e.g. 50"
                        required
                        className="h-12 rounded-xl border-[#DCE5DC]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="securityDeposit">
                        Security Deposit ($) *
                      </Label>
                      <Input
                        id="securityDeposit"
                        name="securityDeposit"
                        type="number"
                        min="0"
                        value={formData.securityDeposit}
                        onChange={handleChange}
                        placeholder="e.g. 100"
                        required
                        className="h-12 rounded-xl border-[#DCE5DC]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxCapacity">Maximum Capacity *</Label>
                    <Input
                      id="maxCapacity"
                      name="maxCapacity"
                      type="number"
                      min="1"
                      value={formData.maxCapacity}
                      onChange={handleChange}
                      placeholder="How many people can your studio accommodate?"
                      required
                      className="h-12 rounded-xl border-[#DCE5DC]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location and Image */}
              <Card className="rounded-2xl border-[#E1E8DF] shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#EAF3E9] p-3 text-[#245D3B]">
                      <MapPin size={21} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#19382A]">
                        Location & Photos
                      </CardTitle>
                      <CardDescription>
                        Help creators find your studio.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="location">Studio Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Gulshan, Dhaka, Bangladesh"
                      required
                      className="h-12 rounded-xl border-[#DCE5DC]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Studio Image URL *</Label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Input
                        id="image"
                        name="image"
                        type="text"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/studio-image.jpg"
                        required
                        className="h-12 rounded-xl border-[#DCE5DC]"
                      />
                    </div>
                    <p className="text-xs text-[#8B968C]">
                      Enter any public image URL.
                    </p>
                  </div>

                  {formData.image && (
                    <div className="overflow-hidden rounded-xl border border-[#DCE5DC]">
                      <img
                        src={formData.image}
                        alt="Studio preview"
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="galleryUrls">Additional Gallery Image URLs</Label>
                    <Textarea
                      id="galleryUrls"
                      name="galleryUrls"
                      value={formData.galleryUrls}
                      onChange={handleChange}
                      placeholder="Add one public image URL per line"
                      rows={3}
                      className="rounded-xl border-[#DCE5DC] bg-white"
                    />
                    <p className="text-xs text-[#8B968C]">
                      Optional. Add additional images to the studio details gallery.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card className="rounded-2xl border-[#E1E8DF] shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#EAF3E9] p-3 text-[#245D3B]">
                      <Wifi size={21} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#19382A]">
                        Amenities & Facilities
                      </CardTitle>
                      <CardDescription>
                        Select everything available in your studio.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {availableAmenities.map((amenity) => {
                      const selected = formData.amenities.includes(amenity);

                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                            selected
                              ? "border-[#245D3B] bg-[#EDF5EE] text-[#245D3B]"
                              : "border-[#E1E8DF] bg-white text-[#526158] hover:border-[#A9C5AC]"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                              selected
                                ? "border-[#245D3B] bg-[#245D3B] text-white"
                                : "border-[#CAD5CA]"
                            }`}
                          >
                            {selected && <Check size={13} />}
                          </span>
                          {amenity}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-xs text-[#8B968C]">
                    {formData.amenities.length} amenities selected
                  </p>
                </CardContent>
              </Card>

              {/* Overview */}
              <Card className="rounded-2xl border-[#E1E8DF] shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#EAF3E9] p-3 text-[#245D3B]">
                      <Camera size={21} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#19382A]">
                        Studio Overview
                      </CardTitle>
                      <CardDescription>
                        Describe what makes your space special.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="overview">Description *</Label>
                    <Textarea
                      id="overview"
                      name="overview"
                      value={formData.overview}
                      onChange={handleChange}
                      placeholder="Describe your studio, its atmosphere, equipment, ideal use cases and what creators can expect..."
                      required
                      rows={7}
                      className="resize-none rounded-xl border-[#DCE5DC] bg-white leading-7"
                    />
                    <p className="text-right text-xs text-[#8B968C]">
                      {formData.overview.length} characters
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Host Information */}
              <Card className="rounded-2xl border-[#E1E8DF] shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#EAF3E9] p-3 text-[#245D3B]">
                      <Users size={21} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-[#19382A]">
                        Host Information
                      </CardTitle>
                      <CardDescription>
                        Your account information will be attached to this
                        listing.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Host Name</Label>
                    <Input
                      value={user.name || ""}
                      readOnly
                      className="h-12 rounded-xl border-[#DCE5DC] bg-[#F5F6F2]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      value={user.email || ""}
                      readOnly
                      className="h-12 rounded-xl border-[#DCE5DC] bg-[#F5F6F2]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Publish Section */}
              <div className="rounded-2xl border border-[#DCE8DC] bg-[#EDF5EE] p-6 md:p-8">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={24} className="text-[#245D3B]" />
                  <div>
                    <h3 className="font-semibold text-[#19382A]">
                      Ready to publish?
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-[#69796D]">
                      Make sure your studio details are accurate before
                      publishing your listing.
                    </p>
                  </div>
                </div>

                <Separator className="my-6 bg-[#DCE8DC]" />

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/studios")}
                    className="h-12 rounded-xl border-[#CAD8CA] px-6"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 rounded-xl bg-[#245D3B] px-8 text-white hover:bg-[#173D2D]"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Studio"}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Side: Preview */}
            <aside className="p-10 space-y-5 lg:sticky lg:top-8">
              {/* Listing Preview */}
              <Card className="overflow-hidden rounded-2xl border-[#E1E8DF] shadow-sm">
                <div className="border-b border-[#E1E8DF] bg-white px-5 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[#19382A]">
                      Live Preview
                    </h3>
                    <span className="rounded-full bg-[#EDF5EE] px-3 py-1 text-xs font-medium text-[#26734A]">
                      PREVIEW
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#8B968C]">
                    Your listing will look like this.
                  </p>
                </div>

                <div className="bg-white">
                  <div className="relative h-48 bg-[#E8EEE6]">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Studio"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-[#9AAA9A]">
                        <ImagePlus size={35} />
                        <span className="text-xs">Studio image preview</span>
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#245D3B] shadow-sm">
                      {formData.category || "Studio Category"}
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <h3 className="text-lg font-bold text-[#19382A]">
                        {formData.title || "Your Studio Name"}
                      </h3>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-[#829084]">
                        <MapPin size={14} />
                        {formData.location || "Studio Location"}
                      </p>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#8B968C]">Hourly rate</p>
                        <p className="mt-1 text-xl font-bold text-[#245D3B]">
                          ${formData.hourlyRate || "0"}
                          <span className="text-xs font-normal text-[#829084]">
                            {" "}
                            / hour
                          </span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-[#8B968C]">Capacity</p>
                        <p className="mt-1 flex items-center justify-end gap-1 text-sm font-semibold text-[#19382A]">
                          <Users size={15} />
                          {formData.maxCapacity || "0"} People
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="mb-3 text-sm font-semibold text-[#19382A]">
                        Available Amenities
                      </p>

                      {formData.amenities.length ? (
                        <div className="flex flex-wrap gap-2">
                          {formData.amenities.slice(0, 5).map((amenity) => (
                            <span
                              key={amenity}
                              className="rounded-lg bg-[#EDF5EE] px-2.5 py-1.5 text-xs text-[#386448]"
                            >
                              {amenity}
                            </span>
                          ))}

                          {formData.amenities.length > 5 && (
                            <span className="rounded-lg bg-[#F1F3EF] px-2.5 py-1.5 text-xs text-[#69796D]">
                              +{formData.amenities.length - 5} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-[#9AAA9A]">
                          Selected amenities will appear here.
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl bg-[#F5F6F2] p-3">
                      <p className="text-xs leading-6 text-[#69796D]">
                        {formData.overview
                          ? formData.overview.slice(0, 120) +
                            (formData.overview.length > 120 ? "..." : "")
                          : "Your studio description will appear here."}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Helpful Tips */}
              <Card className="rounded-2xl border-[#E1E8DF] bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-[#19382A]">
                    <Sparkles size={18} className="text-[#B28B45]" />
                    Helpful Tips
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <Camera size={18} className="shrink-0 text-[#52715A]" />
                    <div>
                      <p className="text-sm font-medium text-[#19382A]">
                        Use quality photos
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#829084]">
                        Clear photos help creators understand your space.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Sparkles size={18} className="shrink-0 text-[#52715A]" />
                    <div>
                      <p className="text-sm font-medium text-[#19382A]">
                        Write a great description
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#829084]">
                        Highlight your studio&apos;s unique features.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <ShieldCheck
                      size={18}
                      className="shrink-0 text-[#52715A]"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#19382A]">
                        Set fair pricing
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#829084]">
                        Choose a competitive hourly rate and deposit.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Host Card */}
              <Card className="rounded-2xl border-[#E1E8DF] bg-[#173D2D] text-white shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B8D7A8] text-lg font-bold text-[#173D2D]">
                      {(user.name || "H").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {user.name || "Studio Host"}
                      </p>
                      <p className="truncate text-xs text-[#C3D5C7]">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4 bg-white/20" />

                  <p className="text-xs leading-6 text-[#D0DDD3]">
                    Your listing will be associated with your StudioSpace
                    account.
                  </p>
                </CardContent>
              </Card>

              {/* Quick Information */}
              <div className="rounded-2xl border border-[#E1E8DF] bg-white p-5">
                <h3 className="mb-4 font-semibold text-[#19382A]">
                  Listing Checklist
                </h3>

                <div className="space-y-3 text-sm">
                  {[
                    ["Studio name", !!formData.title],
                    ["Category", !!formData.category],
                    ["Location", !!formData.location],
                    ["Studio image", !!formData.image],
                    ["Pricing", !!formData.hourlyRate],
                    ["Amenities", formData.amenities.length > 0],
                    ["Description", !!formData.overview],
                  ].map(([label, completed]) => (
                    <div
                      key={String(label)}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[#69796D]">{label}</span>
                      {completed ? (
                        <Check size={16} className="text-[#26734A]" />
                      ) : (
                        <Clock3 size={15} className="text-[#B8BFB8]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          {/* Footer */}
          <footer className="py-9 text-center text-xs text-[#94A096]">
            © 2026 StudioSpace. Create more. Share more.
          </footer>
        </div>
      </main>
    </form>
  );
}
