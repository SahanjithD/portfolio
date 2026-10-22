import type { IconType } from "react-icons"
import {
  SiDocker,
  SiGit,
  SiGithubactions,
  SiJavascript,
  SiJenkins,
  SiLinux,
  SiOpenjdk,
  SiOpensearch,
  SiPython,
  SiPytorch,
  SiTypescript,
} from "react-icons/si"
import { SectionHeading } from "@/components/section-heading"
import { about, education, roles, stack } from "@/lib/content"

// Brand marks where they exist; a typeset monogram where they don't.
const icons: Record<string, IconType | string> = {
  Ballerina: "Bal",
  Python: SiPython,
  Java: SiOpenjdk,
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  AWS: "AWS",
  OpenSearch: SiOpensearch,
  PyTorch: SiPytorch,
  Docker: SiDocker,
  Jenkins: SiJenkins,
  "GitHub Actions": SiGithubactions,
  Linux: SiLinux,
  Git: SiGit,
}

function Tool({ name }: { name: string }) {
  const Icon = icons[name]
  return (
    <li className="flex w-16 flex-col items-center gap-2 text-center">
      <span className="grid size-12 place-items-center rounded-md border border-rule bg-surface">
        {typeof Icon === "string" || !Icon ? (
          <span aria-hidden className="font-semiwide text-[0.8rem] font-bold">
            {Icon ?? name.slice(0, 3)}
          </span>
        ) : (
          <Icon aria-hidden className="size-6" />
        )}
      </span>
      <span className="text-xs leading-tight text-graphite">{name}</span>
    </li>
  )
}

export function About() {
  return (
    <section aria-labelledby="about" className="shell py-20">
      <SectionHeading id="about" title="About">
        {about.intro}
      </SectionHeading>

      <div className="grid gap-12 border-t border-rule pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <p className="max-w-[48ch] text-lg leading-relaxed md:text-xl">{about.bio}</p>

        <div className="grid content-start gap-10 sm:grid-cols-2">
          <div>
            <h3 className="text-sm text-graphite">Education</h3>
            <p className="mt-2 font-semibold">{education.degree}</p>
            <p className="mt-1">{education.school}</p>

            <div className="mt-6 flex items-end gap-8">
              <div>
                <p className="font-wide text-4xl font-extrabold leading-none tracking-[-0.02em]">{education.gpa}</p>
                <p className="mt-1.5 text-sm text-graphite">GPA</p>
              </div>
              <div className="min-w-0 flex-1">
                {/* One segment per year of the degree, filled up to the current one. */}
                <div
                  role="img"
                  aria-label={`Year ${education.year} of ${education.years}`}
                  className="grid gap-1"
                  style={{ gridTemplateColumns: `repeat(${education.years}, minmax(0, 1fr))` }}
                >
                  {Array.from({ length: education.years }, (_, i) => (
                    <span key={i} className={i < education.year ? "h-2 rounded-sm bg-signal" : "h-2 rounded-sm bg-rule"} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-graphite">
                  Year {education.year} of {education.years}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-graphite">{roles.length === 1 ? "Role" : "Roles"}</h3>
            <ul className="mt-2 space-y-4">
              {roles.map((role) => (
                <li key={role.title} className="flex gap-4">
                  <span
                    aria-hidden
                    className="grid size-12 shrink-0 place-items-center rounded-md bg-ink font-semiwide text-[0.7rem] font-bold text-paper"
                  >
                    {role.monogram}
                  </span>
                  <span>
                    <span className="block font-semibold">{role.title}</span>
                    <span className="block text-[0.95rem]">{role.org}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-rule pt-10">
        <h3 className="font-semiwide text-xl font-bold tracking-[-0.01em]">Stack</h3>
        <div className="mt-6 flex flex-wrap gap-x-12 gap-y-8">
          {stack.map(({ group, items }) => (
            <div key={group}>
              <h4 className="text-sm text-graphite">{group}</h4>
              <ul className="mt-3 flex flex-wrap gap-3">
                {items.map((name) => (
                  <Tool key={name} name={name} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
