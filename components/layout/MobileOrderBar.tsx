"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

/**
 * Thumb-friendly sticky action bar on phones/tablets.
 * Appears once the visitor scrolls past the hero; shows live cart total.
 */
export function MobileOrderBar() {
  const { count, total, open } = useCart();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-ink-900/92 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-500 ease-luxe md:hidden",
        show ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex items-stretch gap-2.5">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-[52px] w-[52px] shrink-0 place-items-center bg-[#1E7048] text-white"
          aria-label="Order on WhatsApp"
          tabIndex={show ? 0 : -1}
        >
          <Icon name="whatsapp" className="h-6 w-6" />
        </a>
        {count > 0 ? (
          <button
            type="button"
            onClick={open}
            tabIndex={show ? 0 : -1}
            className="flex h-[52px] flex-1 items-center justify-between bg-copper-500 px-4 text-ink-900"
          >
            <span className="flex items-center gap-2.5 text-[0.78rem] font-bold uppercase tracking-[0.12em]">
              <span className="grid h-6 min-w-6 place-items-center rounded-full bg-ink-900 px-1.5 text-[0.7rem] text-copper-300">{count}</span>
              View Order
            </span>
            <span className="text-[0.95rem] font-bold">{formatPrice(total)}</span>
          </button>
        ) : (
          <a
            href="#menu"
            tabIndex={show ? 0 : -1}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 bg-copper-500 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-ink-900"
          >
            Order Now <Icon name="arrow" className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
