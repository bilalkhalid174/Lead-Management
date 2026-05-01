"use client";

import { AlertTriangle, Copy } from "lucide-react";
import toast from "react-hot-toast";

type AlertBannerProps = {
  content: string;
  onDismiss: () => void;
};

export function AlertBanner({ content, onDismiss }: AlertBannerProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-lg mb-8 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="hidden sm:block mt-0.5">
          <AlertTriangle className="text-amber-600 shrink-0" size={20} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 sm:block">
            <AlertTriangle className="text-amber-600 shrink-0 sm:hidden" size={18} />
            <h3 className="text-sm font-semibold text-amber-900">Save your new API key</h3>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            For security reasons, this key will only be shown once. Please copy it and store it somewhere safe.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <code className="bg-white px-3 py-2 border border-amber-200 rounded-md flex-1 font-mono text-sm text-zinc-800 break-all text-center sm:text-left">
              {content}
            </code>

            <button
              onClick={() => copyToClipboard(content)}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-sm font-medium rounded-md transition-colors shadow-sm shrink-0"
            >
              <Copy size={14} />
              Copy
            </button>
          </div>

          <button
            onClick={onDismiss}
            className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors w-full sm:w-auto text-center sm:text-left pt-2 sm:pt-0"
          >
            I have saved this key
          </button>
        </div>
      </div>
    </div>
  );
}
