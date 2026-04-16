interface Props {
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  onAdd: () => void;
}

export default function LeadFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="px-4 py-2 border rounded-lg w-full sm:w-80"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="px-4 py-2 border rounded-lg"
      >
        <option value="">All</option>
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
      </select>

      <button
        onClick={onAdd}
        className="px-4 py-2 bg-gray-900 text-white rounded-lg"
      >
        + Add Lead
      </button>
    </div>
  );
}