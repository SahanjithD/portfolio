// Refreshes lib/data/github-snapshot.json, the fallback used when GitHub
// can't be reached at build time. Run with `npm run snapshot`.
import { writeFile } from "node:fs/promises"
import { contributionsUrl, parseContributions, parsePullRequests, pullRequestsUrl } from "../lib/github-core.ts"

const user = "SahanjithD"
const token = process.env.GITHUB_TOKEN

const html = await fetch(contributionsUrl(user)).then((r) => r.text())
const json = await fetch(pullRequestsUrl(user), {
  headers: { Accept: "application/vnd.github+json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
}).then((r) => r.json())

const days = parseContributions(html)
const pulls = parsePullRequests(json)
if (!days.length) throw new Error("No contribution days parsed; GitHub's markup may have changed.")

const out = new URL("../lib/data/github-snapshot.json", import.meta.url)
await writeFile(out, JSON.stringify({ fetchedAt: new Date().toISOString(), days, pulls }, null, 2) + "\n")
console.log(`Saved ${days.length} days and ${pulls.length} pull requests.`)
