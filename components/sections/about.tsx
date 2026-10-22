import { SectionHeading } from "@/components/section-heading"
import { about, education, roles, stack } from "@/lib/content"

export function About() {
  return (
    <section aria-labelledby="about" className="shell py-20">
      <SectionHeading id="about" title="About">
        {about.intro}
      </SectionHeading>

      <div className="grid gap-12 border-t border-rule pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <p className="max-w-[56ch] text-lg leading-relaxed">{about.bio}</p>

        <dl className="grid content-start gap-10 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-graphite">Education</dt>
            <dd className="mt-2">
              <p className="font-semibold">{education.degree}</p>
              <p className="mt-1">{education.school}</p>
              <p className="mt-1 text-graphite">
                Year {education.year} of {education.years}, GPA {education.gpa}
              </p>
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

      <h3 className="mt-16 font-semiwide text-xl font-bold tracking-[-0.01em]">Stack</h3>
      <div className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-3">
        {stack.map(({ group, items }) => (
          <div key={group}>
            <h4 className="font-semibold">{group}</h4>
            <p className="mt-2 text-graphite">{items.join(", ")}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
