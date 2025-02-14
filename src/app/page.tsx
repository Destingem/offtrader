"use client"
import dynamic from "next/dynamic"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CoursesSection } from "@/components/courses-section"
import { ProcessSection } from "@/components/process-section"
import { PricingSection } from "@/components/pricing-section"
import { CTASection } from "@/components/cta-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

const ClientReviewsSection = dynamic(
  () => import("@/components/client-reviews-section").then((mod) => mod.ClientReviewsSection),
  { ssr: false },
)

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="courses">
          <CoursesSection />
        </div>
        <div id="process">
          <ProcessSection />
        </div>
        <div id="pricing">
          <PricingSection />
        </div>
        <div id="reviews">
          <ClientReviewsSection />
        </div>
        <CTASection />
        <div id="faq">
          <FAQSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}

