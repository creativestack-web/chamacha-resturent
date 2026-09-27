"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { navigation, site } from "@/data/site";
import { useCart } from "@/lib/cart";
import { cn, telLink, whatsappLink } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("top");
  const { count, open } = useCart();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the nav link for the section in view
  useEffect(() => {
    const ids = navigation.map((n) => n.href.split("#")[1]).filter(Boolean);
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Cart count bump animation
  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 450);
    return () => clearTimeout(t);
  }, [count]);

  // Mobile menu: lock scroll, close on Escape, trap focus
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>("a,button");
    focusables?.[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
      if (e.key === "Tab" && focusables && focusables.length) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-luxe",
          scrolled ? "border-b border-cream/[0.07] bg-ink-900/85 backdrop-blur-xl" : "bg-gradient-to-b from-ink-900/70 to-transparent"
        )}
      >
        <div className={cn("container flex items-center justify-between gap-3 sm:gap-6 transition-all duration-500 ease-luxe", scrolled ? "h-[64px]" : "h-[84px]")}>
          <Logo compact={scrolled} />

          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {navigation.map((item) => {
                const id = item.href.split("#")[1];
                const isActive = active === id;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative py-2 text-[0.8rem] font-medium tracking-[0.04em] transition-colors duration-300",
                        isActive ? "text-copper-300" : "text-cream-100/80 hover:text-cream-50",
                        "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-copper-400 after:transition-all after:duration-500 after:ease-luxe",
                        isActive ? "after:w-full" : "after:w-0 hover:after:w-full"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
            <ButtonLink
              href={whatsappLink()}
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex"
              aria-label="WhatsApp us (opens WhatsApp)"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              WhatsApp Us
            </ButtonLink>
            <ButtonLink href={site.ordering.orderUrl} size="sm" className="hidden md:inline-flex">
              Order Online
            </ButtonLink>

            <button
              type="button"
              onClick={open}
              className="relative grid h-11 w-11 shrink-0 place-items-center border border-cream/15 text-cream-50 transition-colors duration-300 hover:border-copper-400 hover:text-copper-300"
              aria-label={`Open your order${count ? `, ${count} item${count > 1 ? "s" : ""}` : ", empty"}`}
            >
              <Icon name="cart" />
              {count > 0 && (
                <span
                  className={cn(
                    "absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-copper-500 px-1 text-[0.7rem] font-bold text-ink-900 transition-transform duration-300",
                    bump && "scale-125"
                  )}
                >
                  {count}
                </span>
              )}
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid h-11 w-11 shrink-0 place-items-center border border-cream/15 text-cream-50 transition-colors hover:border-copper-400 xl:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <div
        className={cn("fixed inset-0 z-[70] xl:hidden", menuOpen ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!menuOpen}
      >
        <div
          className={cn("absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-500", menuOpen ? "opacity-100" : "opacity-0")}
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="mobile-nav"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={cn(
            "grain absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-ink-800 transition-transform duration-500 ease-luxe",
            menuOpen ? "translate-x-0" : "translate-x-full"
          )}
          inert={!menuOpen}
        >
          <div className="flex h-[76px] items-center justify-between border-b border-cream/[0.07] px-6">
            <span className="text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-400">Menu</span>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="grid h-11 w-11 place-items-center border border-cream/15 text-cream-50 hover:border-copper-400"
              aria-label="Close menu"
            >
              <Icon name="close" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 px-6 py-6">
            <ul>
              {navigation.map((item, i) => (
                <li
                  key={item.href}
                  className={cn("transition-all duration-500 ease-luxe", menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0")}
                  style={{ transitionDelay: menuOpen ? `${80 + i * 35}ms` : "0ms" }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between border-b border-cream/[0.06] py-3.5 font-display text-[1.65rem] text-cream-50 transition-colors hover:text-copper-300"
                  >
                    {item.label}
                    <Icon name="arrow" className="h-4 w-4 text-copper-500" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-3 border-t border-cream/[0.07] p-6">
            <ButtonLink href={site.ordering.orderUrl} size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
              Order Online
            </ButtonLink>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href={whatsappLink()} variant="whatsapp" size="md" className="w-full">
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
              </ButtonLink>
              <ButtonLink href={telLink()} variant="outline" size="md" className="w-full">
                <Icon name="phone" className="h-4 w-4" /> Call
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
