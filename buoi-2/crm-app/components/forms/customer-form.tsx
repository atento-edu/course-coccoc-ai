import Link from "next/link";
import type { Customer, User } from "@prisma/client";
import { INDUSTRIES, SEGMENTS } from "@/lib/crm";

type CustomerLike = Partial<Customer> & { id?: string };

export function CustomerForm({
  action,
  customer,
  users,
  submitLabel = "Lưu khách hàng",
}: {
  action: (fd: FormData) => Promise<void>;
  customer?: CustomerLike | null;
  users: Pick<User, "id" | "name" | "team">[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="space-y-6">
      {customer?.id ? <input type="hidden" name="id" value={customer.id} /> : null}

      <section className="card p-5">
        <h2 className="section-title mb-4">Công ty</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label" htmlFor="name">Tên công ty <span className="text-orange">*</span></label>
            <input id="name" name="name" required defaultValue={customer?.name ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="industry">Ngành</label>
            <select id="industry" name="industry" defaultValue={customer?.industry ?? ""} className="select">
              <option value="">Chọn ngành</option>
              {INDUSTRIES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="segment">Phân khúc</label>
            <select id="segment" name="segment" defaultValue={customer?.segment ?? ""} className="select">
              <option value="">Chọn phân khúc</option>
              {SEGMENTS.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="annualBudget">Ngân sách quảng cáo / năm (triệu VNĐ)</label>
            <input id="annualBudget" name="annualBudget" type="number" min="0" defaultValue={customer?.annualBudget ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="city">Tỉnh / thành phố</label>
            <input id="city" name="city" defaultValue={customer?.city ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="agency">Agency</label>
            <input id="agency" name="agency" defaultValue={customer?.agency ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="status">Trạng thái</label>
            <select id="status" name="status" defaultValue={customer?.status ?? "Tiềm năng"} className="select">
              <option>Tiềm năng</option>
              <option>Khách hàng</option>
              <option>Không hoạt động</option>
            </select>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-4">Liên hệ và phụ trách</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="contactName">Người liên hệ chính</label>
            <input id="contactName" name="contactName" defaultValue={customer?.contactName ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="contactTitle">Chức danh</label>
            <input id="contactTitle" name="contactTitle" defaultValue={customer?.contactTitle ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="ownerId">Sales phụ trách</label>
            <select id="ownerId" name="ownerId" defaultValue={customer?.ownerId ?? ""} className="select">
              <option value="">Chưa phân công</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}{u.team ? ` · ${u.team}` : ""}</option>)}
            </select>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <button className="btn btn-primary" type="submit">{submitLabel}</button>
        <Link href={customer?.id ? `/customers/${customer.id}` : "/customers"} className="btn">Huỷ</Link>
      </div>
    </form>
  );
}
