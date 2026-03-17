import { useState } from "react";
import type { Listing } from "@/types/marketplace-listing-types";
import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";

type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "newest", label: "Mới nhất" },
];

function sortListings(listings: Listing[], sort: SortOption): Listing[] {
  const sorted = [...listings];
  if (sort === "price-asc") return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
  if (sort === "price-desc") return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
  if (sort === "popular") return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  // newest: keep original order (id ascending as proxy)
  return sorted.sort((a, b) => b.id.localeCompare(a.id));
}

interface BrowseListingsResultsGridProps {
  listings: Listing[];
  totalCount: number;
}

export function BrowseListingsResultsGrid({ listings, totalCount }: BrowseListingsResultsGridProps) {
  const [sort, setSort] = useState<SortOption>("popular");

  const sorted = sortListings(listings, sort);

  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalCount}</span> kết quả
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results grid */}
      {sorted.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          Không tìm thấy kết quả. Thử thay đổi bộ lọc.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((listing) => (
            <MarketplaceListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
