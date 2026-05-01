"use client";

import { Pencil, Trash2, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

type Lead = {
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
};

type Session = {
  user?: {
    name?: string | null;
  } | null;
};

type LeadTableProps = {
  leads: Lead[];
  loading: boolean;
  sortBy: "name" | "email" | "company" | "status";
  sortOrder: "asc" | "desc";
  onSort: (col: "name" | "email" | "company" | "status") => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  getStatusStyle: (status: string) => string;
  formatDate: (dateStr?: string) => string;
  session: Session | null | undefined;
};

export function LeadTable({
  leads,
  loading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  getStatusStyle,
  formatDate,
  session,
}: LeadTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-left border-collapse min-w-300">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {(["name", "company", "status"] as const).map((col) => (
                <th
                  key={col}
                  onClick={() => onSort(col)}
                  className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 cursor-pointer hover:text-gray-900"
                >
                  <div className="flex items-center gap-1">
                    {col}
                    {sortBy === col ? (
                      sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    ) : (
                      <ChevronsUpDown size={14} className="opacity-30" />
                    )}
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
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-20 text-center text-gray-400 text-sm italic">
                  No leads found.
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const creatorName = typeof lead.createdBy === "object"
                  ? lead.createdBy.name
                  : lead.createdBy || session?.user?.name || "System";

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
                        <span className="text-sm text-gray-600 font-medium">{creatorName}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          title="Edit Lead"
                          onClick={() => onEdit(lead)}
                          className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Delete Lead"
                          onClick={() => onDelete(lead.id)}
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
  );
}
