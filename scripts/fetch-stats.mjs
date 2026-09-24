#!/usr/bin/env node
/**
 * Refreshes src/data/stats.json, the snapshot baked into the site.
 *
 * Runs before every production build (see .github/workflows/deploy.yml). This
 * snapshot is what visitors see first; the stats Worker (worker/) then brings
 * it up to date, and it's what the site falls back to if the Worker is
 * unreachable. The fetching itself lives in sources.mjs, shared with the Worker.
 *
 * Usage: node scripts/fetch-stats.mjs
 */
import {mkdir, readFile, writeFile} from "node:fs/promises";
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";
import {collectStats} from "./sources.mjs";

const OUT_FILE = fileURLToPath(new URL("../src/data/stats.json", import.meta.url));

async function main() {
    let previous = {};
    try {
        previous = JSON.parse(await readFile(OUT_FILE, "utf8"));
    } catch {
        // First run: nothing to fall back to.
    }

    const stats = await collectStats(previous, {githubToken: process.env.GITHUB_TOKEN, log: console.log});

    await mkdir(dirname(OUT_FILE), {recursive: true});
    await writeFile(OUT_FILE, `${JSON.stringify(stats, null, 2)}\n`);
    console.log(`→ wrote ${OUT_FILE}`);
}

main().catch((error) => {
    // Never fail the build over stats; the committed snapshot is still valid.
    console.error(error);
});
