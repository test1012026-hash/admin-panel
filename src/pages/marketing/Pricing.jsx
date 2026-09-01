import { Link } from "react-router-dom";

export default function Pricing() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <header className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Flexible Deployment</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 tracking-tight">
          Simple, Predictable Pricing
        </h1>
        <p className="text-ink-500 text-base sm:text-lg">
          Start with an unrestricted 90-day free trial. Scale with your organization.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Trial Card */}
        <div className="rounded-3xl border border-ink-200 card p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-ink-950">90-Day Enterprise Trial</h3>
            <p className="text-ink-500 text-sm">Full feature access for testing across your corporate team.</p>
            <div className="text-4xl font-extrabold text-ink-950">$0 <span className="text-base font-normal text-ink-400">/ 90 days</span></div>
            <ul className="text-sm text-ink-600 space-y-2.5 pt-4 border-t border-ink-200">
              <li className="flex items-center gap-2">&#10003; Full Outlook &amp; Gmail Add-ins</li>
              <li className="flex items-center gap-2">&#10003; Unlimited Inbound Decryption</li>
              <li className="flex items-center gap-2">&#10003; Admin Console &amp; Audit Logs</li>
              <li className="flex items-center gap-2">&#10003; PDF &amp; Message Encryption</li>
            </ul>
          </div>
          <Link to="/signup" className="btn-secondary w-full py-3 text-center text-sm">
            Start Free Trial
          </Link>
        </div>

        {/* Corporate License */}
        <div className="card border-accent/40 bg-accent-soft/30 p-8 space-y-6 flex flex-col justify-between shadow-lift relative">
          <div className="space-y-4">
            <span className="px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold uppercase tracking-wider">
              Most Popular for Teams
            </span>
            <h3 className="text-xl font-bold text-ink-950">Corporate Seat License</h3>
            <p className="text-ink-500 text-sm">Billed quarterly in 90-day renewable intervals per seat.</p>
            <div className="text-4xl font-extrabold text-ink-950">Custom <span className="text-base font-normal text-ink-500">/ seat</span></div>
            <ul className="text-sm text-ink-600 space-y-2.5 pt-4 border-t border-ink-200">
              <li className="flex items-center gap-2">&#10003; Dedicated Group Administrator Portal</li>
              <li className="flex items-center gap-2">&#10003; Reseller / MSP Multi-Tenant Management</li>
              <li className="flex items-center gap-2">&#10003; Turnkey Developer SDK for ERPs</li>
              <li className="flex items-center gap-2">&#10003; Priority Security Support &amp; SLA</li>
            </ul>
          </div>
          <Link to="/login" className="btn-primary w-full py-3 text-center text-sm">
            Contact Sales / MSP Portal
          </Link>
        </div>
      </div>
    </div>
  );
}