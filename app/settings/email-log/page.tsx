"use client";

import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Mail, CheckCircle2, XCircle, Clock, Filter, Inbox } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

type EmailLog = {
  id: string;
  to: string;
  subject: string;
  type: string;
  status: string;
  error?: string | null;
  createdAt: string;
};

export default function EmailLogPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const fetchLogs = async () => {
    setLoading(true);

    const params = new URLSearchParams();

    if (type) params.append("type", type);
    if (status) params.append("status", status);

    try {
      const res = await fetch(`/api/email-logs?${params.toString()}`);
      const data = await res.json();
      setLogs(data.data || []);
    } catch (error) {
      console.error("Failed to fetch logs", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [type, status]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} />
            Sent
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle size={12} />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} />
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200">
      <Navbar />

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full overflow-hidden">
        
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

        {/* HEADER & FILTERS */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-950">
              Email Logs
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Monitor outgoing system emails and their delivery statuses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <div className="relative w-full sm:w-40">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter size={14} className="text-zinc-400" />
              </div>
              <select
                className="w-full pl-9 pr-8 py-2 bg-white border border-zinc-200 text-zinc-700 text-sm rounded-lg focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all shadow-sm appearance-none"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="WELCOME">Welcome</option>
                <option value="LEAD_STATUS_CHANGE">Status Change</option>
                <option value="NEW_LEAD">New Lead</option>
              </select>
            </div>

            <div className="relative w-full sm:w-40">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Clock size={14} className="text-zinc-400" />
              </div>
              <select
                className="w-full pl-9 pr-8 py-2 bg-white border border-zinc-200 text-zinc-700 text-sm rounded-lg focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none transition-all shadow-sm appearance-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="SENT">Sent</option>
                <option value="FAILED">Failed</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left min-w-full">
              <thead className="bg-zinc-50 border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-4 sm:px-6 py-4">Recipient</th>
                  <th className="hidden md:table-cell px-6 py-4">Subject</th>
                  <th className="hidden lg:table-cell px-6 py-4">Type</th>
                  <th className="px-4 sm:px-6 py-4 text-center sm:text-left w-24">Status</th>
                  <th className="hidden sm:table-cell px-6 py-4 text-right">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
                        <span className="text-sm font-medium">Loading email logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-16 text-center">
                      <div className="flex flex-col items-center justify-center text-zinc-500">
                        <Inbox size={40} className="mb-4 text-zinc-300" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-zinc-900">No logs found</p>
                        <p className="text-sm mt-1">Try adjusting your filters to see more results.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors group">
                      
                      {/* Recipient & Folded Data for Mobile */}
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="p-2 bg-zinc-100 rounded-md border border-zinc-200 hidden sm:block shrink-0 mt-0.5 sm:mt-0">
                            <Mail size={14} className="text-zinc-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-zinc-900 truncate">{log.to}</p>
                            
                            {/* Mobile Folded Metadata (Prevents Horizontal Scroll) */}
                            <div className="md:hidden mt-1.5 space-y-1">
                              <p className="text-xs text-zinc-600 line-clamp-1" title={log.subject}>
                                {log.subject}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono">
                                <span className="bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                                  {log.type}
                                </span>
                                <span className="sm:hidden">
                                  {new Date(log.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Subject (Desktop Only) */}
                      <td className="hidden md:table-cell px-6 py-4 text-zinc-600 max-w-50 truncate" title={log.subject}>
                        {log.subject}
                      </td>

                      {/* Type (Large Desktop Only) */}
                      <td className="hidden lg:table-cell px-6 py-4">
                        <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                          {log.type}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 sm:px-6 py-4 text-center sm:text-left">
                        {getStatusBadge(log.status)}
                      </td>

                      {/* Date (Tablet & Desktop) */}
                      <td className="hidden sm:table-cell px-6 py-4 text-right text-zinc-500 text-sm whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}