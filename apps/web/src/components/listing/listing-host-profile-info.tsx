"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@chomuon/ui/components/avatar"
import { Badge } from "@chomuon/ui/components/badge"
import { Button } from "@chomuon/ui/components/button"
import { Separator } from "@chomuon/ui/components/separator"
import type { Host } from "@/types/marketplace-listing-types"
import { Star, MessageCircle, Timer } from "lucide-react"

interface ListingHostProfileInfoProps {
  host: Host
}

export function ListingHostProfileInfo({ host }: ListingHostProfileInfoProps) {
  const { name, avatar, rating, reviewCount, responseRate, responseTime, verified, joinedYear, bio } = host

  return (
    <div className="flex flex-col gap-4">
      {/* Avatar + name + verified */}
      <div className="flex items-center gap-4">
        <Avatar size="lg" className="size-16">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-base">{name}</span>
          {verified && (
            <Badge variant="secondary" className="w-fit text-xs">
              Đã xác minh ✓
            </Badge>
          )}
        </div>
      </div>

      <Separator />

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
          <span>({reviewCount} đánh giá)</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageCircle className="w-4 h-4" />
          <span>Phản hồi {responseRate}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
          <Timer className="w-4 h-4" />
          <span>Thường trả lời trong {responseTime}</span>
        </div>
      </div>

      {/* Joined year */}
      <p className="text-sm text-muted-foreground">
        Thành viên từ năm {joinedYear}
      </p>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button variant="outline" size="sm" className="flex-1">
          Xem hồ sơ
        </Button>
        <Button size="sm" className="flex-1">
          Liên hệ chủ đồ
        </Button>
      </div>
    </div>
  )
}
