import Link from "next/link";
import { db } from "@/lib/db";
import { createCustomer } from "@/app/actions/customers";
import { CustomerForm } from "@/components/forms/customer-form";
import { PageHeader } from "@/components/ui";

export const instant = false;

export default async function NewCustomerPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = Array.isArray(sp.error) ? sp.error[0] : sp.error;
  const users = await db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true, team: true }, orderBy: { name: "asc" } });

  return (
    <>
      <PageHeader title="Khách hàng mới" description="Tạo hồ sơ công ty trước khi tạo deal." actions={<Link href="/customers" className="btn">← Danh sách</Link>} />
      {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</div> : null}
      <CustomerForm action={createCustomer} users={users} submitLabel="Tạo khách hàng" />
    </>
  );
}
