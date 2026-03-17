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

const PAGE_SIZE = 12; // 4 cols × 3 rows

function sortListings(listings: Listing[], sort: SortOption): Listing[] {
  const sorted = [...listings];
  if (sort === "price-asc") return sorted.sort((a, b) => a.pricePerDay - b.pricePerDay);
  if (sort === "price-desc") return sorted.sort((a, b) => b.pricePerDay - a.pricePerDay);
  if (sort === "popular") return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  return sorted.sort((a, b) => b.id.localeCompare(a.id));
}

interface BrowseListingsResultsGridProps {
  listings: Listing[];
  totalCount: number;
}

export function BrowseListingsResultsGrid({ listings, totalCount }: BrowseListingsResultsGridProps) {
  const [sort, setSort] = useState<SortOption>("popular");
  const [page, setPage] = useState(1);

  const sorted = sortListings(listings, sort);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when sort changes (handled via key on select)
  function handleSort(val: SortOption) {
    setSort(val);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{totalCount}</span> kết quả
          {totalPages > 1 && (
            <span className="ml-2 text-muted-foreground">— trang {page}/{totalPages}</span>
          )}
        </p>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Results grid — 2 col mobile, 3 col tablet, 4 col desktop */}
      {pageItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <span className="text-4xl">🔍</span>
          <p className="text-sm">Không tìm thấy kết quả. Thử thay đổi bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {pageItems.map((listing) => (
            <MarketplaceListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ‹ Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={[
                "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                p === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:bg-muted",
              ].join(" ")}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sau ›
          </button>
        </div>
      )}
    </div>
  );
}
