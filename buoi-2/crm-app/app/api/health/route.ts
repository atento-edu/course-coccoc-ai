import { db } from "@/lib/db";

export const instant = false;

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    const [customers, deals, leads, activities] = await Promise.all([
      db.customer.count(),
      db.deal.count(),
      db.lead.count(),
      db.activity.count(),
    ]);
    return Response.json({ ok: true, db: "up", counts: { customers, deals, leads, activities } });
  } catch (error) {
    return Response.json({ ok: false, db: "down", error: String(error) }, { status: 503 });
  }
}
