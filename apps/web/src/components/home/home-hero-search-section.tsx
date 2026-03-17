import { useState } from "react";
import { Button } from "@chomuon/ui/components/button";

export function HomeHeroSearchSection() {
  const [keyword, setKeyword] = useState("");
  const [district, setDistrict] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (district) params.set("district", district);
    window.location.href = `/browse?${params.toString()}`;
  }

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Radial amber background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--color-primary) 10%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center flex flex-col gap-6">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          Thuê bất cứ thứ gì
          <br />
          <span className="text-primary">bạn cần</span> — từ cộng đồng
        </h1>

        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Từ máy ảnh đến lều cắm trại, từ nhạc cụ đến thiết bị sự kiện.
          ChoMuon kết nối bạn với chủ đồ gần bạn.
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mt-2">
          <input
            type="text"
            placeholder="Tìm đồ bạn cần..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="bg-card border border-border rounded-lg px-4 py-3 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <input
            type="text"
            placeholder="Quận/huyện..."
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="bg-card border border-border rounded-lg px-4 py-3 text-sm w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button
            type="submit"
            className="bg-primary text-primary-foreground px-6 py-3 h-auto rounded-lg font-semibold shrink-0 hover:bg-primary/90"
          >
            Tìm kiếm
          </Button>
        </form>
      </div>
    </section>
  );
}
