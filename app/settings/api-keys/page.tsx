"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { Key, Plus, Copy, Trash2, Terminal, AlertTriangle, CheckCircle2, Clock, ArrowLeft, X } from "lucide-react";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string | null;
  status?: string; // Optional if you decide to send "revoked" from backend
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [keyToRevoke, setKeyToRevoke] = useState<string | null>(null); // For Confirmation Dialog

  // Fetch keys
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

  // Generate key
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

  // Revoke key
  const confirmRevokeKey = async () => {
    if (!keyToRevoke) return;

    try {
      const res = await fetch(`/api/api-keys/${keyToRevoke}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to revoke key");

      toast.success("Key revoked successfully");
      setKeys((prev) => prev.filter((k) => k.id !== keyToRevoke));
      setKeyToRevoke(null); // Close dialog
    } catch {
      toast.error("Failed to revoke key");
    }
  };

  // Copy helper
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
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
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-950">
              API Keys
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Manage your API keys to authenticate programmatic requests.
            </p>
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

        {/* NEW KEY WARNING ALERTS */}
        {newKey && (
          <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-lg mb-8 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="hidden sm:block mt-0.5">
                <AlertTriangle className="text-amber-600 shrink-0" size={20} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 sm:block">
                  <AlertTriangle className="text-amber-600 shrink-0 sm:hidden" size={18} />
                  <h3 className="text-sm font-semibold text-amber-900">
                    Save your new API key
                  </h3>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  For security reasons, this key will only be shown once. Please copy it and store it somewhere safe.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <code className="bg-white px-3 py-2 border border-amber-200 rounded-md flex-1 font-mono text-sm text-zinc-800 break-all text-center sm:text-left">
                    {newKey}
                  </code>

                  <button
                    onClick={() => copyToClipboard(newKey)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-sm font-medium rounded-md transition-colors shadow-sm shrink-0"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                </div>

                <button
                  onClick={() => setNewKey(null)}
                  className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors w-full sm:w-auto text-center sm:text-left pt-2 sm:pt-0"
                >
                  I have saved this key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABLE SECTION */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mb-12 w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left min-w-full">
              <thead className="bg-zinc-50 border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 sm:px-6 py-4">Name & Status</th>
                  <th className="hidden sm:table-cell px-6 py-4">Prefix</th>
                  <th className="hidden md:table-cell px-6 py-4">Created</th>
                  <th className="hidden sm:table-cell px-6 py-4">Last Used</th>
                  <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {loading && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                        Loading keys...
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && keys.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <Key size={32} className="mb-3 text-zinc-300" />
                        <p className="text-sm font-medium text-zinc-900">No API keys found</p>
                        <p className="text-sm mt-1">Generate your first key to get started.</p>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading &&
                  keys.map((key) => (
                    <tr key={key.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-100 rounded-md border border-zinc-200 hidden sm:block shrink-0">
                            <Key size={14} className="text-zinc-600" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-zinc-900 truncate">{key.name}</p>
                              {/* ACTIVE STATUS BADGE */}
                              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                Active
                              </span>
                            </div>
                            
                            {/* Mobile View Metadata (Stops horizontal scrolling) */}
                            <div className="sm:hidden mt-1.5 space-y-1">
                              <p className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                                <span className="text-zinc-400">Prefix:</span> {key.prefix}
                              </p>
                              <p className="text-xs text-zinc-500 flex items-center gap-1">
                                <Clock size={12} className="text-zinc-400 shrink-0" />
                                {new Date(key.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="hidden sm:table-cell px-6 py-4">
                        <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                          {key.prefix}••••••••
                        </span>
                      </td>

                      <td className="hidden md:table-cell px-6 py-4 text-zinc-500 whitespace-nowrap">
                        {new Date(key.createdAt).toLocaleDateString()}
                      </td>

                      <td className="hidden sm:table-cell px-6 py-4 text-zinc-500 whitespace-nowrap">
                        {key.lastUsedAt ? (
                          <span className="flex items-center gap-1.5 text-zinc-700">
                            <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                            {new Date(key.lastUsedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-zinc-400 italic">Never used</span>
                        )}
                      </td>

                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => copyToClipboard(key.prefix)}
                            className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
                            title="Copy Prefix"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            onClick={() => setKeyToRevoke(key.id)} // Trigger Dialog instead of deleting directly
                            className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Revoke Key"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CURL CHEAT SHEET */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden w-full">
          <div className="px-4 sm:px-6 py-5 border-b border-zinc-100 flex items-center gap-2">
            <Terminal size={18} className="text-zinc-500 shrink-0" />
            <h2 className="text-lg font-semibold text-zinc-900">
              API Usage Guide
            </h2>
          </div>

          <div className="p-4 sm:p-6 bg-zinc-50/50">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {/* CREATE */}
              <div className="space-y-2 w-full">
                <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Create Lead</p>
                <div className="w-full">
                  <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{`curl -X POST http://localhost:3000/api/leads \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "status": "NEW"
  }'`}
                  </pre>
                </div>
              </div>

              {/* GET LIST */}
              <div className="space-y-2 w-full">
                <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Get Leads</p>
                <div className="w-full">
                  <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{`curl -X GET "http://localhost:3000/api/leads?page=1&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </pre>
                </div>
              </div>

              {/* SINGLE */}
              <div className="space-y-2 w-full">
                <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Get Single Lead</p>
                <div className="w-full">
                  <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{`curl -X GET http://localhost:3000/api/leads/LEAD_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </pre>
                </div>
              </div>

              {/* UPDATE */}
              <div className="space-y-2 w-full">
                <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Update Lead</p>
                <div className="w-full">
                  <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{`curl -X PATCH http://localhost:3000/api/leads/LEAD_ID \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "status": "CONTACTED" }'`}
                  </pre>
                </div>
              </div>

              {/* DELETE */}
              <div className="space-y-2 lg:col-span-2 w-full">
                <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Delete Lead</p>
                <div className="w-full">
                  <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{`curl -X DELETE http://localhost:3000/api/leads/LEAD_ID \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* REVOKE CONFIRMATION MODAL */}
      {keyToRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle size={20} />
                <h3 className="font-semibold text-lg text-zinc-900">Revoke API Key</h3>
              </div>
              <button 
                onClick={() => setKeyToRevoke(null)}
                className="text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <p className="text-zinc-600 text-sm mb-6">
              Are you sure you want to revoke this API key? Any applications currently using this key will immediately lose access. This action cannot be undone.
            </p>
            
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => setKeyToRevoke(null)}
                className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={confirmRevokeKey}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm w-full sm:w-auto"
              >
                Yes, revoke key
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}