import { cache } from "react"
import snapshot from "@/lib/data/github-snapshot.json"
import {
  contributionsUrl,
  parseContributions,
  parsePullRequests,
  pullRequestsUrl,
  toWeeks,
  type Day,
  type PullRequest,
} from "@/lib/github-core"
import { profile } from "@/lib/content"

// Refreshed at most once a day; the committed snapshot covers outages,
// rate limits and offline builds (GITHUB_OFFLINE=1).
const REVALIDATE = 86_400
const offline = process.env.GITHUB_OFFLINE === "1"

async function getContributions(): Promise<Day[]> {
  if (offline) return snapshot.days
  try {
    const res = await fetch(contributionsUrl(profile.githubUser), { next: { revalidate: REVALIDATE } })
    if (!res.ok) throw new Error(`contributions: ${res.status}`)
    const days = parseContributions(await res.text())
    return days.length ? days : snapshot.days
  } catch {
    return snapshot.days
  }
}

async function getPullRequests(): Promise<PullRequest[]> {
  if (offline) return snapshot.pulls as PullRequest[]
  const token = process.env.GITHUB_TOKEN
  try {
    const res = await fetch(pullRequestsUrl(profile.githubUser), {
      headers: {
        Accept: "application/vnd.github+json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) throw new Error(`pull requests: ${res.status}`)
    return parsePullRequests(await res.json())
  } catch {
    return snapshot.pulls as PullRequest[]
  }
}

// Cached per request so the hero and the work section share one fetch and parse.
export const getGitHubActivity = cache(async () => {
  const [days, pulls] = await Promise.all([getContributions(), getPullRequests()])
  return {
    weeks: toWeeks(days, pulls),
    total: days.reduce((sum, d) => sum + d.count, 0),
    pulls,
  }
})

export type { Day, PullRequest, Week } from "@/lib/github-core"
