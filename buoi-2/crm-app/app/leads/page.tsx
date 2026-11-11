import Link from "next/link";
import { Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { db } from "@/lib/db";
import { getCurrentUser, seesEverything } from "@/lib/auth";
import { LEAD_STATUS_COLORS, LEAD_STATUSES, PRIORITIES, PRIORITY_COLORS } from "@/lib/crm";
import { formatDate, formatNumber } from "@/lib/format";
import { Empty, PageHeader } from "@/components/ui";
import type { Prisma } from "@prisma/client";

export const instant = false;

const PAGE_SIZE = 25;

function hrefWith(base: Record<string, string | undefined>, patch: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries({ ...base, ...patch })) if (v) params.set(k, v);
  return `/leads?${params.toString()}`;
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) ?? "";
  const q = get("q");
  const status = get("status");
  const priority = get("priority");
  const owner = get("owner");
  const sla = get("sla");
  const page = Math.max(1, Number(get("page") || 1));

  const user = await getCurrentUser();
  const scope = seesEverything(user) ? {} : { ownerId: user.id };

  const where: Prisma.LeadWhereInput = {
    ...scope,
    ...(status ? { status } : {}),
    ...(priority ? { priority } : {}),
    ...(owner ? { ownerId: owner } : {}),
    ...(sla === "late" ? { slaStatus: { in: ["Trễ SLA", "Quá hạn chưa liên hệ"] } } : {}),
    ...(q
      ? {
          OR: [
            { company: { contains: q, mode: "insensitive" } },
            { contactName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { phone: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, leads, users, counts] = await Promise.all([
    db.lead.count({ where }),
    db.lead.findMany({
      where,
      orderBy: [{ receivedAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { owner: true, customer: true },
    }),
    db.user.findMany({ select: { id: true, name: true, team: true }, orderBy: { name: "asc" } }),
    db.lead.groupBy({ by: ["status"], where: scope, _count: { _all: true } }),
  ]);

  const countOf = (s: string) => counts.find((c) => c.status === s)?._count._all ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const base = { q, status, priority, owner, sla };

  return (
    <>
      <PageHeader
        title="Lead"
        description="Lead mới, đang chăm và đã chuyển thành deal. Ưu tiên và SLA được tính tự động từ ngân sách, nguồn và phân khúc."
        actions={<Link href="/leads/new" className="btn btn-primary"><UserPlus size={15} /> Lead mới</Link>}
      />

      <div className="mb-4 grid gap-2 sm:grid-cols-4">
        {[
          { label: "Mới chờ phân công", value: countOf("Mới"), href: "/leads?status=Mới" },
          { label: "Đang chăm sóc", value: countOf("Đang chăm sóc"), href: "/leads?status=Đang chăm sóc" },
          { label: "Đủ điều kiện", value: countOf("Đủ điều kiện"), href: "/leads?status=Đủ điều kiện" },
          { label: "Trễ SLA", value: leads.filter((l) => l.slaStatus === "Trễ SLA" || l.slaStatus === "Quá hạn chưa liên hệ").length, href: "/leads?sla=late" },
        ].map((s) => (
          <Link key={s.label} href={s.href} className="card px-4 py-3 transition hover:border-line-2">
            <div className="kpi-label">{s.label}</div>
            <div className="mt-1 text-[22px] font-semibold leading-none">{s.value}</div>
          </Link>
        ))}
      </div>

      <form className="card mb-4 flex flex-wrap items-end gap-2 p-3" method="get">
        <div className="min-w-52 flex-1">
          <label className="label" htmlFor="q">Tìm kiếm</label>
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-2.5 text-muted" />
            <input id="q" name="q" defaultValue={q} className="input pl-9" placeholder="Công ty, người liên hệ, email, số điện thoại" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="status">Trạng thái</label>
          <select id="status" name="status" defaultValue={status} className="select min-w-40">
            <option value="">Tất cả</option>
            {LEAD_STATUSES.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="priority">Ưu tiên</label>
          <select id="priority" name="priority" defaultValue={priority} className="select min-w-32">
            <option value="">Tất cả</option>
            {PRIORITIES.map((v) => <option key={v}>{v}</option>)}
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
        {(q || status || priority || owner || sla) ? <Link href="/leads" className="btn">Xoá lọc</Link> : null}
      </form>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="text-[12px] text-muted">{formatNumber(total)} lead</span>
          <span className="text-[11.5px] text-muted">Trang {page}/{pages}</span>
        </div>
        {leads.length === 0 ? (
          <div className="p-6"><Empty>Không có lead khớp bộ lọc.</Empty></div>
        ) : (
          <div className="overflow-x-auto scroll-thin">
            <table className="table min-w-[900px]">
              <thead>
                <tr>
                  <th>Công ty</th>
                  <th>Nguồn</th>
                  <th>Ngân sách/năm</th>
                  <th>Ưu tiên</th>
                  <th>Trạng thái</th>
                  <th>Phụ trách</th>
                  <th>Nhận</th>
                  <th>SLA</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <Link href={`/leads/${l.id}`} className="font-semibold hover:text-brand-deep">{l.company}</Link>
                      <div className="text-[11.5px] text-muted">{l.contactName ?? "—"}{l.contactTitle ? ` · ${l.contactTitle}` : ""}</div>
                    </td>
                    <td className="text-ink-2">{l.source ?? "—"}</td>
                    <td className="whitespace-nowrap">{l.annualBudget ? `${formatNumber(l.annualBudget)} tr` : "—"}</td>
                    <td>{l.priority ? <span className={`badge ${PRIORITY_COLORS[l.priority] ?? ""}`}>{l.priority} · {l.score ?? 0}đ</span> : "—"}</td>
                    <td>{l.status ? <span className={`badge ${LEAD_STATUS_COLORS[l.status] ?? ""}`}>{l.status}</span> : "—"}</td>
                    <td className="whitespace-nowrap text-ink-2">{l.owner?.name ?? <span className="text-orange">Chưa gán</span>}</td>
                    <td className="whitespace-nowrap text-muted">{formatDate(l.receivedAt)}</td>
                    <td>
                      {l.slaStatus ? (
                        <span className={`badge ${l.slaStatus === "Đạt" ? "border-brand-line bg-brand-soft text-brand-deep" : l.slaStatus === "Còn trong hạn" ? "border-amber-200 bg-amber-50 text-amber-700" : "border-red-200 bg-red-50 text-red-700"}`}>
                          {l.slaStatus}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="text-right">
                      <Link href={`/leads/${l.id}`} className="text-[12px] font-semibold text-brand-deep hover:underline">Mở</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {pages > 1 ? (
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
            {page > 1 ? <Link className="btn btn-sm" href={hrefWith(base, { page: String(page - 1) })}>← Trước</Link> : <span />}
            <span className="text-[11.5px] text-muted">{total} kết quả</span>
            {page < pages ? <Link className="btn btn-sm" href={hrefWith(base, { page: String(page + 1) })}>Sau →</Link> : <span />}
          </div>
        ) : null}
      </div>
    </>
  );
}
