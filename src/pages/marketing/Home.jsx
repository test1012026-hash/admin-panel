import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-28 sm:space-y-36">
      {/* 1. HERO SECTION */}
      <section className="pt-16 sm:pt-24 pb-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent-soft text-accent text-xs font-semibold uppercase tracking-wider mb-8">
          <span className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
          Enterprise Zero-Trust Document Protection
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink-950 max-w-4xl mx-auto leading-[1.12]">
          Secure Corporate Email & PDFs. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-400 bg-clip-text text-transparent">
            Without Third-Party Portals.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-ink-600 max-w-2xl mx-auto leading-relaxed">
          Encrypt confidential client contracts, invoices, and sensitive communications directly inside Outlook and Gmail. Zero vendor custody. Seamless recipient decryption.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#trial"
            className="btn-primary w-full sm:w-auto px-8 py-4 text-base"
          >
            Start 90-Day Enterprise Trial
          </a>
          <Link
            to="/security"
            className="btn-secondary w-full sm:w-auto px-8 py-4 text-base"
          >
            How the Cryptography Works &rarr;
          </Link>
        </div>

        {/* Integration Badges */}
        <div className="mt-16 pt-8 border-t border-ink-200 grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center opacity-75">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <span className="text-accent text-lg">&#10003;</span> Microsoft 365 / Outlook
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <span className="text-accent text-lg">&#10003;</span> Google Workspace / Gmail
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <span className="text-accent text-lg">&#10003;</span> Single Sign-On (SSO)
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-ink-500">
            <span className="text-accent text-lg">&#10003;</span> Turnkey Node.js SDK
          </div>
        </div>
      </section>

      {/* 2. THE THREAT LANDSCAPE (WHY SMBs MUST UPGRADE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">The Critical Problem</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-ink-950 tracking-tight">
            Why Legacy "Secure Email" Fails Modern Teams
          </h3>
          <p className="mt-4 text-ink-500 text-base leading-relaxed">
            Small and mid-sized enterprises handle the same high-stakes data as global conglomerates, but legacy security appliances introduce friction that employees and clients actively bypass.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-8 shadow-panel hover:border-ink-300 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-xl font-bold mb-6">
              !
            </div>
            <h4 className="text-xl font-bold text-ink-950 mb-3">The Portal Drop-off Trap</h4>
            <p className="text-ink-500 text-sm leading-relaxed">
              Forcing recipients to register external accounts and log into separate web portals creates friction. Frustrated clients ask for unencrypted versions, defeating your security policy.
            </p>
          </div>

          <div className="card p-8 shadow-panel hover:border-ink-300 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl font-bold mb-6">
              &#9888;
            </div>
            <h4 className="text-xl font-bold text-ink-950 mb-3">Cloud Storage Honeypots</h4>
            <p className="text-ink-500 text-sm leading-relaxed">
              Traditional SaaS security tools stage plaintext files in centralized cloud repositories. If the vendor suffers an intrusion, your corporate data is exposed in bulk.
            </p>
          </div>

          <div className="card p-8 shadow-panel hover:border-ink-300 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xl font-bold mb-6">
              &sect;
            </div>
            <h4 className="text-xl font-bold text-ink-950 mb-3">Escalating Regulatory Fines</h4>
            <p className="text-ink-500 text-sm leading-relaxed">
              GDPR, HIPAA, and corporate data privacy statutes mandate encryption for personal identifiers and financial records. Inadvertent email leaks trigger severe statutory liability.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE ARCHITECTURE & VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card border-accent/30 bg-accent-soft/20 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <span className="px-3 py-1 rounded-md bg-accent-soft text-accent font-semibold text-xs uppercase tracking-wider">
              Zero-Custody Cryptographic Principle
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-ink-950 leading-tight">
              "We Do Not Have Your Encrypted Data. <br className="hidden sm:inline" />
              We Just Provide the Keys."
            </h2>
            <p className="text-ink-600 text-base sm:text-lg leading-relaxed">
              SecureDocShare mathematically decouples key delivery from content storage. Your messages and PDF attachments are encrypted client-side using industry-standard **AES-256-GCM** and asymmetric **2048-bit RSA-OAEP** key wrapping.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold text-base">&#10003;</span>
                <p className="text-sm text-ink-600"><strong className="text-ink-950">Unclaimed Recipient Provisioning:</strong> Send to any email address instantly; keys are provisioned before recipient signup.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent font-bold text-base">&#10003;</span>
                <p className="text-sm text-ink-600"><strong className="text-ink-950">Identity-Locked Decryption:</strong> Keys unlock exclusively when verified by Google, Microsoft, Yahoo, or OTP authentication.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MULTI-PLATFORM ECOSYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Native Workspace Integration</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-ink-950 tracking-tight">
            Integrated Directly Into Everyday Tools
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Outlook Box */}
          <div id="outlook" className="card p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                OL
              </div>
              <h4 className="text-xl font-bold text-ink-950">Microsoft Outlook Add-in</h4>
            </div>
            <p className="text-ink-500 text-sm leading-relaxed">
              Features native <code className="text-accent">OnMessageSend</code> and <code className="text-accent">OnMessageDecrypt</code> event integration. Automatically packages messages and attachments into protected <code className="text-ink-700">.securepdf</code> files upon clicking Send.
            </p>
            <ul className="text-sm text-ink-600 space-y-2 pt-2">
              <li className="flex items-center gap-2">&bull; Manifest-based Outlook sideloading</li>
              <li className="flex items-center gap-2">&bull; Decrypts directly in the Outlook reading pane</li>
              <li className="flex items-center gap-2">&bull; Task pane fallback with complete key visibility</li>
            </ul>
          </div>

          {/* Chrome & Gmail Box */}
          <div id="gmail" className="card p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                GM
              </div>
              <h4 className="text-xl font-bold text-ink-950">Google Chrome & Gmail Extension</h4>
            </div>
            <p className="text-ink-500 text-sm leading-relaxed">
              A lightweight browser extension with rich-text composing, Google People API contact autocompletion, and in-place email thread decryption directly inside <code className="text-accent">mail.google.com</code>.
            </p>
            <ul className="text-sm text-ink-600 space-y-2 pt-2">
              <li className="flex items-center gap-2">&bull; Rich text styling & PDF attachment protection</li>
              <li className="flex items-center gap-2">&bull; Automatic background ciphertext replacement in Gmail</li>
              <li className="flex items-center gap-2">&bull; One-click Gmail API media uploads</li>
            </ul>
          </div>

          {/* Admin Console */}
          <div id="admin" className="card p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-teal-500/20 text-accent flex items-center justify-center font-bold">
                AD
              </div>
              <h4 className="text-xl font-bold text-ink-950">Multi-Tier Admin & Reseller Console</h4>
            </div>
            <p className="text-ink-500 text-sm leading-relaxed">
              Granular Role-Based Access Control (Super Admin &rarr; Reseller &rarr; Group Admin &rarr; Subscriber). Manage teams, invitations, subscription expirations, and immutable audit logs.
            </p>
            <ul className="text-sm text-ink-600 space-y-2 pt-2">
              <li className="flex items-center gap-2">&bull; Track user quotas & 90-day subscription renewals</li>
              <li className="flex items-center gap-2">&bull; Audit logging for compliance and access oversight</li>
              <li className="flex items-center gap-2">&bull; Block/Unblock capabilities with preserved read rights</li>
            </ul>
          </div>

          {/* Developer SDK */}
          <div id="sdk" className="card p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                API
              </div>
              <h4 className="text-xl font-bold text-ink-950">Enterprise Node.js SDK (`sendSecureMail`)</h4>
            </div>
            <p className="text-ink-500 text-sm leading-relaxed">
              Connect automated back-office systems, CRM triggers, and billing pipelines to check subscriber validity, encrypt invoices, and dispatch confidential mail automatically.
            </p>
            <ul className="text-sm text-ink-600 space-y-2 pt-2">
              <li className="flex items-center gap-2">&bull; REST endpoints for public and authenticated encryption</li>
              <li className="flex items-center gap-2">&bull; Plug-and-play script integration for ERP systems</li>
              <li className="flex items-center gap-2">&bull; Zero reliance on external binary storage</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. COMPARISON TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Market Comparison</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-ink-950 tracking-tight">
            How SecureDocShare Compares
          </h3>
        </div>

        <div className="table-wrap card overflow-x-auto shadow-panel">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-ink-200 bg-ink-50 text-xs font-semibold uppercase tracking-wider text-ink-500">
              <tr>
                <th className="py-4 px-6">Feature</th>
                <th className="py-4 px-6 text-ink-500">Standard Email</th>
                <th className="py-4 px-6 text-ink-500">Portal Solutions</th>
                <th className="py-4 px-6 text-accent font-bold bg-accent-soft/50">SecureDocShare</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              <tr>
                <td className="py-4 px-6 font-medium text-ink-950">Recipient Decryption</td>
                <td className="py-4 px-6 text-ink-500">Plaintext (Insecure)</td>
                <td className="py-4 px-6 text-ink-500">Password / Web Portal Login</td>
                <td className="py-4 px-6 text-accent font-semibold bg-accent-soft/50">Inline within Outlook & Gmail</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-ink-950">Vendor Data Custody</td>
                <td className="py-4 px-6 text-ink-500">Host Scans Content</td>
                <td className="py-4 px-6 text-ink-500">Plaintext Stored in Cloud DB</td>
                <td className="py-4 px-6 text-accent font-semibold bg-accent-soft/50">Zero Custody (Client-Side Encrypted)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-ink-950">Attachment Packaging</td>
                <td className="py-4 px-6 text-ink-500">Unencrypted Bytes</td>
                <td className="py-4 px-6 text-ink-500">Expiring Cloud Links</td>
                <td className="py-4 px-6 text-accent font-semibold bg-accent-soft/50">Self-Contained .securepdf Packages</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-ink-950">Unregistered Recipients</td>
                <td className="py-4 px-6 text-ink-500">N/A</td>
                <td className="py-4 px-6 text-ink-500">Blocked / Forced Registration</td>
                <td className="py-4 px-6 text-accent font-semibold bg-accent-soft/50">Auto-Provisioned Public Keys</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-medium text-ink-950">Enterprise Audit Logs</td>
                <td className="py-4 px-6 text-ink-500">None</td>
                <td className="py-4 px-6 text-ink-500">Expensive Add-On Tier</td>
                <td className="py-4 px-6 text-accent font-semibold bg-accent-soft/50">Built-in RBAC Audit Activity Log</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. TRIAL & CONVERSION CALL TO ACTION */}
      <section id="trial" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="card border-accent/30 bg-accent-soft/30 p-10 sm:p-16 space-y-6 shadow-lift">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-ink-950 tracking-tight">
            Protect Corporate Communications Today
          </h2>
          <p className="text-ink-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Every new claimed account automatically starts with an unrestricted **90-Day Enterprise Trial**. Deploy the add-in and protect your client relationships in under 5 minutes.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/signup"
              className="btn-primary px-8 py-4 text-base"
            >
              Claim 90-Day Free Trial
            </a>
            <Link
              to="/terms"
              className="px-6 py-4 rounded-xl text-sm font-medium text-ink-500 hover:text-ink-950 transition-colors"
            >
              Read Terms & Conditions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}