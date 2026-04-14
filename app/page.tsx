"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import LeadModal from "@/components/ui/LeadModal";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  status: string;
  notes: string | null;
}

export default function Home() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/leads");
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
      const data = await response.json();
      setLeads(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
  };

  const handleSubmitForm = async (formData: Partial<Lead>) => {
    setIsSubmitting(true);
    try {
      if (editingLead) {
        // Update lead
        const response = await fetch(`/api/leads/${editingLead.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update lead");
        }

        const updatedLead = await response.json();
        setLeads(leads.map((l) => (l.id === updatedLead.id ? updatedLead : l)));
        setError(null);
      } else {
        // Create lead
        const response = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to create lead");
        }

        const newLead = await response.json();
        setLeads([...leads, newLead]);
        setError(null);
      }

      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Form submission error:", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete lead");
      }

      setLeads(leads.filter((l) => l.id !== id));
      setDeleteConfirm(null);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Delete error:", errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      CONTACTED: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      QUALIFIED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      LOST: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      CONVERTED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="py-4 sm:py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Lead Management Dashboard
              </h1>
            </div>
            <button
              onClick={handleAddLead}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm sm:text-base"
            >
              + Add New Lead
            </button>
          </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-3 sm:p-6">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Total Leads
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {leads.length}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border-l-4 border-blue-600 rounded-lg shadow p-3 sm:p-6">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">New</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {leads.filter((l) => l.status === "NEW").length}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border-l-4 border-yellow-600 rounded-lg shadow p-3 sm:p-6">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Contacted</p>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {leads.filter((l) => l.status === "CONTACTED").length}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border-l-4 border-green-600 rounded-lg shadow p-3 sm:p-6">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Qualified</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              {leads.filter((l) => l.status === "QUALIFIED").length}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 border-l-4 border-purple-600 rounded-lg shadow p-3 sm:p-6">
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Converted</p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {leads.filter((l) => l.status === "CONVERTED").length}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-600 dark:text-red-400">{error}</p>
              <button
                onClick={fetchLeads}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No leads found
              </p>
              <button
                onClick={handleAddLead}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Your First Lead
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="hidden lg:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="hidden xl:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Notes
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                        {lead.name}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 truncate max-w-xs sm:max-w-none">
                        {lead.email}
                      </td>
                      <td className="hidden md:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                        {lead.phone || "-"}
                      </td>
                      <td className="hidden lg:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300 truncate max-w-xs">
                        {lead.company || "-"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="hidden xl:table-cell px-3 sm:px-6 py-4 text-gray-600 dark:text-gray-300 max-w-xs truncate">
                        {lead.notes || "-"}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 mr-2 sm:mr-4 font-medium text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(lead.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 font-medium text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Delete Lead
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this lead? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteLead(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lead Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        editingLead={editingLead}
        isLoading={isSubmitting}
      />
    </div>
  );
}
