"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { makeId, formText, formDateOrNow } from "@/lib/form";

export async function addActivity(fd: FormData) {
  const user = await getCurrentUser();
  const dealId = formText(fd, "dealId");
  const deal = await db.deal.findUnique({ where: { id: dealId } });
  if (!deal) redirect("/activities");
  if (!seesEverything(user) && deal.ownerId && deal.ownerId !== user.id) {
    redirect(`/deals/${dealId}?error=${encodeURIComponent("Bạn không phụ trách deal này.")}`);
  }

  const date = formDateOrNow(fd, "date");
  const id = makeId("HD");
  const activity = await db.activity.create({
    data: {
      id,
      dealId,
      ownerId: user.id,
      type: formText(fd, "type") || "Ghi chú",
      content: formText(fd, "content") || "(không có nội dung)",
      date,
    },
  });

  await db.deal.update({
    where: { id: dealId },
    data: { lastInteractionAt: new Date(date.getTime() + 9 * 3_600_000) },
  });

  await logAudit({ user, action: "activity", entity: "deal", entityId: dealId, after: activity });
  revalidatePath(`/deals/${dealId}`);
  revalidatePath("/activities");
  revalidatePath("/");
}

export async function deleteActivity(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const activity = await db.activity.findUnique({ where: { id }, include: { deal: true } });
  if (!activity) redirect("/activities");
  if (!seesEverything(user) && activity.deal.ownerId && activity.deal.ownerId !== user.id) {
    redirect(`/deals/${activity.dealId}?error=${encodeURIComponent("Bạn không phụ trách deal này.")}`);
  }

  await db.activity.delete({ where: { id } });
  await logAudit({ user, action: "delete-activity", entity: "deal", entityId: activity.dealId, before: activity });
  revalidatePath(`/deals/${activity.dealId}`);
  revalidatePath("/activities");
}
