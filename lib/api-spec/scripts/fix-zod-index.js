// Orval's zod generator unconditionally appends `export * from './generated/api'`
// and `export * from './generated/types'` to lib/api-zod/src/index.ts on every
// run. Those two barrel re-exports collide with the explicit named re-exports
// we maintain by hand in that file (a handful of operations produce a zod
// schema value and a TS type of the identical name from different generated
// files, which `export *` can't merge — see the comments in index.ts).
// Run this after every `orval` invocation to strip the appended lines back out.
const fs = require("node:fs");
const path = require("node:path");

const indexPath = path.resolve(__dirname, "..", "..", "api-zod", "src", "index.ts");
const contents = fs.readFileSync(indexPath, "utf8");

const cleaned = contents
  .split("\n")
  .filter((line) => {
    const trimmed = line.trim();
    return (
      trimmed !== "export * from './generated/api';" &&
      trimmed !== "export * from './generated/types';"
    );
  })
  .join("\n");

if (cleaned !== contents) {
  fs.writeFileSync(indexPath, cleaned);
  console.log("[fix-zod-index] Stripped orval's auto-appended barrel exports from lib/api-zod/src/index.ts");
} else {
  console.log("[fix-zod-index] No auto-appended barrel exports found; nothing to strip.");
}
