"use client"

import { useState } from "react"
import { Button } from "@chomuon/ui/components/button"
import { Separator } from "@chomuon/ui/components/separator"
import type { Listing } from "@/types/marketplace-listing-types"

interface ListingBookingRequestPanelProps {
  listing: Listing
}

export function ListingBookingRequestPanel({ listing }: ListingBookingRequestPanelProps) {
  const { pricePerDay, deposit } = listing
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const dayCount =
    startDate && endDate
      ? Math.max(
          0,
          Math.round(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0

  const rentalTotal = dayCount * pricePerDay
  const grandTotal = rentalTotal + deposit
  const canSubmit = dayCount > 0

  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 sticky top-24">
      {/* Price header */}
      <div>
        <span className="text-2xl font-bold text-primary">
          {pricePerDay.toLocaleString("vi-VN")}đ
        </span>
        <span className="text-muted-foreground text-sm"> / ngày</span>
      </div>

      <Separator />

      {/* Date pickers */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Ngày nhận
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Ngày trả
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split("T")[0]}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Cost breakdown */}
      {canSubmit && (
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>
              {dayCount} ngày × {pricePerDay.toLocaleString("vi-VN")}đ
            </span>
            <span>{rentalTotal.toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Tiền cọc</span>
            <span>{deposit.toLocaleString("vi-VN")}đ</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-primary text-base">
            <span>Tổng cộng</span>
            <span>{grandTotal.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      )}

      {/* CTA */}
      <Button
        className="w-full h-11 text-sm font-semibold"
        disabled={!canSubmit}
      >
        Gửi yêu cầu thuê
      </Button>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Bạn chưa bị trừ tiền. Chủ đồ sẽ xác nhận trong 24h.
      </p>
    </div>
  )
}
