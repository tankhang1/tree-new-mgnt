"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileUp,
  HandCoins,
  Home,
  IdCard,
  Landmark,
  Mail,
  MapPin,
  Phone,
  User2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { partners, type Category, type Partner } from "@/pages/data/partners";
import { useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AddPayablesPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<Category>("khach-hang");
  const [search, setSearch] = useState("");
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(
    "1"
  );

  const [paymentType, setPaymentType] = useState<string>("invoice");

  const [invoiceNo, setInvoiceNo] = useState("INV001");
  const [amount, setAmount] = useState<string>("5000000");
  const [fileName, setFileName] = useState<string | null>(null);

  const [paidAmount, setPaidAmount] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [txnCode, setTxnCode] = useState("");
  const [note, setNote] = useState("");
  const filteredPartners = useMemo(
    () =>
      partners.filter(
        (p) =>
          p.category === category &&
          p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [category, search]
  );

  const selectedPartner = useMemo(
    () => partners.find((p) => p.id === selectedPartnerId) || null,
    [selectedPartnerId]
  );

  const amountNumber = useMemo(() => {
    const n = Number(amount.replace(/\D/g, ""));
    return Number.isNaN(n) ? 0 : n;
  }, [amount]);

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handlePrev = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  return (
    <div className="flex flex-col gap-4">
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
              Thêm mới phiếu công nợ phải trả
            </h1>
          </div>
        </div>
        <Stepper step={step} />
      </header>

      {step === 1 && (
        <Step1SelectPartner
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
          partners={filteredPartners}
          selectedPartnerId={selectedPartnerId}
          setSelectedPartnerId={setSelectedPartnerId}
        />
      )}

      {step === 2 && (
        <Step2Invoice
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          invoiceNo={invoiceNo}
          setInvoiceNo={setInvoiceNo}
          amount={amount}
          setAmount={setAmount}
          fileName={fileName}
          setFileName={setFileName}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          accountName={accountName}
          setAccountName={setAccountName}
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
          bankName={bankName}
          setBankName={setBankName}
          swiftCode={swiftCode}
          setSwiftCode={setSwiftCode}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          txnCode={txnCode}
          setTxnCode={setTxnCode}
          note={note}
          setNote={setNote}
        />
      )}

      {step === 3 && (
        <Step3Confirm
          category={category}
          partner={selectedPartner}
          paymentType={paymentType}
          invoiceNo={invoiceNo}
          amount={amountNumber}
          fileName={fileName}
          paidAmount={paidAmount}
          accountName={accountName}
          accountNumber={accountNumber}
          bankName={bankName}
          swiftCode={swiftCode}
          paymentMethod={paymentMethod}
          txnCode={txnCode}
        />
      )}

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
          onClick={handleNext}
          size="sm"
          className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
        >
          {step === 3 ? "Hoàn thành" : "Tiếp theo"}
        </Button>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { id: 1, label: "Thông tin khách hàng/đối tác" },
    { id: 2, label: "Thông tin hóa đơn hoặc đợt thanh toán" },
    { id: 3, label: "Xác nhận thông tin" },
  ];

  return (
    <div className="flex flex-1 items-center gap-4">
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

function Step1SelectPartner({
  category,
  setCategory,
  search,
  setSearch,
  partners,
  selectedPartnerId,
  setSelectedPartnerId,
}: {
  category: Category;
  setCategory: (c: Category) => void;
  search: string;
  setSearch: (v: string) => void;
  partners: Partner[];
  selectedPartnerId: string | null;
  setSelectedPartnerId: (id: string) => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const totalPages = Math.max(1, Math.ceil(partners.length / pageSize));

  const paginatedPartners = useMemo(() => {
    const start = (page - 1) * pageSize;
    return partners.slice(start, start + pageSize);
  }, [partners, page]);

  useEffect(() => {
    setPage(1);
  }, [partners.length]);

  const startIndex = partners.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, partners.length);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Bước 1 – Thông tin khách hàng/đối tác
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">
            Phân loại
          </p>
          <div className="flex flex-wrap gap-2">
            <CategoryButton
              active={category === "khach-hang"}
              icon={User2}
              label="Khách hàng"
              onClick={() => setCategory("khach-hang")}
            />
            <CategoryButton
              active={category === "doi-tac"}
              icon={HandCoins}
              label="Đối tác"
              onClick={() => setCategory("doi-tac")}
            />
            <CategoryButton
              active={category === "nha-cung-cap"}
              icon={Home}
              label="Nhà cung cấp"
              onClick={() => setCategory("nha-cung-cap")}
            />
            <CategoryButton
              active={category === "ngan-hang"}
              icon={Landmark}
              label="Ngân hàng"
              onClick={() => setCategory("ngan-hang")}
            />
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">
            Tìm kiếm
          </p>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên đối tác, số điện thoại, email..."
            className="h-9"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginatedPartners.map((p) => {
            const selected = p.id === selectedPartnerId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedPartnerId(p.id)}
                className={`group flex h-full flex-col rounded-xl border bg-card/80 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-md ${
                  selected
                    ? "border-primary ring-1 ring-primary/40"
                    : "border-border"
                }`}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {p.name}
                    </p>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700">
                      {p.type}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.tags && p.tags.length > 0 && (
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700"
                      >
                        Đối tác
                      </Badge>
                    )}
                    {selected ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary/70" />
                    )}
                  </div>
                </div>

                <div className="grid gap-x-4 gap-y-1 text-xs text-muted-foreground md:grid-cols-2">
                  <p className="flex items-center gap-1">
                    <IdCard className="h-3 w-3 text-emerald-500" />
                    <span className="font-medium">Người đại diện:</span>
                    <span className="truncate">{p.contact}</span>
                  </p>
                  {p.taxCode && (
                    <p className="flex items-center gap-1">
                      <IdCard className="h-3 w-3 text-emerald-500" />
                      <span className="font-medium">Mã số thuế:</span>
                      <span className="truncate">{p.taxCode}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-emerald-500" />
                    <span className="font-medium">SĐT:</span>
                    <span>{p.phone}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-emerald-500" />
                    <span className="truncate">{p.email}</span>
                  </p>
                  <p className="md:col-span-2 flex items-start gap-1">
                    <MapPin className="mt-[1px] h-3 w-3 text-emerald-500" />
                    <span className="line-clamp-2">{p.address}</span>
                  </p>
                </div>

                {(p.tags?.length || p.note) && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {p.tags?.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700"
                      >
                        {t}
                      </Badge>
                    ))}
                    {p.note && (
                      <span className="text-[11px] italic text-muted-foreground">
                        {p.note}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}

          {partners.length === 0 && (
            <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed bg-muted/40 px-4 py-10 text-sm text-muted-foreground">
              Không tìm thấy đối tác phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>

        {partners.length > 0 && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Hiển thị{" "}
              <span className="font-medium">
                {startIndex}–{endIndex}
              </span>{" "}
              / <span className="font-medium">{partners.length}</span> đối tác
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trước
              </Button>
              <span>
                Trang{" "}
                <span className="font-medium">
                  {page}/{totalPages}
                </span>
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CategoryButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof User2;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "outline"}
      className={
        active
          ? "bg-primary! text-primary-foreground! hover:bg-primary/90!"
          : ""
      }
      onClick={onClick}
    >
      <Icon className="mr-1 h-4 w-4" />
      {label}
    </Button>
  );
}

function Step2Invoice({
  paymentType,
  setPaymentType,
  invoiceNo,
  setInvoiceNo,
  amount,
  setAmount,
  fileName,
  setFileName,
  paidAmount,
  setPaidAmount,
  accountName,
  setAccountName,
  accountNumber,
  setAccountNumber,
  bankName,
  setBankName,
  swiftCode,
  setSwiftCode,
  paymentMethod,
  setPaymentMethod,
  txnCode,
  setTxnCode,
  note,
  setNote,
}: {
  paymentType: string;
  setPaymentType: (v: string) => void;

  invoiceNo: string;
  setInvoiceNo: (v: string) => void;

  amount: string;
  setAmount: (v: string) => void;

  fileName: string | null;
  setFileName: (v: string | null) => void;

  paidAmount: string;
  setPaidAmount: (v: string) => void;

  accountName: string;
  setAccountName: (v: string) => void;

  accountNumber: string;
  setAccountNumber: (v: string) => void;

  bankName: string;
  setBankName: (v: string) => void;

  swiftCode: string;
  setSwiftCode: (v: string) => void;

  paymentMethod: string;
  setPaymentMethod: (v: string) => void;

  txnCode: string;
  setTxnCode: (v: string) => void;

  note?: string;
  setNote?: (v: string) => void;
}) {
  const handleAmountChange = (val: string, setter: (v: string) => void) => {
    setter(val.replace(/\D/g, ""));
  };
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Bước 2 – Thông tin hóa đơn hoặc đợt thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground">
            Hình thức thanh toán
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={paymentType === "invoice" ? "default" : "outline"}
              className={
                paymentType === "invoice"
                  ? "bg-primary! text-primary-foreground!"
                  : ""
              }
              onClick={() => setPaymentType("invoice")}
            >
              Hóa đơn
            </Button>
            <Button
              type="button"
              size="sm"
              variant={paymentType === "installment" ? "default" : "outline"}
              className={
                paymentType === "installment"
                  ? "bg-primary! text-primary-foreground!"
                  : ""
              }
              onClick={() => setPaymentType("installment")}
            >
              Đợt thanh toán
            </Button>
          </div>
        </div>

        {paymentType === "invoice" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                Mã hóa đơn
              </p>
              <Input
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="Nhập mã hóa đơn"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                Số tiền
              </p>
              <Input
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value, setAmount)}
                placeholder="Nhập số tiền"
                className="h-9"
              />
            </div>
            {setNote && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Ghi chú / nội dung hóa đơn
                </p>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Mô tả ngắn về hóa đơn, kỳ công nợ…"
                  className="min-h-[80px] text-sm"
                />
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Tệp đính kèm
              </p>
              <div className="flex min-h-[200px] items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 bg-muted/40 px-4">
                <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FileUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Bỏ và thả file tại đây
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Đính kèm file (tối đa 5MB)
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-1"
                    onClick={() =>
                      setFileName(fileName ? null : "hoa-don-mau.pdf")
                    }
                  >
                    {fileName ? "Xóa file mẫu" : "Chọn file mẫu"}
                  </Button>
                  {fileName && (
                    <p className="text-xs text-emerald-600">
                      Đã chọn: <span className="font-medium">{fileName}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {paymentType === "installment" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">
                Số tiền đã thanh toán
              </p>
              <Input
                value={paidAmount}
                onChange={(e) =>
                  handleAmountChange(e.target.value, setPaidAmount)
                }
                placeholder="Nhập số tiền đã thanh toán"
                className="h-9"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Chủ tài khoản
                </p>
                <Input
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Nhập tên chủ tài khoản"
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Số tài khoản
                </p>
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Nhập số tài khoản"
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Ngân hàng
                </p>
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Nhập tên ngân hàng"
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Mã SWIFT
                </p>
                <Input
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  placeholder="Nhập mã SWIFT (nếu có)"
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Phương thức thanh toán
                </p>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn phương thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tiền mặt</SelectItem>
                    <SelectItem value="transfer">Chuyển khoản</SelectItem>
                    <SelectItem value="card">Thẻ ngân hàng</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">
                  Mã giao dịch / mã hóa đơn
                </p>
                <Input
                  value={txnCode}
                  onChange={(e) => setTxnCode(e.target.value)}
                  placeholder="Nhập mã giao dịch / mã hóa đơn"
                  className="h-9"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Step3Confirm({
  category,
  partner,
  paymentType,
  invoiceNo,
  amount,
  fileName,
  paidAmount,
  accountName,
  accountNumber,
  bankName,
  swiftCode,
  paymentMethod,
  txnCode,
}: {
  category: Category;
  partner: Partner | null;
  paymentType: string;
  invoiceNo: string;
  amount: number;
  fileName: string | null;

  paidAmount: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  swiftCode: string;
  paymentMethod: string;
  txnCode: string;
}) {
  const categoryLabel: Record<string, string> = {
    "khach-hang": "Khách hàng",
    "doi-tac": "Đối tác",
    "nha-cung-cap": "Nhà cung cấp",
    "ngan-hang": "Ngân hàng",
  };

  const paidAmountNumber = (() => {
    const n = Number(paidAmount.replace(/\D/g, ""));
    return Number.isNaN(n) ? 0 : n;
  })();

  const formatMoney = (v: number) =>
    v ? `${v.toLocaleString("vi-VN")} VND` : "-";

  const paymentMethodLabel =
    paymentMethod === "cash"
      ? "Tiền mặt"
      : paymentMethod === "transfer"
      ? "Chuyển khoản"
      : paymentMethod === "card"
      ? "Thẻ ngân hàng"
      : paymentMethod
      ? "Khác"
      : "-";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Bước 3 – Xác nhận thông tin công nợ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Thông tin đối tác
            </p>
            <div className="rounded-lg border bg-card/60 px-4 py-3 space-y-1">
              <p>
                Phân loại:{" "}
                <span className="font-medium">
                  {categoryLabel[category] || "Chưa chọn"}
                </span>
              </p>
              <p>
                Tên liên hệ:{" "}
                <span className="font-medium">{partner?.contact || "-"}</span>
              </p>
              <p>
                Số điện thoại:{" "}
                <span className="font-medium">{partner?.phone || "-"}</span>
              </p>
              <p>
                Email:{" "}
                <span className="font-medium">{partner?.email || "-"}</span>
              </p>
              <p>
                Địa chỉ:{" "}
                <span className="font-medium">{partner?.address || "-"}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Thông tin thanh toán
            </p>
            <div className="rounded-lg border bg-card/60 px-4 py-3 space-y-1">
              <p>
                Hình thức thanh toán:{" "}
                <span className="font-medium">
                  {paymentType === "invoice" ? "Hóa đơn" : "Đợt thanh toán"}
                </span>
              </p>

              {paymentType === "invoice" && (
                <>
                  <p>
                    Mã hóa đơn:{" "}
                    <span className="font-medium">{invoiceNo || "-"}</span>
                  </p>
                  <p>
                    Số tiền:{" "}
                    <span className="font-bold text-emerald-600">
                      {formatMoney(amount)}
                    </span>
                  </p>
                </>
              )}

              {paymentType === "installment" && (
                <>
                  <p>
                    Số tiền thanh toán:{" "}
                    <span className="font-bold text-emerald-600">
                      {formatMoney(paidAmountNumber)}
                    </span>
                  </p>
                  <p>
                    Chủ tài khoản:{" "}
                    <span className="font-medium">{accountName || "-"}</span>
                  </p>
                  <p>
                    Số tài khoản:{" "}
                    <span className="font-medium">{accountNumber || "-"}</span>
                  </p>
                  <p>
                    Ngân hàng:{" "}
                    <span className="font-medium">{bankName || "-"}</span>
                  </p>
                  <p>
                    Mã SWIFT:{" "}
                    <span className="font-medium">{swiftCode || "-"}</span>
                  </p>
                  <p>
                    Phương thức thanh toán:{" "}
                    <span className="font-medium">{paymentMethodLabel}</span>
                  </p>
                  <p>
                    Mã giao dịch / mã hóa đơn:{" "}
                    <span className="font-medium">{txnCode || "-"}</span>
                  </p>
                </>
              )}

              <p>
                Tệp đính kèm:{" "}
                <span className="font-medium text-primary">
                  {fileName ? "Xem file" : "Không có tệp đính kèm"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
