"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";

import { AlertDialog } from "@/components/ui/AlertDialog";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { ApiKeysTable } from "./components/ApiKeysTable";
import { ApiUsageGuide } from "./components/ApiUsageGuide";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string | null;
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/api-keys");
      if (!res.ok) throw new Error("Failed to fetch keys");
      const data = await res.json();
      setKeys(Array.isArray(data.data) ? data.data : []);
    } catch {
      toast.error("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const generateKey = async () => {
    if (keys.length >= 5) {
      toast.error("Maximum limit of 5 keys reached.");
      return;
    }

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "default-key" }),
      });

      if (!res.ok) throw new Error("Failed to generate key");
      const data = await res.json();
      setNewKey(data?.data?.key || null);
      toast.success("API Key generated");
      fetchKeys();
    } catch {
      toast.error("Failed to generate key");
    }
  };

  const confirmRevokeKey = async () => {
    if (!keyToRevoke) return;

    try {
      const res = await fetch(`/api/api-keys/${keyToRevoke}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to revoke key");
      toast.success("Key revoked successfully");
      setKeys((prev) => prev.filter((k) => k.id !== keyToRevoke));
      setKeyToRevoke(null);
    } catch {
      toast.error("Failed to revoke key");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const isAtMaxLimit = keys.length >= 5;

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200">
      <Navbar />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full overflow-hidden relative">
        {/* BACK BUTTON */}
        <div className="mb-6">
          <Link
            href="/settings"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Settings
          </Link>
        </div>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-950">API Keys</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage your API keys to authenticate programmatic requests.</p>
          </div>

          <button
            onClick={generateKey}
            disabled={isAtMaxLimit}
            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm shrink-0 w-full sm:w-auto ${
              isAtMaxLimit
                ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                : "bg-zinc-900 hover:bg-zinc-800 text-white active:scale-95"
            }`}
            title={isAtMaxLimit ? "You can only have up to 5 active API keys" : ""}
          >
            <Plus size={16} />
            {isAtMaxLimit ? "Key Limit Reached (5/5)" : "Generate New Key"}
          </button>
        </div>

        {/* NEW KEY WARNING ALERT */}
        {newKey && <AlertBanner content={newKey} onDismiss={() => setNewKey(null)} />}

        {/* KEYS TABLE */}
        <ApiKeysTable
          keys={keys}
          loading={loading}
          onRevoke={setKeyToRevoke}
          onCopyPrefix={copyToClipboard}
        />

        {/* API USAGE GUIDE */}
        <ApiUsageGuide />

        {/* REVOKE CONFIRMATION DIALOG */}
        <AlertDialog
          open={!!keyToRevoke}
          title="Revoke API Key"
          description="Are you sure you want to revoke this API key? Any applications currently using this key will immediately lose access. This action cannot be undone."
          confirmLabel="Yes, revoke key"
          cancelLabel="Cancel"
          onConfirm={confirmRevokeKey}
          onCancel={() => setKeyToRevoke(null)}
          variant="danger"
        />
      </div>
    </div>
  );
}
