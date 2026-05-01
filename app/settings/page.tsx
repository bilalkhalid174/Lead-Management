"use client";

import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { Loader2, User, Mail, UserCircle, KeyRound, Settings2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const { data: session, update } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // loading state for toggle only
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const data = await res.json();

        setName(data.name);
        setEmail(data.email);
        setEmailNotifications(Boolean(data.emailNotifications));
      } catch (err) {}
    };

    fetchSettings();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleToggleNotifications = async () => {
    const newValue = !emailNotifications;

    setEmailNotifications(newValue);

    try {
      setToggleLoading(true);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          emailNotifications: newValue,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update toggle");
      }

      toast.success(newValue ? "Notifications ON" : "Notifications OFF");
    } catch (err) {
      setEmailNotifications(emailNotifications);
      toast.error("Failed to update toggle");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }

    setLoading(true);
    try {
      const profileRes = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          emailNotifications,
        }),
      });

      if (!profileRes.ok) {
        const profileData = await profileRes.json();
        throw new Error(profileData.error || "Profile update failed");
      }

      // ✅ ONLY FIX ADDED HERE
      await update({
        name,
        email,
      });

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-950">
            Account Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your profile details, change your password, and manage your account security settings.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

            {/* LEFT */}
            <div className="p-6 sm:p-8 md:p-10 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <User size={18} className="text-gray-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-800 block mb-1">
                    Full Name
                  </label>
                  <p className="text-sm font-medium text-gray-500">{name || "—"}</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-800 block mb-1">
                    Email Address
                  </label>
                  <p className="text-sm font-medium text-gray-500">{email || "—"}</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="p-6 sm:p-8 md:p-10 space-y-8 bg-gray-50/30 flex flex-col justify-between">

              <div className="space-y-8">

                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                    <KeyRound size={18} className="text-gray-500" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-800 block mb-1">
                    Password
                  </label>
                  <p className="text-sm font-medium text-gray-500 tracking-widest">••••••••</p>
                </div>

                {/* TOGGLE (FIXED) */}
                <div className="pt-4">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-800 block mb-2">
                    Email Notifications
                  </label>

                  <button
                    type="button"
                    disabled={toggleLoading}
                    onClick={handleToggleNotifications}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                      emailNotifications ? "bg-gray-900" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                        emailNotifications ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>

                  <p className="text-xs text-gray-500 mt-2">
                    Receive email when lead status changes
                  </p>
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

      {/* MODAL - REDESIGNED */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-950/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-xl w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit Account
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update your personal information and security credentials.
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 p-2.5 outline-none transition-all placeholder:text-gray-400" 
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 p-2.5 outline-none transition-all placeholder:text-gray-400" 
                  placeholder="Enter your email"
                />
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                  Change Password <span className="text-gray-400 font-normal normal-case tracking-normal">(Optional)</span>
                </label>
                <div className="space-y-3">
                  <input 
                    type="password" 
                    placeholder="Current Password" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 p-2.5 outline-none transition-all placeholder:text-gray-400" 
                  />
                  <input 
                    type="password" 
                    placeholder="New Password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-1 focus:ring-gray-900 focus:border-gray-900 p-2.5 outline-none transition-all placeholder:text-gray-400" 
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateAccount}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center min-w-30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Save Changes"}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}