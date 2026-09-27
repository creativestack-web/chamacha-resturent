"use client";

import { useToast } from "@/lib/cart";
import { Icon } from "./Icon";

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2 px-4 md:bottom-auto md:left-auto md:right-6 md:top-24 md:items-end"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm animate-rise items-center gap-3 border border-copper-500/30 bg-ink-700/95 px-4 py-3.5 shadow-lift backdrop-blur"
        >
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-copper-500 text-ink-900">
            <Icon name="check" className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-cream-50">{t.title}</p>
            {t.body && <p className="truncate text-xs text-cream-300/70">{t.body}</p>}
          </div>
          <button type="button" onClick={() => dismiss(t.id)} className="grid h-8 w-8 place-items-center text-cream-300/70 hover:text-cream-50" aria-label="Dismiss notification">
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
