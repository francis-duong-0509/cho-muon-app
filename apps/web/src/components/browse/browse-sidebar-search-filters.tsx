import { useState } from "react";
import { Button } from "@chomuon/ui/components/button";
import { Input } from "@chomuon/ui/components/input";
import { Label } from "@chomuon/ui/components/label";
import { Checkbox } from "@chomuon/ui/components/checkbox";
import { CATEGORIES } from "@/data/marketplace-mock-data";
import { BrowseSidebarAdvancedSortAndAvailabilityFilters } from "./browse-sidebar-advanced-sort-and-availability-filters";

export interface BrowseFilters {
  category: string;
  district: string;
  minPrice: number;
  maxPrice: number;
  verifiedOnly: boolean;
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
  onFilter: (filters: BrowseFilters) => void;
}

export function BrowseSidebarSearchFilters({ onFilter }: BrowseSidebarSearchFiltersProps) {
  const [category, setCategory] = useState("all");
  const [district, setDistrict] = useState("Tất cả");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<BrowseFilters["sortBy"]>("popular");
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState<BrowseFilters["availability"]>("all");
  const [minDays, setMinDays] = useState(0);
  const [city, setCity] = useState("Tất cả");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onFilter({ category, district, minPrice, maxPrice, verifiedOnly, sortBy, minRating, availability, minDays, city });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-4 bg-card border border-border rounded-xl">
      {/* Danh mục */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Danh mục</p>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
              category === "all"
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            Tất cả
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
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
          onChange={(e) => setDistrict(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Giá/ngày */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Giá/ngày (VND)</p>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Từ"
            min={0}
            value={minPrice || ""}
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="text-sm"
          />
          <span className="text-muted-foreground text-sm">—</span>
          <Input
            type="number"
            placeholder="Đến"
            min={0}
            value={maxPrice || ""}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="text-sm"
          />
        </div>
      </div>

      {/* Đã xác minh */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="verified-only"
          checked={verifiedOnly}
          onCheckedChange={(checked) => setVerifiedOnly(checked === true)}
        />
        <Label htmlFor="verified-only" className="text-sm cursor-pointer">
          Chỉ hiện đồ đã xác minh
        </Label>
      </div>

      {/* Advanced: city, sort, rating, availability, minDays */}
      <BrowseSidebarAdvancedSortAndAvailabilityFilters
        city={city}
        sortBy={sortBy}
        minRating={minRating}
        availability={availability}
        minDays={minDays}
        onCityChange={setCity}
        onSortByChange={setSortBy}
        onMinRatingChange={setMinRating}
        onAvailabilityChange={setAvailability}
        onMinDaysChange={setMinDays}
      />

      <Button type="submit" className="w-full bg-primary text-primary-foreground">
        Áp dụng bộ lọc
      </Button>
    </form>
  );
}
