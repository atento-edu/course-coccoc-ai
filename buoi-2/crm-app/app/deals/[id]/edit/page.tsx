import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { updateDeal } from "@/app/actions/deals";
import { DealForm } from "@/components/forms/deal-form";
import { PageHeader } from "@/components/ui";

export const instant = false;

export default async function EditDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const scope = seesEverything(user) ? {} : { ownerId: user.id };
  const [deal, customers, users] = await Promise.all([
    db.deal.findFirst({ where: { id, ...scope } }),
    db.customer.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true, team: true }, orderBy: { name: "asc" } }),
  ]);
  if (!deal) notFound();

  return (
    <>
      <PageHeader
        title="Sửa deal"
        description={deal.name}
        actions={<Link href={`/deals/${deal.id}`} className="btn">← Chi tiết</Link>}
      />
      <DealForm action={updateDeal} deal={deal} customers={customers} users={users} submitLabel="Lưu thay đổi" />
    </>
  );
}
