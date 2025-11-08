"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Circle,
  Leaf,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";

import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Supplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  taxCode?: string;
  tags?: string[];
  note?: string;
};

type Material = {
  id: string;
  code: string;
  name: string;
  category: "phan-bon" | "thuoc-bvtv" | "thuc-an" | "khac";
  defaultUnit: string;
};

type LineItem = {
  id: string;
  materialId: string;
  materialName: string;
  unit: string;
  quantity: number | "";
  unitPrice: number | "";
};

const suppliers: Supplier[] = [
  {
    id: "s1",
    name: "Công ty TNHH Nông nghiệp Xanh",
    contact: "Nguyễn Văn A",
    phone: "0912345678",
    email: "contact@nongsanxanh.vn",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    taxCode: "0312345678",
    tags: ["Phân bón", "Thuốc BVTV"],
    note: "Đối tác vật tư chính cho vườn cây lâu năm.",
  },
  {
    id: "s2",
    name: "Công ty CP Vật tư Nông nghiệp Miền Tây",
    contact: "Trần Thị B",
    phone: "0987654321",
    email: "info@vatrumientay.vn",
    address: "Khu công nghiệp Trà Nóc, Cần Thơ",
    tags: ["Thức ăn gia súc", "Cám hỗn hợp"],
  },
  {
    id: "s3",
    name: "Nhà cung cấp Thuốc BVTV An Toàn",
    contact: "Lê Văn C",
    phone: "0934567890",
    email: "support@antoanbvtv.vn",
    address: "Thủ Dầu Một, Bình Dương",
    tags: ["Thuốc BVTV"],
    note: "Chỉ cung cấp các dòng thuốc đạt chuẩn VietGAP.",
  },
];

const materials: Material[] = [
  {
    id: "m1",
    code: "PB-NPK-16168",
    name: "Phân NPK 16-16-8",
    category: "phan-bon",
    defaultUnit: "Bao (50kg)",
  },
  {
    id: "m2",
    code: "PB-HUUCO-01",
    name: "Phân hữu cơ vi sinh",
    category: "phan-bon",
    defaultUnit: "Bao (25kg)",
  },
  {
    id: "m3",
    code: "BVTV-SAU-01",
    name: "Thuốc trừ sâu sinh học",
    category: "thuoc-bvtv",
    defaultUnit: "Chai (1 lít)",
  },
  {
    id: "m4",
    code: "TA-BEBO-01",
    name: "Thức ăn hỗn hợp cho bò sữa",
    category: "thuc-an",
    defaultUnit: "Bao (40kg)",
  },
  {
    id: "m5",
    code: "TA-BEBO-02",
    name: "Thức ăn tinh cho bò vỗ béo",
    category: "thuc-an",
    defaultUnit: "Bao (25kg)",
  },
];

function createEmptyLine(): LineItem {
  return {
    id: crypto.randomUUID(),
    materialId: "",
    materialName: "",
    unit: "",
    quantity: "",
    unitPrice: "",
  };
}

