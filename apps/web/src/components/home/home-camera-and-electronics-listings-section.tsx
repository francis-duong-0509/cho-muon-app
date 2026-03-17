import { LISTINGS } from "@/data/marketplace-mock-data";
import { MarketplaceListingCard } from "@/components/listing/marketplace-listing-card";

export function HomeCameraAndElectronicsListingsSection() {
  const cameraAndElectronicsListings = LISTINGS.filter(
    (listing) =>
      listing.category === "camera" || listing.category === "electronics"
  );

  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">📷 Máy Ảnh &amp; Thiết Bị Điện Tử</h2>
          <a
            href="/browse?category=camera"
            className="text-primary font-medium hover:underline text-sm"
          >
            Xem thêm →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cameraAndElectronicsListings.map((listing) => (
            <MarketplaceListingCard listing={listing} key={listing.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
