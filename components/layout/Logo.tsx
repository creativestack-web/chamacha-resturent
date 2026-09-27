import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Wordmark for Chamcha Restaurant.
 * The monogram draws a stylised serving spoon ("chamcha" = spoon), giving the
 * brand a custom mark. Replace with the restaurant's own logo file if available.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("h-10 w-10", className)}>
      <rect x="1" y="1" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.55" transform="rotate(45 20 20) scale(0.72) translate(7.8 7.8)" />
      <ellipse cx="20" cy="14.5" rx="5.2" ry="6.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 21.2v11.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="20" cy="34.2" r="1.3" fill="currentColor" />
    </svg>
  );
}

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/#top" aria-label="Chamcha Restaurant — home" className={cn("group inline-flex shrink-0 items-center gap-2.5 xs:gap-3", className)}>
      <LogoMark className={cn("text-copper-400 transition-all duration-500 ease-luxe", compact ? "h-8 w-8" : "h-9 w-9 xs:h-10 xs:w-10")} />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display tracking-[0.2em] text-cream-50 transition-all duration-500 ease-luxe", compact ? "text-[1.05rem] xs:text-[1.15rem]" : "text-[1.1rem] xs:text-[1.3rem]")}>
          CHAMCHA
        </span>
        <span className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.42em] text-copper-400/90 xs:tracking-[0.5em]">Restaurant</span>
      </span>
    </Link>
  );
}
