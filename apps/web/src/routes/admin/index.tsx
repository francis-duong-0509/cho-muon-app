import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Users,
  Package,
  ShieldCheck,
  ClipboardList,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  // TODO: Replace with real API data from admin stats endpoint
  const stats = [
    {
      label: "Tổng người dùng",
      value: "—",
      change: null,
      icon: Users,
      to: "/admin/users",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Đồ cho thuê",
      value: "—",
      change: null,
      icon: Package,
      to: "/admin/listings",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "KYC chờ duyệt",
      value: "—",
      change: null,
      icon: ShieldCheck,
      to: "/admin/kyc",
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Đơn thuê",
      value: "—",
      change: null,
      icon: ClipboardList,
      to: "/admin/bookings",
      color: "text-violet-600 bg-violet-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-sm text-gray-500 mt-1">Chào mừng trở lại! Đây là tổng quan hệ thống.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.to}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            {stat.change && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs font-medium text-green-600">{stat.change}</span>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Quick actions + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Hành động nhanh</h2>
          <div className="space-y-2">
            <QuickAction
              icon={ShieldCheck}
              label="Duyệt KYC"
              description="Xem và phê duyệt yêu cầu xác minh"
              to="/admin/kyc"
              color="text-amber-600 bg-amber-50"
            />
            <QuickAction
              icon={Package}
              label="Kiểm duyệt đồ"
              description="Duyệt đồ cho thuê mới đăng"
              to="/admin/listings"
              color="text-emerald-600 bg-emerald-50"
            />
            <QuickAction
              icon={Users}
              label="Quản lý người dùng"
              description="Xem và quản lý tài khoản"
              to="/admin/users"
              color="text-blue-600 bg-blue-50"
            />
          </div>
        </div>

        {/* Recent activity placeholder */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-bold text-gray-900 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-3">
            <ActivityItem
              icon={CheckCircle2}
              text="Hệ thống đang hoạt động bình thường"
              time="Vừa xong"
              color="text-green-500"
            />
            <ActivityItem
              icon={Clock}
              text="Có yêu cầu KYC chờ duyệt"
              time="Kiểm tra ngay"
              color="text-amber-500"
            />
            <ActivityItem
              icon={AlertTriangle}
              text="Dữ liệu thống kê sẽ sớm ra mắt"
              time="Đang phát triển"
              color="text-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  description,
  to,
  color,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  to: string;
  color: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
    >
      <div className={`p-2 rounded-lg ${color} shrink-0`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
    </Link>
  );
}

function ActivityItem({
  icon: Icon,
  text,
  time,
  color,
}: {
  icon: React.ElementType;
  text: string;
  time: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700">{text}</p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  );
}
