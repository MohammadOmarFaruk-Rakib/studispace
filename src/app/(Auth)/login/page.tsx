"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import { ArrowRight, Eye, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export default function Loginform() {
  const router = useRouter();

  const formRef = useRef<HTMLDivElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const getReturnRoute = () => {
    const params = new URLSearchParams(window.location.search);
    const requestedRoute =
      params.get("callbackUrl") ?? params.get("callbackURL") ?? "/";

    if (!requestedRoute.startsWith("/") || requestedRoute.startsWith("//")) {
      return "/";
    }

    const url = new URL(requestedRoute, window.location.origin);
    return url.origin === window.location.origin
      ? `${url.pathname}${url.search}${url.hash}`
      : "/";
  };

  // Email and Password Login
  const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      const returnRoute = getReturnRoute();

      const { error } = await signIn.email({
        email: data.email as string,
        password: data.password as string,
        rememberMe: true,
        callbackURL: returnRoute,
      });

      if (error) {
        setError(error.message || "Unable to sign in.");
        return;
      }

      router.replace(returnRoute);
      router.refresh();
    } catch (loginError) {
      console.error("Email login error:", loginError);
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await signIn.social({
        provider: "google",
        callbackURL: getReturnRoute(),
      });

      if (error) {
        setError(error.message || "Google login failed.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Unable to login with Google.");
    } finally {
      setLoading(false);
    }
  };

  // Password Visibility
  const togglePassword = () => {
    setShowPassword((prev) => !prev);

    if (passwordRef.current) {
      passwordRef.current.type =
        passwordRef.current.type === "password" ? "text" : "password";
    }
  };

  const inputClass =
    "h-12 rounded-xl border-slate-200 bg-slate-50 pl-11 text-slate-900 placeholder:text-slate-400 shadow-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-18 text-slate-900">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-indigo-200/50 blur-[150px]" />

      <div ref={formRef} className="relative w-full max-w-[440px]">
        {/* Heading */}
        <div className="form-item mb-9 text-center">
          <h1 className="text-[50px] font-semibold tracking-tight text-slate-900">
            Log in
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to StudioShadow.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
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

            {/* Password */}
            <div className="form-item space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>

                <button
                  type="button"
                  onClick={() =>
                    setError(
                      "Password reset is not available yet. Please contact support.",
                    )
                  }
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="h-12 rounded-xl border-slate-200 bg-slate-50 pr-12 text-slate-900 placeholder:text-slate-400 shadow-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/20"
                />

                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Eye size={17} />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p
                role="alert"
                className="form-item rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
              >
                {error}
              </p>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="form-item h-12 w-full cursor-pointer rounded-xl bg-slate-900 font-medium text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}

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

          {/* Social Login */}
          <div className="form-item grid grid-cols-1 gap-3">
            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              variant="outline"
              className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md"
            >
              Google
            </Button>
          </div>

          {/* Register Link */}
          <p className="form-item mt-7 text-center text-sm text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/Register"
              className="font-medium text-indigo-600 transition-colors hover:text-indigo-500"
            >
              Create account
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
