import Nav from "../../components/landing_page_components/Nav"
import Hero from "../../components/landing_page_components/Hero"
import Features from "../../components/landing_page_components/Features"
import Testimonials from "../../components/landing_page_components/Testimonials"
import './about.css'

export default function Home() {
  return (
      <div>
        <Nav />
        <Hero />
        <Features />
        <Testimonials />
      </div>
  );
}
