"use client";

import { useMemo, useState } from "react";
import {
  FileDown,
  Filter,
  Leaf,
  Sprout,
  Plus,
  Search,
  Factory,
  Warehouse,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";

// ================== TYPES ==================

type Status = "active" | "warning" | "inactive";

type Pesticide = {
  id: string;
  code: string;
  name: string;
  group: string;
  typeCode: string;
  unit: string;
  registrationNo: string;
  manufacturer: string;
  origin: string;
  ingredient: string;
  crops: string[];
  hashtag: string[];
  reEntryHours: number; // thời gian cách ly lao động
  preHarvestDays: number; // thời gian cách ly thu hoạch
  description: string;
  guide: string;
  hazardLevel: "Thấp" | "Trung bình" | "Cao";
  stockQty: number;
  minStock: number;
  status: Status;
};

type Fertilizer = {
  id: string;
  code: string;
  name: string;
  type: "Vô cơ" | "Hữu cơ" | "Hữu cơ khoáng";
  form: "Hạt" | "Bột" | "Lỏng";
  nutrient: string;
  unit: string;
  dosage: string;
  applicationStage: string;
  crops: string[];
  manufacturer: string;
  origin: string;
  hashtag: string[];
  description?: string;
  stockQty: number;
  minStock: number;
  status: Status;
};

// ================== MOCK DATA ==================

const pesticides: Pesticide[] = [
  {
    id: "1",
    code: "BVTV001",
    name: "Thuốc trừ sâu SuperKiller",
    group: "Thuốc trừ sâu",
    typeCode: "INSECTICIDE",
    unit: "ml",
    registrationNo: "VN-1234-IK",
    manufacturer: "Công ty BVTV Miền Nam",
    origin: "Việt Nam",
    ingredient: "Chlorpyrifos Ethyl 500g/l + Cypermethrin 50g/l",
    crops: ["Lúa", "Ngô"],
    hashtag: ["trừ sâu cuốn lá", "rầy nâu"],
    reEntryHours: 24,
    preHarvestDays: 14,
    description: "Diệt trừ sâu cuốn lá, rầy nâu, tác dụng nhanh, ít tồn dư.",
    guide:
      "Pha 25ml cho bình 16L, phun đều lên lá vào sáng sớm hoặc chiều mát. Không phun khi trời mưa.",
    hazardLevel: "Trung bình",
    stockQty: 220,
    minStock: 100,
    status: "active",
  },
  {
    id: "2",
    code: "BVTV002",
    name: "Thuốc trừ bệnh BioShield",
    group: "Thuốc trừ bệnh",
    typeCode: "FUNGICIDE",
    unit: "g",
    registrationNo: "VN-5678-FG",
    manufacturer: "BioCare Japan",
    origin: "Nhật Bản",
    ingredient: "Copper Hydroxide 77%",
    crops: ["Thanh long", "Xoài"],
    hashtag: ["thán thư", "đốm lá"],
    reEntryHours: 12,
    preHarvestDays: 7,
    description: "Đặc trị nấm hại trên cây ăn quả, ít gây cháy lá.",
    guide:
      "Pha 20g/8L nước, phun ướt đều tán lá. Lặp lại sau 7–10 ngày khi áp lực bệnh cao.",
    hazardLevel: "Thấp",
    stockQty: 80,
    minStock: 120,
    status: "warning",
  },
  {
    id: "3",
    code: "BVTV003",
    name: "Thuốc trừ cỏ CleanField",
    group: "Thuốc trừ cỏ",
    typeCode: "HERBICIDE",
    unit: "ml",
    registrationNo: "VN-9999-HB",
    manufacturer: "AgriChem EU",
    origin: "Đức",
    ingredient: "Glyphosate 480g/l",
    crops: ["Cao su", "Cà phê"],
    hashtag: ["cỏ lá rộng", "cỏ lá hẹp"],
    reEntryHours: 48,
    preHarvestDays: 30,
    description: "Trừ cỏ phổ rộng, hiệu quả kéo dài, không tồn dư trong đất.",
    guide:
      "Pha 40–50ml/bình 16L, phun đều lên lá cỏ. Tránh phun chạm vào thân, lá cây trồng.",
    hazardLevel: "Cao",
    stockQty: 0,
    minStock: 50,
    status: "inactive",
  },
];

const fertilizers: Fertilizer[] = [
  {
    id: "1",
    code: "F001",
    name: "NPK 16-16-8 TE",
    type: "Vô cơ",
    form: "Hạt",
    nutrient: "NPK 16-16-8 + TE",
    unit: "kg",
    dosage: "300–500 kg/ha",
    applicationStage: "Bón lót & thúc sớm",
    crops: ["Lúa", "Cà phê", "Cao su"],
    manufacturer: "Công ty Phân bón Miền Nam",
    origin: "Việt Nam",
    hashtag: ["tăng trưởng", "ra rễ khỏe"],
    description:
      "Cân đối đạm – lân – kali, bổ sung vi lượng cho giai đoạn đầu.",
    stockQty: 550,
    minStock: 300,
    status: "active",
  },
  {
    id: "2",
    code: "F002",
    name: "Phân hữu cơ vi sinh BioFarm",
    type: "Hữu cơ",
    form: "Hạt",
    nutrient: "Hữu cơ 30% + Vi sinh",
    unit: "bao",
    dosage: "1–2 tấn/ha",
    applicationStage: "Bón cải tạo đất sau thu hoạch",
    crops: ["Thanh long", "Rau màu"],
    manufacturer: "Công ty Hữu cơ Việt",
    origin: "Việt Nam",
    hashtag: ["cải tạo đất", "tăng mùn"],
    description: "Tăng độ tơi xốp, cải thiện hệ vi sinh đất.",
    stockQty: 120,
    minStock: 150,
    status: "warning",
  },
  {
    id: "3",
    code: "F003",
    name: "Urê hạt trắng",
    type: "Vô cơ",
    form: "Hạt",
    nutrient: "Đạm 46%",
    unit: "kg",
    dosage: "150–300 kg/ha",
    applicationStage: "Bón thúc mạnh cho giai đoạn sinh trưởng thân lá",
    crops: ["Ngô", "Lúa"],
    manufacturer: "Đạm Phú Mỹ",
    origin: "Việt Nam",
    hashtag: ["tăng đạm", "xanh lá"],
    stockQty: 60,
    minStock: 80,
    status: "active",
  },
];

// ================== UI HELPERS ==================

function StatusBadge({ status }: { status: Status }) {
  if (status === "active")
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[11px]">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Đang kinh doanh
      </Badge>
    );
  if (status === "warning")
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[11px]">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Sắp hết hàng
      </Badge>
    );
  return (
    <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[11px]">
      <XCircle className="mr-1 h-3 w-3" />
      Ngừng sử dụng
    </Badge>
  );
}

