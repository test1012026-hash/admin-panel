import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Overview", end: true },
  { to: "/solutions", label: "Solutions" },
  { to: "/security", label: "Zero-Knowledge Security" },
  { to: "/pricing", label: "Pricing" },
  { to: "/terms", label: "Terms" },
];

function navClass({ isActive }) {
  return isActive
    ? "text-accent font-semibold"
    : "text-ink-600 hover:text-ink-950 transition-colors";
}

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-accent/15 blur-3xl"
        style={{ animation: "soft-pulse 5s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl"
        style={{ animation: "soft-pulse 6s ease-in-out infinite 0.8s" }}
      />

      <header className="sticky top-0 z-50 border-b border-ink-200/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white shadow-md shadow-accent/30 transition-transform group-hover:scale-105">
              <span className="font-display text-sm font-bold">SD</span>
            </div>
            <span className="font-display text-xl font-bold text-ink-950 group-hover:text-accent transition-colors">
              SecureDocShare
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="btn-secondary px-4 py-2">
              Sign In
            </Link>
            <Link to="/signup" className="btn-primary px-4 py-2">
              Start 90-Day Trial
            </Link>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-ink-500 hover:text-ink-950 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="space-y-3 border-b border-ink-200 bg-white/95 px-4 pb-6 pt-2 md:hidden">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base text-ink-600 hover:text-ink-950"
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Link to="/login" className="btn-secondary w-full py-2.5 text-center" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/signup" className="btn-primary w-full py-2.5 text-center" onClick={() => setMobileMenuOpen(false)}>
                Start 90-Day Trial
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative z-10 flex-grow page-enter">
        <Outlet />
      </main>

      <footer className="relative z-10 mt-24 border-t border-ink-200/70 bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
                  SD
                </div>
                <span className="font-display text-lg font-bold text-ink-950">SecureDocShare</span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-ink-500">
                Next-generation zero-knowledge document encryption and email transmission for modern corporate enterprises. We never touch your plaintext data.
              </p>
              <p className="text-xs text-ink-400">
                &copy; {new Date().getFullYear()} SecureDocShare. All rights reserved.
              </p>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-700">Product</h4>
              <ul className="space-y-2.5 text-sm text-ink-500">
                <li><Link to="/#outlook" className="hover:text-accent transition-colors">Outlook Add-in</Link></li>
                <li><Link to="/#gmail" className="hover:text-accent transition-colors">Chrome Extension</Link></li>
                <li><Link to="/#sdk" className="hover:text-accent transition-colors">Enterprise SDK</Link></li>
                <li><Link to="/#admin" className="hover:text-accent transition-colors">Admin Console</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-700">Security</h4>
              <ul className="space-y-2.5 text-sm text-ink-500">
                <li><Link to="/security" className="hover:text-accent transition-colors">Zero-Custody Architecture</Link></li>
                <li><Link to="/security" className="hover:text-accent transition-colors">RSA-OAEP & AES-256</Link></li>
                <li><Link to="/security" className="hover:text-accent transition-colors">Compliance Matrix</Link></li>
                <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-ink-700">Solutions</h4>
              <ul className="space-y-2.5 text-sm text-ink-500">
                <li><Link to="/solutions" className="hover:text-accent transition-colors">Legal & Advisory</Link></li>
                <li><Link to="/solutions" className="hover:text-accent transition-colors">Accounting & Tax</Link></li>
                <li><Link to="/solutions" className="hover:text-accent transition-colors">Healthcare & HR</Link></li>
                <li><Link to="/solutions" className="hover:text-accent transition-colors">Resellers & MSPs</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
