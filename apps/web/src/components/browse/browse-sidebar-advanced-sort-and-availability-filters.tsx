import { Label } from "@chomuon/ui/components/label";
import type { BrowseFilters } from "./browse-sidebar-search-filters";

// Constants shared by the advanced filter panel
export const CITIES = ["Tất cả", "TP. Hồ Chí Minh", "Hà Nội", "Đà Nẵng"];

export const SORT_OPTIONS: { value: BrowseFilters["sortBy"]; label: string }[] = [
  { value: "popular", label: "Phổ biến nhất" },
  { value: "price_asc", label: "Giá thấp→cao" },
  { value: "price_desc", label: "Giá cao→thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
  { value: "newest", label: "Mới nhất" },
];

const RATING_OPTIONS = [
  { val: 0, label: "Tất cả" },
  { val: 3, label: "⭐3+" },
  { val: 4, label: "⭐4+" },
  { val: 4.5, label: "⭐4.5+" },
];

interface Props {
  city: string;
  sortBy: BrowseFilters["sortBy"];
  minRating: number;
  onCityChange: (v: string) => void;
  onSortByChange: (v: BrowseFilters["sortBy"]) => void;
  onMinRatingChange: (v: number) => void;
}

/** Advanced sort/city/rating filter controls for the browse sidebar */
export function BrowseSidebarAdvancedSortAndAvailabilityFilters({
  city, sortBy, minRating,
  onCityChange, onSortByChange, onMinRatingChange,
}: Props) {
  return (
    <>
      {/* Thành phố */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="city-select" className="text-sm font-semibold">
          Thành phố
        </Label>
        <select
          id="city-select"
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Sắp xếp */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Sắp xếp</p>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              <input
                type="radio"
                name="sortBy"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={() => onSortByChange(opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Đánh giá tối thiểu */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-foreground">Đánh giá tối thiểu</p>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map(({ val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => onMinRatingChange(val)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                minRating === val
                  ? "bg-primary text-primary-foreground border-primary font-medium"
                  : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
