/**
 * patch-convex-ws.cjs
 * --------------------
 * Workaround for the Freebuff/WebContainer (nodepod) runtime, which intercepts
 * `require("ws")` and returns a browser *facade object* (`{ WebSocket, default, ... }`)
 * instead of the real `WebSocket` constructor class.
 *
 * The Convex CLI bundle passes that object as `webSocketConstructor` to its sync
 * client, so `new this.webSocketConstructor(url)` throws
 *   TypeError: this.webSocketConstructor is not a constructor
 * which crashes the CLI during deploy-time snapshot exports
 *   ("Deployment failed: Exporting dev data failed").
 *
 * This script rewrites the two `webSocketConstructor:` assignments in the bundle
 * to prefer Node's native, always-constructible `globalThis.WebSocket` and fall
 * back to the original value everywhere else.
 *
 * It is idempotent and safe to run on every `npm install` via the `postinstall`
 * script. Requires Node >= 18 (the `??` operator).
 */
"use strict";

const fs = require("fs");
const path = require("path");

const BUNDLE = path.join(
  __dirname,
  "..",
  "node_modules",
  "convex",
  "dist",
  "cli.bundle.cjs",
);

const MARKER = "globalThis.WebSocket ??";
const REPLACEMENTS = [
  // original -> patched
  ["webSocketConstructor: import_ws.default", "webSocketConstructor: globalThis.WebSocket ?? import_ws.default"],
  ["webSocketConstructor: import_ws2.default", "webSocketConstructor: globalThis.WebSocket ?? import_ws2.default"],
];

function main() {
  if (!fs.existsSync(BUNDLE)) {
    console.log("[patch-convex-ws] bundle not found, skipping:", BUNDLE);
    process.exit(0);
  }

  let source;
  try {
    source = fs.readFileSync(BUNDLE, "utf8");
  } catch (err) {
    console.error("[patch-convex-ws] could not read bundle:", err.message);
    process.exit(1);
  }

  if (source.includes(MARKER)) {
    console.log("[patch-convex-ws] already patched, nothing to do.");
    process.exit(0);
  }

  let changed = 0;
  for (const [from, to] of REPLACEMENTS) {
    if (source.includes(from)) {
      source = source.split(from).join(to);
      changed += 1;
    }
  }

  if (changed === 0) {
    console.error(
      "[patch-convex-ws] WARNING: expected webSocketConstructor assignments were not found; " +
        "the convex package layout may have changed.",
    );
    process.exit(1);
  }

  try {
    fs.writeFileSync(BUNDLE, source, "utf8");
  } catch (err) {
    console.error("[patch-convex-ws] could not write bundle:", err.message);
    process.exit(1);
  }

  console.log(
    `[patch-convex-ws] patched ${changed} webSocketConstructor assignment(s) in ${BUNDLE}`,
  );
  process.exit(0);
}

main();
