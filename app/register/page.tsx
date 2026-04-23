"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { showToast } from "@/app/utils/notifications";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return "All fields are required";
    }
    if (form.name.length < 3) {
      return "Name must be at least 3 characters";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Invalid email format";
    }
    if (form.password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      showToast.error(validationError);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.message || "Something went wrong";
        setError(msg);
        showToast.error(msg);
        return;
      }

      showToast.success("Account created successfully");
      router.push("/login");
    } catch  {
      setError("Server error");
      showToast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 p-4 sm:p-8">

      <div className="w-full max-w-dvh bg-white border border-zinc-200 p-6 sm:p-10 rounded-lg shadow-sm transition-all duration-300">

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            Create account
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Enter your info to register your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900" />
                <input
                  name="name"
                  type="text"
                  placeholder="Bilal Khalid"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 focus:bg-white"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 focus:bg-white"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 focus:bg-white"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-zinc-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-800 ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-zinc-900 focus:bg-white"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-zinc-400"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-[12px] text-red-700 text-center">{error}</p>
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full py-4 bg-zinc-900 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-zinc-900 font-semibold hover:underline"
            >
              Log in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}