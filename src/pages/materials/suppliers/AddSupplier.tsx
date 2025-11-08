"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Building2,
  Home,
  User,
  Phone,
  Mail,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bankAccounts } from "@/pages/data/banks";

type PartnerType = "doanh-nghiep" | "nong-ho";

type Branch = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxAddress: string;
  note: string;
};

type BankAccount = {
  id: string;
  bankName: string;
  accountNo: string;
  owner: string;
  branch: string;
  note: string;
};

type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  position: string;
  address: string;
  note: string;
};

export default function AddSupplierPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // step 1
  const [type, setType] = useState<PartnerType>("doanh-nghiep");
  const [code, setCode] = useState("ENT-001");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [repName, setRepName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [taxCode, setTaxCode] = useState("");
  const [taxAddress, setTaxAddress] = useState("");
  const [segment, setSegment] = useState("");
  const [note, setNote] = useState("");

  // step 2 – chi nhánh
  // step 2 – chi nhánh
  const [branches, setBranches] = useState<Branch[]>([
    {
      id: crypto.randomUUID(),
      name: "Chi nhánh Hà Nội",
      phone: "0241234567",
      email: "hanoi@greenagro.vn",
      address: "456 Phố Huế, Hai Bà Trưng, Hà Nội",
      taxAddress: "123 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội",
      note: "Chi nhánh miền Bắc – phụ trách phân phối khu vực phía Bắc",
    },
    {
      id: crypto.randomUUID(),
      name: "Chi nhánh Cần Thơ",
      phone: "0292123456",
      email: "cantho@greenagro.vn",
      address: "789 Nguyễn Trãi, Ninh Kiều, Cần Thơ",
      taxAddress: "456 Trần Phú, Ninh Kiều, Cần Thơ",
      note: "Chi nhánh miền Tây – phụ trách khu vực đồng bằng sông Cửu Long",
    },
  ]);

  // step 3 – ngân hàng
  const [banks, setBanks] = useState<BankAccount[]>([
    {
      id: crypto.randomUUID(),
      bankName: "Vietcombank (VCB)",
      accountNo: "0011001234567",
      owner: "Nguyễn Văn A",
      branch: "CN Hà Nội",
      note: "Tài khoản giao dịch chính",
    },
    {
      id: crypto.randomUUID(),
      bankName: "Techcombank (TCB)",
      accountNo: "1900123456789",
      owner: "Nguyễn Văn A",
      branch: "CN Lê Văn Sỹ",
      note: "Tài khoản nội bộ",
    },
  ]);

  // step 4 – liên hệ
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: crypto.randomUUID(),
      name: "Nguyễn Văn A",
      phone: "0909123456",
      email: "vana@greenagro.vn",
      department: "Kinh doanh",
      position: "Giám đốc",
      address: "123 Lê Lợi, Quận 1, TP.HCM",
      note: "Phụ trách khách hàng lớn khu vực miền Nam",
    },
    {
      id: crypto.randomUUID(),
      name: "Trần Thị B",
      phone: "0934567890",
      email: "tranb@greenagro.vn",
      department: "Kế toán",
      position: "Kế toán trưởng",
      address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
      note: "Phụ trách công nợ và hóa đơn thanh toán",
    },
  ]);

  const next = () => setStep((s) => (s < 5 ? ((s + 1) as any) : s));
  const prev = () => setStep((s) => (s > 1 ? ((s - 1) as any) : s));

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => history.back()}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Tạo mới doanh nghiệp / nông hộ
            </h1>
            <p className="text-xs text-muted-foreground">
              Nhập lần lượt thông tin cơ bản, chi nhánh, ngân hàng, liên hệ và
              xác nhận trước khi lưu.
            </p>
          </div>
        </div>
      </header>

      <Stepper step={step} />

      {step === 1 && (
        <Step1Basic
          type={type}
          setType={setType}
          code={code}
          setCode={setCode}
          name={name}
          setName={setName}
          brand={brand}
          setBrand={setBrand}
          repName={repName}
          setRepName={setRepName}
          phone={phone}
          setPhone={setPhone}
          email={email}
          setEmail={setEmail}
          address={address}
          setAddress={setAddress}
          taxCode={taxCode}
          setTaxCode={setTaxCode}
          taxAddress={taxAddress}
          setTaxAddress={setTaxAddress}
          segment={segment}
          setSegment={setSegment}
          note={note}
          setNote={setNote}
        />
      )}

      {step === 2 && (
        <Step2Branches branches={branches} setBranches={setBranches} />
      )}

      {step === 3 && <Step3Banks banks={banks} setBanks={setBanks} />}

      {step === 4 && (
        <Step4Contacts contacts={contacts} setContacts={setContacts} />
      )}

      {step === 5 && (
        <Step5Review
          type={type}
          code={code}
          name={name}
          brand={brand}
          repName={repName}
          phone={phone}
          email={email}
          address={address}
          taxCode={taxCode}
          taxAddress={taxAddress}
          segment={segment}
          note={note}
          branches={branches}
          banks={banks}
          contacts={contacts}
        />
      )}

      {/* FOOTER BUTTONS */}
      <div className="flex justify-between border-t pt-4 mb-2">
        <Button
          variant="outline"
          size="sm"
          disabled={step === 1}
          onClick={prev}
        >
          Quay lại
        </Button>
        <Button
          size="sm"
          className="bg-primary! text-primary-foreground!"
          onClick={step === 5 ? () => alert("Submit form") : next}
        >
          {step === 5 ? "Hoàn thành" : "Tiếp theo"}
        </Button>
      </div>
    </div>
  );
}

