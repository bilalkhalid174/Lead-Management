"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import LeadModal from "@/components/ui/LeadModal";
import { showToast } from "@/app/utils/notifications"; 
import { useSession } from "next-auth/react"; 
import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt?: string;
  createdBy?: { name: string } | string; 
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

  const { data: session } = useSession(); 

  useEffect(() => { fetchLeads(); }, []);
  useEffect(() => { setCurrentPage(1); }, [search, statusFilter, sortBy, sortOrder]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to fetch leads");
      
      const data = await res.json();

      let extractedLeads: Lead[] = [];
      
      if (Array.isArray(data)) {
        extractedLeads = data;
      } else if (data && Array.isArray(data.leads)) {
        extractedLeads = data.leads;
      } else if (data && Array.isArray(data.data)) {
        extractedLeads = data.data;
      } else if (data && typeof data === 'object') {
        const possibleArray = Object.values(data).find(val => Array.isArray(val));
        if (possibleArray) extractedLeads = possibleArray as Lead[];
      }

      setLeads(extractedLeads);
    } catch (error) {
      console.error(error);
      showToast.error("Could not load leads from server.");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const processedLeads = useMemo(() => {
    let filtered = Array.isArray(leads) ? [...leads] : [];
    
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

  // Ensure totalPages is at least 1 even if there are no leads
  const totalPages = Math.max(1, Math.ceil(processedLeads.length / itemsPerPage));
  const paginatedLeads = processedLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmitForm = async (formData: Partial<Lead>) => {
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
        if (saved.message?.toLowerCase().includes("email")) {
          throw new Error("This email is already in use.");
        }
        throw new Error("Action failed");
      }

      // Show success toast
      if (editingLead) {
        showToast.success("Lead updated successfully!");
      } else {
        showToast.success("New lead created successfully!");
      }

      // Close the modal
      setIsModalOpen(false);
      setEditingLead(null);
      
      // FIX: Fetch fresh leads from server immediately so the UI updates without reload
      await fetchLeads();
      
    } catch (err: unknown) {
      showToast.error(err instanceof Error ? err.message : "Something went wrong while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      
      setDeleteConfirm(null);
      showToast.success("Lead deleted successfully");
      
      // FIX: Fetch fresh leads to keep UI accurately synced
      await fetchLeads();
      
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
      CONTACTED: "bg-blue-50 text-blue-700 border-blue-100",
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
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 selection:bg-gray-200 font-sans">
      <Navbar />

      <div className="max-w-full mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">Leads Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your customer pipeline</p>
          </div>

          <button
            onClick={() => {
              setEditingLead(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm active:scale-95"
          >
            + Create New Lead
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email or company..."
              className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 outline-none transition-all text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-gray-400 text-sm cursor-pointer"
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
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full text-left border-collapse min-w-300">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  {(["name", "company", "status"] as const).map((col) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-gray-900"
                    >
                      <div className="flex items-center gap-1">
                        {col}
                        {sortBy === col ? (
                          sortOrder === "asc" ? <ChevronUp size={14}/> : <ChevronDown size={14}/>
                        ) : <ChevronsUpDown size={14} className="opacity-30"/>}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Phone</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Notes</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Created At</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Updated At</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Created By</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-24 text-center">
                      <div className="w-8 h-8 mx-auto border-[3px] border-gray-100 border-t-gray-900 rounded-full animate-spin" />
                    </td>
                  </tr>
                ) : paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-gray-400 text-sm italic">No leads found.</td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => {
                    const creatorName = typeof lead.createdBy === 'object' 
                      ? lead.createdBy.name 
                      : (lead.createdBy || session?.user?.name || "System");

                    return (
                      <tr key={lead.id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">{lead.name}</span>
                            <span className="text-[11px] text-gray-400">{lead.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{lead.company || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-lg border ${getStatusStyle(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{lead.phone || "—"}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-37.5 truncate" title={lead.notes || ""}>
                          {lead.notes || "—"}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">{formatDate(lead.createdAt)}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">{formatDate(lead.updatedAt)}</td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-indigo-100 uppercase">
                               {creatorName.charAt(0)}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                              {creatorName}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              title="Edit Lead"
                              onClick={() => { setEditingLead(lead); setIsModalOpen(true); }}
                              className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              title="Delete Lead"
                              onClick={() => setDeleteConfirm(lead.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        {!loading && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Showing page <span className="text-gray-900">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl animate-in zoom-in-95">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
               <Trash2 className="text-red-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-950">Delete Lead?</h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              Are you sure? This lead will be removed permanently. This action cannot be reversed.
            </p>
            <div className="mt-6 flex gap-3">
              <button 
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 px-4 py-2.5 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-sm"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
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