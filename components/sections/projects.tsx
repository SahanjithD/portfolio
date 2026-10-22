import { ArrowUpRight } from "lucide-react"
import { GitHubIcon } from "@/components/icons"
import { Pipeline } from "@/components/pipeline"
import { SectionHeading } from "@/components/section-heading"
import { profile, projects, projectsIntro, tags } from "@/lib/content"

export function Projects() {
  return (
    <section aria-labelledby="projects" className="shell py-20">
      <SectionHeading id="projects" title="Projects">
        {projectsIntro}
      </SectionHeading>

      <ul>
        {projects.map((project) => {
          const tag = tags[project.tag]
          return (
            <li
              key={project.name}
              className="grid gap-6 border-t border-rule py-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
            >
              <div>
                <p className="flex items-center gap-2 text-sm text-graphite">
                  <span aria-hidden className="h-[3px] w-5 rounded-full" style={{ background: tag.color }} />
                  {tag.label}
                </p>
                <h3 className="mt-3 font-semiwide text-[clamp(1.5rem,2.6vw,2rem)] font-bold leading-tight tracking-[-0.02em]">
                  {project.name}
                </h3>
                <p className="mt-3 max-w-[48ch]">{project.summary}</p>
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-[0.95rem] font-medium text-signal-ink hover:text-ink"
                >
                  <GitHubIcon className="size-4" />
                  Source code
                  <ArrowUpRight aria-hidden className="size-4" />
                </a>
              </div>

              <div className="flex min-w-0 flex-col justify-center gap-5 lg:pt-8">
                {project.lanes && <Pipeline lanes={project.lanes} color={tag.color} />}
                <p className="text-sm text-graphite">Built with {project.stack.join(", ")}</p>
              </div>
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
