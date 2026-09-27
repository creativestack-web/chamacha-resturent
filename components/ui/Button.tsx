import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "whatsapp" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-sans font-semibold uppercase tracking-[0.14em] transition-all duration-300 ease-luxe focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-copper-500 text-ink-900 hover:bg-copper-300 hover:shadow-glow",
  outline: "border border-cream/30 text-cream hover:border-copper-400 hover:text-copper-300 hover:bg-cream/[0.03]",
  ghost: "text-cream/85 hover:text-copper-300",
  whatsapp: "bg-[#1E7048] text-white hover:bg-[#23804F]",
  light: "bg-cream-100 text-ink-900 hover:bg-white",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.7rem]",
  md: "h-12 px-6 text-[0.74rem]",
  lg: "h-14 px-8 text-[0.78rem]",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({ variant = "primary", size = "md", className, children, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; external?: boolean }) {
  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    const isWeb = href.startsWith("http");
    return (
      <a
        href={href}
        className={buttonClass(variant, size, className)}
        {...(isWeb ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}