function HazardBadge({ level }: { level: Pesticide["hazardLevel"] }) {
  const map = {
    Thấp: "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Trung bình": "bg-amber-50 text-amber-700 border-amber-200",
    Cao: "bg-red-50 text-red-700 border-red-200",
  } as const;
  return (
    <Badge className={`${map[level]} text-[11px]`}>Độc tính {level}</Badge>
  );
}

function StockBar({
  qty,
  min,
  unit,
}: {
  qty: number;
  min: number;
  unit: string;
}) {
  const ratio = Math.max(0, Math.min(1, qty / (min || 1)));
  const color =
    qty === 0 ? "bg-red-500" : ratio < 1 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          Tồn:{" "}
          <span className="font-semibold text-foreground">
            {qty.toLocaleString("vi-VN")} {unit}
          </span>
        </span>
        <span>Định mức: {min.toLocaleString("vi-VN")}</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted">
        <div
          className={`h-1.5 rounded-full ${color}`}
          style={{ width: `${Math.min(100, ratio * 100)}%` }}
        />
      </div>
    </div>
  );
}

// ================== PAGE ==================

export default function AgrilInputsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"pesticide" | "fertilizer">("pesticide");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [hazardFilter, setHazardFilter] = useState<string>("all");
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  // ===== SUMMARY =====
  const totalPesticides = pesticides.length;
  const totalFertilizers = fertilizers.length;
  const totalWarning =
    pesticides.filter((i) => i.status === "warning").length +
    fertilizers.filter((i) => i.status === "warning").length;
  const totalInactive =
    pesticides.filter((i) => i.status === "inactive").length +
    fertilizers.filter((i) => i.status === "inactive").length;

  // ===== COLUMNS =====
  const pesticideColumns: ColumnDef<Pesticide>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Chọn dòng"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "code", header: "Mã thuốc" },
    {
      accessorKey: "name",
      header: "Tên thuốc",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.name}</div>
          <div className="flex flex-wrap items-center gap-1">
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]"
            >
              {row.original.group}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-200 bg-slate-50 text-[11px]"
            >
              Đăng ký: {row.original.registrationNo}
            </Badge>
            <HazardBadge level={row.original.hazardLevel} />
          </div>
        </div>
      ),
    },
    {
      accessorKey: "ingredient",
      header: "Thành phần & hãng sản xuất",
      cell: ({ row }) => (
        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="line-clamp-2">{row.original.ingredient}</p>
          <p className="flex items-center gap-1">
            <Factory className="h-3 w-3" />
            {row.original.manufacturer} • {row.original.origin}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "crops",
      header: "Cây trồng áp dụng",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.crops.map((c) => (
            <Badge
              key={c}
              variant="outline"
              className="border-lime-200 bg-lime-50 text-lime-700 text-[11px]"
            >
              {c}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "hashtag",
      header: "Hashtag",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.hashtag.map((h) => (
            <Badge
              key={h}
              variant="outline"
              className="border-sky-200 bg-sky-50 text-sky-700 text-[10px]"
            >
              <Tag className="mr-1 h-3 w-3" />
              {h}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "unit",
      header: "ĐVT / Hạn cách ly",
      cell: ({ row }) => (
        <div className="text-xs">
          <p>ĐVT: {row.original.unit}</p>
          <p className="text-muted-foreground">
            NLĐ: {row.original.reEntryHours}h • Thu hoạch:{" "}
            {row.original.preHarvestDays} ngày
          </p>
        </div>
      ),
    },
    {
      accessorKey: "stockQty",
      header: "Tồn kho",
      cell: ({ row }) => (
        <StockBar
          qty={row.original.stockQty}
          min={row.original.minStock}
          unit={row.original.unit}
        />
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ];

  const fertilizerColumns: ColumnDef<Fertilizer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Chọn dòng"
        />
      ),
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "code", header: "Mã phân bón" },
    {
      accessorKey: "name",
      header: "Tên phân bón",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.original.name}</div>
          <div className="flex flex-wrap items-center gap-1">
            <Badge
              variant="outline"
              className={
                row.original.type === "Hữu cơ"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]"
                  : "border-sky-200 bg-sky-50 text-sky-700 text-[11px]"
              }
            >
              {row.original.type}
            </Badge>
            <Badge
              variant="outline"
              className="border-indigo-200 bg-indigo-50 text-indigo-700 text-[11px]"
            >
              Dạng {row.original.form}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "nutrient",
      header: "Thành phần dinh dưỡng",
      cell: ({ row }) => (
        <div className="space-y-1 text-xs">
          <p className="font-medium">{row.original.nutrient}</p>
          <p className="text-muted-foreground line-clamp-2">
            {row.original.description || "—"}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "applicationStage",
      header: "Giai đoạn bón",
      cell: ({ row }) => (
        <div className="text-xs">
          <p className="line-clamp-2">{row.original.applicationStage}</p>
          <p className="text-muted-foreground">Liều: {row.original.dosage}</p>
        </div>
      ),
    },
    {
      accessorKey: "crops",
      header: "Cây trồng",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.crops.map((c) => (
            <Badge
              key={c}
              variant="outline"
              className="border-lime-200 bg-lime-50 text-lime-700 text-[11px]"
            >
              {c}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "manufacturer",
      header: "Nhà sản xuất",
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            <Factory className="h-3 w-3" />
            {row.original.manufacturer}
          </p>
          <p>Xuất xứ: {row.original.origin}</p>
        </div>
      ),
    },
    {
      accessorKey: "hashtag",
      header: "Hashtag",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.hashtag.map((h) => (
            <Badge
              key={h}
              variant="outline"
              className="border-amber-200 bg-amber-50 text-amber-700 text-[10px]"
            >
              <Tag className="mr-1 h-3 w-3" />
              {h}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "stockQty",
      header: "Tồn kho",
      cell: ({ row }) => (
        <StockBar
          qty={row.original.stockQty}
          min={row.original.minStock}
          unit={row.original.unit}
        />
      ),
    },
  ];

  // ===== FILTERED DATA =====

  const filteredPesticides = useMemo(() => {
    return pesticides.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.manufacturer.toLowerCase().includes(q);
      const matchType =
        typeFilter === "all" ||
        p.group.toLowerCase() === typeFilter ||
        p.typeCode.toLowerCase() === typeFilter;
      const matchHazard =
        hazardFilter === "all" || p.hazardLevel.toLowerCase() === hazardFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchType && matchHazard && matchStatus;
    });
  }, [search, typeFilter, hazardFilter, statusFilter]);

  const filteredFertilizers = useMemo(() => {
    return fertilizers.filter((f) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        f.manufacturer.toLowerCase().includes(q);
      const matchType =
        typeFilter === "all" || f.type.toLowerCase() === typeFilter;
      const matchManufacturer =
        manufacturerFilter === "all" ||
        f.manufacturer.toLowerCase() === manufacturerFilter;
      const matchStatus = statusFilter === "all" || f.status === statusFilter;
      return matchSearch && matchType && matchManufacturer && matchStatus;
    });
  }, [search, typeFilter, manufacturerFilter, statusFilter]);

  const currentData =
    tab === "pesticide" ? filteredPesticides : filteredFertilizers;
  const currentColumns =
    tab === "pesticide" ? pesticideColumns : fertilizerColumns;

  // ================== RENDER ==================

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">
            Quản lý phân bón & thuốc bảo vệ thực vật
          </h1>
          <p className="text-xs text-muted-foreground">
            Theo dõi danh mục vật tư, tồn kho và trạng thái sử dụng cho sản xuất
            nông nghiệp.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-1 h-4 w-4" />
            Xuất file
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={() => navigate("/main/materials/supplies/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm mới
          </Button>
        </div>
      </header>
      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Thuốc BVTV đang quản lý"
          value={totalPesticides.toString()}
          icon={<Leaf className="h-5 w-5 text-emerald-600" />}
          color="text-emerald-600"
          sub="Số hoạt chất / thương phẩm trong danh mục"
        />
        <SummaryCard
          title="Phân bón đang quản lý"
          value={totalFertilizers.toString()}
          icon={<Sprout className="h-5 w-5 text-lime-600" />}
          color="text-lime-600"
          sub="Bao gồm vô cơ, hữu cơ, hữu cơ khoáng"
        />
        <SummaryCard
          title="Mã sắp hết hàng"
          value={totalWarning.toString()}
          icon={<Warehouse className="h-5 w-5 text-amber-500" />}
          color="text-amber-600"
          sub="Cần lên kế hoạch nhập thêm"
        />
        <SummaryCard
          title="Mã ngừng sử dụng"
          value={totalInactive.toString()}
          icon={<XCircle className="h-5 w-5 text-slate-500" />}
          color="text-slate-600"
          sub="Đã khóa không cho xuất kho"
        />
      </div>
      <div className="flex items-center gap-2 ">
        <Button
          size="sm"
          variant={tab === "pesticide" ? "default" : "ghost"}
          className={
            tab === "pesticide"
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground"
          }
          onClick={() => setTab("pesticide")}
        >
          <Leaf className="mr-1 h-4 w-4" />
          Thuốc bảo vệ thực vật
        </Button>
        <Button
          size="sm"
          variant={tab === "fertilizer" ? "default" : "ghost"}
          className={
            tab === "fertilizer"
              ? "bg-white text-primary shadow-sm"
              : "text-muted-foreground"
          }
          onClick={() => setTab("fertilizer")}
        >
          <Sprout className="mr-1 h-4 w-4" />
          Phân bón
        </Button>
      </div>
      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Tìm kiếm & lọc thông tin
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Lọc nhanh theo tên, loại, độc tính / nhà sản xuất và trạng thái
                sử dụng.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 w-full">
          {/* Hàng tìm kiếm + nút reset */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Input
                placeholder={
                  tab === "pesticide"
                    ? "Nhập tên / mã thuốc, hãng sản xuất..."
                    : "Nhập tên / mã phân bón, hãng sản xuất..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start md:self-auto"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
                setHazardFilter("all");
                setManufacturerFilter("all");
                setStatusFilter("all");
              }}
            >
              <Filter className="mr-1 h-4 w-4" />
              Làm mới bộ lọc
            </Button>
          </div>

          {/* Các filter chi tiết */}
          <div className="flex items-center gap-3">
            {/* Loại / nhóm */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Loại / nhóm
              </p>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Chọn loại / nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {tab === "pesticide" ? (
                    <>
                      <SelectItem value="thuốc trừ sâu">
                        Thuốc trừ sâu
                      </SelectItem>
                      <SelectItem value="thuốc trừ bệnh">
                        Thuốc trừ bệnh
                      </SelectItem>
                      <SelectItem value="thuốc trừ cỏ">Thuốc trừ cỏ</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="vô cơ">Phân vô cơ</SelectItem>
                      <SelectItem value="hữu cơ">Phân hữu cơ</SelectItem>
                      <SelectItem value="hữu cơ khoáng">
                        Phân hữu cơ khoáng
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {tab === "pesticide" ? "Mức độc tính" : "Nhà sản xuất"}
              </p>
              {tab === "pesticide" ? (
                <Select value={hazardFilter} onValueChange={setHazardFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn mức độc tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Độc tính (tất cả)</SelectItem>
                    <SelectItem value="thấp">Thấp</SelectItem>
                    <SelectItem value="trung bình">Trung bình</SelectItem>
                    <SelectItem value="cao">Cao</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Select
                  value={manufacturerFilter}
                  onValueChange={setManufacturerFilter}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn nhà sản xuất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả nhà sản xuất</SelectItem>
                    <SelectItem value="công ty phân bón miền nam">
                      Công ty Phân bón Miền Nam
                    </SelectItem>
                    <SelectItem value="công ty hữu cơ việt">
                      Công ty Hữu Cơ Việt
                    </SelectItem>
                    <SelectItem value="đạm phú mỹ">Đạm Phú Mỹ</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Trạng thái */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Trạng thái
              </p>
              <Select
                value={statusFilter}
                onValueChange={(v: Status | "all") => setStatusFilter(v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Đang kinh doanh</SelectItem>
                  <SelectItem value="warning">Sắp hết hàng</SelectItem>
                  <SelectItem value="inactive">Ngừng sử dụng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Ô trống dành cho filter mở rộng sau này / hoặc hiển thị tổng số bản ghi */}
          <div className="hidden lg:flex flex-col justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 px-3 text-xs text-muted-foreground p-3">
            <span className="font-medium text-foreground">
              {tab === "pesticide" ? "Thuốc BVTV" : "Phân bón"} đang hiển thị
            </span>
            <span>
              Áp dụng{" "}
              <span className="font-semibold text-foreground">
                {
                  [
                    typeFilter !== "all",
                    tab === "pesticide"
                      ? hazardFilter !== "all"
                      : manufacturerFilter !== "all",
                    statusFilter !== "all",
                  ].filter(Boolean).length
                }
              </span>{" "}
              bộ lọc
            </span>
          </div>
        </CardContent>
      </Card>
      {/* TABLE */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            {tab === "pesticide"
              ? "Danh sách thuốc bảo vệ thực vật"
              : "Danh sách phân bón"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={currentColumns}
            data={currentData}
            filterColumn="name"
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ================== SUMMARY CARD ==================

function SummaryCard({
  title,
  value,
  sub,
  color,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  color: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
            {title}
          </CardTitle>
        </div>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
