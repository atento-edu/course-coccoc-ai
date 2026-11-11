import Link from "next/link";
import { PhoneCall, Search, SlidersHorizontal } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { ACTIVITY_TYPES } from "@/lib/crm";
import { formatDate, formatNumber } from "@/lib/format";
import { Empty, PageHeader } from "@/components/ui";
import type { Prisma } from "@prisma/client";

export const instant = false;

const PAGE_SIZE = 30;

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) ?? "";
  const q = get("q");
  const type = get("type");
  const owner = get("owner");
  const page = Math.max(1, Number(get("page") || 1));

  const user = await getCurrentUser();
  const scope = seesEverything(user) ? {} : { deal: { ownerId: user.id } };
  const where: Prisma.ActivityWhereInput = {
    ...scope,
    ...(type ? { type } : {}),
    ...(owner ? { ownerId: owner } : {}),
    ...(q
      ? {
          OR: [
            { content: { contains: q, mode: "insensitive" } },
            { deal: { name: { contains: q, mode: "insensitive" } } },
            { deal: { customer: { name: { contains: q, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  const [total, activities, users, byType] = await Promise.all([
    db.activity.count({ where }),
    db.activity.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { deal: { include: { customer: true } }, owner: true },
    }),
    db.user.findMany({ where: { role: "SALES" }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    db.activity.groupBy({ by: ["type"], where: scope, _count: { _all: true } }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const base = { q, type, owner };

  return (
    <>
      <PageHeader
        title="Hoạt động"
        description="Nhật ký gọi điện, email, họp, gửi media plan và IO. Đây là nguồn dữ liệu để tính tương tác cuối và cảnh báo deal nguội."
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {ACTIVITY_TYPES.map((t) => {
          const count = byType.find((x) => x.type === t)?._count._all ?? 0;
          return (
            <Link key={t} href={`/activities?type=${encodeURIComponent(t)}`} className="card px-3 py-2.5 transition hover:border-line-2">
              <div className="kpi-label truncate">{t}</div>
              <div className="mt-0.5 text-[19px] font-semibold leading-none">{count}</div>
            </Link>
          );
        })}
      </div>

      <form className="card mb-4 flex flex-wrap items-end gap-2 p-3" method="get">
        <div className="min-w-60 flex-1">
          <label className="label" htmlFor="q">Tìm kiếm</label>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-muted" />
            <input id="q" name="q" defaultValue={q} className="input pl-9" placeholder="Nội dung, deal hoặc khách hàng" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="type">Loại</label>
          <select id="type" name="type" defaultValue={type} className="select min-w-36">
            <option value="">Tất cả</option>
            {ACTIVITY_TYPES.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="owner">Sales</label>
          <select id="owner" name="owner" defaultValue={owner} className="select min-w-44">
            <option value="">Tất cả</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <button className="btn btn-ink" type="submit"><SlidersHorizontal size={14} /> Lọc</button>
        {(q || type || owner) ? <Link href="/activities" className="btn">Xoá lọc</Link> : null}
      </form>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="text-[12px] text-muted">{formatNumber(total)} hoạt động</span>
          <span className="text-[11.5px] text-muted">Trang {page}/{pages}</span>
        </div>
        {activities.length === 0 ? <div className="p-6"><Empty>Không có hoạt động khớp bộ lọc.</Empty></div> : (
          <ul className="divide-y divide-line">
            {activities.map((a) => (
              <li key={a.id} className="flex items-start gap-3 px-4 py-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-deep"><PhoneCall size={14} /></span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px]"><b className="font-semibold">{a.type}</b> · {a.content}</div>
                  <div className="mt-0.5 text-[11.5px] text-muted">
                    <Link href={`/deals/${a.dealId}`} className="hover:text-brand-deep">{a.deal.name}</Link>
                    {" · "}{a.deal.customer.name}{" · "}{a.owner?.name ?? "—"}
                  </div>
                </div>
                <span className="whitespace-nowrap text-[11px] text-muted">{formatDate(a.date)}</span>
              </li>
            ))}
          </ul>
        )}
        {pages > 1 ? (
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
            {page > 1 ? <Link className="btn btn-sm" href={`/activities?${new URLSearchParams({ ...base, page: String(page - 1) }).toString()}`}>← Trước</Link> : <span />}
            <span className="text-[11.5px] text-muted">{total} kết quả</span>
            {page < pages ? <Link className="btn btn-sm" href={`/activities?${new URLSearchParams({ ...base, page: String(page + 1) }).toString()}`}>Sau →</Link> : <span />}
          </div>
        ) : null}
      </div>
    </>
  );
}
