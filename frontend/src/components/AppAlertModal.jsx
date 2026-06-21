import React from "react";

const iconStyles = {
  error: {
    wrap: "bg-red-100 text-red-600",
    button: "bg-red-600 hover:bg-red-700",
    ring: "ring-red-100",
    icon: "✕",
  },
  warning: {
    wrap: "bg-amber-100 text-amber-600",
    button: "bg-amber-500 hover:bg-amber-600",
    ring: "ring-amber-100",
    icon: "!",
  },
  success: {
    wrap: "bg-emerald-100 text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
    ring: "ring-emerald-100",
    icon: "✓",
  },
  info: {
    wrap: "bg-blue-100 text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
    ring: "ring-blue-100",
    icon: "i",
  },
};

export default function AppAlertModal({ open, alertData, onClose }) {
  if (!open) return null;

  const style = iconStyles[alertData?.type] || iconStyles.error;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-[2px]">
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-slate-200
          bg-white
          shadow-2xl
          animate-[fadeIn_.2s_ease-out]
        "
      >
        <div className="flex items-start gap-4 px-6 py-6">
          <div
            className={`
              flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-black
              ${style.wrap}
            `}
          >
            {style.icon}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-extrabold text-slate-900">
              {alertData?.title || "Aviso"}
            </h3>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
              {alertData?.message || "Ha ocurrido un evento en el sistema."}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className={`
              rounded-2xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition
              ${style.button}
            `}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}