function formatCurrency(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

export default function AddOrdersPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedSupplierId, setSelectedSupplierId] = useState<string>("s1");
  const [supplierSearch, setSupplierSearch] = useState("");

  const [orderNo, setOrderNo] = useState("PO-AGRI-0001");
  const [orderDate, setOrderDate] = useState("2025-11-08");
  const [expectedDate, setExpectedDate] = useState("2025-11-15");
  const [deliveryPlace, setDeliveryPlace] = useState(
    "Kho vật tư trang trại – Ấp 3, Xã Tân Lập, Huyện X, Tỉnh Y"
  );
  const [note, setNote] = useState(
    "Đơn mua vật tư phục vụ vụ mùa sầu riêng 2025–2026."
  );

  const [items, setItems] = useState<LineItem[]>([
    {
      id: crypto.randomUUID(),
      materialId: "m1",
      materialName: "Phân NPK 16-16-8",
      unit: "Bao (50kg)",
      quantity: 100,
      unitPrice: 350000,
    },
    {
      id: crypto.randomUUID(),
      materialId: "m3",
      materialName: "Thuốc trừ sâu sinh học",
      unit: "Chai (1 lít)",
      quantity: 50,
      unitPrice: 180000,
    },
  ]);

  const [vatRate, setVatRate] = useState("10");
  const [discount, setDiscount] = useState<string>("0");

  const selectedSupplier = useMemo(
    () => suppliers.find((s) => s.id === selectedSupplierId) || null,
    [selectedSupplierId]
  );

  const filteredSuppliers = useMemo(
    () =>
      suppliers.filter((s) =>
        s.name.toLowerCase().includes(supplierSearch.toLowerCase())
      ),
    [supplierSearch]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, line) => {
        if (
          typeof line.quantity === "number" &&
          typeof line.unitPrice === "number"
        ) {
          return sum + line.quantity * line.unitPrice;
        }
        return sum;
      }, 0),
    [items]
  );

  const vatAmount = useMemo(() => {
    const rate = Number(vatRate) || 0;
    return (subtotal * rate) / 100;
  }, [subtotal, vatRate]);

  const discountAmount = useMemo(() => {
    const d = Number(discount.replace(/\D/g, "")) || 0;
    return d;
  }, [discount]);

  const totalAmount = useMemo(
    () => subtotal + vatAmount - discountAmount,
    [subtotal, vatAmount, discountAmount]
  );

  const handleChangeMaterial = (id: string, materialId: string) => {
    const material = materials.find((m) => m.id === materialId);
    setItems((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              materialId,
              materialName: material ? material.name : "",
              unit: material ? material.defaultUnit : "",
            }
          : l
      )
    );
  };

  const handleChangeLine = (
    id: string,
    field: keyof Omit<LineItem, "id" | "materialId" | "materialName" | "unit">,
    value: string
  ) => {
    setItems((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              [field]:
                field === "quantity" || field === "unitPrice"
                  ? value === ""
                    ? ""
                    : Number(value.replace(/\D/g, ""))
                  : value,
            }
          : l
      )
    );
  };

  const handleAddLine = () => {
    setItems((prev) => [...prev, createEmptyLine()]);
  };

  const handleRemoveLine = (id: string) => {
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((l) => l.id !== id)
    );
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
      {/* Header + Stepper */}
      <header className="flex flex-col gap-3 rounded-lg border bg-card px-4 py-3 md:flex-row md:items-center md:justify-between">
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
              Đơn mua vật tư nông nghiệp
            </h1>
            <p className="text-xs text-muted-foreground">
              Quản lý đầy đủ thông tin nhà cung cấp, vật tư và giá trị đơn hàng.
            </p>
          </div>
        </div>
        <Stepper step={step} />
      </header>

      {step === 1 && (
        <Step1Supplier
          supplierSearch={supplierSearch}
          setSupplierSearch={setSupplierSearch}
          suppliers={filteredSuppliers}
          selectedSupplierId={selectedSupplierId}
          setSelectedSupplierId={setSelectedSupplierId}
          orderNo={orderNo}
          setOrderNo={setOrderNo}
          orderDate={orderDate}
          setOrderDate={setOrderDate}
          expectedDate={expectedDate}
          setExpectedDate={setExpectedDate}
          deliveryPlace={deliveryPlace}
          setDeliveryPlace={setDeliveryPlace}
          note={note}
          setNote={setNote}
        />
      )}

      {step === 2 && (
        <Step2Items
          items={items}
          onChangeMaterial={handleChangeMaterial}
          onChangeLine={handleChangeLine}
          onAddLine={handleAddLine}
          onRemoveLine={handleRemoveLine}
          subtotal={subtotal}
          vatRate={vatRate}
          setVatRate={setVatRate}
          discount={discount}
          setDiscount={setDiscount}
          vatAmount={vatAmount}
          totalAmount={totalAmount}
        />
      )}

      {step === 3 && (
        <Step3Confirm
          supplier={selectedSupplier}
          orderNo={orderNo}
          orderDate={orderDate}
          expectedDate={expectedDate}
          deliveryPlace={deliveryPlace}
          note={note}
          items={items}
          subtotal={subtotal}
          vatAmount={vatAmount}
          discountAmount={discountAmount}
          totalAmount={totalAmount}
          vatRate={vatRate}
        />
      )}

      {/* Footer actions */}
      <div className="my-2 flex justify-between border-t pt-4">
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
          className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
          onClick={handleNext}
        >
          {step === 3 ? "Hoàn thành & Lưu đơn" : "Tiếp theo"}
        </Button>
      </div>
    </div>
  );
}

