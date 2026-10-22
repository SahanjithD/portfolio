import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/sections/hero"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
      </main>
    </>
  )
}
