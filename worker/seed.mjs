/**
 * Seeds the Worker's D1 table from the build snapshot (src/data/stats.json),
 * so the live API starts with complete data, including every CodeChef problem
 * rating, instead of rebuilding it over its first few refreshes.
 *
 *   node seed.mjs [--local]   (npm run seed / npm run seed:local)
 */
import {execFileSync} from "node:child_process";
import {readFileSync, rmSync, writeFileSync} from "node:fs";

const snapshot = JSON.parse(readFileSync(new URL("../src/data/stats.json", import.meta.url), "utf8"));
const sources = {...snapshot.platforms, github: snapshot.github};

const sqlString = (value) => `'${value.replace(/'/g, "''")}'`;
const statements = [
    `CREATE TABLE IF NOT EXISTS sources (name TEXT PRIMARY KEY, data TEXT, fetched_at INTEGER NOT NULL DEFAULT 0, checked_at INTEGER NOT NULL DEFAULT 0);`,
    ...Object.entries(sources)
        .filter(([, data]) => data)
        .map(([name, data]) => {
            const fetchedAt = Date.parse(data.fetchedAt ?? snapshot.generatedAt);
            // checked_at = fetched_at, so the first visit after seeding refreshes anything older than 5 minutes.
            return `INSERT OR REPLACE INTO sources (name, data, fetched_at, checked_at) VALUES (${sqlString(name)}, ${sqlString(JSON.stringify(data))}, ${fetchedAt}, ${fetchedAt});`;
        }),
];

const file = new URL("./.seed.sql", import.meta.url);
writeFileSync(file, statements.join("\n"));
try {
    const target = process.argv.includes("--local") ? "--local" : "--remote";
    execFileSync("npx", ["wrangler", "d1", "execute", "portfolio-stats", target, "--file", ".seed.sql"], {
        stdio: "inherit",
        cwd: new URL(".", import.meta.url),
    });
} finally {
    rmSync(file, {force: true});
}
