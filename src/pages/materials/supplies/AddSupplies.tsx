"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Sprout,
  Droplets,
  Wheat,
  Package2,
  Boxes,
  Building2,
  AlertTriangle,
  Plus,
  X,
  Truck,
  ImageIcon,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

type MaterialCategory =
  | "phan-bon"
  | "thuoc-bvtv"
  | "giong"
  | "thuc-an"
  | "vat-tu-khac";
type SupplierRow = {
  id: string;
  supplierId: string;
  minOrderQty: string;
  unit: string;
  packing: string;
};
type SupplierOption = {
  id: string;
  name: string;
  defaultUnit: string;
  defaultPacking: string;
};
const warehouses = [
  "Kho vật tư trung tâm",
  "Kho vật tư trại sầu riêng",
  "Kho thức ăn trại bò sữa",
  "Vườn ươm giống",
];
const supplierOptions: SupplierOption[] = [
  {
    id: "s1",
    name: "Công ty phân bón Miền Tây",
    defaultUnit: "Bao 50kg",
    defaultPacking: "Bao 50kg / bao",
  },
  {
    id: "s2",
    name: "Nhà cung cấp thuốc BVTV Xanh",
    defaultUnit: "Chai 1L",
    defaultPacking: "Thùng 12 chai x 1L",
  },
  {
    id: "s3",
    name: "Công ty giống cây trồng Việt",
    defaultUnit: "Khay 104 lỗ",
    defaultPacking: "Xe 50 khay / chuyến",
  },
];
export default function AddSuppliesPage() {
  const navigate = useNavigate();

  const [code, setCode] = useState("VT-0009");
  const [name, setName] = useState("Phân bón NPK 20-20-15+TE");
  const [category, setCategory] = useState<MaterialCategory>("phan-bon");
  const [unit, setUnit] = useState("Bao 50kg");
  const [isActive, setIsActive] = useState(true);

  const [warehouse, setWarehouse] = useState(warehouses[0]);
  const [location, setLocation] = useState("Kệ A2-01");
  const [minQty, setMinQty] = useState("50");
  const [reorderQty, setReorderQty] = useState("100");
  const [initStock, setInitStock] = useState("0");
  const [avgCost, setAvgCost] = useState("450000");
  const [supplierRows, setSupplierRows] = useState<SupplierRow[]>([
    {
      id: crypto.randomUUID(),
      supplierId: "s1",
      minOrderQty: "50",
      unit: "Bao 50kg",
      packing: "Bao 50kg / bao",
    },
  ]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [supplierName, setSupplierName] = useState("Công ty phân bón Miền Tây");
  const [supplierCode, setSupplierCode] = useState("NCC-PB-001");
  const [note, setNote] = useState(
    "Phân bón chuyên dùng cho giai đoạn nuôi trái, phù hợp cây ăn trái lâu năm."
  );

  const handleSave = () => {
    // TODO: call API
    console.log("Saving material:", {
      code,
      name,
      category,
      unit,
      isActive,
      warehouse,
      location,
      minQty,
      reorderQty,
      initStock,
      avgCost,
      supplierName,
      supplierCode,
      note,
    });
    navigate(-1);
  };
  const updateSupplierRow = (
    id: string,
    field: keyof SupplierRow,
    value: string
  ) => {
    setSupplierRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;

        if (field === "supplierId") {
          const supplier = supplierOptions.find((s) => s.id === value);
          return {
            ...row,
            supplierId: value,
            unit: supplier?.defaultUnit ?? row.unit,
            packing: supplier?.defaultPacking ?? row.packing,
          };
        }

        return { ...row, [field]: value };
      })
    );
  };

  const addSupplierRow = () => {
    const first = supplierOptions[0];
    setSupplierRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        supplierId: first?.id ?? "",
        minOrderQty: "",
        unit: first?.defaultUnit ?? "",
        packing: first?.defaultPacking ?? "",
      },
    ]);
  };
  const removeSupplierRow = (id: string) => {
    setSupplierRows((prev) => prev.filter((r) => r.id !== id));
  };
  const handleCancel = () => navigate(-1);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const clearImage = () => {
    setImagePreview(null);
  };
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={handleCancel}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Thêm mới vật tư nông nghiệp
            </h1>
            <p className="text-xs text-muted-foreground">
              Khai báo vật tư để sử dụng cho mua hàng, xuất kho, sản xuất và
              theo dõi tồn kho.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Hủy bỏ
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
            onClick={handleSave}
          >
            Lưu vật tư
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[2fr,1.5fr]">
        {/* Cột trái – Thông tin chính */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              Thông tin vật tư
              <Badge variant="outline" className="text-[11px]">
                Thông tin bắt buộc
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Mã vật tư <span className="text-red-500">*</span>
                </p>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-9"
                  placeholder="VD: VT-0009"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Mã dùng chung trên toàn hệ thống.
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Tên vật tư <span className="text-red-500">*</span>
                </p>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9"
                  placeholder="VD: Phân bón NPK, Thuốc BVTV, Cây giống..."
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Hashtag <span className="text-red-500">*</span>
                </p>
                <Select>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn hashtag" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Sử dụng thường xuyên", "Sử dụng cho mùa hè"].map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs text-muted-foreground">
                Nhóm vật tư <span className="text-red-500">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <CategoryChip
                  active={category === "phan-bon"}
                  icon={<Sprout className="mr-1 h-4 w-4" />}
                  label="Phân bón"
                  onClick={() => setCategory("phan-bon")}
                />
                <CategoryChip
                  active={category === "thuoc-bvtv"}
                  icon={<Droplets className="mr-1 h-4 w-4" />}
                  label="Thuốc BVTV"
                  onClick={() => setCategory("thuoc-bvtv")}
                />

                <CategoryChip
                  active={category === "thuc-an"}
                  icon={<Package2 className="mr-1 h-4 w-4" />}
                  label="Thức ăn"
                  onClick={() => setCategory("thuc-an")}
                />
                <CategoryChip
                  active={category === "vat-tu-khac"}
                  icon={<Boxes className="mr-1 h-4 w-4" />}
                  label="Vật tư khác"
                  onClick={() => setCategory("vat-tu-khac")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md border bg-muted/40 px-3 py-2">
              <div>
                <p className="text-xs font-medium">Trạng thái sử dụng</p>
                <p className="text-[11px] text-muted-foreground">
                  Tắt nếu vật tư không còn sử dụng nhưng muốn giữ lịch sử.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {isActive ? "Đang sử dụng" : "Ngừng sử dụng"}
                </span>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>
            {category === "phan-bon" && (
              <div>
                <p className="mb-1 text-xs text-muted-foreground">
                  Hàm lượng dinh dưỡng
                </p>
                <Textarea
                  className="min-h-[80px]"
                  placeholder="Mô tả hàm lượng dinh dưỡng: NPK 16-16-8"
                />
              </div>
            )}
            {category === "thuoc-bvtv" && (
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Công thức hoạt chất
                  </p>
                  <Textarea
                    className="min-h-[80px]"
                    placeholder="Mô tả công thức hoạt chất: Azadirachtin 0.15%,.."
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Công dụng
                  </p>
                  <Textarea
                    className="min-h-[80px]"
                    placeholder="Mô tả công dụng hoạt chất: Phòng và trị sâu cuốn lá, rệp sáp, bọ trĩ"
                  />
                </div>
              </div>
            )}
            <div>
              <p className="mb-1 text-xs text-muted-foreground">Ghi chú</p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px]"
                placeholder="Mô tả chi tiết công dụng, lưu ý khi bảo quản, sử dụng..."
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              Hình ảnh vật tư
              <ImageIcon className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-xs text-muted-foreground">
              Thêm ảnh đại diện vật tư để dễ nhận diện trong kho, đơn mua, phiếu
              xuất.
            </p>

            <div className="grid gap-3 md:grid-cols-[220px,1fr]">
              {/* Ô preview */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 p-3">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Ảnh vật tư"
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="absolute right-2 top-2 h-7 w-7 border border-red-200 bg-white/80 text-red-600 hover:bg-red-50"
                      onClick={clearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center text-xs text-muted-foreground">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <ImageIcon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">
                      Chưa có hình ảnh
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Nên dùng hình chụp bao bì hoặc nhãn mác vật tư thực tế.
                    </p>
                  </div>
                )}
              </div>

              {/* Ô chọn file */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  Tải lên ảnh vật tư
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    id="material-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      const input = document.getElementById(
                        "material-image"
                      ) as HTMLInputElement | null;
                      input?.click();
                    }}
                  >
                    <ImageIcon className="h-4 w-4" />
                    Chọn ảnh từ máy
                  </Button>
                  {imagePreview && (
                    <span className="text-[11px] text-muted-foreground">
                      Đã chọn 1 ảnh
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Hỗ trợ file JPG, PNG. Dung lượng đề xuất &lt; 2MB. Tỉ lệ vuông
                  (1:1) sẽ hiển thị đẹp nhất.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Cột phải – Tồn kho & Nhà cung cấp */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                Thiết lập tồn kho
                <Badge variant="outline" className="text-[11px]">
                  Kho & định mức
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Kho mặc định <span className="text-red-500">*</span>
                  </p>
                  <Select value={warehouse} onValueChange={setWarehouse}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Chọn kho" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Vị trí trong kho
                  </p>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-9"
                    placeholder="VD: Kệ A2-01, Luống G1..."
                  />
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Tồn tối thiểu
                  </p>
                  <Input
                    inputMode="numeric"
                    value={minQty}
                    onChange={(e) =>
                      setMinQty(e.target.value.replace(/\D/g, ""))
                    }
                    className="h-9 text-right"
                  />
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    Cảnh báo khi tồn kho thấp hơn mức này.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Số lượng nhập lại (gợi ý)
                  </p>
                  <Input
                    inputMode="numeric"
                    value={reorderQty}
                    onChange={(e) =>
                      setReorderQty(e.target.value.replace(/\D/g, ""))
                    }
                    className="h-9 text-right"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Dùng để gợi ý số lượng khi lập đơn mua.
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Tồn ban đầu
                  </p>
                  <Input
                    inputMode="numeric"
                    value={initStock}
                    onChange={(e) =>
                      setInitStock(e.target.value.replace(/\D/g, ""))
                    }
                    className="h-9 text-right"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Dùng khi bắt đầu quản lý trên hệ thống.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs text-muted-foreground">
                    Giá vốn bình quân (ước tính)
                  </p>
                  <Input
                    inputMode="numeric"
                    value={avgCost}
                    onChange={(e) =>
                      setAvgCost(e.target.value.replace(/\D/g, ""))
                    }
                    className="h-9 text-right"
                  />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Dùng để ước tính giá trị tồn ban đầu.
                  </p>
                </div>
                <div className="flex items-end justify-between rounded-md bg-muted/40 px-3 py-2 text-xs">
                  <div>
                    <p className="font-semibold text-muted-foreground">
                      Giá trị tồn ước tính
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Tồn ban đầu x Giá vốn bình quân
                    </p>
                  </div>
                  <p className="text-sm font-bold text-emerald-700">
                    {(() => {
                      const qty = Number(initStock || "0");
                      const cost = Number(avgCost || "0");
                      return (qty * cost).toLocaleString("vi-VN") + " đ";
                    })()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                Nhà cung cấp & quy cách đặt hàng
                <Truck className="h-4 w-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-xs text-muted-foreground">
                Khai báo nhiều nhà cung cấp cho cùng một vật tư. Mỗi nhà cung
                cấp có thể có{" "}
                <span className="font-semibold">số lượng tối thiểu</span>,{" "}
                <span className="font-semibold">đơn vị đặt hàng</span> và{" "}
                <span className="font-semibold">quy cách đóng gói</span> khác
                nhau.
              </p>

              <div className="space-y-3">
                {supplierRows.map((row, index) => (
                  <div
                    key={row.id}
                    className="rounded-lg border bg-muted/40 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between text-xs">
                      <p className="font-semibold text-muted-foreground">
                        Nhà cung cấp #{index + 1}
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-red-600"
                        onClick={() => removeSupplierRow(row.id)}
                        disabled={supplierRows.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-[11px] text-muted-foreground">
                          Nhà cung cấp
                        </p>
                        <Select
                          value={row.supplierId}
                          onValueChange={(v) =>
                            updateSupplierRow(row.id, "supplierId", v)
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Chọn nhà cung cấp" />
                          </SelectTrigger>
                          <SelectContent>
                            {supplierOptions.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] text-muted-foreground">
                          Số lượng tối thiểu / đơn hàng
                        </p>
                        <Input
                          inputMode="numeric"
                          value={row.minOrderQty}
                          onChange={(e) =>
                            updateSupplierRow(
                              row.id,
                              "minOrderQty",
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          className="h-9 text-right"
                          placeholder="VD: 50"
                        />
                      </div>
                    </div>

                    <div className="mt-2 grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="mb-1 text-[11px] text-muted-foreground">
                          Đơn vị đặt hàng
                        </p>
                        <Input
                          value={row.unit}
                          onChange={(e) =>
                            updateSupplierRow(row.id, "unit", e.target.value)
                          }
                          className="h-9"
                          placeholder="VD: Bao 50kg, Chai 1L..."
                        />
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] text-muted-foreground">
                          Quy cách đóng gói
                        </p>
                        <Input
                          value={row.packing}
                          onChange={(e) =>
                            updateSupplierRow(row.id, "packing", e.target.value)
                          }
                          className="h-9"
                          placeholder="VD: Thùng 12 chai x 1L, Pallet 50 bao..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-dashed"
                onClick={addSupplierRow}
              >
                <Plus className="mr-1 h-4 w-4" />
                Thêm nhà cung cấp
              </Button>

              <p className="text-[11px] text-muted-foreground">
                Giá mua theo từng nhà cung cấp có thể quản lý ở màn hình{" "}
                <span className="font-semibold">giá mua / hợp đồng mua</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CategoryChip({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-muted-foreground/20 text-muted-foreground hover:border-primary/40 hover:text-primary"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
