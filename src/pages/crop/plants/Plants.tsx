"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Sprout,
  Search,
  Filter,
  Leaf,
  CalendarRange,
  ShoppingBag,
  Scissors,
  Recycle,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { useNavigate } from "react-router";
import { DataTableRowActions } from "@/components/data-table-row-actions";

/* ========== TYPES ========== */

type HarvestForm = "thu-tuoi" | "thu-hat" | "thu-bap-non" | "cat-luot" | "khac";

type GrowthCycle = "ngan-ngay" | "trung-binh" | "dai-ngay";

type CropType = "bap" | "dau-nanh" | "lua" | "rau-mau" | "cay-an-trai";

type CropRow = {
  id: string;
  code: string; // mã cây / mã lô cây
  name: string; // tên cây trồng
  image?: string;
  cropType: CropType;

  seedName: string; // tên giống
  seedCode?: string; // mã giống (nếu có)
  seedSupplier?: string; // nhà cung cấp

  harvestForm: HarvestForm; // hình thức thu hoạch
  harvestNote?: string; // ví dụ: thu tươi bán chợ, thu hạt làm giống,...

  growthCycle: GrowthCycle; // chu kỳ sinh trưởng
  growthDays?: string; // vd: 90–100 ngày
  growthNote?: string;

  season: string; // mùa vụ điển hình
  note?: string;
};

/* ========== MOCK DATA ========== */

const crops: CropRow[] = [
  {
    id: "C001",
    code: "BAP-DK9955",
    name: "Bắp lai DK9955",
    image: "https://nongduochai.vn/upload_images/images/2018/09/25/2.jpg",
    cropType: "bap",
    seedName: "DK9955 (hãng Dekalb)",
    seedCode: "DK9955",
    seedSupplier: "Đại lý VTNN A1",
    harvestForm: "thu-bap-non",
    harvestNote: "Thu trái tươi làm bắp non / bắp luộc",
    growthCycle: "trung-binh",
    growthDays: "100–110 ngày",
    growthNote: "Giai đoạn xoáy nõn – trổ cờ nhạy cảm thiếu nước.",
    season: "Đông Xuân",
    note: "Phù hợp đất tốt, yêu cầu phân bón tương đối cao.",
  },
  {
    id: "C002",
    code: "DAU-DT26",
    name: "Đậu nành DT26",
    image: "https://www.trungtamgiongcaytrong.vn/upload/img/2.3_4.jpg",
    cropType: "dau-nanh",
    seedName: "Giống DT26",
    seedCode: "DT26",
    seedSupplier: "Trung tâm giống tỉnh",
    harvestForm: "thu-hat",
    harvestNote: "Thu hạt khô bán nhà máy ép dầu / thức ăn.",
    growthCycle: "ngan-ngay",
    growthDays: "85–95 ngày",
    growthNote: "Có thể trồng xen với bắp để cải thiện đạm đất.",
    season: "Đông Xuân / Hè Thu",
    note: "Chịu hạn khá, phù hợp chân đất cao.",
  },
  {
    id: "C003",
    code: "LUA-ST25",
    name: "Lúa thơm ST25",
    image:
      "https://thaodienxanh.vn/image/data/07-2023/gao-ngon-nhat-the-gioi-st25-khong-dung-lai-o-dinh-cao-3.jpeg",
    cropType: "lua",
    seedName: "Giống ST25",
    seedCode: "ST25",
    seedSupplier: "Doanh nghiệp giống X",
    harvestForm: "thu-hat",
    harvestNote: "Thu lúa khô, ưu tiên bán theo hợp đồng chất lượng cao.",
    growthCycle: "trung-binh",
    growthDays: "95–105 ngày",
    season: "Đông Xuân",
    note: "Yêu cầu quản lý phân – thuốc chặt để đạt chất lượng gạo thơm.",
  },
  {
    id: "C004",
    code: "RAU-CAI-XANH",
    name: "Rau cải xanh ăn lá",
    image:
      "https://images.baodantoc.vn/uploads/2023/Th%C3%A1ng%202/Ng%C3%A0y_17/Thanh/20210528_145200_370993_rau-cai.max-1800x1800.jpg",
    cropType: "rau-mau",
    seedName: "Giống cải xanh F1",
    seedSupplier: "Công ty giống rau quả Y",
    harvestForm: "cat-luot",
    harvestNote: "Cắt lứa 25–30 ngày sau gieo, có thể cắt 2–3 lứa.",
    growthCycle: "ngan-ngay",
    growthDays: "25–35 ngày/lứa",
    season: "Quanh năm (ưu tiên vụ mát)",
    note: "Ưu tiên canh tác trong nhà lưới / nhà màng, kiểm soát dư lượng.",
  },
  {
    id: "C005",
    code: "XOAI-CATCHU",
    name: "Xoài cát Chu",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTckkQTUNtxl9vYI8yM-7KgxoMcdAQ3rMQzFw&s",
    cropType: "cay-an-trai",
    seedName: "Cây ghép giống xoài cát Chu",
    seedSupplier: "Vườn ươm cây ăn trái B",
    harvestForm: "thu-tuoi",
    harvestNote: "Thu trái tươi, có thể bao trái để tăng chất lượng.",
    growthCycle: "dai-ngay",
    growthDays: "3–4 năm cho trái ổn định",
    season: "Chính vụ: Tháng 3–5 (có thể xử lý ra hoa nghịch vụ)",
    note: "Cần ghi chú riêng lịch xử lý ra hoa, tỉa cành, bón phân năm.",
  },
];

