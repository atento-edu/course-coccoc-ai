import Link from "next/link";
import { BUYING_CHANNELS, INDUSTRIES, LEAD_SOURCES, LEAD_STATUSES, PRIORITIES, SEGMENTS } from "@/lib/crm";
import { formatDate } from "@/lib/format";
import type { Lead, User } from "@prisma/client";

type LeadLike = Partial<Lead> & { id?: string };

export function LeadForm({
  action,
  lead,
  users,
  submitLabel = "Lưu lead",
}: {
  action: (fd: FormData) => Promise<void>;
  lead?: LeadLike | null;
  users: Pick<User, "id" | "name" | "team">[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-6">
      {lead?.id ? <input type="hidden" name="id" value={lead.id} /> : null}

      <section className="card p-5">
        <h2 className="section-title mb-4">Thông tin công ty</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label" htmlFor="company">
              Tên công ty / nhãn hàng <span className="text-orange">*</span>
            </label>
            <input id="company" name="company" required defaultValue={lead?.company ?? ""} className="input" placeholder="Công ty TNHH..." />
          </div>
          <div>
            <label className="label" htmlFor="industry">Ngành</label>
            <select id="industry" name="industry" defaultValue={lead?.industry ?? ""} className="select">
              <option value="">Chọn ngành</option>
              {INDUSTRIES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="segment">Phân khúc</label>
            <select id="segment" name="segment" defaultValue={lead?.segment ?? ""} className="select">
              <option value="">Chọn phân khúc</option>
              {SEGMENTS.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="annualBudget">Ngân sách quảng cáo / năm (triệu VNĐ)</label>
            <input id="annualBudget" name="annualBudget" type="number" min="0" step="1" defaultValue={lead?.annualBudget ?? ""} className="input" placeholder="1200" />
          </div>
          <div>
            <label className="label" htmlFor="agency">Agency</label>
            <input id="agency" name="agency" defaultValue={lead?.agency ?? ""} className="input" placeholder="Trực tiếp hoặc tên agency" />
          </div>
          <div>
            <label className="label" htmlFor="source">Nguồn lead</label>
            <select id="source" name="source" defaultValue={lead?.source ?? ""} className="select">
              <option value="">Chọn nguồn</option>
              {LEAD_SOURCES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="buyingChannel">Kênh mua</label>
            <select id="buyingChannel" name="buyingChannel" defaultValue={lead?.buyingChannel ?? ""} className="select">
              <option value="">Chọn kênh</option>
              {BUYING_CHANNELS.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-4">Người liên hệ và nhu cầu</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="contactName">Người liên hệ</label>
            <input id="contactName" name="contactName" defaultValue={lead?.contactName ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="contactTitle">Chức danh</label>
            <input id="contactTitle" name="contactTitle" defaultValue={lead?.contactTitle ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" defaultValue={lead?.email ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Số điện thoại</label>
            <input id="phone" name="phone" defaultValue={lead?.phone ?? ""} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="productInterest">Sản phẩm quan tâm</label>
            <input id="productInterest" name="productInterest" defaultValue={lead?.productInterest ?? ""} className="input" placeholder="Banner Tab mới, Search Ads..." />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="need">Nhu cầu</label>
            <textarea id="need" name="need" defaultValue={lead?.need ?? ""} className="textarea" placeholder="Mục tiêu chiến dịch, thời gian, KPI..." />
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-4">Phân công và theo dõi</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="ownerId">Sales phụ trách</label>
            <select id="ownerId" name="ownerId" defaultValue={lead?.ownerId ?? ""} className="select">
              <option value="">Chưa phân công</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}{u.team ? ` · ${u.team}` : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="status">Trạng thái</label>
            <select id="status" name="status" defaultValue={lead?.status ?? "Mới"} className="select">
              {LEAD_STATUSES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="priority">Mức ưu tiên</label>
            <select id="priority" name="priority" defaultValue={lead?.priority ?? ""} className="select">
              <option value="">Tự tính theo ngân sách và nguồn</option>
              {PRIORITIES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Lead nhận lúc</label>
            <div className="input bg-paper-2/60 text-muted">
              {lead?.receivedAt ? formatDate(lead.receivedAt) : "Bây giờ"}
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="note">Ghi chú</label>
            <textarea id="note" name="note" defaultValue={lead?.note ?? ""} className="textarea" placeholder="Thông tin thêm cho người nhận lead..." />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn btn-primary" type="submit">{submitLabel}</button>
        <Link href={lead?.id ? `/leads/${lead.id}` : "/leads"} className="btn">Huỷ</Link>
        <p className="text-[12px] text-muted">
          Điểm và SLA được tính lại khi lưu. Ưu tiên để trống sẽ tự tính.
        </p>
      </div>
    </form>
  );
}
