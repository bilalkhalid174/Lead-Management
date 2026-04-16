"use client";

import { useEffect, useState } from "react";

interface Lead {
  id?: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  status: string;
  notes?: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Lead>) => Promise<void> | void;
  editingLead?: Lead | null;
  isLoading?: boolean;
}

export default function LeadModal({
  isOpen,
  onClose,
  onSubmit,
  editingLead,
  isLoading = false,
}: Props) {
  const [form, setForm] = useState<Partial<Lead>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "NEW",
    notes: "",
  });

  // Prefill in edit mode
  useEffect(() => {
    if (editingLead) {
      setForm(editingLead);
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        status: "NEW",
        notes: "",
      });
    }
  }, [editingLead, isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingLead ? "Edit Lead" : "Add New Lead"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Name */}
            <input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="Name"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

            {/* Email */}
            <input
              name="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              required
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

            {/* Phone */}
            <input
              name="phone"
              value={form.phone || ""}
              onChange={handleChange}
              placeholder="Phone"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

            {/* Company */}
            <input
              name="company"
              value={form.company || ""}
              onChange={handleChange}
              placeholder="Company"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />

            {/* Status */}
            <select
              name="status"
              value={form.status || "NEW"}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm col-span-1 sm:col-span-2"
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="LOST">Lost</option>
              <option value="CONVERTED">Converted</option>
            </select>

            {/* Notes */}
            <textarea
              name="notes"
              value={form.notes || ""}
              onChange={handleChange}
              placeholder="Notes..."
              rows={3}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm col-span-1 sm:col-span-2"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm disabled:opacity-50"
            >
              {isLoading
                ? "Saving..."
                : editingLead
                ? "Update Lead"
                : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}