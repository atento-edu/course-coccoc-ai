"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function switchUser(formData: FormData) {
  const id = String(formData.get("userId") ?? "");
  if (!id) return;
  const jar = await cookies();
  jar.set("crm_user", id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/");
}
