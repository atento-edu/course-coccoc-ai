import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { updateLead } from "@/app/actions/leads";
import { LeadForm } from "@/components/forms/lead-form";
import { PageHeader } from "@/components/ui";

export const instant = false;

export default async function EditLeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  const scope = seesEverything(user) ? {} : { ownerId: user.id };
  const [lead, users] = await Promise.all([
    db.lead.findFirst({ where: { id, ...scope }, include: { owner: true } }),
    db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true, team: true }, orderBy: { name: "asc" } }),
  ]);
  if (!lead) notFound();

  return (
    <>
      <PageHeader
        title="Sửa lead"
        description={lead.company}
        actions={<Link href={`/leads/${lead.id}`} className="btn">← Chi tiết</Link>}
      />
      <LeadForm action={updateLead} lead={lead} users={users} submitLabel="Lưu thay đổi" />
    </>
  );
}
