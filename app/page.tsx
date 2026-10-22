import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/sections/hero"
import { Projects } from "@/components/sections/projects"
import { Competitions } from "@/components/sections/competitions"
import { About } from "@/components/sections/about"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Projects />
        <Competitions />
        <About />
      </main>
    </>
  )
}
