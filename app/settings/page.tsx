"use client";

import Navbar from "@/components/layout/Navbar";
import { useEffect, useState } from "react";
import { Loader2, User, ShieldCheck, Mail, UserCircle, KeyRound } from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type ModalType = "profile" | "password" | null;

export default function SettingsPage() {
  const { data: session, update } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [modalType, setModalType] = useState<ModalType>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  const closeModal = () => {
    setModalType(null);
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleProfileUpdate = async () => {
    if (!name || !email) {
      toast.error("Name and Email required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      await update({
        ...session,
        user: { ...session?.user, name, email },
      });
      toast.success("Profile updated successfully");
      closeModal();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("All fields required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile/password", {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error);
        return;
      }
      toast.success("Password updated successfully");
      closeModal();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 selection:bg-gray-200 font-sans">
      <Navbar />

      <main className="max-w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* HEADER - Synced with LeadsPage */}
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your profile details, change your password, and manage your account security settings.
          </p>
        </div>

        {/* MAIN CARD - Synced with Table Container Style */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            
            {/* LEFT PORTION: PROFILE */}
            <div className="p-6 sm:p-10 space-y-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <User size={18} className="text-gray-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Profile Details</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block mb-1">Full Name</label>
                  <p className="text-sm font-medium text-gray-700">{name || "—"}</p>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block mb-1">Email Address</label>
                  <p className="text-sm font-medium text-gray-700">{email || "—"}</p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setModalType("profile")}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm active:scale-95"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT PORTION: SECURITY */}
            <div className="p-6 sm:p-10 space-y-8 bg-gray-50/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <KeyRound size={18} className="text-gray-500" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-gray-700 block mb-1">Password</label>
                  <p className="text-sm font-medium text-gray-700 tracking-widest">••••••••</p>
                </div>



                <div className="pt-2">
                  <button
                    onClick={() => setModalType("password")}
                    className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm active:scale-95"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* MODAL - Synced with DeleteConfirm style */}
      {modalType && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl animate-in zoom-in-95 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-950 mb-1">
              {modalType === "profile" ? "Update Profile" : "Security Update"}
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Please enter the details you wish to update below.
            </p>

            <div className="space-y-4">
              {modalType === "profile" ? (
                <>
                  <div className="relative group">
                    <UserCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 outline-none transition-all text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 outline-none transition-all text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 mt-10">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={modalType === "password" ? handlePasswordChange : handleProfileUpdate}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm active:scale-95 disabled:bg-gray-300"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}