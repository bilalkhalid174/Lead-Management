"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/utils/notifications";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //  SESSION EXPIRY HANDLING (ADDED)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const expired = urlParams.get("expired");

    if (expired === "true") {
      showToast.error("Session expired. Please login again.");

      // clean URL so toast doesn't repeat
      window.history.replaceState({}, "", "/login");
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.error) {
        setError("Invalid email or password");
        showToast.error("Invalid email or password");
      } else {
        showToast.success("Login successful");
        router.push("/");
      }
    } catch {
      setError("An unexpected error occurred");
      showToast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-zinc-50 overflow-hidden px-4">

      <div className="w-full max-w-dvh bg-white border border-zinc-200 p-6 sm:p-10 rounded-lg shadow-sm transition-all duration-300">

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input
                type="email"
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-800">
                Password
              </label>
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-zinc-50/50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-zinc-900 focus:bg-white transition-all"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-900 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 animate-in fade-in zoom-in duration-200">
              <p className="text-[12px] text-red-700 font-medium text-center">
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={loading}
            className="w-full mt-2 py-3 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-zinc-400" /> : null}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        {/* Navigation Footer */}
        <div className="mt-8 text-center border-t border-zinc-100 pt-6">
          <p className="text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <button
              onClick={() => router.push("/register")}
              className="text-zinc-900 font-semibold hover:underline underline-offset-4"
            >
              Sign up
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}