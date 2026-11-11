import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, Mail, Phone, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { deleteCustomer } from "@/app/actions/customers";
import { ConfirmButton } from "@/components/confirm-button";
import { Badge, Card, Empty, PageHeader } from "@/components/ui";
import { stageMeta } from "@/lib/crm";
import { daysBetween, formatDate, formatNumber, formatVnd } from "@/lib/format";

export const instant = false;

export default async function CustomerDetailPage({
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

  const customer = await db.customer.findFirst({ where: { id, ...scope }, include: { owner: true } });
  if (!customer) notFound();

  const deals = await db.deal.findMany({
    where: { customerId: id },
    orderBy: [{ status: "asc" }, { value: "desc" }],
    include: { owner: true },
  });
  const activities = await db.activity.findMany({
    where: { deal: { customerId: id } },
    orderBy: { date: "desc" },
    take: 12,
    include: { deal: true, owner: true },
  });

  const revenue = deals.filter((d) => d.status === "Thành công").reduce((s, d) => s + Number(d.value), 0);
  const pipeline = deals.filter((d) => d.status === "Đang mở").reduce((s, d) => s + Number(d.expectedValue), 0);
  const last = deals.map((d) => d.lastInteractionAt).filter((d): d is Date => Boolean(d)).sort((a, b) => b.getTime() - a.getTime())[0];
  const quiet = daysBetween(last);

  return (
    <>
      <PageHeader
        title={customer.name}
        description={`${customer.id} · ${customer.industry ?? "—"} · ${customer.segment ?? "—"}`}
        actions={
          <>
            <Link href={`/customers/${customer.id}/edit`} className="btn">Sửa</Link>
            <form action={deleteCustomer}>
              <input type="hidden" name="id" value={customer.id} />
              <ConfirmButton className="btn btn-danger" message={`Xoá khách hàng ${customer.name}? Chỉ xoá được khi không còn deal.`}>
                <Trash2 size={14} /> Xoá
              </ConfirmButton>
            </form>
          </>
        }
      />

      {error ? <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-700">{error}</div> : null}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge tone={customer.status === "Khách hàng" ? "green" : "zinc"}>{customer.status ?? "—"}</Badge>
        {quiet != null && quiet > 30 ? <Badge tone="amber">{quiet} ngày không tương tác</Badge> : null}
        <span className="text-[12px] text-muted">{deals.length} deal · phụ trách {customer.owner?.name ?? "—"}</span>
      </div>

      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        <div className="card px-4 py-3"><div className="kpi-label">Doanh số đã chốt</div><div className="mt-1 text-[22px] font-semibold leading-none text-brand-deep">{formatVnd(revenue, true)}</div></div>
        <div className="card px-4 py-3"><div className="kpi-label">Pipeline đang mở</div><div className="mt-1 text-[22px] font-semibold leading-none">{formatVnd(pipeline, true)}</div></div>
        <div className="card px-4 py-3"><div className="kpi-label">Số deal</div><div className="mt-1 text-[22px] font-semibold leading-none">{deals.length}</div></div>
        <div className="card px-4 py-3"><div className="kpi-label">Tương tác cuối</div><div className="mt-1 text-[16px] font-semibold leading-tight">{formatDate(last)}</div></div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-4">
          <Card title={`Deal của khách hàng (${deals.length})`} pad={false}>
            {deals.length === 0 ? <div className="p-4"><Empty>Chưa có deal. Tạo deal từ trang Pipeline.</Empty></div> : (
              <div className="overflow-x-auto scroll-thin">
                <table className="table min-w-[720px]">
                  <thead><tr><th>Chiến dịch</th><th>Giá trị</th><th>Giai đoạn</th><th>Phụ trách</th><th>Bước tiếp theo</th></tr></thead>
                  <tbody>
                    {deals.map((d) => {
                      const meta = stageMeta(d.stage);
                      return (
                        <tr key={d.id}>
                          <td><Link href={`/deals/${d.id}`} className="font-semibold hover:text-brand-deep">{d.name}</Link><div className="text-[11px] text-muted">{d.id}</div></td>
                          <td className="whitespace-nowrap">{formatVnd(d.value, true)}</td>
                          <td><span className="badge border-line-2 bg-white" style={{ color: meta.color }}><span className="dot" style={{ background: meta.color }} />{d.stage}</span></td>
                          <td className="whitespace-nowrap text-ink-2">{d.owner?.name ?? "—"}</td>
                          <td className="text-[12px]">{d.nextStep ?? "—"}<div className="text-[11px] text-muted">{formatDate(d.nextStepDueAt)}</div></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card title="Hoạt động gần đây" subtitle="Tổng hợp từ tất cả deal của khách hàng" pad={false}>
            {activities.length === 0 ? <div className="p-4"><Empty>Chưa có hoạt động.</Empty></div> : (
              <ul className="divide-y divide-line">
                {activities.map((a) => (
                  <li key={a.id} className="px-4 py-2.5">
                    <div className="text-[12.5px]"><b className="font-semibold">{a.type}</b> · {a.content}</div>
                    <div className="text-[11px] text-muted">{a.deal.name} · {a.owner?.name ?? "—"} · {formatDate(a.date)}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Hồ sơ công ty">
            <dl className="space-y-2.5 text-[12.5px]">
              <div className="flex justify-between gap-3"><dt className="text-muted">Ngành</dt><dd className="text-right">{customer.industry ?? "—"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Phân khúc</dt><dd className="text-right">{customer.segment ?? "—"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Ngân sách/năm</dt><dd className="text-right">{customer.annualBudget ? `${formatNumber(customer.annualBudget)} triệu` : "—"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Tỉnh / thành</dt><dd className="text-right">{customer.city ?? "—"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Agency</dt><dd className="text-right">{customer.agency ?? "—"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-muted">Ngày tạo</dt><dd className="text-right">{formatDate(customer.createdAt)}</dd></div>
            </dl>
          </Card>

          <Card title="Người liên hệ">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-deep"><Building2 size={17} /></span>
              <div>
                <div className="text-[13px] font-semibold">{customer.contactName ?? "—"}</div>
                <div className="text-[11.5px] text-muted">{customer.contactTitle ?? "—"}</div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="badge border-line-2 bg-paper-2 text-ink-2"><Mail size={12} /> Chưa có email</span>
              <span className="badge border-line-2 bg-paper-2 text-ink-2"><Phone size={12} /> Chưa có số</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">Bảng Khách hàng của Buổi 1 không có email/số điện thoại; muốn bổ sung thì thêm cột vào schema.</p>
          </Card>
        </div>
      </div>
    </>
  );
}
