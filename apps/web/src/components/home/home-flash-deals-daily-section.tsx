import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Badge } from "@chomuon/ui/components/badge";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Zap } from "lucide-react";

// Fixed end time: 8h 45m 32s from a fixed reference point
const DEAL_DURATION_SECONDS = 8 * 3600 + 45 * 60 + 32;

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

interface FlashListing {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  pricePerDay: number;
  images: { url: string }[];
}

function FlashDealCard({ listing }: { listing: FlashListing }) {
  const originalPrice = Math.round(listing.pricePerDay * 1.3);
  const coverImage = listing.images[0]?.url ?? listing.thumbnailUrl;

  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.id }}
      className="shrink-0 w-36 group"
    >
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all duration-200">
        {/* Square image */}
        <div className="aspect-square bg-gray-100 overflow-hidden">
          {coverImage && (
            <img
              src={coverImage}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          )}
        </div>
        {/* Info */}
        <div className="p-2 flex flex-col gap-1">
          <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight">
            {listing.title}
          </p>
          <div className="flex flex-col gap-0.5">
            <p className="text-primary font-bold text-sm">
              {listing.pricePerDay.toLocaleString("vi-VN")}đ
              <span className="text-gray-400 font-normal text-xs">/ngày</span>
            </p>
            <p className="text-gray-400 line-through text-xs">
              {originalPrice.toLocaleString("vi-VN")}đ
            </p>
          </div>
          <Badge className="bg-red-500 hover:bg-red-500 text-white text-[10px] px-1.5 py-0 h-4 w-fit">
            Tiết kiệm 30%
          </Badge>
        </div>
      </div>
    </Link>
  );
}

export function HomeFlashDealsDailySection() {
  const [timeLeft, setTimeLeft] = useState(DEAL_DURATION_SECONDS);

  const { data } = useQuery(orpc.listings.list.queryOptions({
    input: { sortBy: "price_asc", limit: 5 },
  }));

  const flashDeals = data?.items ?? [];

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (flashDeals.length === 0) return null;

  return (
    <section className="py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header banner */}
        <div className="bg-gradient-to-r from-red-500 to-amber-500 rounded-xl px-4 py-3 flex items-center justify-between mb-4 border-l-4 border-red-700">
          <span className="text-white font-bold text-base tracking-wide">
            <Zap className="w-4 h-4 inline mr-1" /> Giá Tốt Hôm Nay
          </span>
          <div className="flex items-center gap-2">
            <span className="text-white/80 text-xs">Còn lại:</span>
            <span className="bg-black/20 text-white font-mono font-bold text-sm px-2 py-0.5 rounded-md tracking-widest">
              {formatTime(timeLeft)}
            </span>
            <a
              href="/browse"
              className="text-white/90 text-xs underline-offset-2 hover:underline ml-2 whitespace-nowrap"
            >
              Xem tất cả ưu đãi →
            </a>
          </div>
        </div>

        {/* Horizontal scroll row */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 w-max">
            {flashDeals.map((listing) => (
              <FlashDealCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
