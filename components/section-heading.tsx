export function SectionHeading({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div className="grid items-end gap-4 pb-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <h2 id={id} className="font-wide text-[clamp(2.25rem,5.5vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.03em]">
        {title}
      </h2>
      <p className="max-w-[52ch] text-graphite">{children}</p>
    </div>
  )
}
