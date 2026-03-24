import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { Star, Sparkles } from "lucide-react";

interface NewArrivalListing {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  pricePerDay: number;
  district: string;
  avgRating: string | null;
  images: { url: string }[];
}

function NewArrivalCard({ listing }: { listing: NewArrivalListing }) {
  const coverImage = listing.images[0]?.url ?? listing.thumbnailUrl;

  return (
    <Link
      to="/listing/$id"
      params={{ id: listing.id }}
      className="shrink-0 w-40 group"
    >
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all duration-200">
        {/* Portrait image */}
        <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
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
          <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-tight">
            {listing.title}
          </p>
          <p className="text-primary font-bold text-sm">
            {listing.pricePerDay.toLocaleString("vi-VN")}đ
            <span className="text-gray-400 font-normal text-xs">/ngày</span>
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-0.5">
              <Star className="w-3 h-3 text-primary fill-primary" />
              <span>{listing.avgRating ? Number(listing.avgRating).toFixed(1) : "Mới"}</span>
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-1.5 py-0.5 truncate max-w-[70px]">
              {listing.district}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function HomeNewArrivalsHorizontalScrollSection() {
  const { data } = useQuery(orpc.listings.list.queryOptions({
    input: { sortBy: "newest", limit: 6 },
  }));

  const newArrivals = data?.items ?? [];

  if (newArrivals.length === 0) return null;

  return (
    <section className="py-6 px-4 bg-orange-50/50">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5"><Sparkles className="w-5 h-5 text-primary" /> Mới Đăng</h2>
          <a
            href="/browse"
            className="text-sm text-primary font-medium hover:underline underline-offset-2"
          >
            Xem thêm →
          </a>
        </div>

        {/* Horizontal scroll */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 w-max">
            {newArrivals.map((listing) => (
              <NewArrivalCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
