// Prettier check via Node API — the prettier CLI bin crashes in this
// runtime's node-exec shim ("__asyncLoad is not defined").
const fs = require("fs");
const files = [
  "src/pages/Privacy.tsx",
  "src/pages/Terms.tsx",
  "src/main.tsx",
  "src/components/footer.tsx",
  "src/pages/Landing.tsx",
  "src/pages/Calculator.tsx",
];

import("prettier")
  .then(async (p) => {
    let bad = 0;
    for (const f of files) {
      const src = fs.readFileSync(f, "utf8");
      const opts = (await p.resolveConfig(f)) || {};
      const out = await p.format(src, { ...opts, filepath: f });
      if (out !== src) {
        console.log("UNFORMATTED", f);
        bad++;
      } else {
        console.log("OK", f);
      }
    }
    console.log(
      bad ? `${bad} file(s) differ from prettier format` : "ALL 6 FILES FORMATTED",
    );
    process.exitCode = bad ? 1 : 0;
  })
  .catch((e) => {
    console.log("PRETTIER_ERR", e.message);
    process.exitCode = 2;
  });
