import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-ink-900 px-5 pt-24 text-center">
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-400">404</p>
        <h1 className="mt-4 font-display text-5xl text-cream-50 sm:text-6xl">This page isn&rsquo;t on the menu.</h1>
        <p className="mt-4 text-cream-200/70">The page you&rsquo;re looking for may have moved.</p>
        <Link href="/" className="mt-8 inline-flex h-12 items-center bg-copper-500 px-6 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-ink-900 hover:bg-copper-300">
          Back to Home
        </Link>
      </div>
    </section>
  );
}
