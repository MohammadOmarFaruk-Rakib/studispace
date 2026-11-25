"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import {
  ArrowRight,
  Eye,
  Image as ImageIcon,
  Mail,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function Authform() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const Onhandle_Register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const image = String(formData.get("image") || "").trim();

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      const message =
        "Password must be at least 6 characters and include an uppercase and a lowercase letter.";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await signUp.email({
        name,
        email,
        password,
        ...(image ? { image } : {}),
        callbackURL: "/",
      });

      if (signUpError) {
        const message = signUpError.message || "Unable to create your account.";
        setError(message);
        toast.error(message);
        return;
      }

      toast.success("Account created. Please log in.");
      router.push("/login");
    } catch (registrationError) {
      console.error("Registration failed:", registrationError);
      const message =
        registrationError instanceof Error
          ? registrationError.message
          : "Unable to create your account.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setError("");
    setLoading(true);
    try {
      const { error: signInError } = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (signInError) {
        const message = signInError.message || `Unable to sign in with ${provider}.`;
        setError(message);
        toast.error(message);
      }
    } catch (socialError) {
      console.error(`Sign in with ${provider} failed:`, socialError);
      const message =
        socialError instanceof Error
          ? socialError.message
          : `Unable to sign in with ${provider}.`;
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const formRef = useRef<HTMLDivElement>(null);

  const passwordRef = useRef<HTMLInputElement>(null);

  // GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".form-item",
        {
          y: 18,
          autoAlpha: 0,
        },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.65,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "all",
        },
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  // Password Visibility
  const togglePassword = (
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const input = inputRef.current;

    if (!input) return;

    input.type = input.type === "password" ? "text" : "password";
  };

  const inputClass =
    "h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 shadow-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20";

  const passwordInputClass =
    "h-12 rounded-xl border-slate-200 bg-slate-50 pr-12 text-slate-900 placeholder:text-slate-400 shadow-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-18 text-slate-900">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-indigo-200/50 blur-[150px]" />

      <div ref={formRef} className="relative w-full max-w-[440px]">
        {/* Heading */}
        <div className="form-item mb-9 text-center">
          <h1 className="text-[50px] font-semibold tracking-tight text-slate-900">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter your details to get started.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8">
          <form onSubmit={Onhandle_Register} className="space-y-5">
            {/* Full Name */}
            <div className="form-item space-y-2">
              <Label htmlFor="name" className="text-slate-700">
                Full name
              </Label>

              <div className="relative">
                <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  autoComplete="name"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-item space-y-2">
              <Label htmlFor="email" className="text-slate-700">
                Email address
              </Label>

              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Photo URL */}
            <div className="form-item space-y-2">
              <Label htmlFor="photoURL" className="text-slate-700">
                Photo URL
              </Label>

              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  id="photoURL"
                  name="image"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  autoComplete="url"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-item space-y-2">
              <Label htmlFor="password" className="text-slate-700">
                Password
              </Label>

              <div className="relative">
                <Input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className={passwordInputClass}
                />

                <button
                  type="button"
                  onClick={() => togglePassword(passwordRef)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-900"
                  aria-label="Toggle password visibility"
                >
                  <Eye size={17} />
                </button>
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="form-item rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Create Account */}
            <Button
              type="submit"
              disabled={loading}
              className="hover:cursor-pointer form-item h-12 w-full rounded-xl bg-slate-900 font-medium text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0"
            >
              {loading ? "Creating account..." : "Register"}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {/* Divider */}
          <div className="form-item relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-xs text-slate-400">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Social Sign In */}
          <div className="form-item grid grid-cols-2 gap-3">
            <Button
              onClick={() => void handleSocialSignIn("google")}
              disabled={loading}
              type="button"
              variant="outline"
              className="h-12 rounded-xl hover:cursor-pointer border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md"
            >
              Google
            </Button>

            <Button
              onClick={() => void handleSocialSignIn("github")}
              disabled={loading}
              type="button"
              variant="outline"
              className="h-12 rounded-xl hover:cursor-pointer border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md"
            >
              GitHub
            </Button>
          </div>

          {/* Sign In Link */}
          <p className="form-item mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 transition-colors hover:text-indigo-500"
            >
              Log in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="form-item mt-6 text-center text-xs text-slate-400">
          © 2026 StudioShadow. All rights reserved.
        </p>
      </div>
    </main>
  );
}
