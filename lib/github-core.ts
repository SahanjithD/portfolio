// Pure GitHub helpers with no imports, so both the app (lib/github.ts) and
// the snapshot script (scripts/snapshot-github.mts) can use them.

export type Day = { date: string; count: number; level: number }

export type PullRequest = {
  title: string
  url: string
  repo: string
  state: "merged" | "open" | "closed"
  createdAt: string
  mergedAt: string | null
}

export type Week = {
  start: string
  end: string
  // Sunday first, like GitHub's calendar; null where the year starts or ends mid-week.
  days: (Day | null)[]
  total: number
  merged: PullRequest[]
}

export const contributionsUrl = (user: string) => `https://github.com/users/${user}/contributions`

export const pullRequestsUrl = (user: string) =>
  `https://api.github.com/search/issues?q=author:${user}+type:pr&sort=created&order=desc&per_page=100`

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1]

// The public contributions page renders one <td> per day plus a <tool-tip>
// holding its count ("8 contributions on October 19th.", "No contributions...").
export function parseContributions(html: string): Day[] {
  const counts = new Map<string, number>()
  for (const [, id, text] of html.matchAll(/<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    counts.set(id, Number.parseInt(text.replace(/,/g, ""), 10) || 0)
  }

  const days: Day[] = []
  for (const [tag] of html.matchAll(/<td[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = attr(tag, "data-date")
    const id = attr(tag, "id")
    if (!date || !id) continue
    days.push({ date, count: counts.get(id) ?? 0, level: Number(attr(tag, "data-level") ?? 0) })
  }
  return days.sort((a, b) => a.date.localeCompare(b.date))
}

type SearchItem = {
  title: string
  html_url: string
  repository_url: string
  state: "open" | "closed"
  created_at: string
  pull_request?: { merged_at: string | null }
}

export function parsePullRequests(json: { items?: SearchItem[] }): PullRequest[] {
  return (json.items ?? []).map((item) => {
    const mergedAt = item.pull_request?.merged_at ?? null
    return {
      title: item.title,
      url: item.html_url,
      repo: item.repository_url.split("/repos/")[1] ?? "",
      state: mergedAt ? "merged" : item.state,
      createdAt: item.created_at,
      mergedAt,
    }
  })
}

const DAY_MS = 86_400_000
const toTime = (date: string) => Date.parse(`${date}T00:00:00Z`)
const toDate = (time: number) => new Date(time).toISOString().slice(0, 10)

// Groups days into Sunday-first weeks and attaches the PRs merged in each.
export function toWeeks(days: Day[], pulls: PullRequest[]): Week[] {
  const weeks = new Map<string, Week>()
  for (const day of days) {
    const time = toTime(day.date)
    const start = toDate(time - new Date(time).getUTCDay() * DAY_MS)
    let week = weeks.get(start)
    if (!week) {
      week = { start, end: toDate(toTime(start) + 6 * DAY_MS), days: Array(7).fill(null), total: 0, merged: [] }
      weeks.set(start, week)
    }
    week.days[new Date(time).getUTCDay()] = day
    week.total += day.count
  }

  const list = [...weeks.values()].sort((a, b) => a.start.localeCompare(b.start))
  for (const pr of pulls) {
    if (!pr.mergedAt) continue
    const merged = pr.mergedAt.slice(0, 10)
    list.find((w) => w.start <= merged && merged <= w.end)?.merged.push(pr)
  }
  return list
}
