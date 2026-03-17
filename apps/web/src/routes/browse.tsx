import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { SiteFooterWithNavLinks } from "@/components/layout/site-footer-with-nav-links";
import { BrowseSidebarSearchFilters } from "@/components/browse/browse-sidebar-search-filters";
import type { BrowseFilters } from "@/components/browse/browse-sidebar-search-filters";
import { BrowseListingsResultsGrid } from "@/components/browse/browse-listings-results-grid";
import { LISTINGS } from "@/data/marketplace-mock-data";

export const Route = createFileRoute("/browse")({
  component: BrowsePage,
});

function applyFilters(filters: BrowseFilters) {
  let results = LISTINGS.filter((listing) => {
    if (filters.category && filters.category !== "all" && listing.category !== filters.category) return false;
    if (filters.district && filters.district !== "Tất cả" && listing.district !== filters.district) return false;
    if (filters.minPrice > 0 && listing.pricePerDay < filters.minPrice) return false;
    if (filters.maxPrice > 0 && listing.pricePerDay > filters.maxPrice) return false;
    if (filters.verifiedOnly && !listing.verified) return false;
    if (filters.city && filters.city !== "Tất cả" && listing.city !== filters.city) return false;
    if (filters.minRating > 0 && listing.rating < filters.minRating) return false;
    if (filters.availability === "available" && !listing.available) return false;
    if (filters.availability === "unavailable" && listing.available) return false;
    if (filters.minDays > 0 && listing.minDays > filters.minDays) return false;
    return true;
  });

  // Sort
  switch (filters.sortBy) {
    case "price_asc":
      results = [...results].sort((a, b) => a.pricePerDay - b.pricePerDay);
      break;
    case "price_desc":
      results = [...results].sort((a, b) => b.pricePerDay - a.pricePerDay);
      break;
    case "rating":
      results = [...results].sort((a, b) => b.rating - a.rating);
      break;
    case "newest":
      results = [...results].sort((a, b) => Number(b.id) - Number(a.id));
      break;
    case "popular":
    default:
      results = [...results].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
  }

  return results;
}

function BrowsePage() {
  const [filters, setFilters] = useState<BrowseFilters>({
    category: "all",
    district: "Tất cả",
    minPrice: 0,
    maxPrice: 0,
    verifiedOnly: false,
    sortBy: "popular",
    minRating: 0,
    availability: "all",
    minDays: 0,
    city: "Tất cả",
  });

  const filteredListings = applyFilters(filters);

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbarWithAuthCta />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Khám phá đồ cho thuê
        </h1>

        <div className="flex gap-6 items-start">
          {/* Sidebar */}
          <aside className="w-72 shrink-0 hidden md:block">
            <BrowseSidebarSearchFilters onFilter={setFilters} />
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0">
            <BrowseListingsResultsGrid
              listings={filteredListings}
              totalCount={filteredListings.length}
            />
          </main>
        </div>
      </div>

      <SiteFooterWithNavLinks />
    </div>
  );
}
