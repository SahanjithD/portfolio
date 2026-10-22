import { Topology } from "@/components/topology"
import { education, profile } from "@/lib/content"

const titleBlock = [
  { term: "Studying", value: `${education.degree.replace(" (Hons)", "")}, ${profile.university}` },
  { term: "Based in", value: profile.location },
  { term: "Status", value: profile.status, live: true },
]

export function Hero() {
  const [first, last] = profile.name.split(" ")

  return (
    <section id="top" className="shell pb-20 pt-8 lg:pt-12">
      <Topology />

      <h1 className="mt-8 border-t border-rule pt-5 font-wide text-[clamp(3.25rem,13.4vw,11.25rem)] font-extrabold leading-[0.86] tracking-[-0.035em] lg:mt-10">
        {[first, last].map((word, i) => (
          // Padding gives descenders room inside the clipping mask.
          <span key={word} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <span className="rise block" style={{ animationDelay: `${120 + i * 90}ms` }}>
              {word}
            </span>
          </span>
        ))}
      </h1>

      <div className="fade mt-10 grid items-end gap-10 [animation-delay:450ms] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <p className="max-w-[44ch] text-lg leading-relaxed md:text-xl">
            I&apos;m a computer engineering undergraduate at the {profile.university}. I build software-defined
            networks, CI/CD pipelines and full-stack apps, and I&apos;m looking for a full-time role where I can keep
            doing all three.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-solid">
              See my projects
            </a>
            <a href={`mailto:${profile.email}`} className="btn btn-line">
              Email me
            </a>
          </div>
        </div>

        <dl className="grid border-t border-rule sm:grid-cols-3">
          {titleBlock.map((cell) => (
            <div key={cell.term} className="border-b border-rule py-3 sm:border-b-0 sm:border-l sm:px-4 sm:first:border-l-0 sm:first:pl-0">
              <dt className="text-sm text-graphite">{cell.term}</dt>
              <dd className="mt-1 flex items-baseline gap-2 font-medium leading-snug">
                {cell.live && <span aria-hidden className="size-2 shrink-0 translate-y-[-1px] rounded-full bg-signal" />}
                {cell.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
