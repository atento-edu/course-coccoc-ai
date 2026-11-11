import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, PhoneCall, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { changeStage, deleteDeal, setNextStep } from "@/app/actions/deals";
import { addActivity, deleteActivity } from "@/app/actions/activities";
import { ConfirmButton } from "@/components/confirm-button";
import { Badge, Card, Empty, PageHeader } from "@/components/ui";
import { ACTIVITY_TYPES, stageMeta } from "@/lib/crm";
import { daysBetween, formatDate, formatDateTime, formatVnd, toInputDate } from "@/lib/format";
import { demoNow } from "@/lib/clock";

export const instant = false;

export default async function DealDetailPage({
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

  const deal = await db.deal.findFirst({
    where: { id, ...scope },
    include: {
      customer: true,
      owner: true,
      activities: { include: { owner: true }, orderBy: { date: "desc" } },
    },
  });
  if (!deal) notFound();

  const audits = await db.auditLog.findMany({
    where: { entity: "deal", entityId: id },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  const meta = stageMeta(deal.stage);
  const stale = daysBetween(deal.lastInteractionAt);
  const overdue = deal.nextStepDueAt && new Date(deal.nextStepDueAt) < demoNow();

  return (
    <>
      <PageHeader
        title={deal.name}
        description={`${deal.id} · ${deal.customer.name}`}
        actions={
          <>
            <Link href={`/deals/${deal.id}/edit`} className="btn">Sửa</Link>
            <form action={deleteDeal}>
              <input type="hidden" name="id" value={deal.id} />
              <ConfirmButton className="btn btn-danger" message={`Xoá deal ${deal.name}? Hoạt động liên quan cũng bị xoá.`}>
                <Trash2 size={14} /> Xoá
              </ConfirmButton>
            </form>
          </>
        }
      />

      {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</div> : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="badge border-line-2 bg-white" style={{ color: meta.color }}>
          <span className="dot" style={{ background: meta.color }} /> {deal.stage} · {deal.probability}%
        </span>
        <Badge tone={deal.status === "Thành công" ? "green" : deal.status === "Thất bại" ? "red" : "blue"}>{deal.status}</Badge>
        {overdue ? <Badge tone="orange">Quá hạn bước tiếp theo</Badge> : null}
        {stale != null && stale > 14 ? <Badge tone="amber">{stale} ngày không tương tác</Badge> : null}
        <span className="text-[12px] text-muted">Giá trị kỳ vọng {formatVnd(deal.expectedValue, true)}</span>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-4">
          <Card title="Thông tin deal">
            <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <div><dt className="kpi-label">Khách hàng</dt><dd className="mt-0.5"><Link href={`/customers/${deal.customer.id}`} className="font-medium text-brand-deep hover:underline">{deal.customer.name}</Link></dd></div>
              <div><dt className="kpi-label">Ngành</dt><dd className="mt-0.5">{deal.customer.industry ?? "—"}</dd></div>
              <div><dt className="kpi-label">Giá trị IO</dt><dd className="mt-0.5 text-[16px] font-semibold">{formatVnd(deal.value)}</dd></div>
              <div><dt className="kpi-label">Giá trị kỳ vọng</dt><dd className="mt-0.5 font-medium text-brand-deep">{formatVnd(deal.expectedValue)}</dd></div>
              <div><dt className="kpi-label">Team / Sales</dt><dd className="mt-0.5">{deal.team ?? "—"} · {deal.owner?.name ?? "Chưa gán"}</dd></div>
              <div><dt className="kpi-label">Nguồn</dt><dd className="mt-0.5">{deal.source ?? "—"}</dd></div>
              <div><dt className="kpi-label">Định dạng</dt><dd className="mt-0.5">{deal.format ?? "—"}</dd></div>
              <div><dt className="kpi-label">Ngày tạo</dt><dd className="mt-0.5">{formatDate(deal.createdAt)}</dd></div>
              <div><dt className="kpi-label">Chốt dự kiến</dt><dd className="mt-0.5">{formatDate(deal.expectedCloseAt)}</dd></div>
              <div><dt className="kpi-label">Chốt thực tế</dt><dd className="mt-0.5">{formatDate(deal.actualCloseAt)}</dd></div>
              <div><dt className="kpi-label">Kết thúc chiến dịch</dt><dd className="mt-0.5">{formatDate(deal.campaignEndAt)}</dd></div>
              <div><dt className="kpi-label">Tương tác cuối</dt><dd className="mt-0.5">{formatDate(deal.lastInteractionAt)}</dd></div>
              {deal.lostReason ? <div className="sm:col-span-2"><dt className="kpi-label">Lý do thất bại</dt><dd className="mt-0.5 text-red-700">{deal.lostReason}</dd></div> : null}
            </dl>
          </Card>

          <Card title={`Hoạt động (${deal.activities.length})`} subtitle="Mỗi lần gọi, email, họp đều cập nhật tương tác cuối" pad={false}>
            <form action={addActivity} className="grid gap-2 border-b border-line bg-paper-2/40 p-4 sm:grid-cols-[140px_1fr_auto]">
              <input type="hidden" name="dealId" value={deal.id} />
              <div>
                <label className="label" htmlFor="date">Ngày</label>
                <input id="date" name="date" type="date" className="input" defaultValue={toInputDate(demoNow())} />
              </div>
              <div>
                <label className="label" htmlFor="type">Loại</label>
                <select id="type" name="type" className="select" defaultValue="Gọi điện">
                  {ACTIVITY_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="label" htmlFor="content">Nội dung</label>
                <div className="flex gap-2">
                  <input id="content" name="content" className="input" placeholder="Đã trao đổi gì, kết quả, bước tiếp theo..." required />
                  <button className="btn btn-primary shrink-0" type="submit"><PhoneCall size={14} /> Ghi</button>
                </div>
              </div>
            </form>
            {deal.activities.length === 0 ? <div className="p-4"><Empty>Chưa có hoạt động.</Empty></div> : (
              <ul className="divide-y divide-line">
                {deal.activities.map((a) => (
                  <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-deep"><PhoneCall size={13} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12.5px]"><b className="font-semibold">{a.type}</b> · {a.content}</div>
                      <div className="text-[11px] text-muted">{a.owner?.name ?? "—"} · {formatDate(a.date)}</div>
                    </div>
                    <form action={deleteActivity}>
                      <input type="hidden" name="id" value={a.id} />
                      <ConfirmButton className="text-[11px] text-muted hover:text-red-600" message="Xoá hoạt động này?"><Trash2 size={13} /></ConfirmButton>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Chuyển giai đoạn" subtitle="Xác suất và giá trị kỳ vọng tự cập nhật">
            <form action={changeStage} className="space-y-2">
              <input type="hidden" name="id" value={deal.id} />
              <select key={deal.stage} name="stage" defaultValue={deal.stage} className="select">
                {["Tiếp cận", "Nhận brief", "Gửi đề xuất", "Đàm phán", "Chờ ký IO", "Thành công", "Thất bại"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className="btn btn-ink w-full" type="submit"><ArrowRight size={14} /> Cập nhật giai đoạn</button>
              <p className="text-[11.5px] text-muted">
                Thành công hoặc Thất bại sẽ đóng deal và ghi ngày chốt thực tế. Muốn nhập lý do thất bại, dùng nút Sửa.
              </p>
            </form>
          </Card>

          <Card title="Bước tiếp theo">
            <form action={setNextStep} className="space-y-2">
              <input type="hidden" name="id" value={deal.id} />
              <div>
                <label className="label" htmlFor="nextStep">Việc cần làm</label>
                <input id="nextStep" name="nextStep" defaultValue={deal.nextStep ?? ""} className="input" placeholder="Gửi media plan..." />
              </div>
              <div>
                <label className="label" htmlFor="nextStepDueAt">Hạn</label>
                <input id="nextStepDueAt" name="nextStepDueAt" type="date" defaultValue={toInputDate(deal.nextStepDueAt)} className="input" />
              </div>
              <button className="btn w-full" type="submit">Lưu bước tiếp theo</button>
            </form>
          </Card>

          <Card title="Khách hàng">
            <Link href={`/customers/${deal.customer.id}`} className="flex items-start gap-3 rounded-xl border border-line p-3 transition hover:border-brand">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-deep"><Building2 size={16} /></span>
              <div className="min-w-0">
                <div className="truncate text-[13px] font-semibold">{deal.customer.name}</div>
                <div className="text-[11.5px] text-muted">{deal.customer.segment ?? "—"} · {deal.customer.city ?? "—"}</div>
                <div className="mt-0.5 text-[11.5px] text-muted">{deal.customer.contactName ?? "—"}</div>
              </div>
            </Link>
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
