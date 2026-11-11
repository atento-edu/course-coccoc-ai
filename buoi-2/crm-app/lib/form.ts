export function makeId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().split("-")[0].toUpperCase()}`;
}

import { demoNow } from "@/lib/clock";

export function formText(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export function formTextOrNull(fd: FormData, key: string): string | null {
  const v = formText(fd, key);
  return v || null;
}

export function formInt(fd: FormData, key: string): number | null {
  const v = formText(fd, key).replace(/[.,\s]/g, "");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}

export function formFloat(fd: FormData, key: string): number | null {
  const v = formText(fd, key).replace(/,/g, "");
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export function formDate(fd: FormData, key: string): Date | null {
  const v = formText(fd, key);
  if (!v) return null;
  const d = new Date(`${v}T00:00:00+07:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formDateOrNow(fd: FormData, key: string): Date {
  return formDate(fd, key) ?? demoNow();
}
