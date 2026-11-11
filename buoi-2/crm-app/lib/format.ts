import type { Prisma } from "@prisma/client";
import { demoNow } from "@/lib/clock";

type Money = Prisma.Decimal | number | string | null | undefined;

export function toNumber(value: Money): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  return Number(value.toString());
}

export function formatVnd(value: Money, compact = false): string {
  const n = toNumber(value);
  if (compact) {
    if (Math.abs(n) >= 1_000_000_000) {
      return `${(n / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 2 })} tỷ`;
    }
    if (Math.abs(n) >= 1_000_000) {
      return `${(n / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} tr`;
    }
  }
  return `${n.toLocaleString("vi-VN")} ₫`;
}

export function formatNumber(value: number | null | undefined): string {
  return (value ?? 0).toLocaleString("vi-VN");
}

export function formatPercent(value: number | null | undefined): string {
  return `${(value ?? 0).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}%`;
}

const dateFmt = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});

const dateTimeFmt = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  return dateFmt.format(new Date(value));
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  return dateTimeFmt.format(new Date(value));
}

export function toInputDate(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function daysBetween(from: Date | string | null | undefined, to = demoNow()): number | null {
  if (!from) return null;
  const a = new Date(from).getTime();
  return Math.floor((to.getTime() - a) / 86_400_000);
}

export function isOverdue(value: Date | string | null | undefined): boolean {
  if (!value) return false;
  return new Date(value).getTime() < demoNow().getTime();
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}
