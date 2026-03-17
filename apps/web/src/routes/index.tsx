import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { SiteFooterWithNavLinks } from "@/components/layout/site-footer-with-nav-links";
import { HomeWhyChooseUsBenefitsSection } from "@/components/home/home-why-choose-us-benefits-section";
import { HomeHeroSearchSection } from "@/components/home/home-hero-search-section";
import { HomeFlashDealsDailySection } from "@/components/home/home-flash-deals-daily-section";
import { HomeCategoriesGridSection } from "@/components/home/home-categories-grid-section";
import { HomeNewArrivalsHorizontalScrollSection } from "@/components/home/home-new-arrivals-horizontal-scroll-section";
import { HomeFeaturedListingsSection } from "@/components/home/home-featured-listings-section";
import { HomeBrowseByDistrictSection } from "@/components/home/home-browse-by-district-section";
import { HomeStatsCounterSection } from "@/components/home/home-stats-counter-section";
import { HomeTopVerifiedHostsShowcaseSection } from "@/components/home/home-top-verified-hosts-showcase-section";
import { HomeHowItWorksStepsSection } from "@/components/home/home-how-it-works-steps-section";
import { HomeUserTestimonialsSection } from "@/components/home/home-user-testimonials-section";
import { HomeTrustSafetyPillarsSection } from "@/components/home/home-trust-safety-pillars-section";
import { HomeOwnerCtaSection } from "@/components/home/home-owner-cta-section";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteNavbarWithAuthCta />
      <HomeWhyChooseUsBenefitsSection />
      <HomeHeroSearchSection />
      <HomeFlashDealsDailySection />
      <HomeCategoriesGridSection />
      <HomeNewArrivalsHorizontalScrollSection />
      <HomeFeaturedListingsSection />
      <HomeBrowseByDistrictSection />
      <HomeStatsCounterSection />
      <HomeTopVerifiedHostsShowcaseSection />
      <HomeHowItWorksStepsSection />
      <HomeUserTestimonialsSection />
      <HomeTrustSafetyPillarsSection />
      <HomeOwnerCtaSection />
      <SiteFooterWithNavLinks />
    </div>
  );
}
