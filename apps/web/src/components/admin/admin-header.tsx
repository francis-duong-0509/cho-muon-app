import { useState } from "react";
import { Menu, Bell, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface AdminHeaderProps {
  session: { user: { name: string; email: string } };
  onMenuToggle: () => void;
}

export function AdminHeader({ session, onMenuToggle }: AdminHeaderProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="h-16 border-b border-gray-100 bg-white px-4 lg:px-6 flex items-center justify-between shrink-0">
      {/* Left: hamburger (mobile) + page context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <p className="text-xs text-gray-400 font-medium">Xin chào,</p>
          <p className="text-sm font-semibold text-gray-900 -mt-0.5">{session.user.name}</p>
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {session.user.name?.charAt(0).toUpperCase() ?? "A"}
            </span>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-30 truncate">
              {session.user.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-gray-100 rounded-xl shadow-lg z-40 py-1.5">
                <div className="px-3 py-2 border-b border-gray-50">
                  <p className="text-sm font-semibold text-gray-900">{session.user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                </div>
                <div className="py-1">
                  <a href="/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    Về trang chính
                  </a>
                  <button
                    onClick={async () => {
                      await authClient.signOut();
                      window.location.href = "/admin/login";
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