/* ---------- STEPPER ---------- */

function Stepper({ step }: { step: 1 | 2 | 3 | 4 | 5 }) {
  const items = [
    { id: 1, label: "Thông tin cơ bản" },
    { id: 2, label: "Thông tin chi nhánh" },
    { id: 3, label: "Thông tin ngân hàng" },
    { id: 4, label: "Thông tin liên hệ" },
    { id: 5, label: "Xác nhận" },
  ];

  return (
    <div className="flex items-center gap-4 rounded-lg border bg-card px-4 py-2">
      {items.map((s, index) => {
        const isActive = s.id === step;
        const isDone = s.id < step;
        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-9 items-center rounded-full border px-3 text-xs font-medium ${
                isDone
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isActive
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted text-muted-foreground"
              }`}
            >
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-xs font-semibold">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  s.id
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold">Bước {s.id}</span>
                <span className="text-[11px]">{s.label}</span>
              </div>
            </div>
            {index < items.length - 1 && (
              <div className="h-px flex-1 bg-emerald-500/70" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- STEP 1: BASIC ---------- */

function Step1Basic(props: {
  type: PartnerType;
  setType: (v: PartnerType) => void;
  code: string;
  setCode: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  brand: string;
  setBrand: (v: string) => void;
  repName: string;
  setRepName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  taxCode: string;
  setTaxCode: (v: string) => void;
  taxAddress: string;
  setTaxAddress: (v: string) => void;
  segment: string;
  setSegment: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
}) {
  const {
    type,
    setType,
    code,
    setCode,
    name,
    setName,
    brand,
    setBrand,
    repName,
    setRepName,
    phone,
    setPhone,
    email,
    setEmail,
    address,
    setAddress,
    taxCode,
    setTaxCode,
    taxAddress,
    setTaxAddress,
    segment,
    setSegment,
    note,
    setNote,
  } = props;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.1fr)]">
      {/* thông tin cơ bản */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Mã định danh *</p>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Loại đối tượng</p>
              <Select
                value={type}
                onValueChange={(v: PartnerType) => setType(v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="doanh-nghiep">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      Doanh nghiệp
                    </span>
                  </SelectItem>
                  <SelectItem value="nong-ho">
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      Nông hộ
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Tên đối tượng *</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Thương hiệu</p>
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Phân loại đối tác</p>
              <Input
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="h-9"
                placeholder="VD: Nhà phân phối, đại lý cấp 1..."
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Người đại diện</p>
              <Input
                value={repName}
                onChange={(e) => setRepName(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Số điện thoại</p>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Email</p>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Địa chỉ</p>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="h-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* thông tin thuế + ghi chú */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin thuế & ghi chú
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Mã số thuế</p>
            <Input
              value={taxCode}
              onChange={(e) => setTaxCode(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Địa chỉ thuế</p>
            <Input
              value={taxAddress}
              onChange={(e) => setTaxAddress(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Ghi chú</p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px] text-sm"
              placeholder="Ví dụ: điều khoản thanh toán, lịch giao hàng..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- STEP 2: BRANCHES ---------- */

function Step2Branches({
  branches,
  setBranches,
}: {
  branches: Branch[];
  setBranches: (v: Branch[]) => void;
}) {
  const update = (id: string, field: keyof Branch, value: string) =>
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );

  const add = () =>
    setBranches((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        phone: "",
        email: "",
        address: "",
        taxAddress: "",
        note: "",
      },
    ]);

  const remove = (id: string) =>
    setBranches((prev) => prev.filter((b) => b.id !== id));

  return (
    <Card>
      <CardHeader className="pb-3 flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin chi nhánh
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Khai báo các chi nhánh / điểm giao dịch của đối tác.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed"
          onClick={add}
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm chi nhánh
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {branches.map((b, idx) => (
          <div
            key={b.id}
            className="rounded-lg border bg-muted/20 p-3 space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold">Chi nhánh {idx + 1}</span>
              {branches.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(b.id)}
                  className="flex items-center gap-1 text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                  Xóa
                </button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Tên chi nhánh</p>
                <Input
                  value={b.name}
                  onChange={(e) => update(b.id, "name", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Số điện thoại</p>
                <Input
                  value={b.phone}
                  onChange={(e) => update(b.id, "phone", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <Input
                  value={b.email}
                  onChange={(e) => update(b.id, "email", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Địa chỉ</p>
                <Input
                  value={b.address}
                  onChange={(e) => update(b.id, "address", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Địa chỉ thuế</p>
              <Input
                value={b.taxAddress}
                onChange={(e) => update(b.id, "taxAddress", e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Ghi chú</p>
              <Textarea
                value={b.note}
                onChange={(e) => update(b.id, "note", e.target.value)}
                className="min-h-[60px] text-sm"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ---------- STEP 3: BANKS ---------- */

function Step3Banks({
  banks,
  setBanks,
}: {
  banks: BankAccount[];
  setBanks: (v: BankAccount[]) => void;
}) {
  const update = (id: string, field: keyof BankAccount, value: string) =>
    setBanks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );

  const add = () =>
    setBanks((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        bankName: "",
        accountNo: "",
        owner: "",
        branch: "",
        note: "",
      },
    ]);

  const remove = (id: string) =>
    setBanks((prev) => prev.filter((b) => b.id !== id));

  return (
    <Card>
      <CardHeader className="pb-3 flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin ngân hàng
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Chọn ngân hàng & tài khoản dùng để thanh toán với nhà cung cấp.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed"
          onClick={add}
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm tài khoản
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {banks?.map((b, idx) => {
          const selectedBank = bankAccounts.find(
            (opt) => opt.name === b.bankName
          );

          return (
            <div
              key={b.id}
              className="space-y-3 rounded-lg border bg-muted/20 p-3"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold">Tài khoản {idx + 1}</span>
                {banks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(b.id)}
                    className="flex items-center gap-1 text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                    Xóa
                  </button>
                )}
              </div>

              {/* Ngân hàng + Số tài khoản */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Ngân hàng</p>
                  <Select
                    value={b.bankName || undefined}
                    onValueChange={(val) => {
                      update(b.id, "bankName", val);
                      // auto set chi nhánh đầu tiên nếu đang trống
                      const opt = bankAccounts.find((o) => o.name === val);
                      if (opt && !b.branch) {
                        update(b.id, "branch", opt.branches[0] ?? "");
                      }
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Chọn ngân hàng" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts.map((opt) => (
                        <SelectItem key={opt.id} value={opt.name}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Số tài khoản</p>
                  <Input
                    value={b.accountNo}
                    onChange={(e) => update(b.id, "accountNo", e.target.value)}
                    className="h-9"
                    placeholder="VD: 0011001234567"
                  />
                </div>
              </div>

              {/* Chủ TK + Chi nhánh (select theo ngân hàng) */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Chủ tài khoản</p>
                  <Input
                    value={b.owner}
                    onChange={(e) => update(b.id, "owner", e.target.value)}
                    className="h-9"
                    placeholder="VD: Nguyễn Văn A"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Chi nhánh</p>
                  {selectedBank ? (
                    <Select
                      value={b.branch || undefined}
                      onValueChange={(val) => update(b.id, "branch", val)}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Chọn chi nhánh" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedBank?.branches?.map((br) => (
                          <SelectItem key={br} value={br}>
                            {br}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={b.branch}
                      onChange={(e) => update(b.id, "branch", e.target.value)}
                      className="h-9"
                      placeholder="Chọn ngân hàng trước"
                    />
                  )}
                </div>
              </div>

              {/* Ghi chú */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Ghi chú</p>
                <Textarea
                  value={b.note}
                  onChange={(e) => update(b.id, "note", e.target.value)}
                  className="min-h-[60px] text-sm"
                  placeholder="VD: chỉ dùng cho thanh toán nội bộ..."
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ---------- STEP 4: CONTACTS ---------- */

function Step4Contacts({
  contacts,
  setContacts,
}: {
  contacts: Contact[];
  setContacts: (v: Contact[]) => void;
}) {
  const update = (id: string, field: keyof Contact, value: string) =>
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );

  const add = () =>
    setContacts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        phone: "",
        email: "",
        department: "",
        position: "",
        address: "",
        note: "",
      },
    ]);

  const remove = (id: string) =>
    setContacts((prev) => prev.filter((c) => c.id !== id));

  return (
    <Card>
      <CardHeader className="pb-3 flex items-center justify-between">
        <div>
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin liên hệ
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Thêm các đầu mối làm việc: kinh doanh, kế toán, kho vận...
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed"
          onClick={add}
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm liên hệ
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {contacts.map((c, idx) => (
          <div
            key={c.id}
            className="rounded-lg border bg-muted/20 p-3 space-y-3"
          >
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold">Liên hệ {idx + 1}</span>
              {contacts.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(c.id)}
                  className="flex items-center gap-1 text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                  Xóa
                </button>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Họ tên</p>
                <Input
                  value={c.name}
                  onChange={(e) => update(c.id, "name", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Số điện thoại</p>
                <Input
                  value={c.phone}
                  onChange={(e) => update(c.id, "phone", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Email</p>
                <Input
                  value={c.email}
                  onChange={(e) => update(c.id, "email", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Phòng ban</p>
                <Input
                  value={c.department}
                  onChange={(e) => update(c.id, "department", e.target.value)}
                  className="h-9"
                  placeholder="VD: Kinh doanh, Kế toán..."
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Chức vụ</p>
                <Input
                  value={c.position}
                  onChange={(e) => update(c.id, "position", e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Địa chỉ</p>
                <Input
                  value={c.address}
                  onChange={(e) => update(c.id, "address", e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Ghi chú</p>
              <Textarea
                value={c.note}
                onChange={(e) => update(c.id, "note", e.target.value)}
                className="min-h-[60px] text-sm"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ---------- STEP 5: REVIEW ---------- */

function Step5Review(props: {
  type: PartnerType;
  code: string;
  name: string;
  brand: string;
  repName: string;
  phone: string;
  email: string;
  address: string;
  taxCode: string;
  taxAddress: string;
  segment: string;
  note: string;
  branches: Branch[];
  banks: BankAccount[];
  contacts: Contact[];
}) {
  const {
    type,
    code,
    name,
    brand,
    repName,
    phone,
    email,
    address,
    taxCode,
    taxAddress,
    segment,
    note,
    branches,
    banks,
    contacts,
  } = props;

  // ======= DATA MẪU =======
  const sampleBranches: Branch[] = [
    {
      id: "b1",
      name: "Chi nhánh Hà Nội",
      phone: "0241234567",
      email: "hanoi@greenagro.vn",
      address: "456 Phố Huế, Hai Bà Trưng, Hà Nội",
      taxAddress: "123 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội",
      note: "Chi nhánh miền Bắc",
    },
    {
      id: "b2",
      name: "Chi nhánh Cần Thơ",
      phone: "0292123456",
      email: "cantho@greenagro.vn",
      address: "789 Nguyễn Trãi, Ninh Kiều, Cần Thơ",
      taxAddress: "456 Trần Phú, Ninh Kiều, Cần Thơ",
      note: "Chi nhánh miền Tây",
    },
  ];

  const sampleBanks: BankAccount[] = [
    {
      id: "bk1",
      bankName: "Vietcombank (VCB)",
      accountNo: "0011001234567",
      owner: "Nguyễn Văn A",
      branch: "CN Hà Nội",
      note: "Tài khoản giao dịch chính",
    },
    {
      id: "bk2",
      bankName: "Techcombank (TCB)",
      accountNo: "1900123456789",
      owner: "Nguyễn Văn A",
      branch: "CN Lê Văn Sỹ",
      note: "Thanh toán nội bộ",
    },
  ];

  const sampleContacts: Contact[] = [
    {
      id: "ct1",
      name: "Nguyễn Văn A",
      phone: "0909123456",
      email: "vana@greenagro.vn",
      department: "Kinh doanh",
      position: "Giám đốc",
      address: "123 Lê Lợi, Quận 1, TP.HCM",
      note: "Phụ trách khách hàng lớn miền Nam",
    },
    {
      id: "ct2",
      name: "Trần Thị B",
      phone: "0934567890",
      email: "tranb@greenagro.vn",
      department: "Kế toán",
      position: "Kế toán trưởng",
      address: "456 Nguyễn Huệ, Quận 1, TP.HCM",
      note: "Phụ trách thanh toán và hóa đơn",
    },
  ];

  // nếu props trống thì dùng data mẫu
  const finalBranches = branches.length ? branches : sampleBranches;
  const finalBanks = banks.length ? banks : sampleBanks;
  const finalContacts = contacts.length ? contacts : sampleContacts;

  return (
    <div className="space-y-4">
      {/* ==== THÔNG TIN CƠ BẢN ==== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
          <div className="space-y-1">
            <p>Mã định danh: {code || "ENT-001"}</p>
            <p>
              Loại:{" "}
              {type === "doanh-nghiep" || !type
                ? "Doanh nghiệp"
                : "Nông hộ / hộ cá thể"}
            </p>
            <p>
              Tên đối tượng: {name || "Công ty TNHH Nông sản Xanh (GreenAgro)"}
            </p>
            <p>Thương hiệu: {brand || "GreenAgro"}</p>
            <p>Phân loại: {segment || "Nhà phân phối cấp 1"}</p>
          </div>
          <div className="space-y-1">
            <p>Người đại diện: {repName || "Nguyễn Văn A"}</p>
            <p>SĐT: {phone || "0909123456"}</p>
            <p>Email: {email || "contact@greenagro.vn"}</p>
            <p>Địa chỉ: {address || "123 Lê Lợi, Quận 1, TP.HCM"}</p>
          </div>
          <div className="space-y-1 md:col-span-2">
            <p>Mã số thuế: {taxCode || "0301234567"}</p>
            <p>
              Địa chỉ thuế: {taxAddress || "123 Trần Hưng Đạo, Quận 5, TP.HCM"}
            </p>
            <p>
              Ghi chú:{" "}
              {note ||
                "Khách hàng ưu tiên, thường đặt hàng theo mùa vụ. Có hợp đồng khung với hệ thống phân phối."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ==== CHI NHÁNH ==== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Chi nhánh
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
          {finalBranches.map((b, idx) => (
            <div
              key={b.id}
              className="rounded-lg border bg-muted/20 p-2 space-y-1"
            >
              <p className="font-semibold">
                Chi nhánh {idx + 1}: {b.name}
              </p>
              <p>SĐT: {b.phone}</p>
              <p>Email: {b.email}</p>
              <p>Địa chỉ: {b.address}</p>
              <p>Địa chỉ thuế: {b.taxAddress}</p>
              <p>Ghi chú: {b.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ==== NGÂN HÀNG ==== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Ngân hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
          {finalBanks.map((b, idx) => (
            <div
              key={b.id}
              className="rounded-lg border bg-muted/20 p-2 space-y-1"
            >
              <p className="font-semibold">
                Tài khoản {idx + 1}: {b.bankName}
              </p>
              <p>Số tài khoản: {b.accountNo}</p>
              <p>Chủ TK: {b.owner}</p>
              <p>Chi nhánh: {b.branch}</p>
              <p>Ghi chú: {b.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ==== LIÊN HỆ ==== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin liên hệ
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
          {finalContacts.map((c, idx) => (
            <div
              key={c.id}
              className="rounded-lg border bg-muted/20 p-2 space-y-1"
            >
              <p className="font-semibold">
                Liên hệ {idx + 1}: {c.name}
              </p>
              <p>Điện thoại: {c.phone}</p>
              <p>Email: {c.email}</p>
              <p>Phòng ban: {c.department}</p>
              <p>Chức vụ: {c.position}</p>
              <p>Địa chỉ: {c.address}</p>
              <p>Ghi chú: {c.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
