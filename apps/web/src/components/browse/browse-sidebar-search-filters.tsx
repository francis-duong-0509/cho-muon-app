import { Input } from "@chomuon/ui/components/input";
import { Label } from "@chomuon/ui/components/label";
import { BrowseSidebarAdvancedSortAndAvailabilityFilters } from "./browse-sidebar-advanced-sort-and-availability-filters";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useState, useEffect, useRef } from "react";

export interface BrowseFilters {
  category: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  sortBy: "popular" | "price_asc" | "price_desc" | "rating" | "newest";
  minRating: number;
  availability: "all" | "available" | "unavailable";
  minDays: number;
  city: string;
}

const DISTRICTS = [
  "Tất cả", "Quận 1", "Quận 2", "Quận 3", "Quận 5",
  "Quận 7", "Quận 10", "Bình Thạnh", "Phú Nhuận", "Tân Bình",
];

interface BrowseSidebarSearchFiltersProps {
  filters: BrowseFilters;
  onFilterChange: (filters: BrowseFilters) => void;
}

export function BrowseSidebarSearchFilters({ filters, onFilterChange }: BrowseSidebarSearchFiltersProps) {
  const {category, district, sortBy, minRating, city} = filters;

  // Local state for price inputs — debounced before syncing to parent
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local price → parent after 500ms of no typing
  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      if (localMinPrice !== filters.minPrice || localMaxPrice !== filters.maxPrice) {
        onFilterChange({ ...filters, minPrice: localMinPrice, maxPrice: localMaxPrice });
      }
    }, 1000);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [localMinPrice, localMaxPrice]);

  // Sync parent → local when filters reset externally (e.g. clear all)
  useEffect(() => {
    setLocalMinPrice(filters.minPrice);
    setLocalMaxPrice(filters.maxPrice);
  }, [filters.minPrice, filters.maxPrice]);

  const {data: categoriesData} = useQuery(orpc.listings.categories.queryOptions({ input: {} }));

  const categories = categoriesData?.items ?? [];

  return (
      <>
        {/* Danh mục */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-foreground">Danh mục</p>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, category: "all" })}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                category === "all"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange({ ...filters, category: cat.id })}
                className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                  category === cat.id
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quận/Huyện */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="district-select" className="text-sm font-semibold">
            Quận/Huyện
          </Label>
          <select
            id="district-select"
            value={district}
            onChange={(e) => onFilterChange({ ...filters, district: e.target.value })}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Giá/ngày — debounced */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-foreground">Giá/ngày (VND)</p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Từ"
              min={0}
              value={localMinPrice || ""}
              onChange={(e) => setLocalMinPrice(Number(e.target.value))}
              className="text-sm"
            />
            <span className="text-muted-foreground text-sm">—</span>
            <Input
              type="number"
              placeholder="Đến"
              min={0}
              value={localMaxPrice || ""}
              onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
              className="text-sm"
            />
          </div>
        </div>

        {/* Advanced: city, sort, rating */}
        <BrowseSidebarAdvancedSortAndAvailabilityFilters
          city={city}
          sortBy={sortBy}
          minRating={minRating}
          onCityChange={(city) => onFilterChange({ ...filters, city })}
          onSortByChange={(sortBy) => onFilterChange({ ...filters, sortBy })}
          onMinRatingChange={(minRating) => onFilterChange({ ...filters, minRating })}
        />
      </>
  );
}