/* 🧩 Stepper */
function Stepper({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { id: 1, label: "Nhà cung cấp & thông tin đơn" },
    { id: 2, label: "Danh sách vật tư & giá trị" },
    { id: 3, label: "Xác nhận đơn mua" },
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
              <div className="hidden h-px flex-1 bg-emerald-500/70 md:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* 🧩 Step 1 – Nhà cung cấp + thông tin đơn */
function Step1Supplier({
  supplierSearch,
  setSupplierSearch,
  suppliers,
  selectedSupplierId,
  setSelectedSupplierId,
  orderNo,
  setOrderNo,
  orderDate,
  setOrderDate,
  expectedDate,
  setExpectedDate,
  deliveryPlace,
  setDeliveryPlace,
  note,
  setNote,
}: {
  supplierSearch: string;
  setSupplierSearch: (v: string) => void;
  suppliers: Supplier[];
  selectedSupplierId: string;
  setSelectedSupplierId: (id: string) => void;
  orderNo: string;
  setOrderNo: (v: string) => void;
  orderDate: string;
  setOrderDate: (v: string) => void;
  expectedDate: string;
  setExpectedDate: (v: string) => void;
  deliveryPlace: string;
  setDeliveryPlace: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Chọn nhà cung cấp
            <Building2 className="h-4 w-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Tìm nhà cung cấp vật tư..."
            value={supplierSearch}
            onChange={(e) => setSupplierSearch(e.target.value)}
            className="h-9"
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {suppliers.map((s) => {
              const selected = s.id === selectedSupplierId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSupplierId(s.id)}
                  className={`group flex h-full flex-col rounded-xl border bg-card/80 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-md ${
                    selected
                      ? "border-primary ring-1 ring-primary/40"
                      : "border-border"
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        {s.name}
                      </p>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-700">
                        Nhà cung cấp vật tư
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.tags && s.tags.length > 0 && (
                        <Badge
                          variant="outline"
                          className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700"
                        >
                          Ưu tiên
                        </Badge>
                      )}
                      {selected ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground group-hover:text-primary/70" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>
                      Người liên hệ:{" "}
                      <span className="font-medium">{s.contact}</span>
                    </p>
                    <p>
                      SĐT: <span className="font-medium">{s.phone}</span>
                    </p>
                    <p>Email: {s.email}</p>
                    <p className="line-clamp-2">Địa chỉ: {s.address}</p>
                    {s.taxCode && <p>Mã số thuế: {s.taxCode}</p>}
                    {s.tags && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {s.tags.map((t) => (
                          <Badge
                            key={t}
                            variant="outline"
                            className="border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700"
                          >
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {s.note && (
                      <p className="mt-1 text-[11px] italic text-muted-foreground">
                        {s.note}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
            {suppliers.length === 0 && (
              <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed bg-muted/40 px-4 py-10 text-sm text-muted-foreground">
                Không tìm thấy nhà cung cấp phù hợp.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Thông tin đơn mua vật tư
            <Leaf className="h-4 w-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">Số đơn mua</span>
              <Input
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                className="mt-1 h-9"
              />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                Ngày lập đơn
              </span>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="h-9"
                />
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">
                Ngày dự kiến nhận hàng
              </span>
              <div className="mt-1 flex items-center gap-2">
                <Input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="h-9"
                />
                <Truck className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">
                Địa điểm giao hàng
              </span>
              <Textarea
                value={deliveryPlace}
                onChange={(e) => setDeliveryPlace(e.target.value)}
                className="mt-1 min-h-[72px] text-sm"
                placeholder="Nhập địa chỉ kho / khu vực nhận vật tư..."
              />
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Ghi chú</span>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1 min-h-[72px] text-sm"
                placeholder="Ghi chú thêm về yêu cầu giao hàng, chất lượng vật tư..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* 🧩 Step 2 – Danh sách vật tư & giá trị */
function Step2Items({
  items,
  onChangeMaterial,
  onChangeLine,
  onAddLine,
  onRemoveLine,
  subtotal,
  vatRate,
  setVatRate,
  discount,
  setDiscount,
  vatAmount,
  totalAmount,
}: {
  items: LineItem[];
  onChangeMaterial: (id: string, materialId: string) => void;
  onChangeLine: (
    id: string,
    field: "quantity" | "unitPrice",
    value: string
  ) => void;
  onAddLine: () => void;
  onRemoveLine: (id: string) => void;
  subtotal: number;
  vatRate: string;
  setVatRate: (v: string) => void;
  discount: string;
  setDiscount: (v: string) => void;
  vatAmount: number;
  totalAmount: number;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            Danh sách vật tư
            <Leaf className="h-4 w-4 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="hidden rounded-md bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground md:block">
            <div className="grid grid-cols-[1.6fr,0.8fr,0.6fr,0.9fr,0.9fr,40px] gap-3">
              <span>Tên vật tư</span>
              <span>Mã / Đơn vị</span>
              <span className="text-right">Số lượng</span>
              <span className="text-right">Đơn giá</span>
              <span className="text-right">Thành tiền</span>
              <span />
            </div>
          </div>

          <div className="space-y-3">
            {items.map((line) => {
              const material = materials.find((m) => m.id === line.materialId);
              const lineTotal =
                typeof line.quantity === "number" &&
                typeof line.unitPrice === "number"
                  ? line.quantity * line.unitPrice
                  : 0;

              return (
                <div
                  key={line.id}
                  className="grid gap-2 rounded-lg border bg-card/80 p-3 text-xs shadow-sm md:grid-cols-[1.6fr,0.8fr,0.6fr,0.9fr,0.9fr,40px]"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">
                      Vật tư
                    </span>
                    <Select
                      value={line.materialId}
                      onValueChange={(v) => onChangeMaterial(line.id, v)}
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Chọn vật tư" />
                      </SelectTrigger>
                      <SelectContent>
                        {materials.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">
                      Mã / Đơn vị
                    </span>
                    <div className="rounded border bg-muted/40 px-2 py-1 text-[11px] text-muted-foreground">
                      {material ? (
                        <>
                          <span className="font-medium">{material.code}</span> ·{" "}
                          <span>{material.defaultUnit}</span>
                        </>
                      ) : (
                        <span>Chưa chọn vật tư</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">
                      Số lượng
                    </span>
                    <Input
                      inputMode="numeric"
                      value={
                        line.quantity === "" ? "" : line.quantity.toString()
                      }
                      onChange={(e) =>
                        onChangeLine(line.id, "quantity", e.target.value)
                      }
                      className="h-8 text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">
                      Đơn giá
                    </span>
                    <Input
                      inputMode="numeric"
                      value={
                        line.unitPrice === ""
                          ? ""
                          : line.unitPrice.toLocaleString("vi-VN")
                      }
                      onChange={(e) =>
                        onChangeLine(line.id, "unitPrice", e.target.value)
                      }
                      className="h-8 text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground">
                      Thành tiền
                    </span>
                    <div className="flex h-8 items-center justify-end rounded border bg-muted/40 px-2 font-semibold text-emerald-700">
                      {lineTotal > 0 ? formatCurrency(lineTotal) : "-"}
                    </div>
                  </div>

                  <div className="flex items-end justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => onRemoveLine(line.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddLine}
              className="border-dashed"
            >
              <Plus className="mr-1 h-4 w-4" />
              Thêm dòng vật tư
            </Button>
            <div className="text-sm">
              <span className="mr-2 text-muted-foreground">Tổng tạm tính</span>
              <span className="text-lg font-bold text-emerald-600">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Thuế, chiết khấu & tổng giá trị đơn
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[1.3fr,1fr] text-sm">
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <span className="text-xs text-muted-foreground">
                  Thuế VAT (%)
                </span>
                <Select value={vatRate} onValueChange={setVatRate}>
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue placeholder="Chọn VAT" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                    <SelectItem value="8">8%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Chiết khấu (VND)
                </span>
                <Input
                  value={discount}
                  onChange={(e) =>
                    setDiscount(e.target.value.replace(/\D/g, ""))
                  }
                  className="mt-1 h-9 text-right"
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Ghi chú: Chiết khấu áp dụng trên tổng giá trị tạm tính trước VAT.
            </p>
          </div>

          <div className="space-y-2 rounded-lg border bg-muted/40 p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tạm tính</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Thuế VAT ({vatRate}%)
              </span>
              <span className="font-medium">{formatCurrency(vatAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Chiết khấu</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(0)}
              </span>
            </div>
            <div className="my-1 border-t" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Tổng giá trị đơn</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* 🧩 Step 3 – Xác nhận */
function Step3Confirm({
  supplier,
  orderNo,
  orderDate,
  expectedDate,
  deliveryPlace,
  note,
  items,
  subtotal,
  vatAmount,
  discountAmount,
  totalAmount,
  vatRate,
}: {
  supplier: Supplier | null;
  orderNo: string;
  orderDate: string;
  expectedDate: string;
  deliveryPlace: string;
  note: string;
  items: LineItem[];
  subtotal: number;
  vatAmount: number;
  discountAmount: number;
  totalAmount: number;
  vatRate: string;
}) {
  return (
    <div className="flex flex-col gap-6 text-sm">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Thông tin tổng quan đơn mua
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p>
              Số đơn mua:{" "}
              <span className="font-semibold">{orderNo || "-"}</span>
            </p>
            <p>
              Ngày lập đơn:{" "}
              <span className="font-semibold">
                {orderDate
                  ? new Date(orderDate).toLocaleDateString("vi-VN")
                  : "-"}
              </span>
            </p>
            <p>
              Ngày dự kiến nhận hàng:{" "}
              <span className="font-semibold">
                {expectedDate
                  ? new Date(expectedDate).toLocaleDateString("vi-VN")
                  : "-"}
              </span>
            </p>
          </div>
          <div className="space-y-1">
            <p>
              Nhà cung cấp:{" "}
              <span className="font-semibold">
                {supplier?.name || "Chưa chọn"}
              </span>
            </p>
            <p>
              Người liên hệ:{" "}
              <span className="font-semibold">{supplier?.contact || "-"}</span>
            </p>
            <p>
              SĐT:{" "}
              <span className="font-semibold">{supplier?.phone || "-"}</span>
            </p>
            <p>
              Email:{" "}
              <span className="font-semibold">{supplier?.email || "-"}</span>
            </p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p>
              Địa điểm giao hàng:{" "}
              <span className="font-semibold">{deliveryPlace || "-"}</span>
            </p>
            <p>Ghi chú:</p>
            <p className="rounded-md bg-muted/50 p-2 text-sm">
              {note || "Không có ghi chú."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Chi tiết vật tư & giá trị đơn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="hidden rounded-md bg-muted/60 px-3 py-2 text-[11px] text-muted-foreground md:grid md:grid-cols-[1.6fr,0.6fr,0.6fr,0.9fr,0.9fr] md:gap-3">
            <span>Vật tư</span>
            <span className="text-right">Số lượng</span>
            <span>Đơn vị</span>
            <span className="text-right">Đơn giá</span>
            <span className="text-right">Thành tiền</span>
          </div>

          <div className="space-y-2">
            {items.map((l, idx) => {
              const lineTotal =
                typeof l.quantity === "number" &&
                typeof l.unitPrice === "number"
                  ? l.quantity * l.unitPrice
                  : 0;

              return (
                <div
                  key={l.id}
                  className="grid gap-2 rounded-lg border bg-card/80 p-3 text-xs shadow-sm md:grid-cols-[1.6fr,0.6fr,0.6fr,0.9fr,0.9fr]"
                >
                  <div>
                    <p className="font-semibold">
                      {idx + 1}. {l.materialName || "Chưa chọn vật tư"}
                    </p>
                  </div>
                  <div className="md:text-right">
                    Số lượng:{" "}
                    <span className="font-semibold">
                      {typeof l.quantity === "number" ? l.quantity : "-"}
                    </span>
                  </div>
                  <div>Đơn vị: {l.unit || "-"}</div>
                  <div className="md:text-right">
                    Đơn giá:{" "}
                    {typeof l.unitPrice === "number"
                      ? formatCurrency(l.unitPrice)
                      : "-"}
                  </div>
                  <div className="md:text-right">
                    Thành tiền:{" "}
                    <span className="font-semibold text-emerald-700">
                      {lineTotal > 0 ? formatCurrency(lineTotal) : "-"}
                    </span>
                  </div>
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-6 text-center text-sm text-muted-foreground">
                Chưa có dòng vật tư nào.
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-2 rounded-lg border bg-muted/40 p-3 text-sm md:w-80 md:ml-auto">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tạm tính</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Thuế VAT ({vatRate}%)
              </span>
              <span className="font-medium">{formatCurrency(vatAmount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Chiết khấu</span>
              <span className="font-medium text-red-600">
                -{formatCurrency(discountAmount)}
              </span>
            </div>
            <div className="my-1 border-t" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Tổng giá trị đơn</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
