import CTA from "@/components/cta";
import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import Pricing from "@/components/pricing/pricing";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
    </main>
  );
}
