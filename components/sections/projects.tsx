import { ArrowUpRight } from "lucide-react"
import { GitHubIcon } from "@/components/icons"
import { ProjectVisual } from "@/components/project-visuals"
import { SectionHeading } from "@/components/section-heading"
import { profile, projects, projectsIntro, tags } from "@/lib/content"
import { cn } from "@/lib/utils"

export function Projects() {
  return (
    <section aria-labelledby="projects" className="shell py-20">
      <SectionHeading id="projects" title="Projects">
        {projectsIntro}
      </SectionHeading>

      <ul>
        {projects.map((project, i) => {
          const tag = tags[project.tag]
          // Rows alternate which side leads, with different proportions, so the
          // section reads as a sequence of figures rather than a card grid.
          const flipped = i % 2 === 1
          return (
            <li
              key={project.name}
              className={cn(
                "grid gap-8 border-t border-rule py-12 lg:items-center lg:gap-16",
                flipped ? "lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]",
              )}
            >
              <div className={cn(flipped && "lg:order-2")}>
                <p className="flex items-center gap-2 text-sm text-graphite">
                  <span aria-hidden className="h-[3px] w-5 rounded-full" style={{ background: tag.color }} />
                  {tag.label}
                </p>
                <h3 className="mt-3 font-semiwide text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-tight tracking-[-0.02em]">
                  {project.name}
                </h3>
                <p className="mt-3 max-w-[52ch]">{project.summary}</p>

                {project.note && <p className="mt-5 max-w-[52ch] text-[0.95rem] text-graphite">{project.note}</p>}

                <p className="mt-5 text-sm text-graphite">Built with {project.stack.join(", ")}</p>
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[0.95rem] font-medium text-signal-ink hover:text-ink"
                >
                  <GitHubIcon className="size-4" />
                  Source code
                  <ArrowUpRight aria-hidden className="size-4" />
                </a>
              </div>

              <figure className={cn("min-w-0", flipped && "lg:order-1")}>
                <ProjectVisual project={project} color={tag.color} />
                {project.caption && (
                  <figcaption className="mt-4 max-w-[60ch] text-sm leading-relaxed text-graphite">{project.caption}</figcaption>
                )}
              </figure>
            </li>
          )
        })}
      </ul>

      <p className="border-t border-rule pt-8 text-graphite">
        More on{" "}
        <a href={profile.github} target="_blank" rel="noreferrer" className="link text-ink">
          my GitHub
        </a>
        .
      </p>
    </section>
  )
}
