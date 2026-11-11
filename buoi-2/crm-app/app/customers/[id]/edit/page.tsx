import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { updateCustomer } from "@/app/actions/customers";
import { CustomerForm } from "@/components/forms/customer-form";
import { PageHeader } from "@/components/ui";

export const instant = false;

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const scope = seesEverything(user) ? {} : { ownerId: user.id };
  const [customer, users] = await Promise.all([
    db.customer.findFirst({ where: { id, ...scope } }),
    db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true, team: true }, orderBy: { name: "asc" } }),
  ]);
  if (!customer) notFound();

  return (
    <>
      <PageHeader title="Sửa khách hàng" description={customer.name} actions={<Link href={`/customers/${customer.id}`} className="btn">← Chi tiết</Link>} />
      <CustomerForm action={updateCustomer} customer={customer} users={users} submitLabel="Lưu thay đổi" />
    </>
  );
}
