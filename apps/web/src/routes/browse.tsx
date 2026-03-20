import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { SiteFooterWithNavLinks } from "@/components/layout/site-footer-with-nav-links";
import { BrowseSidebarSearchFilters } from "@/components/browse/browse-sidebar-search-filters";
import type { BrowseFilters } from "@/components/browse/browse-sidebar-search-filters";
import { BrowseListingsResultsGrid } from "@/components/browse/browse-listings-results-grid";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Button } from "@chomuon/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@chomuon/ui/components/sheet";

export const Route = createFileRoute("/browse")({
  component: BrowsePage,
});

function BrowsePage() {
  const [filters, setFilters] = useState<BrowseFilters>({
    category: "all",
    district: "Tất cả",
    minPrice: 0,
    maxPrice: 0,
    sortBy: "newest",
    minRating: 0,
    availability: "all",
    minDays: 0,
    city: "Tất cả",
  });

  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data, isLoading } = useQuery(orpc.listings.list.queryOptions({
    input: {
      search: undefined,
      categoryId: filters.category !== "all" ? filters.category : undefined,
      province: filters.city !== "Tất cả" ? filters.city : undefined,
      district: filters.district !== "Tất cả" ? filters.district : undefined,
      priceMin: filters.minPrice > 0 ? filters.minPrice : undefined,
      priceMax: filters.maxPrice > 0 ? filters.maxPrice : undefined,
      sortBy: filters.sortBy === "popular" ? "newest" : filters.sortBy,
      page,
      limit: 12,
    }
  }));

  // Categories for breadcrumb
  const { data: categoriesData } = useQuery(orpc.listings.categories.queryOptions({ input: {} }));
  const activeCategory = categoriesData?.items?.find((c) => c.id === filters.category);

  // Count active filters for mobile badge
  const activeFilterCount = [
    filters.category !== "all",
    filters.district !== "Tất cả",
    filters.minPrice > 0,
    filters.maxPrice > 0,
    filters.city !== "Tất cả",
    filters.minRating > 0,
  ].filter(Boolean).length;

  function handleFilter(newFilters: BrowseFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbarWithAuthCta />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-14 md:pt-8">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="text-sm text-muted-foreground mb-4 flex items-center gap-1.5">
          <Link to="/" className="hover:text-foreground transition-colors">Trang chủ</Link>
          <span>/</span>
          {activeCategory ? (
            <>
              <Link
                to="/browse"
                className="hover:text-foreground transition-colors"
                onClick={() => handleFilter({ ...filters, category: "all" })}
              >
                Khám phá
              </Link>
              <span>/</span>
              <span className="text-foreground font-medium">
                {activeCategory.icon} {activeCategory.name}
              </span>
            </>
          ) : (
            <span className="text-foreground font-medium">Khám phá</span>
          )}
        </nav>

        <h1 className="text-2xl font-bold text-foreground mb-6">
          {activeCategory
            ? `${activeCategory.icon} ${activeCategory.name}`
            : "Khám phá đồ cho thuê"}
        </h1>

        {/* Mobile filter toolbar — fixed below navbar, visible only on mobile */}
        <div className="md:hidden fixed top-14 left-0 right-0 z-40 px-4 py-2.5 bg-background/95 backdrop-blur-sm border-b border-border flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></svg>
            Bộ lọc
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilter({ ...filters, sortBy: e.target.value as BrowseFilters["sortBy"] })}
            className="flex-1 min-w-0 bg-background border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá thấp → cao</option>
            <option value="price_desc">Giá cao → thấp</option>
            <option value="rating">Đánh giá cao nhất</option>
          </select>
        </div>

        {/* Mobile filter sheet */}
        <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Bộ lọc</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6 p-4 overflow-y-auto flex-1">
              <BrowseSidebarSearchFilters filters={filters} onFilterChange={handleFilter} />
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex gap-6 items-start">
          {/* Desktop sidebar */}
          <aside className="w-72 shrink-0 hidden md:block">
            <div className="flex flex-col gap-6 p-4 bg-card border border-border rounded-xl">
              <BrowseSidebarSearchFilters filters={filters} onFilterChange={handleFilter} />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <BrowseListingsResultsGrid
              listings={data?.items ?? []}
              totalCount={data?.total ?? 0}
              page={page}
              onPageChange={setPage}
              isLoading={isLoading}
            />
          </main>
        </div>
      </div>

      <SiteFooterWithNavLinks />
    </div>
  );
}
