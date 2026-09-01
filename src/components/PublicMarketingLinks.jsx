import { Link } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Overview" },
  { to: "/solutions", label: "Solutions" },
  { to: "/security", label: "Security" },
  { to: "/pricing", label: "Pricing" },
  { to: "/terms", label: "Terms" },
];

export default function PublicMarketingLinks() {
  return (
    <nav className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-ink-500">
      {LINKS.map((item, index) => (
        <span key={item.to} className="inline-flex items-center gap-4">
          {index > 0 ? <span className="hidden text-ink-300 sm:inline">·</span> : null}
          <Link to={item.to} className="font-medium hover:text-accent hover:underline">
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
