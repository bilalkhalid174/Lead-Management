"use client";

import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { Loader2, User, Lock, Save, Key, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react"; // Change 1: session import kiya

export default function SettingsPage() {
  const { data: session, update } = useSession(); // Change 2: update function nikala
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user/me");
      const data = await res.json();
      setName(data.name);
      setEmail(data.email);
    };
    fetchUser();
  }, []);

  const handleProfileUpdate = async () => {
    if (!name || !email) {
      toast.error("Name and Email required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      body: JSON.stringify({ name, email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error);
    } else {
      // Change 3: Success par session update call kiya
      await update({
        ...session,
        user: {
          ...session?.user,
          name: name,
          email: email,
        },
      });
      
      toast.success("Profile updated successfully");
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("All fields required");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/user/profile/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error);
    } else {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans">
      <Navbar />
      
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Header Section */}
        <header className="mb-12 border-b border-zinc-200 pb-8">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-zinc-950">
            Settings
          </h1>
          <p className="text-zinc-500 mt-2 text-sm md:text-base">
            Update your personal details and secure your account.
          </p>
        </header>

        <div className="space-y-10">
          
          {/* Profile Section */}
          <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-zinc-200 shadow-sm">
                <User className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-800">Profile Information</h2>
                <p className="text-xs text-zinc-400">Public identity and contact info</p>
              </div>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Full Name</label>
                  <input
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-500 focus:ring-4 focus:ring-zinc-50 outline-none transition-all placeholder:text-zinc-300"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      className="w-full pl-11 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-500 focus:ring-4 focus:ring-zinc-50 outline-none transition-all placeholder:text-zinc-300"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end border-t border-zinc-50 pt-6 mt-4">
                <button 
                  onClick={handleProfileUpdate} 
                  disabled={loading}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-zinc-950 text-white px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 disabled:bg-zinc-300 transition-all active:scale-95"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </div>
          </section>

          {/* Security Section */}
          <section className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-zinc-200 shadow-sm">
                <Lock className="w-4 h-4 text-zinc-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-800">Password & Security</h2>
                <p className="text-xs text-zinc-400">Keep your account protected</p>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-500 focus:ring-4 focus:ring-zinc-50 outline-none transition-all placeholder:text-zinc-300"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:border-zinc-500 focus:ring-4 focus:ring-zinc-50 outline-none transition-all placeholder:text-zinc-300"
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-zinc-50 pt-6 mt-4">
                <button 
                  onClick={handlePasswordChange} 
                  disabled={loading}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-zinc-950 text-white border border-zinc-200 px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 disabled:text-zinc-400 transition-all active:scale-95 shadow-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  Update Password
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}