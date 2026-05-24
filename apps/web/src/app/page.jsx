import Hero from "../components/hero";
import Features from "../components/features";
import HowItWorks from "../components/how-it-works";
import Pricing from "../components/pricing/pricing";
import Faq from "../components/faq";
import CTA from "../components/cta";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section aria-labelledby="hero-title">
        <Hero />
      </section>
      <section aria-labelledby="features-title">
        <Features />
      </section>
      <section aria-labelledby="how-it-works-title">
        <HowItWorks />
      </section>
      <section aria-labelledby="pricing-title">
        <Pricing />
      </section>
      <section aria-labelledby="faq-title">
        <Faq />
      </section>
      <section aria-labelledby="cta-title">
        <CTA />
      </section>
    </main>
  );
}
