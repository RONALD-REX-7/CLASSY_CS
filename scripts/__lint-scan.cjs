// Temporary audit script — runs ESLint programmatically (CLI formatter is broken in this sandbox).
const { ESLint } = require("eslint");

(async () => {
  const eslint = new ESLint({ cwd: process.cwd() });
  const results = await eslint.lintFiles([
    "src/**/*.{ts,tsx}",
    "*.{js,cjs,mjs,ts}",
    "scripts/**/*.cjs",
  ]);
  let errors = 0;
  let warnings = 0;
  const lines = [];
  for (const r of results) {
    for (const m of r.messages) {
      if (m.severity === 2) errors++;
      else warnings++;
      lines.push(
        `${m.severity === 2 ? "ERR " : "WARN"} ${r.filePath} ${m.line}:${m.column} [${m.ruleId}] ${m.message}`
      );
    }
  }
  console.log(`TOTAL errors=${errors} warnings=${warnings}`);
  console.log(lines.join("\n"));
})().catch((e) => {
  console.error("FATAL", e && e.message ? e.message : e);
  process.exit(1);
});
