"use client";

type LeadFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
};

export function LeadFilters({ search, onSearchChange, statusFilter, onStatusFilterChange }: LeadFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email or company..."
          className="w-full pl-4 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 outline-none transition-all text-sm"
        />
      </div>

      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
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
  );
}
