import Navbar from "@/components/layout/Navbar";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function AdminUserLeadsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  //  Auth check
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/");

  const { id } = await params;
  const { page } = await searchParams;

  const currentPage = Number(page) || 1;
  const itemsPerPage = 10;

  if (!id) {
    return <div className="p-10 text-center font-medium text-gray-500">Invalid User ID</div>;
  }

  //  Fetch total count & paginated leads
  const [targetUser, totalLeads] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        leads: {
          orderBy: { createdAt: "desc" },
          skip: (currentPage - 1) * itemsPerPage,
          take: itemsPerPage,
        },
      },
    }),
    prisma.lead.count({ where: { userId: id } }),
  ]);

  if (!targetUser) return <div className="p-10 text-center font-medium text-gray-500">User not found</div>;

  const totalPages = Math.ceil(totalLeads / itemsPerPage);

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

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-gray-200">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* --- HEADER --- */}
        <div className="flex flex-col gap-6 mb-10">
          <Link 
            href="/admin" 
            className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 transition-all"
          >
            <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            Back to Admin Dashboard
          </Link>
          
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Leads of {targetUser.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">{targetUser.email}</p>
          </div>
        </div>
        
        

        {/* --- TABLE SECTION --- */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-275">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Name</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Company</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Phone</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Notes</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Created</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Last Update</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Owner</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {targetUser.leads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-gray-400 text-sm italic">
                      No leads found for this user.
                    </td>
                  </tr>
                ) : (
                  targetUser.leads.map((lead) => (
                    <tr key={lead.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{lead.name}</span>
                          <span className="text-[11px] text-gray-400">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.company || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-full border ${getStatusStyle(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {lead.phone || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-37.5 truncate" title={lead.notes || ""}>
                        {lead.notes || "—"}
                      </td>
                      <td className="px-6 py-4 text-[11px] text-gray-400 font-medium">
                        {new Date(lead.createdAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 text-[11px] text-gray-400 font-medium">
                        {new Date(lead.updatedAt).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric"
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs font-medium text-gray-600">{targetUser.name}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PAGINATION --- */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
            <p className="text-xs text-gray-500 font-medium">
              Showing page <span className="text-gray-900">{currentPage}</span> of {totalPages}
            </p>
            <div className="flex gap-2">
              <Link
                href={`/admin/user/${id}?page=${currentPage - 1}`}
                className={`px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg transition-all ${
                  currentPage <= 1 ? "pointer-events-none opacity-30" : "bg-white hover:bg-gray-50 active:scale-95 shadow-sm"
                }`}
              >
                Previous
              </Link>
              <Link
                href={`/admin/user/${id}?page=${currentPage + 1}`}
                className={`px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg transition-all ${
                  currentPage >= totalPages ? "pointer-events-none opacity-30" : "bg-white hover:bg-gray-50 active:scale-95 shadow-sm"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}