/* ========== HELPERS ========== */

function harvestFormLabel(f: HarvestForm) {
  if (f === "thu-tuoi") return "Thu tươi";
  if (f === "thu-hat") return "Thu hạt / khô";
  if (f === "thu-bap-non") return "Thu bắp non / trái non";
  if (f === "cat-luot") return "Cắt lứa nhiều lần";
  return "Khác";
}

function growthCycleLabel(c: GrowthCycle) {
  if (c === "ngan-ngay") return "Ngắn ngày";
  if (c === "trung-binh") return "Trung bình";
  return "Dài ngày";
}

function cropTypeLabel(t: CropType) {
  if (t === "bap") return "Bắp (Ngô)";
  if (t === "dau-nanh") return "Đậu nành";
  if (t === "lua") return "Lúa";
  if (t === "rau-mau") return "Rau màu";
  return "Cây ăn trái";
}

/* ========== MAIN PAGE ========== */

export default function CropPlantsPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = React.useState<"all" | CropType>("all");
  const [harvestFilter, setHarvestFilter] = React.useState<"all" | HarvestForm>(
    "all"
  );
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    return crops.filter((c) => {
      if (typeFilter !== "all" && c.cropType !== typeFilter) return false;
      if (harvestFilter !== "all" && c.harvestForm !== harvestFilter)
        return false;

      if (search.trim()) {
        const text = search.toLowerCase();
        const haystack = (
          c.name +
          c.code +
          c.seedName +
          (c.seedCode ?? "") +
          (c.seedSupplier ?? "") +
          c.season +
          (c.note ?? "")
        ).toLowerCase();
        if (!haystack.includes(text)) return false;
      }
      return true;
    });
  }, [typeFilter, harvestFilter, search]);

  const columns: ColumnDef<CropRow>[] = [
    {
      accessorKey: "name",
      header: "Cây trồng",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-start gap-2">
            {/* Thumbnail ảnh */}
            <div className="h-12 w-16 overflow-hidden rounded-md bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image ?? "/placeholder-crop.png"}
                alt={c.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{c.name}</span>
              <span className="text-[11px] text-muted-foreground">
                Mã: <span className="font-mono font-medium">{c.code}</span> •
                Loại: {cropTypeLabel(c.cropType)}
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <CalendarRange className="h-3 w-3 text-amber-600" />
                Mùa vụ: <span className="font-medium">{c.season}</span>
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "seedName",
      header: "Hạt giống",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex flex-col text-xs">
            <span className="font-medium">{c.seedName}</span>
            {c.seedCode && (
              <span className="text-[11px] text-muted-foreground">
                Mã giống:{" "}
                <span className="font-mono font-medium">{c.seedCode}</span>
              </span>
            )}
            {c.seedSupplier && (
              <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <ShoppingBag className="h-3 w-3 text-sky-600" />
                Nguồn: <span>{c.seedSupplier}</span>
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "harvestForm",
      header: "Hình thức thu hoạch",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex flex-col text-xs">
            <Badge
              variant="outline"
              className="inline-flex w-fit items-center gap-1 border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
            >
              <Scissors className="h-3 w-3" />
              {harvestFormLabel(c.harvestForm)}
            </Badge>
            {c.harvestNote && (
              <span className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                {c.harvestNote}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "growthCycle",
      header: "Chu kỳ sinh trưởng",
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex flex-col text-xs">
            <Badge
              variant="outline"
              className="inline-flex w-fit items-center gap-1 border-lime-200 bg-lime-50 text-[10px] text-lime-700"
            >
              <Recycle className="h-3 w-3" />
              {growthCycleLabel(c.growthCycle)}
            </Badge>
            {c.growthDays && (
              <span className="mt-0.5 text-[11px] text-muted-foreground">
                Thời gian: <span className="font-medium">{c.growthDays}</span>
              </span>
            )}
            {c.growthNote && (
              <span className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                {c.growthNote}
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      cell: ({ row }) => (
        <p className="max-w-[160px] line-clamp-3 text-[11px] text-muted-foreground">
          {row.original.note ?? "-"}
        </p>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={(r) => console.log("View", r)}
          onEdit={(r) => console.log("Edit", r)}
          onDelete={(r) => console.log("Delete", r)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
            <Sprout className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Danh mục cây trồng & giống
            </h1>
            <p className="text-xs text-muted-foreground">
              Quản lý mã cây, hình ảnh, giống, hình thức thu hoạch và chu kỳ
              sinh trưởng – dùng làm nền cho kế hoạch gieo trồng & nhật ký canh
              tác.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline">
            Xuất file
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={() => navigate("/main/crop/plants/add")}
          >
            Thêm mới
          </Button>
        </div>
      </header>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bộ lọc & tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4 text-xs">
          {/* Loại cây */}
          <FilterItem label="Loại cây trồng">
            <Select
              value={typeFilter}
              onValueChange={(v) => setTypeFilter(v as CropType | "all")}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn loại cây" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="bap">Bắp (Ngô)</SelectItem>
                <SelectItem value="dau-nanh">Đậu nành</SelectItem>
                <SelectItem value="lua">Lúa</SelectItem>
                <SelectItem value="rau-mau">Rau màu</SelectItem>
                <SelectItem value="cay-an-trai">Cây ăn trái</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          {/* Hình thức thu hoạch */}
          <FilterItem label="Hình thức thu hoạch">
            <Select
              value={harvestFilter}
              onValueChange={(v) => setHarvestFilter(v as HarvestForm | "all")}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn hình thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="thu-tuoi">Thu tươi</SelectItem>
                <SelectItem value="thu-hat">Thu hạt / khô</SelectItem>
                <SelectItem value="thu-bap-non">Thu bắp non</SelectItem>
                <SelectItem value="cat-luot">Cắt lứa</SelectItem>
                <SelectItem value="khac">Khác</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          {/* Search */}
          <FilterItem label="Tìm kiếm nhanh">
            <div className="relative">
              <Input
                className="h-8 pl-7"
                placeholder="Nhập tên cây, mã cây, giống, mùa vụ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </FilterItem>

          {/* Reset */}
          <div className="flex items-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                setTypeFilter("all");
                setHarvestFilter("all");
                setSearch("");
              }}
            >
              <Filter className="mr-1 h-4 w-4" />
              Làm mới bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SUMMARY */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryCard
          label="Tổng số cây trong danh mục"
          value={filtered.length.toString()}
          desc="Số cây / giống đang hiển thị theo bộ lọc"
          icon={<Leaf className="h-4 w-4 text-emerald-600" />}
        />
        <SummaryCard
          label="Số loại hình thu hoạch"
          value={
            new Set(filtered.map((c) => c.harvestForm)).size.toString() +
            " dạng"
          }
          desc="Thu tươi, thu hạt, cắt lứa..."
          icon={<Scissors className="h-4 w-4 text-sky-600" />}
        />
        <SummaryCard
          label="Đa dạng chu kỳ sinh trưởng"
          value={
            new Set(filtered.map((c) => c.growthCycle)).size.toString() +
            " nhóm"
          }
          desc="Ngắn ngày / trung bình / dài ngày"
          icon={<Recycle className="h-4 w-4 text-lime-600" />}
        />
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách cây trồng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filtered} filterColumn="name" />
        </CardContent>
      </Card>
    </div>
  );
}

/* ========== SMALL COMPONENTS ========== */

function FilterItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  desc,
  icon,
}: {
  label: string;
  value: string;
  desc?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {desc && (
          <p className="mt-1 text-[11px] text-muted-foreground">{desc}</p>
        )}
      </CardContent>
    </Card>
  );
}
