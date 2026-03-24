import { orpc } from "@/utils/orpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { PackageOpen, Camera } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/dashboard/listings/")({
  component: MyListingPage,
});

function MyListingPage() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined,
  );
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(
    orpc.listings.myListings.queryOptions({
      input: { status: statusFilter as any, page: 1, limit: 20 },
    }),
  );
  const listings = data?.items ?? [];
  const _total = data?.total ?? 0;

  const tabs = [
    { label: "Tất cả", value: undefined },
    { label: "Đang hoạt động", value: "ACTIVE" },
    { label: "Chờ duyệt", value: "PENDING_REVIEW" },
    { label: "Tạm dừng", value: "PAUSED" },
  ] as const;

  // Mutations
  const pauseMutation = useMutation(
    orpc.listings.pause.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.listings.myListings.queryOptions({
            input: { status: statusFilter as any, page: 1, limit: 20 },
          }).queryKey,
        });
      },
    }),
  );

  const activateMutation = useMutation(
    orpc.listings.activate.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.listings.myListings.queryOptions({
            input: { status: statusFilter as any, page: 1, limit: 20 },
          }).queryKey,
        });
      },
    }),
  );

  const deleteMutation = useMutation(
    orpc.listings.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: orpc.listings.myListings.queryOptions({
            input: { status: statusFilter as any, page: 1, limit: 20 },
          }).queryKey,
        });
      },
    }),
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Đồ cho thuê của tôi</h1>
        <Link
          to="/dashboard/listings/new"
          className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          + Đăng đồ mới
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <Spinner variant="section" />
      ) : listings.length === 0 ? (
        <div className="text-center py-16">
          <PackageOpen className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Chưa có đồ cho thuê nào</h2>
          <p className="text-muted-foreground mb-4">
            Bắt đầu đăng đồ để kiếm thêm thu nhập!
          </p>
          <Link
            to="/dashboard/listings/new"
            className="inline-block bg-foreground text-background px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Đăng đồ ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
            >
              {/* Thumbnail */}
              <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden shrink-0">
                {item.thumbnailUrl ? (
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to="/listing/$id"
                  params={{ id: item.id }}
                  className="font-semibold text-foreground hover:underline truncate block"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.pricePerDay.toLocaleString("vi-VN")}đ / ngày
                </p>
              </div>
              {/* Status badge */}
              <StatusBadge status={item.status} />
              {/* Actions */}
              <div className="flex gap-2 shrink-0">
                {item.status === "ACTIVE" && (
                  <button
                    onClick={() => pauseMutation.mutate({ id: item.id })}
                    disabled={pauseMutation.isPending}
                    className="text-sm px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Tạm dừng
                  </button>
                )}
                {item.status === "PAUSED" && (
                  <button
                    onClick={() => activateMutation.mutate({ id: item.id })}
                    disabled={activateMutation.isPending}
                    className="text-sm px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Kích hoạt
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Bạn chắc chắn muốn xóa?"))
                      deleteMutation.mutate({ id: item.id });
                  }}
                  className="text-sm px-3 py-1.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function StatusBadge({status}: {status: string}) {
  const map: Record<string, {label: string; className: string}> = {
    ACTIVE: {label: "Đang hoạt động", className: "text-green-700 bg-green-50"},
    PENDING_REVIEW: {label: "Chờ duyệt", className: "text-yellow-700 bg-yellow-50"},
    PAUSED: {label: "Tạm dừng", className: "text-gray-700 bg-gray-100"},
    SUSPENDED: {label: "Bị đình chỉ", className: "text-red-700 bg-red-50"},
  }

  const badge = map[status] ?? {label: status, className: "text-gray-500 bg-gray-50"}

  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badge.className}`}>{badge.label}</span>
  );
}