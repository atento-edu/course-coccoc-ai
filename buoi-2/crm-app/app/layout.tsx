import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { db } from "@/lib/db";
import { getCurrentUser, roleLabel } from "@/lib/auth";
import { NavLinks } from "@/components/nav-links";
import { switchUser } from "@/app/actions/session";
import { initials } from "@/lib/format";

const font = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRM Cốc Cốc — Bản mô phỏng",
  description: "App CRM mẫu cho Buổi 2: lead, deal, khách hàng, hoạt động và báo cáo.",
};

export const instant = false;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [user, users] = await Promise.all([
    getCurrentUser(),
    db.user.findMany({
      select: { id: true, name: true, team: true, role: true },
      orderBy: [{ role: "asc" }, { name: "asc" }],
    }),
  ]);

  return (
    <html lang="vi" className={font.variable}>
      <body className="min-h-screen">
        <div className="min-h-screen lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
          <aside className="hidden border-r border-white/8 bg-forest p-4 text-white lg:flex lg:h-screen lg:flex-col lg:sticky lg:top-0">
            <div className="mb-7 flex items-center gap-2.5 px-2 pt-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand text-[15px] font-bold text-white">
                C
              </span>
              <div>
                <div className="text-[14px] font-semibold leading-tight">CRM Cốc Cốc</div>
                <div className="text-[11px] text-white/45">Bản mô phỏng · Buổi 2</div>
              </div>
            </div>

            <NavLinks />

            <div className="mt-auto space-y-2">
              <div className="rounded-xl bg-white/8 p-3">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-[12px] font-bold text-brand-deep">
                    {initials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[12.5px] font-semibold">{user.name}</div>
                    <div className="text-[11px] text-white/50">
                      {roleLabel(user.role)}
                      {user.team ? ` · ${user.team}` : ""}
                    </div>
                  </div>
                </div>
                <form action={switchUser} className="mt-2.5 flex gap-1.5">
                  <select
                    name="userId"
                    defaultValue={user.id}
                    className="min-w-0 flex-1 rounded-lg border border-white/15 bg-forest px-2 py-1.5 text-[11.5px] text-white outline-none"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id} className="text-ink">
                        {u.name} · {roleLabel(u.role)}
                      </option>
                    ))}
                  </select>
                  <button className="rounded-lg bg-white/15 px-2.5 py-1.5 text-[11.5px] font-semibold hover:bg-white/25">
                    Đổi
                  </button>
                </form>
              </div>
              <p className="px-1 text-[10.5px] leading-relaxed text-white/35">
                Dữ liệu hư cấu dùng cho lớp học. Không phải số liệu thật của Cốc Cốc.
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <header className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur lg:hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand text-[13px] font-bold text-white">
                    C
                  </span>
                  <div>
                    <div className="text-[13px] font-semibold leading-tight">CRM Cốc Cốc</div>
                    <div className="text-[10.5px] text-muted">Bản mô phỏng</div>
                  </div>
                </div>
                <span className="badge border-amber-200 bg-amber-50 text-amber-700">Dữ liệu mô phỏng</span>
              </div>
              <div className="px-3 pb-2">
                <NavLinks compact />
              </div>
            </header>

            <div className="hidden items-center justify-between border-b border-line bg-white/60 px-8 py-3 lg:flex">
              <div className="flex items-center gap-2 text-[12px] text-muted">
                <span className="dot bg-brand" />
                Đang xem với quyền <b className="font-semibold text-ink-2">{roleLabel(user.role)}</b>
                {user.team ? <span>· Team {user.team}</span> : null}
              </div>
              <div className="flex items-center gap-3">
                <span className="badge border-amber-200 bg-amber-50 text-amber-700">Dữ liệu mô phỏng</span>
                <span className="text-[12px] text-muted">Buổi 2 · Atento × Cốc Cốc</span>
              </div>
            </div>

            <main className="mx-auto w-full max-w-[1440px] px-4 py-6 lg:px-8 lg:py-7">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
