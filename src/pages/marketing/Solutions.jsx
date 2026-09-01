import { Link } from "react-router-dom";
export default function Solutions() {
  const cases = [
    {
      title: "Legal & Corporate Advisory",
      desc: "Distribute executed contracts, merger documents, and privileged litigation strategy directly through Outlook without sending unencrypted attachments.",
      badge: "Attorney-Client Privilege",
    },
    {
      title: "Accounting, Tax & Audit",
      desc: "Transmit confidential financial statements, tax filings, and bank account wiring instructions with recipient identity verification built-in.",
      badge: "Financial Privacy",
    },
    {
      title: "Healthcare & Life Sciences",
      desc: "Deliver patient diagnostics, treatment notes, and insurance evaluations while meeting strict zero-custody regulatory standards.",
      badge: "HIPAA & Health Data",
    },
    {
      title: "Managed Service Providers & Resellers",
      desc: "Manage multiple client organizations under one reseller umbrella with delegated Group Admin portals and turnkey seat management.",
      badge: "Multi-Tenant Scalability",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Tailored Protection</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 tracking-tight">
          Solutions for High-Consequence Sectors
        </h1>
        <p className="text-ink-500 text-base sm:text-lg">
          Protecting critical business workflows across small and mid-market organizations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {cases.map((c, i) => (
          <div key={i} className="card p-8 space-y-4">
            <span className="px-3 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-accent font-semibold text-xs">
              {c.badge}
            </span>
            <h3 className="text-2xl font-bold text-ink-950">{c.title}</h3>
            <p className="text-ink-500 text-sm leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}