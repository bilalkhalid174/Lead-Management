import { Terminal } from "lucide-react";

export function ApiUsageGuide() {
  return (
    <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden w-full">
      <div className="px-4 sm:px-6 py-5 border-b border-zinc-100 flex items-center gap-2">
        <Terminal size={18} className="text-zinc-500 shrink-0" />
        <h2 className="text-lg font-semibold text-zinc-900">API Usage Guide (Windows)</h2>
      </div>

      <div className="p-4 sm:p-6 bg-zinc-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* CREATE */}
          <div className="space-y-2 w-full">
            <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Create Lead</p>
            <div className="w-full">
              <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{[
  'curl.exe -X POST http://localhost:3000/api/leads `',
  '  -H "Authorization: Bearer YOUR_API_KEY" `',
  '  -H "Content-Type: application/json" `',
  '  -d "{\\"name\\": \\"John Doe\\", \\"email\\": \\"john@example.com\\", \\"status\\": \\"NEW\\"}"'
].join('\n')}
              </pre>
            </div>
          </div>

          {/* GET LIST */}
          <div className="space-y-2 w-full">
            <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Get Leads</p>
            <div className="w-full">
              <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{[
  'curl.exe -X GET "http://localhost:3000/api/leads?page=1&limit=10" `',
  '  -H "Authorization: Bearer YOUR_API_KEY"'
].join('\n')}
              </pre>
            </div>
          </div>

          {/* SINGLE */}
          <div className="space-y-2 w-full">
            <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Get Single Lead</p>
            <div className="w-full">
              <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{[
  'curl.exe -X GET http://localhost:3000/api/leads/LEAD_ID `',
  '  -H "Authorization: Bearer YOUR_API_KEY"'
].join('\n')}
              </pre>
            </div>
          </div>

          {/* UPDATE */}
          <div className="space-y-2 w-full">
            <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Update Lead</p>
            <div className="w-full">
              <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{[
  'curl.exe -X PATCH http://localhost:3000/api/leads/LEAD_ID `',
  '  -H "Authorization: Bearer YOUR_API_KEY" `',
  '  -H "Content-Type: application/json" `',
  '  -d "{\\"status\\": \\"CONTACTED\\"}"'
].join('\n')}
              </pre>
            </div>
          </div>

          {/* DELETE */}
          <div className="space-y-2 lg:col-span-2 w-full">
            <p className="text-[13px] font-semibold text-zinc-800 uppercase tracking-wide">Delete Lead</p>
            <div className="w-full">
              <pre className="bg-[#18181b] text-zinc-300 p-4 rounded-lg text-xs font-mono leading-relaxed shadow-inner border border-zinc-800 whitespace-pre-wrap break-all w-full">
{[
  'curl.exe -X DELETE http://localhost:3000/api/leads/LEAD_ID `',
  '  -H "Authorization: Bearer YOUR_API_KEY"'
].join('\n')}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}