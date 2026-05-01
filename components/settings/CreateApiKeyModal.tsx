"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (key: string) => void;
};

export default function CreateApiKeyModal({
  isOpen,
  onClose,
  onCreated,
}: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const createKey = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create key");
      }

      // backend returns full key ONLY ONCE
      onCreated(data.key);

      toast.success("API Key created successfully");
      setName("");
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Generate API Key</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Key name (e.g. Production)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded-lg mb-4"
        />

        {/* Actions */}
        <button
          onClick={createKey}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded-lg flex justify-center items-center gap-2 hover:bg-gray-800"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          Generate Key
        </button>
      </div>
    </div>
  );
}