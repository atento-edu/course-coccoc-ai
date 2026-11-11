import Link from "next/link";
import { db } from "@/lib/db";
import { LeadForm } from "@/components/forms/lead-form";
import { PageHeader } from "@/components/ui";
import { createLead } from "@/app/actions/leads";

export const instant = false;

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const error = Array.isArray(sp.error) ? sp.error[0] : sp.error;
  const users = await db.user.findMany({
    where: { role: "SALES" },
    select: { id: true, name: true, team: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <PageHeader
        title="Lead mới"
        description="Nhập thông tin lead. Điểm, mức ưu tiên và SLA sẽ được tính khi lưu."
        actions={<Link href="/leads" className="btn">← Danh sách lead</Link>}
      />
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</div>
      ) : null}
      <LeadForm action={createLead} users={users} submitLabel="Tạo lead" />
    </>
  );
}
