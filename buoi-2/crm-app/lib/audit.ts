import { db } from "@/lib/db";
import type { CurrentUser } from "@/lib/auth";
import { demoNow } from "@/lib/clock";

export async function logAudit(input: {
  user: CurrentUser;
  action: string;
  entity: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
}) {
  await db.auditLog.create({
    data: {
      userId: input.user.id,
      userName: input.user.name,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      before: input.before == null ? undefined : JSON.parse(JSON.stringify(input.before)),
      after: input.after == null ? undefined : JSON.parse(JSON.stringify(input.after)),
      createdAt: demoNow(),
    },
  });
}
