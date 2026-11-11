import { db } from "@/lib/db";
import { getCurrentUser, roleLabel } from "@/lib/auth";
import { formatNumber, formatVnd } from "@/lib/format";
import { Badge, Card, PageHeader } from "@/components/ui";

export const instant = false;

export default async function UsersPage() {
  const user = await getCurrentUser();
  const [users, deals, leads] = await Promise.all([
    db.user.findMany({ orderBy: [{ role: "asc" }, { name: "asc" }] }),
    db.deal.findMany({ select: { ownerId: true, status: true, value: true } }),
    db.lead.findMany({ select: { ownerId: true, status: true } }),
  ]);

  const rows = users.map((u) => {
    const ownDeals = deals.filter((d) => d.ownerId === u.id);
    const openDeals = ownDeals.filter((d) => d.status === "Đang mở");
    const revenue = ownDeals.filter((d) => d.status === "Thành công").reduce((s, d) => s + Number(d.value), 0);
    const ownLeads = leads.filter((l) => l.ownerId === u.id && !["Loại", "Chuyển thành deal"].includes(l.status ?? ""));
    const load = openDeals.length + ownLeads.length;
    return { ...u, openDeals: openDeals.length, leads: ownLeads.length, revenue, load };
  });

  return (
    <>
      <PageHeader
        title="Người dùng và tải việc"
        description={`${rows.length} người dùng trong bản mô phỏng. Bạn đang xem với quyền ${roleLabel(user.role)}.`}
      />

      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12.5px] leading-relaxed text-amber-900">
        <b className="font-semibold">Đây không phải đăng nhập thật.</b> Bản lớp dùng cookie để đổi người dùng và minh hoạ phân quyền.
        Muốn dùng thật, thay bằng đăng nhập công ty (SSO) hoặc ít nhất mật khẩu chung + HTTPS.
      </div>

      <Card title="Danh sách" subtitle="Tải việc = deal đang mở + lead đang chăm" pad={false}>
        <div className="overflow-x-auto scroll-thin">
          <table className="table min-w-[860px]">
            <thead>
              <tr><th>Người dùng</th><th>Vai trò</th><th>Team</th><th>Deal mở</th><th>Lead đang chăm</th><th>Tải việc</th><th>Doanh số</th><th>Trạng thái</th></tr>
            </thead>
            <tbody>
              {rows.map((u) => {
                const over = u.load > u.capacity;
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="font-semibold">{u.name}</div>
                      <div className="text-[11px] text-muted">{u.id.slice(0, 8)}…</div>
                    </td>
                    <td><Badge tone={u.role === "MANAGER" ? "blue" : u.role === "ADMIN" ? "zinc" : "green"}>{roleLabel(u.role)}</Badge></td>
                    <td className="text-ink-2">{u.team ?? "—"}</td>
                    <td>{formatNumber(u.openDeals)}</td>
                    <td>{formatNumber(u.leads)}</td>
                    <td>
                      <span className={over ? "font-semibold text-orange" : "font-medium"}>{u.load}</span>
                      <span className="text-[11px] text-muted"> / {u.capacity}</span>
                    </td>
                    <td className="whitespace-nowrap font-medium text-brand-deep">{formatVnd(u.revenue, true)}</td>
                    <td>{over ? <Badge tone="orange">Quá tải</Badge> : <Badge tone="green">Ổn</Badge>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="mt-3 text-[11.5px] text-muted">
        Quyền hiện tại: Sales chỉ thấy dữ liệu của mình; Quản lý và Quản trị thấy toàn bộ. Thử đổi người dùng ở góc trái để thấy dữ liệu thay đổi.
      </p>
    </>
  );
}
