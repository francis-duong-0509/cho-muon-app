import { Button } from "@chomuon/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@chomuon/ui/components/dropdown-menu";
import { Skeleton } from "@chomuon/ui/components/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  User,
  LayoutDashboard,
  Package,
  ShieldCheck,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

/**
 * **UserMenu — Dropdown menu cho user đã đăng nhập.**
 *
 * **Concept: `DropdownMenu` (shadcn/ui, built on Radix UI)**
 * → `DropdownMenuTrigger`: Element khi click sẽ mở dropdown.
 * → `DropdownMenuContent`: Khung chứa nội dung dropdown.
 * → `DropdownMenuItem`: Từng option trong menu.
 * → Radix tự handle: focus management, keyboard navigation, click outside.
 *
 * **Concept: Avatar initial**
 * → Thay vì load ảnh avatar, ta dùng chữ cái đầu tiên của tên.
 * → Tạo visual identity mà không cần API upload avatar.
 */
export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline" size="sm">Đăng nhập</Button>
      </Link>
    );
  }

  const userName = session.user.name ?? "User";
  const userEmail = session.user.email;
  const initial = userName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-2 hover:bg-muted"
          />
        }
      >
        {/* Avatar circle with initial */}
        <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shrink-0">
          {initial}
        </span>
        <span className="text-sm font-medium text-foreground max-w-24 truncate hidden lg:block">
          {userName}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden lg:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-card">
        {/* User info header */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex flex-col gap-0.5 pb-2">
            <span className="text-sm font-semibold">{userName}</span>
            <span className="text-xs text-muted-foreground font-normal">{userEmail}</span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Quick nav links */}
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}>
            <LayoutDashboard className="w-4 h-4 mr-2 text-muted-foreground" />
            Bảng điều khiển
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/dashboard/listings" })}>
            <Package className="w-4 h-4 mr-2 text-muted-foreground" />
            Đồ cho thuê
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/dashboard/profile" })}>
            <User className="w-4 h-4 mr-2 text-muted-foreground" />
            Hồ sơ cá nhân
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/dashboard/profile/kyc" })}>
            <ShieldCheck className="w-4 h-4 mr-2 text-muted-foreground" />
            Xác minh KYC
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Sign out */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate({ to: "/" });
                  },
                },
              });
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
