import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { SiteFooterWithNavLinks } from "@/components/layout/site-footer-with-nav-links";
import { HomeHeroSearchSection } from "@/components/home/home-hero-search-section";
import { HomeCategoriesGridSection } from "@/components/home/home-categories-grid-section";
import { HomeFeaturedListingsSection } from "@/components/home/home-featured-listings-section";
import { HomeHowItWorksStepsSection } from "@/components/home/home-how-it-works-steps-section";
import { HomeTrustSafetyPillarsSection } from "@/components/home/home-trust-safety-pillars-section";
import { HomeStatsCounterSection } from "@/components/home/home-stats-counter-section";
import { HomeOwnerCtaSection } from "@/components/home/home-owner-cta-section";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbarWithAuthCta />
      <HomeHeroSearchSection />
      <HomeCategoriesGridSection />
      <HomeFeaturedListingsSection />
      <HomeStatsCounterSection />
      <HomeHowItWorksStepsSection />
      <HomeTrustSafetyPillarsSection />
      <HomeOwnerCtaSection />
      <SiteFooterWithNavLinks />
    </div>
  );
}
