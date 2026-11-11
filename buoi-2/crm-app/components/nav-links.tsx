"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  Handshake,
  LayoutDashboard,
  PhoneCall,
  Settings,
  Users,
} from "lucide-react";

const items = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/leads", label: "Lead", icon: Users },
  { href: "/deals", label: "Deal", icon: Handshake },
  { href: "/customers", label: "Khách hàng", icon: Building2 },
  { href: "/activities", label: "Hoạt động", icon: PhoneCall },
  { href: "/reports", label: "Báo cáo", icon: BarChart3 },
  { href: "/settings/users", label: "Người dùng", icon: Settings },
];

export function NavLinks({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={compact ? "flex gap-1 overflow-x-auto pb-1" : "space-y-1"}>
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2 text-[13.5px] font-medium transition",
              compact ? "" : "w-full",
              active
                ? "bg-white/12 text-white"
                : compact
                  ? "text-ink-2 hover:bg-paper-2"
                  : "text-white/62 hover:bg-white/8 hover:text-white",
            ].join(" ")}
          >
            <Icon size={17} strokeWidth={1.9} className={active ? "text-brand" : ""} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
