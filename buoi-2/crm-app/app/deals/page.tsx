import Link from "next/link";
import { LayoutGrid, List, Plus, Search, SlidersHorizontal } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { OPEN_STAGES, STAGES, stageMeta } from "@/lib/crm";
import { daysBetween, formatDate, formatNumber, formatVnd } from "@/lib/format";
import { Badge, Empty, PageHeader } from "@/components/ui";
import type { Prisma } from "@prisma/client";
import { demoNow } from "@/lib/clock";

export const instant = false;

const PAGE_SIZE = 25;

function hrefWith(base: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...base, ...patch })) if (v) params.set(k, v);
  return `/deals?${params.toString()}`;
}

export default async function DealsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) ?? "";
  const q = get("q");
  const stage = get("stage");
  const owner = get("owner");
  const team = get("team");
  const view = get("view") || "list";
  const page = Math.max(1, Number(get("page") || 1));

  const user = await getCurrentUser();
  const scope = seesEverything(user) ? {} : { ownerId: user.id };
  const now = demoNow();
  const staleCutoff = new Date(now.getTime() - 14 * 86_400_000);

  const where: Prisma.DealWhereInput = {
    ...scope,
    ...(stage ? { stage } : {}),
    ...(owner ? { ownerId: owner } : {}),
    ...(team ? { team } : {}),
    ...(view === "worklist" ? { status: "Đang mở", nextStepDueAt: { lt: now } } : {}),
    ...(view === "stale" ? { status: "Đang mở", lastInteractionAt: { lt: staleCutoff } } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { customer: { name: { contains: q, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  const [total, deals, users, openAgg] = await Promise.all([
    db.deal.count({ where }),
    db.deal.findMany({
      where,
      orderBy: [{ nextStepDueAt: "asc" }, { value: "desc" }],
      skip: view === "kanban" ? 0 : (page - 1) * PAGE_SIZE,
      take: view === "kanban" ? 500 : PAGE_SIZE,
      include: { customer: true, owner: true },
    }),
    db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.deal.aggregate({ where: { status: "Đang mở", ...scope }, _sum: { value: true, expectedValue: true }, _count: { _all: true } }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const base = { q, stage, owner, team, view };
  const kanbanDeals = view === "kanban" ? await db.deal.findMany({
    where: { status: "Đang mở", ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { customer: { name: { contains: q, mode: "insensitive" } } }] } : {}), ...(owner ? { ownerId: owner } : {}), ...(team ? { team } : {}), ...scope },
    orderBy: [{ value: "desc" }],
    include: { customer: true, owner: true },
  }) : [];

  return (
    <>
      <PageHeader
        title="Deal"
        description="Pipeline bán quảng cáo. Chuyển giai đoạn, đặt bước tiếp theo và xem deal nào đang nguội."
        actions={<Link href="/deals/new" className="btn btn-primary"><Plus size={15} /> Deal mới</Link>}
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <div className="card px-4 py-3">
          <div className="kpi-label">Pipeline đang mở</div>
          <div className="mt-1 text-[22px] font-semibold leading-none">{formatVnd(openAgg._sum.value ?? 0, true)}</div>
          <div className="mt-1 text-[11.5px] text-muted">{openAgg._count._all} deal · giá trị IO</div>
        </div>
        <div className="card px-4 py-3">
          <div className="kpi-label">Giá trị kỳ vọng</div>
          <div className="mt-1 text-[22px] font-semibold leading-none text-brand-deep">{formatVnd(openAgg._sum.expectedValue ?? 0, true)}</div>
          <div className="mt-1 text-[11.5px] text-muted">Theo xác suất từng giai đoạn</div>
        </div>
        <div className="card px-4 py-3">
          <div className="kpi-label">Đang hiển thị</div>
          <div className="mt-1 text-[22px] font-semibold leading-none">{formatNumber(total)}</div>
          <div className="mt-1 text-[11.5px] text-muted">{view === "worklist" ? "Deal quá hạn bước tiếp theo" : view === "stale" ? "Deal nguội hơn 14 ngày" : "Theo bộ lọc"}</div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-1 rounded-full border border-line bg-white p-1">
          <Link href={hrefWith(base, { view: "list", page: undefined })} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${view !== "kanban" ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
            <List size={13} /> Bảng
          </Link>
          <Link href={hrefWith(base, { view: "kanban", page: undefined })} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold ${view === "kanban" ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>
            <LayoutGrid size={13} /> Kanban
          </Link>
        </div>
        <div className="flex gap-2 text-[12px]">
          <Link href="/deals?view=worklist" className={`badge ${view === "worklist" ? "border-orange bg-orange text-white" : "border-orange/25 bg-orange/10 text-orange"}`}>Quá hạn</Link>
          <Link href="/deals?view=stale" className={`badge ${view === "stale" ? "border-amber-400 bg-amber-500 text-white" : "border-amber-200 bg-amber-50 text-amber-700"}`}>Nguội &gt;14 ngày</Link>
          <Link href="/deals" className="badge border-line-2 bg-paper-2 text-ink-2">Tất cả</Link>
        </div>
      </div>

      <form className="card mb-4 flex flex-wrap items-end gap-2 p-3" method="get">
        <input type="hidden" name="view" value={view === "kanban" ? "kanban" : view} />
        <div className="min-w-52 flex-1">
          <label className="label" htmlFor="q">Tìm kiếm</label>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-muted" />
            <input id="q" name="q" defaultValue={q} className="input pl-9" placeholder="Tên chiến dịch hoặc khách hàng" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="stage">Giai đoạn</label>
          <select id="stage" name="stage" defaultValue={stage} className="select min-w-36">
            <option value="">Tất cả</option>
            {STAGES.map((s) => <option key={s.name}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="owner">Phụ trách</label>
          <select id="owner" name="owner" defaultValue={owner} className="select min-w-44">
            <option value="">Tất cả</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="team">Team</label>
          <select id="team" name="team" defaultValue={team} className="select min-w-28">
            <option value="">Tất cả</option>
            <option>Agency</option>
            <option>Direct</option>
          </select>
        </div>
        <button className="btn btn-ink" type="submit"><SlidersHorizontal size={14} /> Lọc</button>
        {(q || stage || owner || team) ? <Link href={`/deals?view=${view}`} className="btn">Xoá lọc</Link> : null}
      </form>

      {view === "kanban" ? (
        <div className="overflow-x-auto pb-3 scroll-thin">
          <div className="flex min-w-[1100px] gap-3">
            {OPEN_STAGES.map((s) => {
              const items = kanbanDeals.filter((d) => d.stage === s.name);
              const sum = items.reduce((acc, d) => acc + Number(d.value), 0);
              return (
                <div key={s.name} className="w-[260px] shrink-0">
                  <div className="mb-2 flex items-center justify-between rounded-xl border border-line bg-white px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="dot" style={{ background: s.color }} />
                      <span className="text-[12.5px] font-semibold">{s.name}</span>
                    </div>
                    <span className="text-[11px] text-muted">{items.length}</span>
                  </div>
                  <div className="mb-2 px-1 text-[11px] text-muted">{formatVnd(sum, true)}</div>
                  <div className="space-y-2">
                    {items.map((d) => {
                      const stale = daysBetween(d.lastInteractionAt) ?? 0;
                      return (
                        <Link key={d.id} href={`/deals/${d.id}`} className="block rounded-xl border border-line bg-white p-3 shadow-sm transition hover:border-brand hover:shadow-md">
                          <div className="text-[12.5px] font-semibold leading-snug">{d.name}</div>
                          <div className="mt-1 text-[11.5px] text-muted">{d.customer.name}</div>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-[12px] font-semibold text-brand-deep">{formatVnd(d.value, true)}</span>
                            {stale > 14 ? <span className="badge border-amber-200 bg-amber-50 text-amber-700">{stale}n</span> : <span className="text-[10.5px] text-muted">{d.owner?.name?.split(" ").slice(-1)}</span>}
                          </div>
                        </Link>
                      );
                    })}
                    {items.length === 0 ? <div className="rounded-xl border border-dashed border-line-2 px-3 py-4 text-center text-[11px] text-muted">Trống</div> : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : deals.length === 0 ? (
        <div className="card p-6"><Empty>Không có deal khớp bộ lọc.</Empty></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto scroll-thin">
            <table className="table min-w-[1000px]">
              <thead>
                <tr>
                  <th>Chiến dịch</th>
                  <th>Khách hàng</th>
                  <th>Giá trị</th>
                  <th>Giai đoạn</th>
                  <th>Bước tiếp theo</th>
                  <th>Phụ trách</th>
                  <th>Tương tác cuối</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {deals.map((d) => {
                  const meta = stageMeta(d.stage);
                  const overdue = d.nextStepDueAt && new Date(d.nextStepDueAt) < now;
                  const stale = daysBetween(d.lastInteractionAt) ?? 0;
                  return (
                    <tr key={d.id}>
                      <td>
                        <Link href={`/deals/${d.id}`} className="font-semibold hover:text-brand-deep">{d.name}</Link>
                        <div className="text-[11px] text-muted">{d.id} · {d.team ?? "—"}</div>
                      </td>
                      <td className="text-ink-2">{d.customer.name}</td>
                      <td className="whitespace-nowrap font-medium">{formatVnd(d.value, true)}</td>
                      <td>
                        <span className="badge border-line-2 bg-white" style={{ color: meta.color }}>
                          <span className="dot" style={{ background: meta.color }} /> {d.stage} · {d.probability}%
                        </span>
                      </td>
                      <td className="max-w-56">
                        <div className="truncate text-[12px]">{d.nextStep ?? "—"}</div>
                        <div className={`text-[11px] ${overdue ? "font-semibold text-orange" : "text-muted"}`}>
                          {d.nextStepDueAt ? formatDate(d.nextStepDueAt) : "Chưa đặt hạn"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap text-ink-2">{d.owner?.name ?? "—"}</td>
                      <td>
                        {stale > 14 ? <Badge tone="amber">{stale} ngày</Badge> : <span className="text-[12px] text-muted">{formatDate(d.lastInteractionAt)}</span>}
                      </td>
                      <td className="text-right"><Link href={`/deals/${d.id}`} className="text-[12px] font-semibold text-brand-deep hover:underline">Mở</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {pages > 1 ? (
            <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
              {page > 1 ? <Link className="btn btn-sm" href={hrefWith(base, { page: String(page - 1) })}>← Trước</Link> : <span />}
              <span className="text-[11.5px] text-muted">Trang {page}/{pages} · {total} deal</span>
              {page < pages ? <Link className="btn btn-sm" href={hrefWith(base, { page: String(page + 1) })}>Sau →</Link> : <span />}
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
