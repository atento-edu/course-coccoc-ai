import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Mail, Phone, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { assignLead, convertLead, deleteLead, updateLeadStatus } from "@/app/actions/leads";
import { ConfirmButton } from "@/components/confirm-button";
import { Badge, Card, PageHeader } from "@/components/ui";
import { LEAD_STATUSES, LEAD_STATUS_COLORS, PRIORITY_COLORS, STAGES } from "@/lib/crm";
import { formatDateTime, formatNumber } from "@/lib/format";
import { toInputDate } from "@/lib/format";
import { demoNow } from "@/lib/clock";

export const instant = false;

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const error = Array.isArray(sp.error) ? sp.error[0] : sp.error;
  const user = await getCurrentUser();
  const scope = seesEverything(user) ? {} : { ownerId: user.id };

  const lead = await db.lead.findFirst({
    where: { id, ...scope },
    include: { owner: true, customer: true, deal: true },
  });
  if (!lead) notFound();

  const [users, audits] = await Promise.all([
    db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true, team: true }, orderBy: { name: "asc" } }),
    db.auditLog.findMany({ where: { entity: "lead", entityId: id }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return (
    <>
      <PageHeader
        title={lead.company}
        description={`Lead ${lead.id} · nhận ${formatDateTime(lead.receivedAt)}`}
        actions={
          <>
            <Link href={`/leads/${lead.id}/edit`} className="btn">Sửa</Link>
            <form action={deleteLead}>
              <input type="hidden" name="id" value={lead.id} />
              <ConfirmButton className="btn btn-danger" message={`Xoá lead ${lead.company}?`}>
                <Trash2 size={14} /> Xoá
              </ConfirmButton>
            </form>
          </>
        }
      />

      {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</div> : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {lead.status ? <span className={`badge ${LEAD_STATUS_COLORS[lead.status] ?? ""}`}>{lead.status}</span> : null}
        {lead.priority ? <span className={`badge ${PRIORITY_COLORS[lead.priority] ?? ""}`}>Ưu tiên {lead.priority} · {lead.score ?? 0} điểm</span> : null}
        {lead.slaStatus ? <Badge tone={lead.slaStatus === "Đạt" ? "green" : lead.slaStatus === "Còn trong hạn" ? "amber" : "red"}>{lead.slaStatus} · SLA {lead.slaHours ?? "—"}h</Badge> : null}
        {lead.deal ? <Link href={`/deals/${lead.deal.id}`} className="badge border-brand-line bg-brand-soft text-brand-deep">Đã thành deal →</Link> : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <Card title="Thông tin lead">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <div><dt className="kpi-label">Người liên hệ</dt><dd className="mt-0.5 font-medium">{lead.contactName ?? "—"}</dd></div>
              <div><dt className="kpi-label">Chức danh</dt><dd className="mt-0.5">{lead.contactTitle ?? "—"}</dd></div>
              <div><dt className="kpi-label">Email</dt><dd className="mt-0.5">{lead.email ? <a className="inline-flex items-center gap-1 text-brand-deep hover:underline" href={`mailto:${lead.email}`}><Mail size={13} />{lead.email}</a> : "—"}</dd></div>
              <div><dt className="kpi-label">Điện thoại</dt><dd className="mt-0.5">{lead.phone ? <a className="inline-flex items-center gap-1 text-brand-deep hover:underline" href={`tel:${lead.phone}`}><Phone size={13} />{lead.phone}</a> : "—"}</dd></div>
              <div><dt className="kpi-label">Ngành</dt><dd className="mt-0.5">{lead.industry ?? "—"}</dd></div>
              <div><dt className="kpi-label">Phân khúc</dt><dd className="mt-0.5">{lead.segment ?? "—"}</dd></div>
              <div><dt className="kpi-label">Ngân sách/năm</dt><dd className="mt-0.5">{lead.annualBudget ? `${formatNumber(lead.annualBudget)} triệu` : "—"}</dd></div>
              <div><dt className="kpi-label">Agency</dt><dd className="mt-0.5">{lead.agency ?? "—"}</dd></div>
              <div><dt className="kpi-label">Nguồn</dt><dd className="mt-0.5">{lead.source ?? "—"}</dd></div>
              <div><dt className="kpi-label">Kênh mua</dt><dd className="mt-0.5">{lead.buyingChannel ?? "—"}</dd></div>
              <div><dt className="kpi-label">Sản phẩm quan tâm</dt><dd className="mt-0.5">{lead.productInterest ?? "—"}</dd></div>
              <div><dt className="kpi-label">Phụ trách</dt><dd className="mt-0.5">{lead.owner?.name ?? <span className="text-orange">Chưa phân công</span>}</dd></div>
            </dl>
            {lead.need ? <div className="mt-4 rounded-xl bg-paper-2/70 p-3"><div className="kpi-label">Nhu cầu</div><p className="mt-1 text-[13px] leading-relaxed text-ink-2">{lead.need}</p></div> : null}
            {lead.note ? <div className="mt-2 rounded-xl bg-amber-50 p-3"><div className="kpi-label">Ghi chú</div><p className="mt-1 text-[13px] leading-relaxed text-ink-2">{lead.note}</p></div> : null}
          </Card>

          <Card title="Chuyển thành deal" subtitle="Tạo deal từ lead, giữ nguyên khách hàng và người phụ trách">
            {lead.deal ? (
              <p className="text-[13px] text-ink-2">
                Lead này đã thành deal <Link href={`/deals/${lead.deal.id}`} className="font-semibold text-brand-deep hover:underline">{lead.deal.name}</Link>.
              </p>
            ) : (
              <form action={convertLead} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="id" value={lead.id} />
                <div className="sm:col-span-2">
                  <label className="label" htmlFor="name">Tên chiến dịch</label>
                  <input id="name" name="name" className="input" defaultValue={`${lead.company} – Chiến dịch mới`} />
                </div>
                <div>
                  <label className="label" htmlFor="value">Giá trị IO dự kiến (VNĐ)</label>
                  <input id="value" name="value" type="number" min="0" className="input" defaultValue={0} />
                </div>
                <div>
                  <label className="label" htmlFor="stage">Giai đoạn</label>
                  <select id="stage" name="stage" className="select" defaultValue="Tiếp cận">
                    {STAGES.filter((s) => !["Thành công", "Thất bại"].includes(s.name)).map((s) => <option key={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="expectedCloseAt">Ngày chốt dự kiến</label>
                  <input id="expectedCloseAt" name="expectedCloseAt" type="date" className="input" defaultValue={toInputDate(new Date(demoNow().getTime() + 30 * 86_400_000))} />
                </div>
                <div className="flex items-end">
                  <button className="btn btn-primary" type="submit"><ArrowRight size={14} /> Tạo deal</button>
                </div>
              </form>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Phân công">
            <form action={assignLead} className="space-y-2">
              <input type="hidden" name="id" value={lead.id} />
              <label className="label" htmlFor="ownerId">Sales phụ trách</label>
              <select id="ownerId" name="ownerId" defaultValue={lead.ownerId ?? ""} className="select">
                <option value="">Chưa phân công</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}{u.team ? ` · ${u.team}` : ""}</option>)}
              </select>
              <button className="btn btn-ink w-full" type="submit">Cập nhật phân công</button>
            </form>
          </Card>

          <Card title="Trạng thái">
            <form action={updateLeadStatus} className="space-y-2">
              <input type="hidden" name="id" value={lead.id} />
              <label className="label" htmlFor="status">Trạng thái lead</label>
              <select id="status" name="status" defaultValue={lead.status ?? "Mới"} className="select">
                {LEAD_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className="btn w-full" type="submit">Lưu trạng thái</button>
            </form>
            <dl className="mt-4 space-y-2 border-t border-line pt-3 text-[12px]">
              <div className="flex justify-between gap-2"><dt className="text-muted">Nhận lúc</dt><dd>{formatDateTime(lead.receivedAt)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted">Giao lúc</dt><dd>{formatDateTime(lead.assignedAt)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted">Liên hệ đầu</dt><dd>{formatDateTime(lead.firstContactAt)}</dd></div>
              <div className="flex justify-between gap-2"><dt className="text-muted">Phản hồi</dt><dd>{lead.responseHours != null ? `${lead.responseHours} giờ` : "—"}</dd></div>
            </dl>
          </Card>

          <Card title="Lịch sử thay đổi" pad={false}>
            {audits.length === 0 ? <p className="p-4 text-[12px] text-muted">Chưa có thay đổi.</p> : (
              <ul className="divide-y divide-line">
                {audits.map((a) => (
                  <li key={a.id} className="px-4 py-2.5 text-[12px]">
                    <div className="font-medium">{a.userName ?? "Hệ thống"} · {a.action}</div>
                    <div className="text-[11px] text-muted">{formatDateTime(a.createdAt)}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
