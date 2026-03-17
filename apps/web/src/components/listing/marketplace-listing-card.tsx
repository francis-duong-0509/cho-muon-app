import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@chomuon/ui/components/avatar";
import { Badge } from "@chomuon/ui/components/badge";

import type { Listing } from "@/types/marketplace-listing-types";

interface MarketplaceListingCardProps {
  listing: Listing;
}

export function MarketplaceListingCard({ listing }: MarketplaceListingCardProps) {
  const { title, category, images, pricePerDay, district, rating, reviewCount, host, verified } = listing;
  const coverImage = images[0];

  return (
    <Link to="/listing/$id" params={{ id: listing.id }} className="block group">
      <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-muted">
          {coverImage ? (
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          ) : null}
          {verified && (
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
              Đã xác minh ✓
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-3 flex flex-col gap-1.5">
          <Badge variant="secondary" className="w-fit text-xs">{category}</Badge>

          <p className="font-semibold text-sm leading-tight truncate">{title}</p>

          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <span>📍</span>
            <span className="truncate">{district}</span>
          </p>

          <p className="text-primary font-bold text-sm">
            {pricePerDay.toLocaleString("vi-VN")}đ/ngày
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span>⭐</span>
              <span>{rating.toFixed(1)}</span>
              <span>({reviewCount})</span>
            </span>
            <div className="flex items-center gap-1.5 min-w-0">
              <Avatar size="sm">
                <AvatarImage src={host.avatar} alt={host.name} />
                <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate max-w-[80px]">{host.name}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
