import Link from "next/link";
import type { Customer, Deal, User } from "@prisma/client";
import { FORMATS, LEAD_SOURCES, LOST_REASONS, OPEN_STAGES, STAGES } from "@/lib/crm";
import { toInputDate } from "@/lib/format";

type DealLike = Partial<Deal> & { id?: string };

export function DealForm({
  action,
  deal,
  customers,
  users,
  submitLabel = "Lưu deal",
}: {
  action: (fd: FormData) => Promise<void>;
  deal?: DealLike | null;
  customers: Pick<Customer, "id" | "name">[];
  users: Pick<User, "id" | "name" | "team">[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-6">
      {deal?.id ? <input type="hidden" name="id" value={deal.id} /> : null}

      <section className="card p-5">
        <h2 className="section-title mb-4">Chiến dịch</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label" htmlFor="name">Tên chiến dịch <span className="text-orange">*</span></label>
            <input id="name" name="name" required defaultValue={deal?.name ?? ""} className="input" placeholder="Nhãn hàng – Mùa chiến dịch" />
          </div>
          <div>
            <label className="label" htmlFor="customerId">Khách hàng <span className="text-orange">*</span></label>
            <select id="customerId" name="customerId" required defaultValue={deal?.customerId ?? ""} className="select">
              <option value="">Chọn khách hàng</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="ownerId">Sales phụ trách</label>
            <select id="ownerId" name="ownerId" defaultValue={deal?.ownerId ?? ""} className="select">
              <option value="">Chưa phân công</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}{u.team ? ` · ${u.team}` : ""}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="team">Team</label>
            <select id="team" name="team" defaultValue={deal?.team ?? ""} className="select">
              <option value="">Chọn team</option>
              <option>Agency</option>
              <option>Direct</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="source">Nguồn lead</label>
            <select id="source" name="source" defaultValue={deal?.source ?? ""} className="select">
              <option value="">Chọn nguồn</option>
              {LEAD_SOURCES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="format">Định dạng quảng cáo</label>
            <select id="format" name="format" defaultValue={deal?.format ?? ""} className="select">
              <option value="">Chọn định dạng</option>
              {FORMATS.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="value">Giá trị IO (VNĐ)</label>
            <input id="value" name="value" type="number" min="0" step="1" defaultValue={deal?.value ? String(deal.value) : ""} className="input" placeholder="1200000000" />
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-4">Quy trình</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="stage">Giai đoạn</label>
            <select id="stage" name="stage" defaultValue={deal?.stage ?? "Tiếp cận"} className="select">
              {STAGES.map((s) => <option key={s.name}>{s.name}</option>)}
            </select>
            <p className="mt-1 text-[11.5px] text-muted">
              Xác suất tự tính: {OPEN_STAGES.map((s) => `${s.name} ${s.probability}%`).join(" · ")}
            </p>
          </div>
          <div>
            <label className="label" htmlFor="expectedCloseAt">Ngày chốt dự kiến</label>
            <input id="expectedCloseAt" name="expectedCloseAt" type="date" defaultValue={toInputDate(deal?.expectedCloseAt)} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="nextStep">Bước tiếp theo</label>
            <input id="nextStep" name="nextStep" defaultValue={deal?.nextStep ?? ""} className="input" placeholder="Gọi xác nhận ngân sách..." />
          </div>
          <div>
            <label className="label" htmlFor="nextStepDueAt">Hạn bước tiếp theo</label>
            <input id="nextStepDueAt" name="nextStepDueAt" type="date" defaultValue={toInputDate(deal?.nextStepDueAt)} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="actualCloseAt">Ngày chốt thực tế</label>
            <input id="actualCloseAt" name="actualCloseAt" type="date" defaultValue={toInputDate(deal?.actualCloseAt)} className="input" />
            <p className="mt-1 text-[11.5px] text-muted">Chỉ dùng khi Thành công hoặc Thất bại.</p>
          </div>
          <div>
            <label className="label" htmlFor="campaignEndAt">Ngày kết thúc chiến dịch</label>
            <input id="campaignEndAt" name="campaignEndAt" type="date" defaultValue={toInputDate(deal?.campaignEndAt)} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="label" htmlFor="lostReason">Lý do thất bại</label>
            <select id="lostReason" name="lostReason" defaultValue={deal?.lostReason ?? ""} className="select">
              <option value="">Chưa có / không áp dụng</option>
              {LOST_REASONS.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn btn-primary" type="submit">{submitLabel}</button>
        <Link href={deal?.id ? `/deals/${deal.id}` : "/deals"} className="btn">Huỷ</Link>
      </div>
    </form>
  );
}
