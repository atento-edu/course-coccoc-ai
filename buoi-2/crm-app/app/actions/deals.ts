"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { stageMeta } from "@/lib/crm";
import { makeId, formText, formTextOrNull, formInt, formDate } from "@/lib/form";
import { demoNow } from "@/lib/clock";

function statusFor(stage: string): string {
  if (stage === "Thành công") return "Thành công";
  if (stage === "Thất bại") return "Thất bại";
  return "Đang mở";
}

function parseDeal(fd: FormData) {
  const stage = formText(fd, "stage") || "Tiếp cận";
  const value = formInt(fd, "value") ?? 0;
  const probability = stageMeta(stage).probability;
  return {
    name: formText(fd, "name"),
    customerId: formText(fd, "customerId"),
    ownerId: formTextOrNull(fd, "ownerId"),
    team: formTextOrNull(fd, "team"),
    source: formTextOrNull(fd, "source"),
    format: formTextOrNull(fd, "format"),
    value: String(value),
    stage,
    status: statusFor(stage),
    probability,
    expectedValue: String(Math.round((value * probability) / 100)),
    expectedCloseAt: formDate(fd, "expectedCloseAt"),
    actualCloseAt: stage === "Thành công" || stage === "Thất bại" ? formDate(fd, "actualCloseAt") ?? demoNow() : null,
    campaignEndAt: formDate(fd, "campaignEndAt"),
    lostReason: stage === "Thất bại" ? formTextOrNull(fd, "lostReason") ?? "Khác" : null,
    nextStep: formTextOrNull(fd, "nextStep"),
    nextStepDueAt: stage === "Thành công" || stage === "Thất bại" ? null : formDate(fd, "nextStepDueAt"),
  };
}

export async function createDeal(fd: FormData) {
  const user = await getCurrentUser();
  const data = parseDeal(fd);
  if (!data.name) redirect("/deals/new?error=" + encodeURIComponent("Tên chiến dịch là bắt buộc."));
  if (!data.customerId) redirect("/deals/new?error=" + encodeURIComponent("Chọn khách hàng."));

  const id = makeId("DEAL");
  const deal = await db.deal.create({
    data: {
      id,
      ...data,
      createdAt: demoNow(),
      lastInteractionAt: demoNow(),
    },
  });

  await logAudit({ user, action: "create", entity: "deal", entityId: id, after: deal });
  revalidatePath("/deals");
  revalidatePath("/");
  redirect(`/deals/${id}`);
}

export async function updateDeal(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const before = await db.deal.findUnique({ where: { id } });
  if (!before) redirect("/deals");
  if (!seesEverything(user) && before.ownerId && before.ownerId !== user.id) {
    redirect(`/deals/${id}?error=${encodeURIComponent("Bạn không phụ trách deal này.")}`);
  }

  const data = parseDeal(fd);
  const deal = await db.deal.update({ where: { id }, data });

  await logAudit({ user, action: "update", entity: "deal", entityId: id, before, after: deal });
  revalidatePath(`/deals/${id}`);
  revalidatePath("/deals");
  redirect(`/deals/${id}`);
}

export async function changeStage(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const stage = formText(fd, "stage");
  const before = await db.deal.findUnique({ where: { id } });
  if (!before) redirect("/deals");
  if (!seesEverything(user) && before.ownerId && before.ownerId !== user.id) {
    redirect(`/deals/${id}?error=${encodeURIComponent("Bạn không phụ trách deal này.")}`);
  }
  if (!["Tiếp cận", "Nhận brief", "Gửi đề xuất", "Đàm phán", "Chờ ký IO", "Thành công", "Thất bại"].includes(stage)) {
    redirect(`/deals/${id}?error=${encodeURIComponent("Giai đoạn không hợp lệ.")}`);
  }
  if (stage === "Thành công" && Number(before.value) <= 0) {
    redirect(`/deals/${id}?error=${encodeURIComponent("Không thể chốt Thành công khi chưa có giá trị IO.")}`);
  }

  const probability = stageMeta(stage).probability;
  const deal = await db.deal.update({
    where: { id },
    data: {
      stage,
      status: statusFor(stage),
      probability,
      expectedValue: String(Math.round((Number(before.value) * probability) / 100)),
      actualCloseAt: stage === "Thành công" || stage === "Thất bại" ? before.actualCloseAt ?? demoNow() : null,
      lostReason: stage === "Thất bại" ? before.lostReason ?? "Khác" : null,
      nextStepDueAt: stage === "Thành công" || stage === "Thất bại" ? null : before.nextStepDueAt,
    },
  });

  await logAudit({ user, action: `stage:${stage}`, entity: "deal", entityId: id, before, after: deal });
  revalidatePath(`/deals/${id}`);
  revalidatePath("/deals");
  revalidatePath("/");
}

export async function setNextStep(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const before = await db.deal.findUnique({ where: { id } });
  if (!before) redirect("/deals");
  if (!seesEverything(user) && before.ownerId && before.ownerId !== user.id) {
    redirect(`/deals/${id}?error=${encodeURIComponent("Bạn không phụ trách deal này.")}`);
  }

  const deal = await db.deal.update({
    where: { id },
    data: {
      nextStep: formTextOrNull(fd, "nextStep"),
      nextStepDueAt: formDate(fd, "nextStepDueAt"),
    },
  });

  await logAudit({ user, action: "next-step", entity: "deal", entityId: id, before, after: deal });
  revalidatePath(`/deals/${id}`);
  revalidatePath("/deals");
  revalidatePath("/");
}

export async function deleteDeal(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const before = await db.deal.findUnique({ where: { id } });
  if (!before) redirect("/deals");
  if (!seesEverything(user) && before.ownerId && before.ownerId !== user.id) {
    redirect(`/deals/${id}?error=${encodeURIComponent("Bạn không phụ trách deal này.")}`);
  }

  await db.deal.delete({ where: { id } });
  await logAudit({ user, action: "delete", entity: "deal", entityId: id, before });
  revalidatePath("/deals");
  revalidatePath("/");
  redirect("/deals");
}
