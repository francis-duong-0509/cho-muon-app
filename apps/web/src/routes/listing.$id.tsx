import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { SiteFooterWithNavLinks } from "@/components/layout/site-footer-with-nav-links";
import { ListingImageGalleryWithLightbox } from "@/components/listing/listing-image-gallery-with-lightbox";
import { orpc, queryClient } from "@/utils/orpc";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/listing/$id")({
  loader: ({ params }) => {
    return queryClient.ensureQueryData(
      orpc.listings.getById.queryOptions({ input: { id: params.id } })
    )
  },
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const { id } = Route.useParams();
  const { data: listing } = useSuspenseQuery(
    orpc.listings.getById.queryOptions({ input: { id } })
  );

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <SiteNavbarWithAuthCta />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <p className="text-4xl mb-4">😕</p>
          <h1 className="text-2xl font-bold text-foreground mb-2">Không tìm thấy đồ</h1>
          <p className="text-muted-foreground mb-6">
            Món đồ này không tồn tại hoặc đã bị gỡ.
          </p>
          <a
            href="/browse"
            className="inline-block bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Khám phá đồ khác
          </a>
        </div>
        <SiteFooterWithNavLinks />
      </div>
    );
  }

  // Transform images from [{url, sortOrder}] → string[] for gallery component
  const imageUrls = listing.images.map((img) => img.url);

  // Map pickupMethod enum to Vietnamese display text
  const pickupMethodLabel =
    listing.pickupMethod === "SHIP_AVAILABLE"
      ? "📦 Giao hàng / Gặp mặt"
      : "🤝 Gặp mặt trực tiếp";

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbarWithAuthCta />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb + Share/Save bar */}
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground transition-colors">Trang chủ</a>
            <span>/</span>
            <a href="/browse" className="hover:text-foreground transition-colors">Khám phá</a>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[240px]">{listing.title}</span>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <span>↗</span>
              <span>Chia sẻ</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <span>💾</span>
              <span>Lưu tin</span>
            </button>
          </div>
        </div>

        {/* Main 2-col: gallery + booking panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <ListingImageGalleryWithLightbox images={imageUrls} title={listing.title} />
          </div>
          <div>
            {/* Inline booking panel — using real data directly */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 sticky top-24">
              <div>
                <span className="text-2xl font-bold text-primary">
                  {listing.pricePerDay.toLocaleString("vi-VN")}đ
                </span>
                <span className="text-muted-foreground text-sm"> / ngày</span>
              </div>
              <div className="border-t border-border" />
              <p className="text-xs text-muted-foreground text-center">
                Chức năng đặt thuê sẽ sớm ra mắt
              </p>
            </div>
          </div>
        </div>

        {/* Details section */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{listing.title}</h1>
            {listing.category && (
              <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                {listing.category.icon} {listing.category.name}
              </span>
            )}
          </div>
          <p className="text-muted-foreground leading-relaxed mb-6">{listing.description}</p>

          {/* Condition notes — replaces mock "specs" */}
          {listing.conditionNotes && (
            <div className="bg-card border border-border rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-2">Tình trạng đồ</h3>
              <p className="text-sm text-muted-foreground">{listing.conditionNotes}</p>
            </div>
          )}
        </section>

        {/* Host section — only show fields that API actually returns */}
        <section className="mb-10 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Thông tin chủ đồ</h2>
          <div className="flex items-start gap-4">
            {listing.owner.avatarUrl ? (
              <img
                src={listing.owner.avatarUrl}
                alt={listing.owner.displayName}
                className="w-16 h-16 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl shrink-0">
                👤
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-foreground">{listing.owner.displayName}</span>
            </div>
          </div>
        </section>

        {/* Thông Tin Cho Thuê */}
        <section className="mb-10 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Thông Tin Cho Thuê</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Số ngày tối thiểu</p>
              <p className="font-semibold text-foreground">{listing.minRentalDays} ngày</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Số ngày tối đa</p>
              <p className="font-semibold text-foreground">{listing.maxRentalDays} ngày</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Đặt cọc</p>
              <p className="font-semibold text-foreground">
                {listing.depositAmount.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">Tình trạng</p>
              {listing.status === "ACTIVE" ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  Còn trống
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                  Đã cho thuê
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-1">Hình thức nhận đồ</p>
            <p className="text-sm text-foreground font-medium">{pickupMethodLabel}</p>
          </div>
        </section>

        {/* TODO Phase 1F: Reviews section */}
        {/* TODO Phase 1C: Similar listings */}
      </div>

      <SiteFooterWithNavLinks />
    </div>
  );
}
