import Hero from "../components/hero";
import Features from "../components/features";
import HowItWorks from "../components/how-it-works";
import Pricing from "../components/pricing/pricing";
import CTA from "../components/cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
    </main>
  );
}
