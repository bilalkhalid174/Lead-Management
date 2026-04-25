"use client";

import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { Loader2, User, Mail, UserCircle, KeyRound, Settings2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  // update function session ko refresh karne ke liye use hota hai
  const { data: session, update } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync internal state with session data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleUpdateAccount = async () => {
    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }

    setLoading(true);
    try {
      // 1. Database mein profile update karein
      const profileRes = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!profileRes.ok) {
        const profileData = await profileRes.json();
        throw new Error(profileData.error || "Profile update failed");
      }

      // 2. Agar password change karna hai
      if (newPassword) {
        if (!currentPassword) {
          toast.error("Current password required");
          setLoading(false);
          return;
        }
        const passRes = await fetch("/api/user/profile/password", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentPassword, newPassword }),
        });
        if (!passRes.ok) {
          const passData = await passRes.json();
          throw new Error(passData.error || "Password update failed");
        }
      }

      /**
       * CRITICAL FIX: NextAuth Session Sync
       */
      await update({
        name: name,
        email: email,
      });

      // Force trigger NextAuth session refresh in all components (Navbar etc.)
      window.dispatchEvent(new Event("visibilitychange"));

      toast.success("Account updated successfully");
      closeModal();

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 selection:bg-gray-200 font-sans">
      <Navbar />

      {/* Padding adjusted for mobile and desktop */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-950">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your profile details, change your password, and manage your account security settings.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          {/* Responsive grid: 1 col on mobile, 2 cols on lg screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            
            {/* LEFT: DISPLAY INFO */}
            <div className="p-6 sm:p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <User size={18} className="text-gray-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-800 block mb-1">Full Name</label>
                  <p className="text-sm font-medium text-gray-500 wrap-break-words">{session?.user?.name || "—"}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-800 block mb-1">Email Address</label>
                  <p className="text-sm font-medium text-gray-500 wrap-break-words">{session?.user?.email || "—"}</p>
                </div>
              </div>
            </div>

            {/* RIGHT: SECURITY & ACTION */}
            <div className="p-6 sm:p-8 md:p-10 space-y-8 bg-gray-50/30 flex flex-col justify-between">
              <div className="space-y-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <KeyRound size={18} className="text-gray-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-800 block mb-1">Password</label>
                  <p className="text-sm font-medium text-gray-500 tracking-widest">••••••••</p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm active:scale-95"
                >
                  <Settings2 size={16} />
                  Update Account Details
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MODAL: Responsive width and padding */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white p-6 sm:p-8 rounded-lg w-full max-w-md shadow-xl border border-gray-100 max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-950 mb-1">Edit Account</h2>
            <p className="text-sm text-gray-500 mb-8">Update your profile info and security credentials.</p>

            <div className="space-y-5">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-800 ml-1">Profile Information</label>
                <div className="relative">
                  <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 outline-none transition-all text-sm"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 outline-none transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-800 ml-1">Change Password</label>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 outline-none transition-all text-sm"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 mt-10">
              <button onClick={closeModal} className="w-full sm:w-auto order-2 sm:order-1 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button
                onClick={handleUpdateAccount}
                disabled={loading}
                className="w-full sm:w-auto order-1 sm:order-2 flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm active:scale-95 disabled:bg-gray-300"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save All Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}