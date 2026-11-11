import { cookies } from "next/headers";
import { db } from "@/lib/db";

export type CurrentUser = {
  id: string;
  name: string;
  team: string | null;
  role: string;
};

export async function getCurrentUser(): Promise<CurrentUser> {
  const jar = await cookies();
  const id = jar.get("crm_user")?.value;

  if (id) {
    const user = await db.user.findUnique({
      where: { id },
      select: { id: true, name: true, team: true, role: true },
    });
    if (user) return user;
  }

  const fallback =
    (await db.user.findFirst({
      where: { role: "MANAGER" },
      select: { id: true, name: true, team: true, role: true },
    })) ??
    (await db.user.findFirst({
      select: { id: true, name: true, team: true, role: true },
      orderBy: { name: "asc" },
    }));

  if (!fallback) throw new Error("Chưa có người dùng. Chạy npm run db:seed.");
  return fallback;
}

export function seesEverything(user: CurrentUser): boolean {
  return user.role === "MANAGER" || user.role === "ADMIN";
}

export function ownerWhere(user: CurrentUser): { ownerId?: string } {
  return seesEverything(user) ? {} : { ownerId: user.id };
}

export function roleLabel(role: string): string {
  return role === "MANAGER" ? "Quản lý" : role === "ADMIN" ? "Quản trị" : "Sales";
}
