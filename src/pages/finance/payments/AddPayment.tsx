"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Home,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import { bankAccounts, type BankAccount } from "@/pages/data/banks";
import { partners, type Category, type Partner } from "@/pages/data/partners";
import { people, type Person } from "@/pages/data/employees";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type LineItem = {
  id: string;
  description: string;
  amount: number | "";
};

function createLineItem(description: string, amount: number): LineItem {
  return {
    id: crypto.randomUUID(),
    description,
    amount,
  };
}

export default function AddPaymentPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [payerCategory, setPayerCategory] = useState<Category>("doanh-nghiep");
  const [receiverCategory, setReceiverCategory] =
    useState<Category>("doanh-nghiep");

  const [searchPayer, setSearchPayer] = useState("");
  const [searchReceiver, setSearchReceiver] = useState("");

  const [selectedPayerId, setSelectedPayerId] = useState<string>("p1");
  const [selectedPayerPersonId, setSelectedPayerPersonId] =
    useState<string>("u1");
  const [selectedReceiverId, setSelectedReceiverId] = useState<string>("p3");
  const [selectedReceiverPersonId, setSelectedReceiverPersonId] =
    useState<string>("u2");

  const [purpose, setPurpose] = useState(
    "Thanh toán tiền mua vật tư nông nghiệp"
  );
  const [content, setContent] = useState(
    "Thanh toán tiền phân bón theo hợp đồng số 12345"
  );

  const [items, setItems] = useState<LineItem[]>([
    createLineItem("Thanh toán tiền phân bón đợt 1", 50000000),
    createLineItem("Thanh toán tiền thuốc BVTV", 30000000),
    createLineItem("Chi phí vận chuyển hàng hóa", 20000000),
  ]);

  const [voucherTitle, setVoucherTitle] = useState(
    "Chi tiền hợp đồng số 12345"
  );
  const [voucherNo, setVoucherNo] = useState("PC001");
  const [voucherDate, setVoucherDate] = useState("2025-08-08T10:30");
  const [method, setMethod] = useState("transfer");
  const [selectedBankId, setSelectedBankId] = useState<string>("b1");
  const [bankNote, setBankNote] = useState(
    "Thanh toán chuyển khoản, nội dung: Chi tiền hợp đồng số 12345."
  );

  const filteredPayers = useMemo(
    () =>
      partners.filter(
        (p) =>
          p.category === payerCategory &&
          p.name.toLowerCase().includes(searchPayer.toLowerCase())
      ),
    [payerCategory, searchPayer]
  );

  const filteredReceivers = useMemo(
    () =>
      partners.filter(
        (p) =>
          p.category === receiverCategory &&
          p.name.toLowerCase().includes(searchReceiver.toLowerCase())
      ),
    [receiverCategory, searchReceiver]
  );

  const payerParty = useMemo(
    () => partners.find((p) => p.id === selectedPayerId) || null,
    [selectedPayerId]
  );
  const payerPerson = useMemo(
    () => people.find((u) => u.id === selectedPayerPersonId) || null,
    [selectedPayerPersonId]
  );

  const receiverParty = useMemo(
    () => partners.find((p) => p.id === selectedReceiverId) || null,
    [selectedReceiverId]
  );
  const receiverPerson = useMemo(
    () => people.find((u) => u.id === selectedReceiverPersonId) || null,
    [selectedReceiverPersonId]
  );

  const selectedBank = useMemo(
    () => bankAccounts.find((b) => b.id === selectedBankId) || null,
    [selectedBankId]
  );

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (sum, i) => (typeof i.amount === "number" ? sum + i.amount : sum),
        0
      ),
    [items]
  );

  const handleChangeItem = (
    id: string,
    field: keyof LineItem,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "amount"
                  ? value === ""
                    ? ""
                    : Number(value.replace(/\D/g, ""))
                  : value,
            }
          : item
      )
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description: "",
        amount: "",
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

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
              Thêm mới chứng từ chi tiền
            </h1>
          </div>
        </div>
        <Stepper step={step} />
      </header>

      {step === 1 && (
        <Step1IdentifyPayment
          payerCategory={payerCategory}
          setPayerCategory={setPayerCategory}
          receiverCategory={receiverCategory}
          setReceiverCategory={setReceiverCategory}
          searchPayer={searchPayer}
          setSearchPayer={setSearchPayer}
          searchReceiver={searchReceiver}
          setSearchReceiver={setSearchReceiver}
          payers={filteredPayers}
          receivers={filteredReceivers}
          selectedPayerId={selectedPayerId}
          setSelectedPayerId={setSelectedPayerId}
          selectedReceiverId={selectedReceiverId}
          setSelectedReceiverId={setSelectedReceiverId}
          people={people}
          selectedPayerPersonId={selectedPayerPersonId}
          setSelectedPayerPersonId={setSelectedPayerPersonId}
          selectedReceiverPersonId={selectedReceiverPersonId}
          setSelectedReceiverPersonId={setSelectedReceiverPersonId}
          purpose={purpose}
          setPurpose={setPurpose}
          content={content}
          setContent={setContent}
        />
      )}

      {step === 2 && (
        <Step2PaymentDetails
          items={items}
          onChangeItem={handleChangeItem}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          totalAmount={totalAmount}
          voucherTitle={voucherTitle}
          setVoucherTitle={setVoucherTitle}
          voucherNo={voucherNo}
          setVoucherNo={setVoucherNo}
          voucherDate={voucherDate}
          setVoucherDate={setVoucherDate}
          method={method}
          setMethod={setMethod}
          selectedBankId={selectedBankId}
          setSelectedBankId={setSelectedBankId}
          bankNote={bankNote}
          setBankNote={setBankNote}
        />
      )}

      {step === 3 && (
        <Step3ConfirmPayment
          payerParty={payerParty}
          payerPerson={payerPerson}
          receiverParty={receiverParty}
          receiverPerson={receiverPerson}
          purpose={purpose}
          content={content}
          items={items}
          totalAmount={totalAmount}
          voucherTitle={voucherTitle}
          voucherNo={voucherNo}
          voucherDate={voucherDate}
          method={method}
          bank={selectedBank}
          bankNote={bankNote}
        />
      )}

      <div className="flex justify-between border-t py-4">
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
          {step === 3 ? "Hoàn thành" : "Tiếp theo"}
        </Button>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { id: 1, label: "Thông tin định danh" },
    { id: 2, label: "Thông tin mục đích chi" },
    { id: 3, label: "Xác nhận" },
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

