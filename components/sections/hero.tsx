import { Skyline } from "@/components/skyline/skyline"
import { SkylineFallback } from "@/components/skyline/skyline-fallback"
import { LEVEL_MIX, toSkyline } from "@/components/skyline/data"
import { getGitHubActivity } from "@/lib/github"
import { experience, profile, site } from "@/lib/content"

export async function Hero() {
  const { weeks, total } = await getGitHubActivity()
  const data = toSkyline(weeks)
  const joinIndex = data.findIndex((w) => w.start <= experience.start && experience.start <= w.end)

  return (
    <section id="top" className="pb-14 pt-10 lg:pt-14">
      <div className="shell">
        <h1 className="font-wide text-[clamp(3rem,13vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.035em] md:text-[clamp(4rem,8.2vw,8.25rem)]">
          {/* Padding gives descenders room inside the clipping mask. */}
          <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <span className="rise block">{profile.name}</span>
          </span>
        </h1>

        <div className="fade mt-6 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 [animation-delay:300ms]">
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
      </div>

      <div className="mt-8 border-t border-rule">
        <Skyline weeks={data} joinIndex={joinIndex}>
          <SkylineFallback weeks={data} joinIndex={joinIndex} />
        </Skyline>
      </div>

      <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-3 text-sm text-graphite">
        <p>
          {total.toLocaleString("en-US")} contributions in the last year, straight from GitHub.{" "}
          <span className="hidden [@media(hover:hover)]:inline">Drag to look around, hover a week to see what shipped.</span>
          <span className="[@media(hover:hover)]:hidden">Tap a week to see what shipped.</span>
        </p>
        <p className="flex items-center gap-1.5" aria-hidden>
          Less
          {LEVEL_MIX.map((mix) => (
            <span
              key={mix}
              className="size-3 rounded-[2px]"
              style={{ background: `color-mix(in oklab, var(--signal) ${mix * 100}%, var(--rule))` }}
            />
          ))}
          More
        </p>
      </div>
    </section>
  )
}
