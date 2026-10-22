import { ArrowUpRight } from "lucide-react"
import { ContactForm } from "@/components/contact-form"
import { CopyEmail } from "@/components/copy-email"
import { GitHubIcon, LinkedInIcon } from "@/components/icons"
import { SectionHeading } from "@/components/section-heading"
import { profile } from "@/lib/content"

const elsewhere = [
  { label: "GitHub", handle: "SahanjithD", href: profile.github, Icon: GitHubIcon },
  { label: "LinkedIn", handle: "dasundeshaja", href: profile.linkedin, Icon: LinkedInIcon },
]

export function Contact() {
  return (
    <section aria-labelledby="contact" className="shell py-20">
      <SectionHeading id="contact" title="Contact">
        Hiring for a networking, DevOps or backend role, or want to build something together? Email me directly or
        use the form. I usually reply within a day.
      </SectionHeading>

      <div className="border-t border-rule pt-10">
        <a
          href={`mailto:${profile.email}`}
          className="font-wide text-[clamp(1.45rem,5.2vw,4.5rem)] font-bold leading-none tracking-[-0.03em] decoration-signal decoration-[0.06em] underline-offset-[0.14em] hover:underline"
        >
          {profile.email}
        </a>
        <div className="mt-6">
          <CopyEmail email={profile.email} />
        </div>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <ul className="grid content-start gap-4">
          {elsewhere.map(({ label, handle, href, Icon }) => (
            <li key={label}>
              <a href={href} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3">
                <Icon className="size-5" />
                <span>
                  <span className="font-semibold">{label}</span>{" "}
                  <span className="text-graphite transition-colors group-hover:text-ink">{handle}</span>
                </span>
                <ArrowUpRight aria-hidden className="size-4 text-graphite" />
              </a>
            </li>
          ))}
        </ul>
        <ContactForm />
      </div>
    </section>
  )
}
