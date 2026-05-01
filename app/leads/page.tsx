"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import LeadModal from "@/components/ui/LeadModal";
import { showToast } from "@/app/utils/notifications";
import { useSession } from "next-auth/react";
import { Trash2 } from "lucide-react";

import { AlertDialog } from "@/components/ui/AlertDialog";
import { LeadFilters } from "./components/LeadFilters";
import { LeadTable } from "./components/LeadTable";
import { Pagination } from "./components/Pagination";

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

  useEffect(() => {
    fetchLeads();
  }, []);
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy, sortOrder]);

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
      } else if (data && typeof data === "object") {
        const possibleArray = Object.values(data).find((val) => Array.isArray(val));
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
        (l) =>
          l.name.toLowerCase().includes(s) ||
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

      showToast.success(editingLead ? "Lead updated successfully!" : "New lead created successfully!");
      setIsModalOpen(false);
      setEditingLead(null);
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
      await fetchLeads();
    } catch {
      showToast.error("Failed to delete the lead.");
    }
  };

  const handleSort = (col: "name" | "email" | "company" | "status") => {
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
        <LeadFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* TABLE */}
        <LeadTable
          leads={paginatedLeads}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={(lead) => {
            setEditingLead(lead);
            setIsModalOpen(true);
          }}
          onDelete={setDeleteConfirm}
          getStatusStyle={getStatusStyle}
          formatDate={formatDate}
          session={session}
        />

        {/* PAGINATION */}
        {!loading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* MODALS */}
        <LeadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitForm}
          editingLead={editingLead}
          isLoading={isSubmitting}
        />

        <AlertDialog
          open={!!deleteConfirm}
          title="Delete Lead?"
          description="Are you sure? This lead will be removed permanently. This action cannot be reversed."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={() => deleteConfirm && handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
          variant="danger"
          icon={<Trash2 className="text-red-600" size={24} />}
        />
      </div>
    </div>
  );
}
