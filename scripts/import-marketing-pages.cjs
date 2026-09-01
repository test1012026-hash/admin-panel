const fs = require("fs");
const path = require("path");

const srcDir = path.join(__dirname, "../../website");
const destDir = path.join(__dirname, "../src/pages/marketing");
fs.mkdirSync(destDir, { recursive: true });

const files = {
  "Home.js": "Home.jsx",
  "Terms.js": "Terms.jsx",
  "Security.js": "Security.jsx",
  "Solutions.js": "Solutions.jsx",
  "Pricing.js": "Pricing.jsx",
};

const replacements = [
  [/^import React from "react";\n/m, ""],
  [/href="https:\/\/admin-panel-amber-nine\.vercel\.app\/signup"/g, 'href="/signup"'],
  [/href="https:\/\/admin-panel-amber-nine\.vercel\.app\/login"/g, 'href="/login"'],
  [/target="_blank"\s*rel="noopener noreferrer"\s*/g, ""],
  [/rounded-2xl border border-slate-800 bg-slate-900\/60/g, "card"],
  [
    /rounded-3xl border border-teal-500\/30 bg-gradient-to-br from-teal-900\/30 via-slate-900 to-\[#0b1220\]/g,
    "card border-accent/30 bg-accent-soft/30",
  ],
  [
    /rounded-3xl border border-teal-500\/30 bg-gradient-to-br from-slate-900 via-\[#101e2e\] to-\[#0d222e\]/g,
    "card border-accent/30 bg-accent-soft/20",
  ],
  [
    /overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900\/70/g,
    "table-wrap card overflow-x-auto",
  ],
  [/text-teal-300 font-bold bg-teal-950\/30/g, "text-accent font-bold bg-accent-soft/50"],
  [/text-teal-300 font-semibold bg-teal-950\/30/g, "text-accent font-semibold bg-accent-soft/50"],
  [
    /border-teal-500\/30 bg-teal-500\/10 text-teal-300/g,
    "border-accent/30 bg-accent-soft text-accent",
  ],
  [/bg-teal-500\/20 text-teal-300/g, "bg-accent-soft text-accent"],
  [/text-teal-400/g, "text-accent"],
  [/text-teal-300/g, "text-accent"],
  [/hover:text-teal-300/g, "hover:text-accent"],
  [/text-slate-200/g, "text-ink-700"],
  [/text-slate-300/g, "text-ink-600"],
  [/text-slate-400/g, "text-ink-500"],
  [/text-slate-500/g, "text-ink-400"],
  [/text-white/g, "text-ink-950"],
  [/border-slate-800\/80/g, "border-ink-200"],
  [/border-slate-800/g, "border-ink-200"],
  [/border-slate-700/g, "border-ink-300"],
  [/divide-slate-800/g, "divide-ink-100"],
  [/bg-slate-950\/80/g, "bg-ink-50"],
  [/bg-slate-900\/60/g, "card"],
  [/hover:border-slate-700/g, "hover:border-accent/35"],
  [/hover:bg-slate-800/g, "hover:bg-ink-50"],
  [/hover:text-white/g, "hover:text-ink-950"],
  [/bg-slate-950\/60/g, "bg-ink-50"],
  [
    /w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 shadow-xl shadow-teal-500\/25 transition-all duration-200 transform hover:-translate-y-0.5/g,
    "btn-primary w-full sm:w-auto px-8 py-4 text-base",
  ],
  [
    /w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold text-slate-200 border border-slate-700 bg-slate-900\/60 hover:bg-slate-800 hover:border-slate-600 transition-all duration-200/g,
    "btn-secondary w-full sm:w-auto px-8 py-4 text-base",
  ],
  [
    /px-8 py-4 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 shadow-xl shadow-teal-500\/30 transition-all duration-200/g,
    "btn-primary px-8 py-4 text-base",
  ],
  [
    /w-full text-center py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors/g,
    "btn-secondary w-full py-3 text-center text-sm",
  ],
  [
    /w-full text-center py-3 rounded-xl bg-gradient-to-r from-teal-400 to-teal-500 text-slate-950 font-bold text-sm shadow-md hover:from-teal-300 hover:to-teal-400 transition-all/g,
    "btn-primary w-full py-3 text-center text-sm",
  ],
  [
    /px-6 py-4 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors/g,
    "btn-secondary px-6 py-4 text-sm",
  ],
  [/prose prose-invert max-w-none/g, "max-w-none"],
];

for (const [srcName, destName] of Object.entries(files)) {
  let content = fs.readFileSync(path.join(srcDir, srcName), "utf8");
  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }
  if (!content.includes('import { Link }')) {
    content = 'import { Link } from "react-router-dom";\n' + content.trimStart();
  }
  fs.writeFileSync(path.join(destDir, destName), content);
  console.log("Wrote", destName);
}
