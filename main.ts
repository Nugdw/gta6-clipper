// Entry program for make.fun's gta6-clipper-01 bounty (Node 22, standard
// library only). The entry itself is a public YouTube clip; this program's
// whole job is to hand its address to the gate: it copies VIDEO.json from
// the repository root into the output directory, byte for byte, and stays
// silent on success. No network, no clock, no files outside the repo, so
// every run writes the same bytes.

import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";

function main(): void {
  const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const source = join(botDir, "VIDEO.json");
  const target = join(outputDir, "VIDEO.json");

  mkdirSync(outputDir, { recursive: true });

  try {
    copyFileSync(source, target);
    // Read both sizes back: a short copy must fail loudly, never hand the
    // gate a truncated address file.
    if (statSync(source).size !== statSync(target).size) {
      console.error(`VIDEO.json copy is incomplete: ${source} -> ${target}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(
      `could not copy VIDEO.json from ${botDir}: ${(err as Error).message}`,
    );
    process.exit(1);
  }
}

main();
