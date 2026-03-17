import { createFileRoute } from "@tanstack/react-router";
import { SiteNavbarWithAuthCta } from "@/components/layout/site-navbar-with-auth-cta";
import { SiteFooterWithNavLinks } from "@/components/layout/site-footer-with-nav-links";
import { ListingImageGalleryWithLightbox } from "@/components/listing/listing-image-gallery-with-lightbox";
import { ListingBookingRequestPanel } from "@/components/listing/listing-booking-request-panel";
import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";
import { LISTINGS } from "@/data/marketplace-mock-data";

export const Route = createFileRoute("/listing/$id")({
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const { id } = Route.useParams();
  const listing = LISTINGS.find((l) => l.id === id);

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

  const similarListings = LISTINGS.filter(
    (l) => l.category === listing.category && l.id !== listing.id
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteNavbarWithAuthCta />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <a href="/" className="hover:text-foreground transition-colors">Trang chủ</a>
          <span>/</span>
          <a href="/browse" className="hover:text-foreground transition-colors">Khám phá</a>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[240px]">{listing.title}</span>
        </nav>

        {/* Main 2-col: gallery + booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <ListingImageGalleryWithLightbox images={listing.images} title={listing.title} />
          </div>
          <div>
            <ListingBookingRequestPanel listing={listing} />
          </div>
        </div>

        {/* Details section */}
        <section className="mb-10">
          <h1 className="text-2xl font-bold text-foreground mb-2">{listing.title}</h1>
          <p className="text-muted-foreground leading-relaxed mb-6">{listing.description}</p>

          {/* Specs table */}
          {Object.keys(listing.specs).length > 0 && (
            <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(listing.specs).map(([key, value], idx) => (
                    <tr key={key} className={idx % 2 === 0 ? "bg-muted/40" : ""}>
                      <td className="px-4 py-2.5 font-medium text-foreground w-1/3">{key}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Rules */}
          {listing.rules.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Quy định thuê</h3>
              <ul className="flex flex-col gap-1">
                {listing.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Host section */}
        <section className="mb-10 bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Thông tin chủ đồ</h2>
          <div className="flex items-start gap-4">
            <img
              src={listing.host.avatar}
              alt={listing.host.name}
              className="w-16 h-16 rounded-full object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground">{listing.host.name}</span>
                {listing.host.verified && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                    Đã xác minh ✓
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{listing.host.bio}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>⭐ {listing.host.rating.toFixed(1)} ({listing.host.reviewCount} đánh giá)</span>
                <span>💬 Phản hồi {listing.host.responseRate}%</span>
                <span>⏱ {listing.host.responseTime}</span>
                <span>📅 Thành viên từ {listing.host.joinedYear}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        {listing.reviews.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4">
              Đánh giá ({listing.reviewCount})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listing.reviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm text-foreground">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-400" : "text-muted"}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Similar listings */}
        {similarListings.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-bold text-foreground mb-4">Đồ tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarListings.map((item) => (
                <MarketplaceListingCard key={item.id} listing={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <SiteFooterWithNavLinks />
    </div>
  );
}
