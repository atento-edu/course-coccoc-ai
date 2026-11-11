"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { makeId, formText, formTextOrNull, formInt } from "@/lib/form";
import { demoNow } from "@/lib/clock";

function parseCustomer(fd: FormData) {
  return {
    name: formText(fd, "name"),
    industry: formTextOrNull(fd, "industry"),
    segment: formTextOrNull(fd, "segment"),
    annualBudget: formInt(fd, "annualBudget"),
    city: formTextOrNull(fd, "city"),
    agency: formTextOrNull(fd, "agency"),
    ownerId: formTextOrNull(fd, "ownerId"),
    contactName: formTextOrNull(fd, "contactName"),
    contactTitle: formTextOrNull(fd, "contactTitle"),
    status: formText(fd, "status") || "Tiềm năng",
  };
}

export async function createCustomer(fd: FormData) {
  const user = await getCurrentUser();
  const data = parseCustomer(fd);
  if (!data.name) redirect("/customers/new?error=" + encodeURIComponent("Tên công ty là bắt buộc."));

  const id = makeId("KH");
  const customer = await db.customer.create({ data: { id, ...data, createdAt: demoNow() } });
  await logAudit({ user, action: "create", entity: "customer", entityId: id, after: customer });
  revalidatePath("/customers");
  redirect(`/customers/${id}`);
}

export async function updateCustomer(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const before = await db.customer.findUnique({ where: { id } });
  if (!before) redirect("/customers");
  if (!seesEverything(user) && before.ownerId && before.ownerId !== user.id) {
    redirect(`/customers/${id}?error=${encodeURIComponent("Bạn không phụ trách khách hàng này.")}`);
  }

  const data = parseCustomer(fd);
  const customer = await db.customer.update({ where: { id }, data });
  await logAudit({ user, action: "update", entity: "customer", entityId: id, before, after: customer });
  revalidatePath(`/customers/${id}`);
  revalidatePath("/customers");
  redirect(`/customers/${id}`);
}

export async function deleteCustomer(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const before = await db.customer.findUnique({ where: { id } });
  if (!before) redirect("/customers");

  const dealCount = await db.deal.count({ where: { customerId: id } });
  if (dealCount > 0) {
    redirect(`/customers/${id}?error=${encodeURIComponent(`Không xoá được: còn ${dealCount} deal. Xoá deal trước hoặc giữ khách hàng.`)}`);
  }

  await db.customer.delete({ where: { id } });
  await logAudit({ user, action: "delete", entity: "customer", entityId: id, before });
  revalidatePath("/customers");
  redirect("/customers");
}
