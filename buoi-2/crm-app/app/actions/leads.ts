"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { scoreLead, stageMeta } from "@/lib/crm";
import { makeId, formText, formTextOrNull, formInt, formDate } from "@/lib/form";
import { demoNow } from "@/lib/clock";

function parseLead(fd: FormData) {
  const annualBudget = formInt(fd, "annualBudget");
  const source = formTextOrNull(fd, "source");
  const segment = formTextOrNull(fd, "segment");
  const scored = scoreLead({ annualBudget, source, segment });
  const priority = formText(fd, "priority") || scored.priority;

  return {
    company: formText(fd, "company"),
    contactName: formTextOrNull(fd, "contactName"),
    contactTitle: formTextOrNull(fd, "contactTitle"),
    email: formTextOrNull(fd, "email"),
    phone: formTextOrNull(fd, "phone"),
    source,
    industry: formTextOrNull(fd, "industry"),
    segment,
    annualBudget,
    agency: formTextOrNull(fd, "agency"),
    buyingChannel: formTextOrNull(fd, "buyingChannel"),
    productInterest: formTextOrNull(fd, "productInterest"),
    need: formTextOrNull(fd, "need"),
    ownerId: formTextOrNull(fd, "ownerId"),
    status: formText(fd, "status") || "Mới",
    priority,
    note: formTextOrNull(fd, "note"),
    score: scored.score,
    slaHours: scored.slaHours,
  };
}

export async function createLead(fd: FormData) {
  const user = await getCurrentUser();
  const data = parseLead(fd);
  if (!data.company) redirect("/leads/new?error=" + encodeURIComponent("Tên công ty là bắt buộc."));

  const id = makeId("LD");
  const lead = await db.lead.create({
    data: {
      id,
      ...data,
      receivedAt: demoNow(),
      assignedAt: data.ownerId ? demoNow() : null,
      status: data.ownerId && data.status === "Mới" ? "Đã phân công" : data.status,
    },
  });

  await logAudit({ user, action: "create", entity: "lead", entityId: id, after: lead });
  revalidatePath("/leads");
  revalidatePath("/");
  redirect(`/leads/${id}`);
}

export async function updateLead(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) redirect("/leads");

  if (!seesEverything(user) && before.ownerId && before.ownerId !== user.id) {
    redirect(`/leads/${id}?error=${encodeURIComponent("Bạn không phụ trách lead này.")}`);
  }

  const data = parseLead(fd);
  const lead = await db.lead.update({
    where: { id },
    data: {
      ...data,
      assignedAt: data.ownerId && !before.assignedAt ? demoNow() : before.assignedAt,
    },
  });

  await logAudit({ user, action: "update", entity: "lead", entityId: id, before, after: lead });
  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  redirect(`/leads/${id}`);
}

export async function assignLead(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const ownerId = formTextOrNull(fd, "ownerId");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) redirect("/leads");

  const lead = await db.lead.update({
    where: { id },
    data: {
      ownerId,
      assignedAt: ownerId ? demoNow() : null,
      status: ownerId && (before.status === "Mới" || !before.status) ? "Đã phân công" : before.status,
    },
  });

  await logAudit({ user, action: "assign", entity: "lead", entityId: id, before, after: lead });
  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
}

export async function updateLeadStatus(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const status = formText(fd, "status");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) redirect("/leads");

  const lead = await db.lead.update({
    where: { id },
    data: {
      status,
      firstContactAt:
        before.firstContactAt ?? (["Đang chăm sóc", "Đủ điều kiện"].includes(status) ? demoNow() : null),
    },
  });
  await logAudit({ user, action: "status", entity: "lead", entityId: id, before, after: lead });
  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
}

export async function deleteLead(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const before = await db.lead.findUnique({ where: { id } });
  if (!before) redirect("/leads");
  if (!seesEverything(user) && before.ownerId && before.ownerId !== user.id) {
    redirect(`/leads/${id}?error=${encodeURIComponent("Bạn không phụ trách lead này.")}`);
  }

  await db.lead.delete({ where: { id } });
  await logAudit({ user, action: "delete", entity: "lead", entityId: id, before });
  revalidatePath("/leads");
  revalidatePath("/");
  redirect("/leads");
}

export async function convertLead(fd: FormData) {
  const user = await getCurrentUser();
  const id = formText(fd, "id");
  const lead = await db.lead.findUnique({ where: { id } });
  if (!lead) redirect("/leads");
  if (lead.dealId) redirect(`/deals/${lead.dealId}`);

  let customerId = lead.customerId;
  if (!customerId) {
    customerId = makeId("KH");
    await db.customer.create({
      data: {
        id: customerId,
        name: lead.company,
        industry: lead.industry,
        segment: lead.segment,
        annualBudget: lead.annualBudget,
        agency: lead.agency,
        ownerId: lead.ownerId,
        contactName: lead.contactName,
        contactTitle: lead.contactTitle,
        createdAt: demoNow(),
        status: "Tiềm năng",
      },
    });
  }

  const value = formInt(fd, "value") ?? 0;
  const stage = formText(fd, "stage") || "Tiếp cận";
  const owner = lead.ownerId
    ? await db.user.findUnique({ where: { id: lead.ownerId }, select: { team: true } })
    : null;
  const dealId = makeId("DEAL");
  const deal = await db.deal.create({
    data: {
      id: dealId,
      name: formText(fd, "name") || `${lead.company} – Chiến dịch mới`,
      customerId,
      ownerId: lead.ownerId,
      team: owner?.team ?? null,
      source: lead.source,
      format: lead.productInterest,
      value: String(value),
      stage,
      status: "Đang mở",
      probability: stageMeta(stage).probability,
      expectedValue: String(Math.round((value * stageMeta(stage).probability) / 100)),
      createdAt: demoNow(),
      expectedCloseAt: formDate(fd, "expectedCloseAt"),
      nextStep: "Gửi email xác nhận nhu cầu và hẹn brief",
      nextStepDueAt: new Date(demoNow().getTime() + 2 * 86_400_000),
      lastInteractionAt: demoNow(),
    },
  });

  await db.lead.update({
    where: { id },
    data: { dealId, customerId, status: "Chuyển thành deal" },
  });

  await logAudit({ user, action: "convert", entity: "lead", entityId: id, before: lead, after: deal });
  revalidatePath("/leads");
  revalidatePath("/deals");
  redirect(`/deals/${dealId}`);
}
