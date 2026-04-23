"use client";

interface StatsData {
  total: number;
  NEW: number;
  CONTACTED: number;
  QUALIFIED: number;
  LOST: number;
  CONVERTED: number;
}

interface StatsBarProps {
  stats: StatsData | null;
  loading: boolean;
}

export default function StatsBar({ stats, loading }: StatsBarProps) {
  // Skeleton Loader - Matching the 3x3 Grid
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="bg-gray-50 border border-gray-100 rounded-2xl p-8 h-32 animate-pulse" 
          />
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Total Leads", value: stats.total, highlight: true },
    { label: "New Leads", value: stats.NEW },
    { label: "Contacted", value: stats.CONTACTED },
    { label: "Qualified", value: stats.QUALIFIED },
    { label: "Lost", value: stats.LOST },
    { label: "Converted", value: stats.CONVERTED },
  ];

  return (
    <div className="w-full mb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div 
            key={card.label} 
            className="group bg-white border border-gray-200 rounded-lg p-7 
                       transition-all duration-300 ease-in-out
                       hover:border-gray-400 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex flex-col justify-between h-full">
              <span className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-3">
                {card.label}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-gray-900 text-4xl font-extrabold tracking-tight">
                  {card.value.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}