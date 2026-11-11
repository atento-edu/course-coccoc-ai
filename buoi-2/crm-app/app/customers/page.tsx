import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { INDUSTRIES, SEGMENTS } from "@/lib/crm";
import { daysBetween, formatDate, formatNumber, formatVnd } from "@/lib/format";
import { Empty, PageHeader } from "@/components/ui";
import type { Prisma } from "@prisma/client";

export const instant = false;

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) ?? "";
  const q = get("q");
  const industry = get("industry");
  const segment = get("segment");
  const owner = get("owner");
  const status = get("status");

  const user = await getCurrentUser();
  const scope = seesEverything(user) ? {} : { ownerId: user.id };
  const where: Prisma.CustomerWhereInput = {
    ...scope,
    ...(industry ? { industry } : {}),
    ...(segment ? { segment } : {}),
    ...(owner ? { ownerId: owner } : {}),
    ...(status ? { status } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { contactName: { contains: q, mode: "insensitive" } }] } : {}),
  };

  const [customers, users] = await Promise.all([
    db.customer.findMany({
      where,
      include: {
        owner: true,
        deals: { select: { value: true, status: true, expectedValue: true, lastInteractionAt: true } },
      },
      orderBy: { name: "asc" },
    }),
    db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const rows = customers
    .map((c) => {
      const revenue = c.deals.filter((d) => d.status === "Thành công").reduce((s, d) => s + Number(d.value), 0);
      const pipeline = c.deals.filter((d) => d.status === "Đang mở").reduce((s, d) => s + Number(d.expectedValue), 0);
      const last = c.deals
        .map((d) => d.lastInteractionAt)
        .filter((d): d is Date => Boolean(d))
        .sort((a, b) => b.getTime() - a.getTime())[0];
      return { ...c, revenue, pipeline, last, dealCount: c.deals.length };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const sumRevenue = rows.reduce((s, r) => s + r.revenue, 0);
  const sumPipeline = rows.reduce((s, r) => s + r.pipeline, 0);

  return (
    <>
      <PageHeader
        title="Khách hàng"
        description="Hồ sơ 360: thông tin công ty, deal đang mở, doanh số đã chốt và tương tác gần nhất."
        actions={<Link href="/customers/new" className="btn btn-primary"><Plus size={15} /> Khách hàng mới</Link>}
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        <div className="card px-4 py-3"><div className="kpi-label">Tổng khách hàng</div><div className="mt-1 text-[22px] font-semibold leading-none">{formatNumber(rows.length)}</div><div className="mt-1 text-[11px] text-muted">trong phạm vi bạn thấy</div></div>
        <div className="card px-4 py-3"><div className="kpi-label">Đang là khách</div><div className="mt-1 text-[22px] font-semibold leading-none">{rows.filter((r) => r.status === "Khách hàng").length}</div><div className="mt-1 text-[11px] text-muted">đã từng chốt deal</div></div>
        <div className="card px-4 py-3"><div className="kpi-label">Doanh số đã chốt</div><div className="mt-1 text-[22px] font-semibold leading-none text-brand-deep">{formatVnd(sumRevenue, true)}</div><div className="mt-1 text-[11px] text-muted">tất cả các kỳ</div></div>
        <div className="card px-4 py-3"><div className="kpi-label">Pipeline đang mở</div><div className="mt-1 text-[22px] font-semibold leading-none">{formatVnd(sumPipeline, true)}</div><div className="mt-1 text-[11px] text-muted">giá trị kỳ vọng</div></div>
      </div>

      <form className="card mb-4 flex flex-wrap items-end gap-2 p-3" method="get">
        <div className="min-w-52 flex-1">
          <label className="label" htmlFor="q">Tìm kiếm</label>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-muted" />
            <input id="q" name="q" defaultValue={q} className="input pl-9" placeholder="Tên công ty hoặc người liên hệ" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="industry">Ngành</label>
          <select id="industry" name="industry" defaultValue={industry} className="select min-w-40">
            <option value="">Tất cả</option>
            {INDUSTRIES.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="segment">Phân khúc</label>
          <select id="segment" name="segment" defaultValue={segment} className="select min-w-32">
            <option value="">Tất cả</option>
            {SEGMENTS.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="status">Trạng thái</label>
          <select id="status" name="status" defaultValue={status} className="select min-w-32">
            <option value="">Tất cả</option>
            <option>Tiềm năng</option>
            <option>Khách hàng</option>
            <option>Không hoạt động</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="owner">Phụ trách</label>
          <select id="owner" name="owner" defaultValue={owner} className="select min-w-44">
            <option value="">Tất cả</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <button className="btn btn-ink" type="submit"><SlidersHorizontal size={14} /> Lọc</button>
        {(q || industry || segment || owner || status) ? <Link href="/customers" className="btn">Xoá lọc</Link> : null}
      </form>

      {rows.length === 0 ? (
        <div className="card p-6"><Empty>Không có khách hàng khớp bộ lọc.</Empty></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="text-[12px] text-muted">{formatNumber(rows.length)} khách hàng</span>
            <span className="text-[11.5px] text-muted">Sắp theo doanh số</span>
          </div>
          <div className="overflow-x-auto scroll-thin">
            <table className="table min-w-[980px]">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Ngành / phân khúc</th>
                  <th>Ngân sách/năm</th>
                  <th>Deal</th>
                  <th>Doanh số</th>
                  <th>Pipeline</th>
                  <th>Phụ trách</th>
                  <th>Tương tác cuối</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => {
                  const quiet = daysBetween(c.last);
                  return (
                    <tr key={c.id}>
                      <td>
                        <Link href={`/customers/${c.id}`} className="font-semibold hover:text-brand-deep">{c.name}</Link>
                        <div className="text-[11.5px] text-muted">{c.contactName ?? "—"}{c.city ? ` · ${c.city}` : ""}</div>
                      </td>
                      <td className="text-ink-2">{c.industry ?? "—"}<div className="text-[11px] text-muted">{c.segment ?? "—"}</div></td>
                      <td className="whitespace-nowrap">{c.annualBudget ? `${formatNumber(c.annualBudget)} tr` : "—"}</td>
                      <td>{c.dealCount}</td>
                      <td className="whitespace-nowrap font-medium text-brand-deep">{formatVnd(c.revenue, true)}</td>
                      <td className="whitespace-nowrap">{formatVnd(c.pipeline, true)}</td>
                      <td className="whitespace-nowrap text-ink-2">{c.owner?.name ?? "—"}</td>
                      <td>
                        {quiet != null && quiet > 30 ? <span className="badge border-amber-200 bg-amber-50 text-amber-700">{quiet} ngày</span> : <span className="text-[12px] text-muted">{formatDate(c.last)}</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
