import Nav from '@/components/nav/Nav'
import Hero from '@/components/hero/Hero'
import About from '@/components/about/About'
import Work from '@/components/work/Work'
import CaseGainsight from '@/components/work/CaseGainsight'
import CaseAgents from '@/components/work/CaseAgents'
import Experience from '@/components/experience/Experience'
import Skills from '@/components/skills/Skills'
import Credentials from '@/components/credentials/Credentials'
import Contact from '@/components/contact/Contact'
import ThemeObserver from '@/components/motion/ThemeObserver'

export default function Home() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Work />
        <CaseGainsight />
        <CaseAgents />
        <Experience />
        <Skills />
        <Credentials />
        <Contact />
      </main>
      <ThemeObserver />
    </>
  )
}
