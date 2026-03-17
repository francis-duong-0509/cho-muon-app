import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { SiteFooterWithNavLinks } from "@/components/layout/site-footer-with-nav-links";
import { HomeWhyChooseUsBenefitsSection } from "@/components/home/home-why-choose-us-benefits-section";
import { HomeHeroSearchSection } from "@/components/home/home-hero-search-section";
import { HomeFlashDealsDailySection } from "@/components/home/home-flash-deals-daily-section";
import { HomeCategoriesGridSection } from "@/components/home/home-categories-grid-section";
import { HomeNewArrivalsHorizontalScrollSection } from "@/components/home/home-new-arrivals-horizontal-scroll-section";
import { HomeFeaturedListingsSection } from "@/components/home/home-featured-listings-section";
import { HomeCameraAndElectronicsListingsSection } from "@/components/home/home-camera-and-electronics-listings-section";
import { HomeSportsAndMusicListingsSection } from "@/components/home/home-sports-and-music-listings-section";
import { HomeKitchenAndAppliancesListingsSection } from "@/components/home/home-kitchen-and-appliances-listings-section";
import { HomeEventsAndOutdoorListingsSection } from "@/components/home/home-events-and-outdoor-listings-section";
import { HomeBudgetUnder150kListingsSection } from "@/components/home/home-budget-under-150k-per-day-listings-section";
import { HomeStatsCounterSection } from "@/components/home/home-stats-counter-section";
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
      <HomeCameraAndElectronicsListingsSection />
      <HomeSportsAndMusicListingsSection />
      <HomeKitchenAndAppliancesListingsSection />
      <HomeEventsAndOutdoorListingsSection />
      <HomeBudgetUnder150kListingsSection />
      <HomeStatsCounterSection />
      <HomeOwnerCtaSection />
      <SiteFooterWithNavLinks />
    </div>
  );
}
