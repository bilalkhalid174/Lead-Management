"use client";

import { ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";

type AlertDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
  icon?: ReactNode;
};

export function AlertDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  icon,
}: AlertDialogProps) {
  if (!open) return null;

  const variantStyles = {
    danger: "text-white bg-red-600 hover:bg-red-700",
    warning: "text-white bg-amber-600 hover:bg-amber-700",
    info: "text-white bg-blue-600 hover:bg-blue-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon || <AlertTriangle size={20} />}
            <h3 className="font-semibold text-lg text-zinc-900">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-zinc-600 text-sm mb-6">{description}</p>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors w-full sm:w-auto"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm w-full sm:w-auto ${variantStyles[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
