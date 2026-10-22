import { SectionHeading } from "@/components/section-heading"
import { domains, education, roles, skills, type DomainKey } from "@/lib/content"

export function About() {
  return (
    <section aria-labelledby="about" className="shell py-20">
      <SectionHeading id="about" title="About">
        Where I study, what I look after outside class, and the tools I reach for.
      </SectionHeading>

      <div className="grid gap-12 border-t border-rule pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="max-w-[56ch] space-y-5 text-lg leading-relaxed">
          <p>
            I&apos;m in my third year of computer engineering at the University of Ruhuna. Most of what I build sits
            where networks meet software: SDN controllers and network tooling, automated delivery pipelines, and the
            full-stack apps that run on top of them.
          </p>
          <p>
            Outside the curriculum I compete in CTFs and hackathons, manage the budget for our IEEE Student Branch,
            and build machine learning projects in Python.
          </p>
        </div>

        <dl className="grid content-start gap-10 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-graphite">Education</dt>
            <dd className="mt-2">
              <p className="font-semibold">{education.degree}</p>
              <p className="mt-1">{education.school}</p>
              <p className="mt-1 text-graphite">{education.detail}</p>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-graphite">Roles</dt>
            {roles.map((role) => (
              <dd key={role.title} className="mt-2">
                <p className="font-semibold">{role.title}</p>
                <p className="mt-1">{role.org}</p>
              </dd>
            ))}
          </div>
        </dl>
      </div>

      <h3 className="mt-16 font-semiwide text-xl font-bold tracking-[-0.01em]">Toolbox</h3>
      <div className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
        {(Object.keys(skills) as DomainKey[]).map((key) => (
          <div key={key}>
            <span aria-hidden className="block h-[3px] rounded-full" style={{ background: domains[key].color }} />
            <h4 className="mt-4 font-semibold">{domains[key].label}</h4>
            <ul className="mt-3 space-y-1.5 text-graphite">
              {skills[key].map((tool) => (
                <li key={tool}>{tool}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
