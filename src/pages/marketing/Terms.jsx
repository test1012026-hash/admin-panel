import { Link } from "react-router-dom";
export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="border-b border-ink-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Legal Agreement</span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-ink-950 tracking-tight">
          Terms and Conditions of Service
        </h1>
        <p className="mt-3 text-sm text-ink-500">
          Last Updated: September 1, 2026 &bull; Effective Immediately
        </p>
      </header>

      <div className="max-w-none text-ink-600 text-sm sm:text-base leading-relaxed space-y-8">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink-950">1. Acceptance of Terms</h2>
          <p>
            By accessing, installing, downloading, or using the SecureDocShare services, including our Microsoft Outlook Add-in, Google Chrome Extension, Admin Management Panel, and Developer SDK (collectively, the &ldquo;Services&rdquo;), you (&ldquo;User&rdquo; or &ldquo;Subscriber&rdquo;) agree to be legally bound by these Terms and Conditions (&ldquo;Terms&rdquo;). If you are entering into this agreement on behalf of a corporation, partnership, or other legal entity, you represent that you possess the authority to bind such entity.
          </p>
        </section>

        {/* Section 2 - Core Zero Knowledge Model */}
        <section className="space-y-3 card p-6 rounded-2xl border border-ink-200">
          <h2 className="text-xl font-bold text-accent">2. Non-Custodial &amp; Zero-Knowledge Architecture</h2>
          <p>
            SecureDocShare operates under a strict <strong>non-custodial, zero-knowledge cryptographic model</strong>:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-ink-600">
            <li>
              <strong>Client-Side Processing:</strong> All message payload plaintext and file attachment binaries (such as PDFs) are encrypted on the sender&apos;s local device prior to network transmission.
            </li>
            <li>
              <strong>No Plaintext Data Retention:</strong> SecureDocShare servers facilitate cryptographic key handshake and identity-based authorization checks only. We never store, inspect, or retain the unencrypted content of your communications or documents.
            </li>
            <li>
              <strong>No Custodial Recovery:</strong> Because SecureDocShare does not hold the private keys or plaintext data of its users, <strong>we cannot recover lost documents, decrypt lost packages, or reset private keys on behalf of users who lose their authentication factors</strong>.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink-950">3. User Authentication &amp; Identity Verification</h2>
          <p>
            Access to encrypted document keys is bound to verified user identities. Users may authenticate using Single Sign-On (SSO) through supported identity providers (Google, Microsoft, Yahoo) or via verified email and password with one-time verification codes (OTP). Users are responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-ink-600">
            <li>Maintaining the confidentiality of their login credentials and session tokens.</li>
            <li>Ensuring that the email address associated with their mail client matches their authorized SecureDocShare account identity.</li>
            <li>Promptly notifying their organization administrator of any suspected unauthorized access or compromised credentials.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink-950">4. Subscriptions, Trials, &amp; Billing Cycles</h2>
          <p>
            New accounts receive an initial <strong>90-day free trial period</strong> upon account claim or provisioning. During this trial period, users have full access to encryption and decryption features.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-ink-600">
            <li>
              <strong>Sending Rights:</strong> Upon expiration of a subscription or trial period, the ability to encrypt and dispatch new secure communications is suspended until the subscription is renewed or extended by an authorized administrator or reseller.
            </li>
            <li>
              <strong>Decryption Rights:</strong> Expired or blocked accounts retain the perpetual legal right to authenticate and decrypt previously received encrypted emails and documents addressed to their verified identity.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink-950">5. Acceptable Use Policy</h2>
          <p>You agree not to use the Services to:</p>
          <ul className="list-disc pl-5 space-y-2 text-ink-600">
            <li>Transmit malicious code, viruses, trojans, ransomware, or any harmful binary payloads.</li>
            <li>Engage in unlawful harassment, intellectual property infringement, or regulatory evasion.</li>
            <li>Attempt to reverse-engineer, decompile, or compromise the cryptographic authorization endpoints of the server.</li>
            <li>Impersonate any person or entity or misrepresent an affiliation with an unauthorized corporate domain.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink-950">6. Data Privacy &amp; Encryption at Rest</h2>
          <p>
            User profile metadata stored in our database (such as user email records) is encrypted at rest using AES-256-GCM, with deterministic HMAC hashing utilized solely for index querying. We do not harvest, monetize, or share user behavioral or network activity data.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink-950">7. Limitation of Liability &amp; Disclaimers</h2>
          <p className="text-xs uppercase tracking-wide text-ink-500">
            To the maximum extent permitted by applicable law:
          </p>
          <p>
            THE SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. SECUREDOCSHARE DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            IN NO EVENT SHALL SECUREDOCSHARE OR ITS AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, LOSS OF DATA, BUSINESS INTERRUPTION, OR SECURITY BREACHES ARISING FROM USER CREDENTIAL COMPROMISE.
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink-950">8. Modifications &amp; Termination</h2>
          <p>
            SecureDocShare reserves the right to modify these Terms at any time. Continued use of the Services following notice of updates constitutes binding acceptance. Organization administrators may terminate user accounts via the administrative console at their discretion.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-ink-950">9. Contact &amp; Governance</h2>
          <p>
            For legal inquiries, enterprise compliance documentation, or questions regarding these Terms, contact our compliance office at <span className="text-accent font-mono">legal@securedocs.share</span>.
          </p>
        </section>
      </div>
    </div>
  );
}