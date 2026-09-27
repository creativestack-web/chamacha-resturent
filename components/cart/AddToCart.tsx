"use client";

import { useState } from "react";
import { useCart, useToast } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

type Props = {
  item: { id: string; name: string; price: number; image: string };
  variant?: "full" | "compact";
  label?: string;
  className?: string;
  disabled?: boolean;
  /** Tighter controls for dense list rows. */
  compact?: boolean;
};

/**
 * Quantity selector + "Add to Order" button. Used by menu cards, signature
 * cards and deal cards so every add-to-cart interaction behaves the same.
 */
export function AddToCart({ item, variant = "full", label = "Add to Order", className, disabled, compact }: Props) {
  const { add } = useCart();
  const { notify } = useToast();
  const [qty, setQty] = useState(1);
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");

  const handleAdd = () => {
    if (state !== "idle") return;
    setState("adding");
    // Brief loading state gives tactile feedback (and mirrors a future API call).
    window.setTimeout(() => {
      add(item, qty);
      notify(`${qty} × ${item.name} added`, "Tap the basket to review your order");
      setState("added");
      setQty(1);
      window.setTimeout(() => setState("idle"), 1400);
    }, 260);
  };

  if (disabled) {
    return <p className={cn("text-xs font-semibold uppercase tracking-[0.16em] text-cream-300/72", className)}>Currently unavailable</p>;
  }

  return (
    <div className={cn("flex items-stretch gap-2", className)}>
      {variant === "full" && (
        <div className="flex h-11 shrink-0 items-center border border-cream/15" role="group" aria-label={`Quantity for ${item.name}`}>
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className={cn("grid h-full place-items-center text-cream-200 transition-colors hover:text-copper-300 disabled:opacity-30", compact ? "w-9" : "w-10")}
            aria-label="Decrease quantity"
            disabled={qty <= 1}
          >
            <Icon name="minus" className="h-4 w-4" />
          </button>
          <span className="w-7 text-center text-sm font-semibold tabular-nums text-cream-50" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            className={cn("grid h-full place-items-center text-cream-200 transition-colors hover:text-copper-300", compact ? "w-9" : "w-10")}
            aria-label="Increase quantity"
          >
            <Icon name="plus" className="h-4 w-4" />
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={handleAdd}
        aria-label={`${label}: ${item.name}`}
        className={cn(
          "relative inline-flex h-11 min-w-0 flex-1 items-center justify-center gap-2 overflow-hidden px-3 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-all duration-300 ease-luxe",
          state === "added" ? "bg-cream-100 text-ink-900" : "bg-copper-500 text-ink-900 hover:bg-copper-300 hover:shadow-glow"
        )}
      >
        {state === "adding" ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900/30 border-t-ink-900" aria-hidden="true" />
        ) : state === "added" ? (
          <>
            <Icon name="check" className="h-4 w-4" /> Added
          </>
        ) : (
          <>
            <Icon name="plus" className="h-4 w-4" /> {label}
          </>
        )}
      </button>
    </div>
  );
}

/** Favourite toggle (persisted locally; ready to sync with customer accounts later). */
export function FavoriteButton({ id, name, className }: { id: string; name: string; className?: string }) {
  const [fav, setFav] = useState(false);
  const { notify } = useToast();
  return (
    <button
      type="button"
      aria-pressed={fav}
      aria-label={fav ? `Remove ${name} from favourites` : `Save ${name} to favourites`}
      onClick={() => {
        setFav((f) => !f);
        if (!fav) notify(`${name} saved to favourites`);
      }}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-full border backdrop-blur-md transition-all duration-300 ease-luxe",
        fav ? "border-ember-400 bg-ember-500 text-white" : "border-white/25 bg-black/35 text-white hover:border-white/60 hover:bg-black/55",
        className
      )}
    >
      <Icon name="heart" className={cn("h-[18px] w-[18px] transition-transform duration-300", fav && "scale-110")} fill={fav ? "currentColor" : "none"} />
    </button>
  );
}
