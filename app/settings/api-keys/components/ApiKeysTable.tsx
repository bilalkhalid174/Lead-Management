import { Key, Copy as CopyIcon, Trash2, CheckCircle2, Clock } from "lucide-react";

type ApiKey = {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt?: string | null;
};

type ApiKeysTableProps = {
  keys: ApiKey[];
  loading: boolean;
  onRevoke: (id: string) => void;
  onCopyPrefix: (prefix: string) => void;
};

export function ApiKeysTable({ keys, loading, onRevoke, onCopyPrefix }: ApiKeysTableProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden mb-12 w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left min-w-full">
          <thead className="bg-zinc-50 border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-4 sm:px-6 py-4">Name & Status</th>
              <th className="hidden sm:table-cell px-6 py-4">Prefix</th>
              <th className="hidden md:table-cell px-6 py-4">Created</th>
              <th className="hidden sm:table-cell px-6 py-4">Last Used</th>
              <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {loading && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin" />
                    Loading keys...
                  </div>
                </td>
              </tr>
            )}

            {!loading && keys.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-zinc-500">
                    <Key size={32} className="mb-3 text-zinc-300" />
                    <p className="text-sm font-medium text-zinc-900">No API keys found</p>
                    <p className="text-sm mt-1">Generate your first key to get started.</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              keys.map((key) => (
                <tr key={key.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-zinc-100 rounded-md border border-zinc-200 hidden sm:block shrink-0">
                        <Key size={14} className="text-zinc-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-zinc-900 truncate">{key.name}</p>
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                            Active
                          </span>
                        </div>

                        {/* Mobile View Metadata */}
                        <div className="sm:hidden mt-1.5 space-y-1">
                          <p className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                            <span className="text-zinc-400">Prefix:</span> {key.prefix}
                          </p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1">
                            <Clock size={12} className="text-zinc-400 shrink-0" />
                            {new Date(key.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="hidden sm:table-cell px-6 py-4">
                    <span className="font-mono text-xs text-zinc-600 bg-zinc-100 px-2 py-1 rounded border border-zinc-200">
                      {key.prefix}••••••••
                    </span>
                  </td>

                  <td className="hidden md:table-cell px-6 py-4 text-zinc-500 whitespace-nowrap">
                    {new Date(key.createdAt).toLocaleDateString()}
                  </td>

                  <td className="hidden sm:table-cell px-6 py-4 text-zinc-500 whitespace-nowrap">
                    {key.lastUsedAt ? (
                      <span className="flex items-center gap-1.5 text-zinc-700">
                        <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        {new Date(key.lastUsedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-zinc-400 italic">Never used</span>
                    )}
                  </td>

                  <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onCopyPrefix(key.prefix)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded transition-colors"
                        title="Copy Prefix"
                      >
                        <CopyIcon size={16} />
                      </button>
                      <button
                        onClick={() => onRevoke(key.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Revoke Key"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
