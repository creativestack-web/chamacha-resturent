import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Eyebrow({ children, className, tone = "copper" }: { children: ReactNode; className?: string; tone?: "copper" | "ember" }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 font-sans text-[0.7rem] font-semibold uppercase tracking-eyebrow",
        tone === "copper" ? "text-copper-400" : "text-ember-500",
        className
      )}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-70" />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  tone = "dark",
  id,
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  id?: string;
  className?: string;
  action?: ReactNode;
}) {
  const centered = align === "center";
  return (
    <Reveal
      className={cn(
        "mb-12 flex flex-col gap-6 md:mb-16",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && <Eyebrow tone={tone === "light" ? "ember" : "copper"} className={cn("mb-5", centered && "justify-center")}>{eyebrow}</Eyebrow>}
        <h2
          id={id}
          className={cn(
            "font-display text-[2.35rem] leading-[1.04] tracking-[-0.01em] sm:text-5xl lg:text-[3.6rem]",
            tone === "dark" ? "text-cream-50" : "text-ink-900"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", tone === "dark" ? "text-cream-200/75" : "text-ink-600/80")}>{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
