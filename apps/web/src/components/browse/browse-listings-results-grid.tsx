import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";

const PAGE_SIZE = 12; // 4 cols × 3 rows

interface BrowseListingsResultsGridProps {
  listings: any[]; // Real data from API
  totalCount: number;
  page: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function BrowseListingsResultsGrid({ listings, totalCount, page, onPageChange }: BrowseListingsResultsGridProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

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
      </div>

      {/* Results grid — 2 col mobile, 3 col tablet, 4 col desktop */}
      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
          <span className="text-4xl">🔍</span>
          <p className="text-sm">Không tìm thấy kết quả. Thử thay đổi bộ lọc.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <MarketplaceListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1 pt-4">
          <button
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ‹ Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
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
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
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
