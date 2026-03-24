import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@chomuon/ui/components/avatar";
import { Badge } from "@chomuon/ui/components/badge";
import { Camera, Star, MapPin } from "lucide-react";

interface ListingItem {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  pricePerDay: number;
  province: string;
  district: string;
  avgRating: string | null;
  totalBookings: number;
  owner?: {
    displayName: string;
    avatarUrl: string | null;
  };
  category?: {
    id: string;
    name: string;
    icon: string | null;
  };
  images: { url: string }[];
}

interface MarketplaceListingCardProps {
  listing: ListingItem;
}

export function MarketplaceListingCard({ listing }: MarketplaceListingCardProps) {
  const { title, thumbnailUrl, pricePerDay, district, avgRating, totalBookings, owner, category, images } = listing;

  // Prefer first uploaded image, fallback to thumbnailUrl
  const coverImage = images[0]?.url ?? thumbnailUrl;

  return (
    <Link to="/listing/$id" params={{ id: listing.id }} className="block group">
      <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-4/3 bg-muted">
          {coverImage ? (
            <img src={coverImage} alt={title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Camera className="w-10 h-10" /></div>
          )}
        </div>

        {/* Body */}
        <div className="p-3 flex flex-col gap-1.5">
          {category && (
            <Badge variant="secondary" className="w-fit text-xs">
              {category.icon && <span className="mr-1">{category.icon}</span>}
              {category.name}
            </Badge>
          )}

          <p className="font-semibold text-sm leading-tight truncate">{title}</p>

          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{district}</span>
          </p>

          <p className="text-primary font-bold text-sm">
            {pricePerDay.toLocaleString("vi-VN")}đ/ngày
          </p>

          {/* Bottom row */}
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-primary fill-primary" />
              <span>{avgRating ? Number(avgRating).toFixed(1) : "Mới"}</span>
              {totalBookings > 0 && <span>({totalBookings})</span>}
            </span>
            {owner && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Avatar size="sm">
                  <AvatarImage src={owner.avatarUrl ?? undefined} alt={owner.displayName} />
                  <AvatarFallback>{owner.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground truncate max-w-20">{owner.displayName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
