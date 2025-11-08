"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Calendar,
  Truck,
  Warehouse,
  Percent,
  Phone,
  Building2,
  User,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type DocType = "invoice" | "goods-receipt" | "other";
type DocStatus = "da-nhap-kho" | "cho-doi-chieu" | "thieu-chung-tu" | "da-huy";
const SUPPLIER_OPTIONS = [
  "Công ty Phân bón Miền Nam",
  "Công ty Hữu Cơ Việt",
  "Nhà cung cấp thuốc BVTV Xanh",
  "Công ty Nông nghiệp ABC",
];

const WAREHOUSE_OPTIONS = [
  "Kho Vật tư A",
  "Kho Vật tư B",
  "Kho Tổng – Trung tâm",
  "Kho Tạm – Bãi ngoài",
];
export default function AddInvoicesPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Bước 1 – thông tin cơ bản
  const [code, setCode] = useState("HDN-2025-003");
  const [poCode, setPoCode] = useState("PO-0005");
  const [docType, setDocType] = useState<DocType>("invoice");
  const [issueDate, setIssueDate] = useState("2025-08-10");

  // Bước 2 – số tiền
  const [totalAmount, setTotalAmount] = useState("100000000");
  const [discount, setDiscount] = useState("5000000");
  const [vatPercent, setVatPercent] = useState("8");
  const [freight, setFreight] = useState("1500000");

  // Bước 3 – thông tin NCC & kho
  const [supplierName, setSupplierName] = useState("Công ty Phân bón Miền Nam");
  const [supplierPhone, setSupplierPhone] = useState("0901234567");
  const [supplierTax, setSupplierTax] = useState("0312345678");
  const [contactName, setContactName] = useState("Nguyễn Văn A");
  const [warehouse, setWarehouse] = useState("Kho Vật tư A");
  const [status, setStatus] = useState<DocStatus>("cho-doi-chieu");
  const [note, setNote] = useState(
    "Nhập hàng theo hợp đồng số 12345, giao đợt 1."
  );

  // Tính toán số tiền
  const amounts = useMemo(() => {
    const toNumber = (v: string) => {
      const n = Number(v.replace(/\D/g, ""));
      return Number.isNaN(n) ? 0 : n;
    };
    const total = toNumber(totalAmount);
    const dc = toNumber(discount);
    const ship = toNumber(freight);
    const vatP = Number(vatPercent || "0");
    const afterDiscount = Math.max(total - dc, 0);
    const vatValue = Math.round((afterDiscount * vatP) / 100);
    const payable = afterDiscount + vatValue + ship;
    return { total, dc, ship, vatP, vatValue, payable, afterDiscount };
  }, [totalAmount, discount, freight, vatPercent]);

  const formatMoney = (n: number) =>
    n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " đ";

  const handleNext = () => {
    if (step < 4) setStep((s) => (s + 1) as typeof step);
    else {
      // submit mock
      console.log("submit purchase doc");
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => (s - 1) as typeof step);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Thêm mới hóa đơn & chứng từ nhập hàng
            </h1>
            <p className="text-xs text-muted-foreground">
              Ghi nhận hóa đơn mua vật tư, phiếu nhập kho và thông tin nhà cung
              cấp.
            </p>
          </div>
        </div>
        <Stepper step={step} />
      </header>

      {/* STEP CONTENT */}
      {step === 1 && (
        <Step1Basic
          code={code}
          setCode={setCode}
          poCode={poCode}
          setPoCode={setPoCode}
          docType={docType}
          setDocType={setDocType}
          issueDate={issueDate}
          setIssueDate={setIssueDate}
        />
      )}

      {step === 2 && (
        <Step2Amounts
          totalAmount={totalAmount}
          setTotalAmount={setTotalAmount}
          discount={discount}
          setDiscount={setDiscount}
          vatPercent={vatPercent}
          setVatPercent={setVatPercent}
          freight={freight}
          setFreight={setFreight}
          amounts={amounts}
          formatMoney={formatMoney}
        />
      )}

      {step === 3 && (
        <Step3SupplierWarehouse
          supplierName={supplierName}
          setSupplierName={setSupplierName}
          supplierPhone={supplierPhone}
          setSupplierPhone={setSupplierPhone}
          supplierTax={supplierTax}
          setSupplierTax={setSupplierTax}
          contactName={contactName}
          setContactName={setContactName}
          warehouse={warehouse}
          setWarehouse={setWarehouse}
          status={status}
          setStatus={setStatus}
          note={note}
          setNote={setNote}
        />
      )}

      {step === 4 && (
        <Step4Confirm
          code={code}
          poCode={poCode}
          docType={docType}
          issueDate={issueDate}
          amounts={amounts}
          formatMoney={formatMoney}
          supplierName={supplierName}
          supplierPhone={supplierPhone}
          supplierTax={supplierTax}
          contactName={contactName}
          warehouse={warehouse}
          status={status}
          note={note}
        />
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={step === 1}
          onClick={handlePrev}
        >
          Quay lại
        </Button>
        <Button
          size="sm"
          onClick={handleNext}
          className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
        >
          {step === 4 ? "Hoàn thành" : "Tiếp theo"}
        </Button>
      </div>
    </div>
  );
}

/* ----------------- Stepper ----------------- */

function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const items = [
    { id: 1, label: "Thông tin cơ bản" },
    { id: 2, label: "Số tiền & thuế" },
    { id: 3, label: "Nhà cung cấp & kho" },
    { id: 4, label: "Kiểm tra thông tin" },
  ];

  return (
    <div className="flex flex-1 items-center gap-3">
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

/* ----------------- Step 1 ----------------- */

function Step1Basic({
  code,
  setCode,
  poCode,
  setPoCode,
  docType,
  setDocType,
  issueDate,
  setIssueDate,
}: {
  code: string;
  setCode: (v: string) => void;
  poCode: string;
  setPoCode: (v: string) => void;
  docType: DocType;
  setDocType: (v: DocType) => void;
  issueDate: string;
  setIssueDate: (v: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Bước 1 – Nhập thông tin cơ bản
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1 md:col-span-1">
          <p className="text-xs font-medium text-muted-foreground">
            Mã chứng từ *
          </p>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="VD: HDN-2025-001"
            className="h-9"
          />
        </div>
        <div className="space-y-1 md:col-span-1">
          <p className="text-xs font-medium text-muted-foreground">
            Mã đơn mua hàng
          </p>
          <Input
            value={poCode}
            onChange={(e) => setPoCode(e.target.value)}
            placeholder="VD: PO-0001"
            className="h-9"
          />
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Loại chứng từ *
          </p>
          <Select value={docType} onValueChange={(v: DocType) => setDocType(v)}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Chọn loại chứng từ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invoice">Hóa đơn mua hàng</SelectItem>
              <SelectItem value="goods-receipt">Phiếu nhập kho</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Ngày chứng từ *
          </p>
          <div className="relative">
            <Input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="h-9 pr-8"
            />
            <Calendar className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------- Step 2 ----------------- */

function Step2Amounts({
  totalAmount,
  setTotalAmount,
  discount,
  setDiscount,
  vatPercent,
  setVatPercent,
  freight,
  setFreight,
  amounts,
  formatMoney,
}: {
  totalAmount: string;
  setTotalAmount: (v: string) => void;
  discount: string;
  setDiscount: (v: string) => void;
  vatPercent: string;
  setVatPercent: (v: string) => void;
  freight: string;
  setFreight: (v: string) => void;
  amounts: {
    total: number;
    dc: number;
    ship: number;
    vatP: number;
    vatValue: number;
    payable: number;
    afterDiscount: number;
  };
  formatMoney: (n: number) => string;
}) {
  const onlyNumber = (handler: (v: string) => void) => (e: any) =>
    handler(e.target.value.replace(/\D/g, ""));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          Bước 2 – Nhập số tiền & thuế
          <Truck className="h-4 w-4 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-[2fr,1.5fr]">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Tổng tiền hàng (chưa giảm trừ) *
            </p>
            <Input
              value={totalAmount}
              onChange={onlyNumber(setTotalAmount)}
              className="h-9 text-right"
              inputMode="numeric"
              placeholder="0"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Giảm trừ / chiết khấu
              </p>
              <Input
                value={discount}
                onChange={onlyNumber(setDiscount)}
                className="h-9 text-right"
                inputMode="numeric"
                placeholder="0"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                Thuế GTGT
                <Percent className="h-3 w-3" />
              </p>
              <div className="flex items-center gap-2">
                <Input
                  value={vatPercent}
                  onChange={onlyNumber(setVatPercent)}
                  className="h-9 w-20 text-right"
                  inputMode="numeric"
                  placeholder="8"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Chi phí vận chuyển / bốc xếp
            </p>
            <Input
              value={freight}
              onChange={onlyNumber(setFreight)}
              className="h-9 text-right"
              inputMode="numeric"
              placeholder="0"
            />
          </div>
        </div>

        {/* Tổng hợp */}
        <div className="space-y-2 rounded-lg border bg-muted/40 p-3 text-xs">
          <p className="mb-1 font-semibold text-foreground">
            Tóm tắt số tiền chứng từ
          </p>
          <Row label="Tổng tiền hàng">{formatMoney(amounts.total)}</Row>
          <Row label="Giảm trừ / chiết khấu">
            {amounts.dc ? "-" + formatMoney(amounts.dc) : formatMoney(0)}
          </Row>
          <Row label="Tiền hàng sau giảm trừ">
            {formatMoney(amounts.afterDiscount)}
          </Row>
          <Row label={`Tiền thuế GTGT (${amounts.vatP || 0}%)`}>
            {formatMoney(amounts.vatValue)}
          </Row>
          <Row label="Chi phí vận chuyển / khác">
            {formatMoney(amounts.ship)}
          </Row>

          <div className="mt-2 border-t pt-2">
            <Row label="Tổng tiền phải thanh toán">
              <span className="text-base font-bold text-emerald-600">
                {formatMoney(amounts.payable)}
              </span>
            </Row>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{children}</span>
    </div>
  );
}

/* ----------------- Step 3 ----------------- */

function Step3SupplierWarehouse({
  supplierName,
  setSupplierName,
  supplierPhone,
  setSupplierPhone,
  supplierTax,
  setSupplierTax,
  contactName,
  setContactName,
  warehouse,
  setWarehouse,
  status,
  setStatus,
  note,
  setNote,
}: {
  supplierName: string;
  setSupplierName: (v: string) => void;
  supplierPhone: string;
  setSupplierPhone: (v: string) => void;
  supplierTax: string;
  setSupplierTax: (v: string) => void;
  contactName: string;
  setContactName: (v: string) => void;
  warehouse: string;
  setWarehouse: (v: string) => void;
  status: DocStatus;
  setStatus: (v: DocStatus) => void;
  note: string;
  setNote: (v: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Bước 3 – Thông tin nhà cung cấp & kho nhập
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 lg:grid-cols-2">
        {/* Cột trái: nhà cung cấp */}
        <div className="space-y-3">
          {/* Tên nhà cung cấp -> SELECT */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Nhà cung cấp *
            </p>
            <Select value={supplierName} onValueChange={setSupplierName}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Chọn nhà cung cấp" />
              </SelectTrigger>
              <SelectContent>
                {SUPPLIER_OPTIONS.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Chọn từ danh sách nhà cung cấp đã khai báo.
            </p>
          </div>

          {/* SĐT + MST + người liên hệ vẫn nhập tay */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Số điện thoại
              </p>
              <div className="relative">
                <Input
                  value={supplierPhone}
                  onChange={(e) => setSupplierPhone(e.target.value)}
                  className="h-9 pl-7"
                  placeholder="VD: 0901234567"
                />
                <Phone className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Mã số thuế
              </p>
              <Input
                value={supplierTax}
                onChange={(e) => setSupplierTax(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Người liên hệ
            </p>
            <div className="relative">
              <Input
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="h-9 pl-7"
                placeholder="VD: Nguyễn Văn A"
              />
              <User className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Cột phải: kho + trạng thái + ghi chú */}
        <div className="space-y-3">
          {/* Kho nhập -> SELECT */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Kho nhập
            </p>
            <Select value={warehouse} onValueChange={setWarehouse}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Chọn kho nhập" />
              </SelectTrigger>
              <SelectContent>
                {WAREHOUSE_OPTIONS.map((kho) => (
                  <SelectItem key={kho} value={kho}>
                    {kho}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground">
              Lựa chọn kho nhận hàng để ghi nhận tồn kho chính xác.
            </p>
          </div>

          {/* Trạng thái chứng từ */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Trạng thái chứng từ
            </p>
            <Select
              value={status}
              onValueChange={(v: DocStatus) => setStatus(v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="da-nhap-kho">Đã nhập kho</SelectItem>
                <SelectItem value="cho-doi-chieu">Chờ đối chiếu</SelectItem>
                <SelectItem value="thieu-chung-tu">Thiếu chứng từ</SelectItem>
                <SelectItem value="da-huy">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ghi chú */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Ghi chú / nội dung thêm
            </p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[96px] text-sm"
              placeholder="Ví dụ: giao hàng kèm 2 phiếu cân, chờ NCC xuất hóa đơn điện tử..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ----------------- Step 4 ----------------- */

function Step4Confirm({
  code,
  poCode,
  docType,
  issueDate,
  amounts,
  formatMoney,
  supplierName,
  supplierPhone,
  supplierTax,
  contactName,
  warehouse,
  status,
  note,
}: {
  code: string;
  poCode: string;
  docType: DocType;
  issueDate: string;
  amounts: {
    total: number;
    dc: number;
    ship: number;
    vatValue: number;
    payable: number;
    afterDiscount: number;
  };
  formatMoney: (n: number) => string;
  supplierName: string;
  supplierPhone: string;
  supplierTax: string;
  contactName: string;
  warehouse: string;
  status: DocStatus;
  note: string;
}) {
  const typeLabel: Record<DocType, string> = {
    invoice: "Hóa đơn mua hàng",
    "goods-receipt": "Phiếu nhập kho",
    other: "Khác",
  };

  const statusLabel: Record<DocStatus, string> = {
    "da-nhap-kho": "Đã nhập kho",
    "cho-doi-chieu": "Chờ đối chiếu",
    "thieu-chung-tu": "Thiếu chứng từ",
    "da-huy": "Đã hủy",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Bước 4 – Kiểm tra thông tin trước khi lưu
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2 text-sm">
        <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
          <p className="mb-1 font-semibold text-foreground">
            Thông tin chứng từ
          </p>
          <InfoRow label="Mã chứng từ" value={code || "-"} />
          <InfoRow label="Mã đơn mua hàng" value={poCode || "-"} />
          <InfoRow label="Loại chứng từ" value={typeLabel[docType]} />
          <InfoRow
            label="Ngày chứng từ"
            value={
              issueDate ? new Date(issueDate).toLocaleDateString("vi-VN") : "-"
            }
          />
          <InfoRow label="Kho nhập" value={warehouse || "-"} />
          <InfoRow label="Trạng thái" value={statusLabel[status]} />
        </div>

        <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
          <p className="mb-1 font-semibold text-foreground">
            Thông tin tiền & nhà cung cấp
          </p>
          <InfoRow label="Nhà cung cấp" value={supplierName || "-"} />
          <InfoRow label="Người liên hệ" value={contactName || "-"} />
          <InfoRow label="Số điện thoại" value={supplierPhone || "-"} />
          <InfoRow label="Mã số thuế" value={supplierTax || "-"} />

          <div className="mt-2 border-t pt-2 space-y-1">
            <InfoRow
              label="Tổng tiền hàng"
              value={formatMoney(amounts.total)}
            />
            <InfoRow
              label="Giảm trừ / chiết khấu"
              value={
                amounts.dc ? "-" + formatMoney(amounts.dc) : formatMoney(0)
              }
            />
            <InfoRow
              label="Tiền hàng sau giảm trừ"
              value={formatMoney(amounts.afterDiscount)}
            />
            <InfoRow
              label="Tiền thuế GTGT"
              value={formatMoney(amounts.vatValue)}
            />
            <InfoRow
              label="Chi phí vận chuyển / khác"
              value={formatMoney(amounts.ship)}
            />
            <InfoRow
              label="Tổng tiền thanh toán"
              value={formatMoney(amounts.payable)}
              highlight
            />
          </div>
        </div>

        {note && (
          <div className="lg:col-span-2 rounded-lg border bg-muted/20 p-3">
            <p className="text-xs font-semibold text-muted-foreground">
              Ghi chú
            </p>
            <p className="mt-1 text-sm text-foreground whitespace-pre-line">
              {note}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          "font-medium " +
          (highlight ? "text-emerald-600 text-base" : "text-foreground")
        }
      >
        {value}
      </span>
    </div>
  );
}