function CategoryButtons({
  value,
  onChange,
}: {
  value: Category;
  onChange: (v: Category) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        size="sm"
        variant={value === "doanh-nghiep" ? "default" : "outline"}
        className={
          value === "doanh-nghiep" ? "bg-primary! text-primary-foreground!" : ""
        }
        onClick={() => onChange("doanh-nghiep")}
      >
        <Building2 className="mr-1 h-4 w-4" />
        Doanh nghiệp
      </Button>
      <Button
        type="button"
        size="sm"
        variant={value === "nong-ho" ? "default" : "outline"}
        className={
          value === "nong-ho" ? "bg-primary! text-primary-foreground!" : ""
        }
        onClick={() => onChange("nong-ho")}
      >
        <Home className="mr-1 h-4 w-4" />
        Nông hộ
      </Button>
      <Button
        type="button"
        size="sm"
        variant={value === "khach-hang" ? "default" : "outline"}
        className={
          value === "khach-hang" ? "bg-primary! text-primary-foreground!" : ""
        }
        onClick={() => onChange("khach-hang")}
      >
        <User className="mr-1 h-4 w-4" />
        Khách hàng
      </Button>
    </div>
  );
}

function PartyGrid({
  items,
  selectedId,
  onSelect,
  pageSize = 6,
}: {
  title?: string;
  items: Partner[];
  selectedId: string;
  onSelect: (id: string) => void;
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);

  // Reset về trang 1 khi danh sách thay đổi (do filter / search)
  useEffect(() => {
    setPage(1);
  }, [items.length]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, items.length);
  const pageItems = items.slice(startIndex, endIndex);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="flex items-center justify-center rounded-lg border border-dashed bg-muted/40 px-4 py-10 text-sm text-muted-foreground">
          Không tìm thấy đối tượng phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pageItems.map((p) => {
              const selected = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelect(p.id)}
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
                      <User className="h-3 w-3 text-emerald-500" />
                      <span className="font-medium">Người đại diện:</span>
                      <span className="truncate">{p.contact}</span>
                    </p>
                    {p.taxCode && (
                      <p className="flex items-center gap-1">
                        <Banknote className="h-3 w-3 text-emerald-500" />
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
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              Hiển thị{" "}
              <span className="font-medium text-foreground">
                {startIndex + 1}-{endIndex}
              </span>{" "}
              / {items.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={page === 1}
                onClick={handlePrev}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="min-w-[70px] text-center">
                Trang {page}/{totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={page === totalPages}
                onClick={handleNext}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PersonGrid({
  title,
  selectedId,
  onSelect,
  items,
}: {
  title: string;
  selectedId: string;
  onSelect: (id: string) => void;
  items: Person[];
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => {
            const selected = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                className={`flex h-full flex-col rounded-lg border bg-card p-3 text-left shadow-sm transition hover:border-primary/60 hover:shadow-md ${
                  selected ? "border-primary ring-1 ring-primary/40" : ""
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {p.name}
                  </p>
                  {selected && (
                    <Badge className="bg-primary/10 text-primary">
                      Được chọn
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Vai trò: <span className="font-medium">{p.role}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  SĐT: <span className="font-medium">{p.phone}</span>
                </p>
                {p.email && (
                  <p className="text-xs text-muted-foreground">
                    Email: {p.email}
                  </p>
                )}
                {p.org && (
                  <p className="text-xs text-muted-foreground">
                    Đơn vị: {p.org}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function Step1IdentifyPayment({
  payerCategory,
  setPayerCategory,
  receiverCategory,
  setReceiverCategory,
  searchPayer,
  setSearchPayer,
  searchReceiver,
  setSearchReceiver,
  payers,
  receivers,
  selectedPayerId,
  setSelectedPayerId,
  selectedReceiverId,
  setSelectedReceiverId,
  people,
  selectedPayerPersonId,
  setSelectedPayerPersonId,
  selectedReceiverPersonId,
  setSelectedReceiverPersonId,
  purpose,
  setPurpose,
  content,
  setContent,
}: {
  payerCategory: Category;
  setPayerCategory: (v: Category) => void;
  receiverCategory: Category;
  setReceiverCategory: (v: Category) => void;
  searchPayer: string;
  setSearchPayer: (v: string) => void;
  searchReceiver: string;
  setSearchReceiver: (v: string) => void;
  payers: Partner[];
  receivers: Partner[];
  selectedPayerId: string;
  setSelectedPayerId: (id: string) => void;
  selectedReceiverId: string;
  setSelectedReceiverId: (id: string) => void;
  people: Person[];
  selectedPayerPersonId: string;
  setSelectedPayerPersonId: (id: string) => void;
  selectedReceiverPersonId: string;
  setSelectedReceiverPersonId: (id: string) => void;
  purpose: string;
  setPurpose: (v: string) => void;
  content: string;
  setContent: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">
              Đối tượng chi
            </CardTitle>
            <CategoryButtons
              value={payerCategory}
              onChange={setPayerCategory}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Đối tượng chi"
            value={searchPayer}
            onChange={(e) => setSearchPayer(e.target.value)}
            className="h-9"
          />
          <PartyGrid
            items={payers}
            selectedId={selectedPayerId}
            onSelect={setSelectedPayerId}
          />
        </CardContent>
      </Card>

      <PersonGrid
        title="Người chi"
        selectedId={selectedPayerPersonId}
        onSelect={setSelectedPayerPersonId}
        items={people}
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-4">
            <CardTitle className="text-base font-semibold">
              Đối tượng nhận
            </CardTitle>
            <CategoryButtons
              value={receiverCategory}
              onChange={setReceiverCategory}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Đối tượng nhận"
            value={searchReceiver}
            onChange={(e) => setSearchReceiver(e.target.value)}
            className="h-9"
          />
          <PartyGrid
            items={payers}
            selectedId={selectedPayerId}
            onSelect={setSelectedPayerId}
          />
        </CardContent>
      </Card>

      <PersonGrid
        title="Người nhận"
        selectedId={selectedReceiverPersonId}
        onSelect={setSelectedReceiverPersonId}
        items={people}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Mục đích và nội dung chi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Mục đích</span>
            <Input
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="h-9"
              placeholder="Ví dụ: Thanh toán tiền mua vật tư, chi phí vận chuyển..."
            />
          </div>
          <div className="space-y-1 md:col-span-1">
            <span className="text-xs text-muted-foreground">Nội dung</span>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[72px]"
              placeholder="Mô tả chi tiết nội dung chi tiền..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
function getInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (
    parts[0]!.charAt(0).toUpperCase() +
    parts[parts.length - 1]!.charAt(0).toUpperCase()
  );
}
function Step2PaymentDetails({
  items,
  onChangeItem,
  onAddItem,
  onRemoveItem,
  totalAmount,
  voucherTitle,
  setVoucherTitle,
  voucherNo,
  setVoucherNo,
  voucherDate,
  setVoucherDate,
  method,
  setMethod,
  selectedBankId,
  setSelectedBankId,
  bankNote,
  setBankNote,
}: {
  items: LineItem[];
  onChangeItem: (id: string, field: keyof LineItem, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
  totalAmount: number;
  voucherTitle: string;
  setVoucherTitle: (v: string) => void;
  voucherNo: string;
  setVoucherNo: (v: string) => void;
  voucherDate: string;
  setVoucherDate: (v: string) => void;
  method: string;
  setMethod: (v: string) => void;
  selectedBankId: string;
  setSelectedBankId: (v: string) => void;
  bankNote: string;
  setBankNote: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Danh sách khoản chi
            <Badge variant="outline" className="text-xs">
              Diễn giải & số tiền
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid gap-3 md:grid-cols-[1fr,200px,40px]"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">
                    Nội dung {index + 1}
                  </span>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      onChangeItem(item.id, "description", e.target.value)
                    }
                    placeholder="Nhập nội dung chi..."
                    className="h-9"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Số tiền</span>
                  <Input
                    inputMode="numeric"
                    value={
                      item.amount === ""
                        ? ""
                        : item.amount.toLocaleString("vi-VN")
                    }
                    onChange={(e) =>
                      onChangeItem(item.id, "amount", e.target.value)
                    }
                    className="h-9 text-right"
                  />
                </div>
                <div className="flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => onRemoveItem(item.id)}
                    disabled={items.length === 1}
                  >
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddItem}
              className="border-dashed"
            >
              Thêm diễn giải
            </Button>
            <div className="text-sm">
              <span className="mr-2 text-muted-foreground">Tổng tiền chi</span>
              <span className="text-lg font-bold text-red-600">
                {totalAmount.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Thông tin chứng từ chi
            <Banknote className="h-4 w-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[2fr,1.5fr]">
          <div className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">Tiêu đề</span>
              <Input
                value={voucherTitle}
                onChange={(e) => setVoucherTitle(e.target.value)}
                className="mt-1 h-9"
              />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <span className="text-xs text-muted-foreground">
                  Số phiếu chi
                </span>
                <Input
                  value={voucherNo}
                  onChange={(e) => setVoucherNo(e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Ngày lập chứng từ
                </span>
                <Input
                  type="datetime-local"
                  value={voucherDate}
                  onChange={(e) => setVoucherDate(e.target.value)}
                  className="mt-1 h-9"
                />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <span className="text-xs text-muted-foreground">
                  Hình thức chi
                </span>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue placeholder="Chọn hình thức chi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Tiền mặt</SelectItem>
                    <SelectItem value="transfer">Chuyển khoản</SelectItem>
                    <SelectItem value="offset">Bù trừ công nợ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Ghi chú chứng từ
                </span>
                <Textarea
                  value={bankNote}
                  onChange={(e) => setBankNote(e.target.value)}
                  className="mt-1 min-h-[72px] text-sm"
                  placeholder="Ghi chú thêm về chứng từ, ví dụ: thanh toán theo hợp đồng, hóa đơn kèm theo..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs text-muted-foreground">
              Tài khoản thanh toán
            </span>
            <div className="grid gap-3">
              {bankAccounts.map((b) => {
                const selected = b.id === selectedBankId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setSelectedBankId(b.id)}
                    className={`flex flex-col rounded-lg border bg-muted/40 p-3 text-left text-xs shadow-sm transition hover:border-primary/60 hover:bg-muted/70 ${
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                        : ""
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border bg-background">
                          {/* Nếu có URL logo thì dùng */}
                          {b.avatar && (
                            <AvatarImage
                              src={b.avatar}
                              alt={b.name}
                              className="object-contain"
                            />
                          )}
                          <AvatarFallback className="text-[11px] font-semibold">
                            {getInitials(b.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-foreground">
                            {b.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Tài khoản thanh toán
                          </span>
                        </div>
                      </div>

                      {selected && (
                        <Badge className="bg-primary/10 text-primary">
                          Đang chọn
                        </Badge>
                      )}
                    </div>

                    <p className="text-muted-foreground">
                      Chủ tài khoản:{" "}
                      <span className="font-medium">{b.owner}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Số tài khoản:{" "}
                      <span className="font-mono">{b.account}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Chi nhánh: {b.branch}
                    </p>
                    {b.note && (
                      <p className="mt-1 text-muted-foreground">
                        Ghi chú: {b.note}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step3ConfirmPayment({
  payerParty,
  payerPerson,
  receiverParty,
  receiverPerson,
  purpose,
  content,
  items,
  totalAmount,
  voucherTitle,
  voucherNo,
  voucherDate,
  method,
  bank,
  bankNote,
}: {
  payerParty: Partner | null;
  payerPerson: Person | null;
  receiverParty: Partner | null;
  receiverPerson: Person | null;
  purpose: string;
  content: string;
  items: LineItem[];
  totalAmount: number;
  voucherTitle: string;
  voucherNo: string;
  voucherDate: string;
  method: string;
  bank: BankAccount | null;
  bankNote: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Thông tin đối tượng chi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p>
                Đối tượng chi:{" "}
                <span className="font-semibold">{payerParty?.name || "-"}</span>
              </p>
              <p>
                Người chi:{" "}
                <span className="font-semibold">
                  {payerPerson?.name || "-"}
                </span>
              </p>
              <p>
                SĐT người chi:{" "}
                <span className="font-semibold">
                  {payerPerson?.phone || "-"}
                </span>
              </p>
              <p>
                Email người chi:{" "}
                <span className="font-semibold">
                  {payerPerson?.email || "-"}
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p>
                Đối tượng nhận:{" "}
                <span className="font-semibold">
                  {receiverParty?.name || "-"}
                </span>
              </p>
              <p>
                Người nhận:{" "}
                <span className="font-semibold">
                  {receiverPerson?.name || "-"}
                </span>
              </p>
              <p>
                SĐT người nhận:{" "}
                <span className="font-semibold">
                  {receiverPerson?.phone || "-"}
                </span>
              </p>
              <p>
                Email người nhận:{" "}
                <span className="font-semibold">
                  {receiverPerson?.email || "-"}
                </span>
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p>
                Mục đích chi:{" "}
                <span className="font-semibold">{purpose || "-"}</span>
              </p>
            </div>
            <div className="space-y-1">
              <p>Nội dung:</p>
              <p className="rounded-md bg-muted/50 p-2 text-sm">
                {content || "-"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Danh sách chứng từ chi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <p className="font-semibold text-foreground">Khoản chi</p>
            <p className="text-xs text-muted-foreground">Danh sách diễn giải</p>
            <div className="space-y-1">
              {items.map((item, index) => (
                <p key={item.id}>
                  {index + 1}. {item.description || "Chưa nhập nội dung"}{" "}
                  <span className="font-semibold text-red-600">
                    {typeof item.amount === "number"
                      ? `${item.amount.toLocaleString("vi-VN")} đ`
                      : ""}
                  </span>
                </p>
              ))}
            </div>
            <p className="mt-1 text-sm">
              Tổng tiền chi:{" "}
              <span className="font-semibold text-red-600">
                {totalAmount.toLocaleString("vi-VN")} đ
              </span>
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p>
                Tiêu đề: <span className="font-semibold">{voucherTitle}</span>
              </p>
              <p>
                Số phiếu chi: <span className="font-semibold">{voucherNo}</span>
              </p>
              <p>
                Ngày lập chứng từ:{" "}
                <span className="font-semibold">
                  {voucherDate
                    ? new Date(voucherDate).toLocaleString("vi-VN")
                    : "-"}
                </span>
              </p>
              <p>
                Hình thức chi:{" "}
                <span className="font-semibold">
                  {method === "cash"
                    ? "Tiền mặt"
                    : method === "transfer"
                    ? "Chuyển khoản"
                    : "Bù trừ công nợ"}
                </span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Thông tin tài khoản thanh toán</p>
              {bank ? (
                <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-xs">
                  <Avatar className="h-10 w-10 border bg-background">
                    {bank.avatar && (
                      <AvatarImage
                        src={bank.avatar}
                        alt={bank.name}
                        className="object-contain"
                      />
                    )}
                    <AvatarFallback className="text-[11px] font-semibold">
                      {getInitials(bank.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-semibold text-foreground">
                      {bank.name}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Chủ tài khoản:</span>{" "}
                      {bank.owner}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Số tài khoản:</span>{" "}
                      {bank.account}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium">Chi nhánh:</span>{" "}
                      {bank.branch}
                    </p>
                    {bankNote && (
                      <p className="text-muted-foreground">
                        <span className="font-medium">Ghi chú:</span> {bankNote}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Không chọn tài khoản ngân hàng
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
