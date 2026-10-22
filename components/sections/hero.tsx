import { Topology } from "@/components/topology"
import { profile, site } from "@/lib/content"

export function Hero() {
  const [first, last] = profile.name.split(" ")

  return (
    <section id="top" className="shell pb-20 pt-8 lg:pt-12">
      <Topology />

      <h1 className="mt-8 border-t border-rule pt-5 font-wide text-[clamp(3.25rem,16.4vw,15.25rem)] font-extrabold leading-[0.86] tracking-[-0.035em] lg:mt-8">
        {[first, last].map((word, i) => (
          // Padding gives descenders room inside the clipping mask.
          <span key={word} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <span className="rise block" style={{ animationDelay: `${120 + i * 90}ms` }}>
              {word}
            </span>
          </span>
        ))}
      </h1>

      <div className="fade mt-8 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 [animation-delay:450ms]">
        <p className="max-w-[46ch] text-lg leading-relaxed md:text-xl">{site.intro}</p>
        <div className="flex flex-wrap gap-3">
          <a href="#work" className="btn btn-solid">
            See my work
          </a>
          <a href={`mailto:${profile.email}`} className="btn btn-line">
            Email me
          </a>
        </div>
      </div>
    </section>
  )
}
