import type { Week } from "@/lib/github-core"

// The compact shape the skyline needs, small enough to pass to the client.
export type SkylineWeek = {
  start: string
  end: string
  // Sunday first; -1 where the calendar starts or ends mid-week.
  counts: number[]
  levels: number[]
  total: number
  merged: { title: string; url: string; repo: string }[]
}

export const DAYS = 7

const shortRepo = (repo: string) => repo.replace(/^.*\/(module-ballerinax-)?/, "")

export function toSkyline(weeks: Week[]): SkylineWeek[] {
  return weeks.map((w) => ({
    start: w.start,
    end: w.end,
    counts: w.days.map((d) => (d ? d.count : -1)),
    levels: w.days.map((d) => (d ? d.level : 0)),
    total: w.total,
    merged: w.merged.map((pr) => ({ title: pr.title, url: pr.url, repo: shortRepo(pr.repo) })),
  }))
}

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
const day = (date: string) => fmt.format(new Date(`${date}T00:00:00Z`))

export const weekRange = (w: SkylineWeek) => `${day(w.start)} to ${day(w.end)}`

export const countLabel = (n: number) =>
  n === 0 ? "No contributions this week." : `${n} contribution${n === 1 ? "" : "s"}`

// Square-root scale keeps one busy day from flattening the rest of the year.
export function towerHeight(count: number, max: number) {
  if (count < 0) return 0
  if (count === 0) return 0.08
  return 0.35 + 5.4 * Math.sqrt(count / Math.max(max, 1))
}

export const maxCount = (weeks: SkylineWeek[]) => Math.max(1, ...weeks.flatMap((w) => w.counts))

// Weeks where a new month begins, for the axis labels.
export function monthTicks(weeks: SkylineWeek[]) {
  const label = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" })
  return weeks.flatMap((w, i) => {
    const date = new Date(`${w.start}T00:00:00Z`)
    const prev = i > 0 ? new Date(`${weeks[i - 1].start}T00:00:00Z`) : null
    return prev && prev.getUTCMonth() !== date.getUTCMonth() ? [{ index: i, label: label.format(date) }] : []
  })
}

// Mixes the signal colour into the rule colour by contribution level.
export const LEVEL_MIX = [0, 0.38, 0.6, 0.8, 1]
