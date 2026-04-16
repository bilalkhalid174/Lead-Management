"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import LeadModal from "@/components/ui/LeadModal";
// 1. Toast utility import karein
import { showToast } from "@/app/utils/notifications"; 

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
  updatedAt?: string; 
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "company" | "status">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchLeads(); }, []);
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, sortBy, sortOrder]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      // Error toast for fetching
      showToast.error("Could not load leads from server.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const processedLeads = useMemo(() => {
    let filtered = [...leads];
    if (statusFilter) filtered = filtered.filter((l) => l.status === statusFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (l) => l.name.toLowerCase().includes(s) || 
               l.email.toLowerCase().includes(s) || 
               (l.company || "").toLowerCase().includes(s)
      );
    }
    filtered.sort((a, b) => {
      const aVal = (a[sortBy] || "").toLowerCase();
      const bVal = (b[sortBy] || "").toLowerCase();
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    return filtered;
  }, [leads, search, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedLeads.length / itemsPerPage);
  const paginatedLeads = processedLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmitForm = async (formData: Partial<Lead>) => {
    // Basic frontend edge case check
    if (!formData.name || !formData.email) {
      showToast.error("Name and Email are required!");
      return;
    }

    setIsSubmitting(true);
    try {
      const method = editingLead ? "PUT" : "POST";
      const url = editingLead ? `/api/leads/${editingLead.id}` : "/api/leads";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const saved = await res.json();

      if (!res.ok) {
        // Handling Duplicate Email Edge Case from Server
        if (saved.message?.toLowerCase().includes("email")) {
          throw new Error("This email is already in use.");
        }
        throw new Error("Action failed");
      }

      if (editingLead) {
        setLeads(leads.map((l) => (l.id === saved.id ? saved : l)));
        showToast.success("Lead updated successfully!");
      } else {
        setLeads([...leads, saved]);
        showToast.success("New lead created successfully!");
      }
      setIsModalOpen(false);
      setEditingLead(null);
    } catch (err: any) {
      showToast.error(err.message || "Something went wrong while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      
      setLeads(leads.filter((l) => l.id !== id));
      setDeleteConfirm(null);
      showToast.success("Lead deleted successfully");
    } catch {
      showToast.error("Failed to delete the lead.");
    }
  };

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(col);
      setSortOrder("asc");
    }
  };

  const getStatusStyle = (status: string) => {
    const map: Record<string, string> = {
      NEW: "bg-gray-50 text-gray-600 border-gray-200",
      CONTACTED: "bg-blue-50/50 text-blue-700 border-blue-100",
      QUALIFIED: "bg-gray-900 text-white border-transparent",
      LOST: "bg-red-50 text-red-700 border-red-200",
      CONVERTED: "bg-green-50 text-green-700 border-green-100",
    };
    return map[status] || "bg-gray-100 text-gray-600 border-gray-200";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 selection:bg-gray-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-950">Leads</h1>
          </div>

          <button
            onClick={() => {
              setEditingLead(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-full transition-all duration-200 shadow-sm active:scale-95"
          >
            Create Lead
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative w-full sm:w-96">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Name, Email or Company..."
              className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 transition-all text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 text-sm cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="LOST">Lost</option>
            <option value="CONVERTED">Converted</option>
          </select>
        </div>

        {/* TABLE CONTAINER */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {(["name", "company", "status"] as const).map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-gray-900 transition-colors ${col === 'company' ? 'hidden md:table-cell' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        {col}
                        <span className="text-gray-300">
                          {sortBy === col ? (sortOrder === "asc" ? "↑" : "↓") : "⇅"}
                        </span>
                      </div>
                    </th>
                  ))}
                  <th className="hidden lg:table-cell px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Notes</th>
                  <th className="hidden xl:table-cell px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Last Updated</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="w-8 h-8 mx-auto border-[3px] border-gray-100 border-t-gray-900 rounded-full animate-spin" />
                    </td>
                  </tr>
                ) : paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-400 text-sm">No leads found matching your criteria.</td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => (
                    <tr key={lead.id} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{lead.name}</span>
                          <span className="text-xs text-gray-400 md:hidden">{lead.company || "No Company"}</span>
                          <span className="hidden md:block text-xs text-gray-400 truncate max-w-45">{lead.email}</span>
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4">
                        <span className="text-sm text-gray-600 font-medium">{lead.company || "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-md border ${getStatusStyle(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4">
                        <p className="text-sm text-gray-500 truncate max-w-55 italic">
                          {lead.notes ? `"${lead.notes}"` : <span className="text-gray-200">—</span>}
                        </p>
                      </td>
                      <td className="hidden xl:table-cell px-6 py-4 text-xs text-gray-400">
                        {formatDate(lead.updatedAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setEditingLead(lead); setIsModalOpen(true); }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 rounded-lg transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(lead.id)}
                            className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
            <p className="text-sm text-gray-500 font-medium order-2 sm:order-1">
              Showing page <span className="text-gray-900">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-white disabled:opacity-40 transition-all"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium border border-gray-200 rounded-xl hover:bg-white disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-gray-950">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              This action cannot be undone. This lead will be permanently deleted.
            </p>
            <div className="mt-8 flex gap-3">
              <button 
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-sm"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
        editingLead={editingLead}
        isLoading={isSubmitting}
      />
    </div>
  );
}