import { ArrowUpRight } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { alsoShipped, experience, ragStages, type RagPackage } from "@/lib/content"
import { getGitHubActivity, type PullRequest } from "@/lib/github"
import { cn } from "@/lib/utils"

// Status comes from the live PR list, never hardcoded. Counts stay out of
// the badges because one package can serve several stages.
function status(pkg: RagPackage, pulls: PullRequest[]) {
  const mine = pulls.filter((p) => pkg.repo.endsWith(p.repo))
  if (mine.some((p) => p.state === "merged")) return { text: "Merged", review: false }
  if (mine.some((p) => p.state === "open")) return { text: "In review", review: true }
  return null
}

export async function Work() {
  const { pulls } = await getGitHubActivity()
  const merged = pulls.filter((p) => p.state === "merged" && /^(ballerina-platform|wso2)\//.test(p.repo)).length

  return (
    <section aria-labelledby="work" className="shell py-20">
      <SectionHeading id="work" title="Work">
        {experience.intro}
      </SectionHeading>

      <p className="flex flex-wrap items-baseline gap-x-3 border-t border-rule pt-6 text-sm text-graphite">
        <span className="font-semibold text-ink">
          {experience.role}, {experience.org}
        </span>
        <span>{experience.team} team, June 2026 to present</span>
      </p>

      {/* A cable runs through every stage: down the left on small screens,
          across the top on large ones. Filled nodes are the stages I built. */}
      <ol
        aria-label="RAG pipeline"
        className="relative mt-10 grid gap-10 pl-8 before:absolute before:bottom-2 before:left-[7px] before:top-2 before:w-0.5 before:bg-rule lg:grid-cols-6 lg:gap-6 lg:pl-0 lg:pt-10 lg:before:bottom-auto lg:before:left-0 lg:before:right-0 lg:before:top-[7px] lg:before:h-0.5 lg:before:w-auto"
      >
        {ragStages.map((stage) => {
          const mine = stage.builtBy === "me"
          return (
            <li key={stage.label} className="relative">
              <span
                aria-hidden
                className={cn(
                  "absolute -left-8 top-1 size-4 rounded-full border-2 lg:-top-10 lg:left-0",
                  mine ? "border-signal bg-signal" : "border-rule bg-paper",
                )}
              />
              <h3 className={cn("font-semiwide text-xl font-bold tracking-[-0.01em]", !mine && "text-graphite")}>
                {stage.label}
              </h3>
              <p className={cn("mt-2 text-[0.95rem] leading-relaxed", mine ? "text-ink" : "text-graphite")}>
                {stage.line}
              </p>
              {stage.packages.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {stage.packages.map((pkg) => {
                    const s = status(pkg, pulls)
                    return (
                      <li key={pkg.name + pkg.iface}>
                        <a href={pkg.repo} target="_blank" rel="noreferrer" className="group block">
                          <span className="block font-mono text-[0.8rem] text-signal-ink group-hover:underline">
                            {pkg.name}
                          </span>
                          <span className="block font-mono text-[0.75rem] text-graphite">{pkg.iface}</span>
                        </a>
                        {s && (
                          <span
                            className={cn(
                              "mt-1.5 inline-block rounded px-1.5 py-0.5 text-xs",
                              s.review ? "bg-[color-mix(in_oklab,var(--cable-ops)_25%,transparent)] text-ink" : "bg-surface text-graphite",
                            )}
                          >
                            {s.text}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ol>

      <div className="mt-16 grid gap-10 border-t border-rule pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <p>
          <span className="block font-wide text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-none tracking-[-0.03em]">
            {merged}
          </span>
          <span className="mt-2 block max-w-[30ch] text-graphite">
            pull requests merged into <span className="whitespace-nowrap">ballerina-platform</span> and wso2
            repositories.
          </span>
        </p>
        <div>
          <h3 className="text-sm text-graphite">Also shipped</h3>
          <ul className="mt-3 space-y-4">
            {alsoShipped.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer" className="group inline-flex gap-2">
                  <span className="max-w-[60ch] group-hover:underline">{item.text}</span>
                  <ArrowUpRight aria-hidden className="mt-1 size-4 shrink-0 text-graphite" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
