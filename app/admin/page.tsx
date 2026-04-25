import Navbar from "@/components/layout/Navbar";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  // 🔒 Auth check (Logic remains untouched)
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  // 📊 Fetch data in parallel
  const [totalUsers, totalLeads, users] = await Promise.all([
    prisma.user.count(),
    prisma.lead.count(),
    prisma.user.findMany({
      include: {
        _count: {
          select: { leads: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-950">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              System-wide overview and user management.
            </p>
          </div>
        </div>

        {/* --- STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {[
            { label: "Total Users", value: totalUsers, textColor: "text-gray-950" },
            { label: "Total Leads", value: totalLeads, textColor: "text-gray-950" },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-lg border border-gray-200 bg-white shadow-sm">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
              <p className={`text-4xl font-bold mt-3 tracking-tight ${stat.textColor}`}>
                {stat.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* --- DATA TABLE SECTION --- */}
        <div className="space-y-4">

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-150">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Identity</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500">Role</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">Leads</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-50">
                  {users.map((u) => (
                    <tr key={u.id}>
                      {/* Identity */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">
                            {u.name || "Anonymous"}
                          </span>
                          <span className="text-[11px] text-gray-400">
                            {u.email}
                          </span>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-[10px] font-bold rounded-lg border ${
                            u.role === "ADMIN"
                              ? "bg-gray-900 text-white border-transparent"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      {/* Engagement */}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-lg">
                          {u._count.leads}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/user/${u.id}`}
                          className="inline-flex px-4 py-2 text-xs font-medium border border-gray-200 rounded-lg text-gray-700 bg-white shadow-sm active:scale-95 transition-transform"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="py-20 text-center border-t border-gray-50">
                <p className="text-gray-400 text-sm italic font-medium">No system users found.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}