import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/sections/hero"
import { Projects } from "@/components/sections/projects"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Projects />
      </main>
    </>
  )
}
