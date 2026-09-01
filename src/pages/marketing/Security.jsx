import { Link } from "react-router-dom";

export default function Security() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <header className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-md bg-accent-soft text-accent font-semibold text-xs uppercase tracking-wider">
          Cryptographic Specifications
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-ink-950 tracking-tight">
          Zero-Knowledge Security Architecture
        </h1>
        <p className="text-ink-500 text-base sm:text-lg">
          A transparent review of the client-side cryptographic pipeline protecting your corporate messages and attachments.
        </p>
      </header>

      {/* 3 Step Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 space-y-3">
          <div className="text-accent font-mono text-xs font-bold">STAGE 01</div>
          <h3 className="text-lg font-bold text-ink-950">Client-Side Symmetric Encryption</h3>
          <p className="text-ink-500 text-sm leading-relaxed">
            Message text and raw PDF binaries are encrypted locally using authenticated <strong>AES-256-GCM</strong> with a random 96-bit Initialization Vector (IV) generated per document.
          </p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="text-accent font-mono text-xs font-bold">STAGE 02</div>
          <h3 className="text-lg font-bold text-ink-950">Asymmetric RSA Key Wrapping</h3>
          <p className="text-ink-500 text-sm leading-relaxed">
            The symmetric AES key is encrypted via <strong>2048-bit RSA-OAEP</strong> with SHA-256 using the recipient&apos;s public key. The server never observes the raw symmetric key.
          </p>
        </div>

        <div className="card p-6 space-y-3">
          <div className="text-accent font-mono text-xs font-bold">STAGE 03</div>
          <h3 className="text-lg font-bold text-ink-950">Identity-Verified Decryption</h3>
          <p className="text-ink-500 text-sm leading-relaxed">
            The recipient authenticates through Microsoft 365, Google, or Yahoo SSO. Once identity is confirmed, their wrapped private key is unlocked to decrypt the document.
          </p>
        </div>
      </div>

      {/* Database Security Table */}
      <div className="card p-8 space-y-6">
        <h2 className="text-2xl font-bold text-ink-950">Data at Rest &amp; Database Security</h2>
        <p className="text-ink-500 text-sm leading-relaxed">
          Unlike legacy platforms that store plaintext email strings and unencrypted metadata, SecureDocShare implements field-level cryptographic controls across all database models:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-ink-50 border border-ink-200">
            <h4 className="font-bold text-ink-950 mb-1">Encrypted Email Fields</h4>
            <p className="text-ink-500 text-xs">Emails are stored as AES-256-GCM ciphertexts with dynamic IVs, preventing database harvesting in the event of an intrusion.</p>
          </div>
          <div className="p-4 rounded-xl bg-ink-50 border border-ink-200">
            <h4 className="font-bold text-ink-950 mb-1">Deterministic HMAC Indexing</h4>
            <p className="text-ink-500 text-xs">Indexed user lookups utilize HMAC-SHA-256 hashes generated with isolated key material, enabling fast queries without plaintext storage.</p>
          </div>
        </div>
      </div>
    </div>
  );
}