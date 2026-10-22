import { profile } from "@/lib/content"

export function SiteFooter() {
  return (
    <footer className="shell flex flex-wrap justify-between gap-4 border-t border-rule py-8 text-sm text-graphite">
      <p>
        © {new Date().getFullYear()} {profile.name}
      </p>
      <a href="#top" className="link text-ink">
        Back to top
      </a>
    </footer>
  )
}
