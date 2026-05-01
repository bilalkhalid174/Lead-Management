"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";

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

  // Fetch keys
  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/api-keys");

      if (!res.ok) {
        throw new Error("Failed to fetch keys");
      }

      const data = await res.json();

      // ✅ FIX: correct data extraction
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
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "default-key",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate key");
      }

      const data = await res.json();

      // ✅ FIX: correct key extraction
      setNewKey(data?.data?.key || null);

      toast.success("API Key generated");
      fetchKeys();
    } catch {
      toast.error("Failed to generate key");
    }
  };

  // Revoke key
  const revokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/api-keys/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to revoke key");
      }

      toast.success("Key revoked");
      setKeys((prev) => prev.filter((k) => k.id !== id));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">API Keys</h1>

          <button
            onClick={generateKey}
            className="bg-black text-white px-4 py-2 rounded"
          >
            + Generate Key
          </button>
        </div>

        {/* NEW KEY BOX */}
        {newKey && (
          <div className="bg-yellow-100 p-4 rounded mb-4">
            <p className="font-semibold">
              Save this key (shown only once):
            </p>

            <div className="flex gap-2 mt-2">
              <code className="bg-white px-2 py-1 border rounded flex-1 font-mono">
                {newKey}
              </code>

              <button
                onClick={() => copyToClipboard(newKey)}
                className="px-3 py-1 bg-black text-white rounded"
              >
                Copy
              </button>
            </div>

            <button
              onClick={() => setNewKey(null)}
              className="mt-2 text-sm text-gray-600"
            >
              Close
            </button>
          </div>
        )}

        {/* TABLE */}
        <div className="bg-white border rounded">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-100">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Prefix</th>
                <th className="text-left p-3">Created</th>
                <th className="text-left p-3">Last Used</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                Array.isArray(keys) &&
                keys.map((key) => (
                  <tr key={key.id} className="border-b">
                    <td className="p-3">{key.name}</td>

                    <td className="p-3 font-mono">{key.prefix}</td>

                    <td className="p-3">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3">
                      {key.lastUsedAt
                        ? new Date(key.lastUsedAt).toLocaleDateString()
                        : "Never"}
                    </td>

                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => copyToClipboard(key.prefix)}
                        className="px-2 py-1 border rounded"
                      >
                        Copy
                      </button>

                      <button
                        onClick={() => revokeKey(key.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && keys.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-500">
                    No API keys found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}