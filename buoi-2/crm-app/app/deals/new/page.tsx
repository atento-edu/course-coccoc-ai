import Link from "next/link";
import { db } from "@/lib/db";
import { createDeal } from "@/app/actions/deals";
import { DealForm } from "@/components/forms/deal-form";
import { PageHeader } from "@/components/ui";

export const instant = false;

export default async function NewDealPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = Array.isArray(sp.error) ? sp.error[0] : sp.error;
  const [customers, users] = await Promise.all([
    db.customer.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true, team: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <PageHeader
        title="Deal mới"
        description="Tạo một chiến dịch cho khách hàng đã có. Nếu là khách mới, tạo khách hàng trước."
        actions={<Link href="/deals" className="btn">← Pipeline</Link>}
      />
      {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</div> : null}
      <DealForm action={createDeal} customers={customers} users={users} submitLabel="Tạo deal" />
    </>
  );
}
