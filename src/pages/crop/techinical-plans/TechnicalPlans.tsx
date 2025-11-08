"use client";

import { useMemo, useState } from "react";
import {
  Sprout,
  Filter,
  Search,
  Leaf,
  Wheat,
  CalendarRange,
  Activity,
  Archive,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { useNavigate } from "react-router";

/* ========= TYPES ========= */

type GroupStatus = "dang-su-dung" | "tam-ngung" | "luu-tru";

type CropGroup = {
  id: string;
  code: string;
  name: string;
  category: string; // Nhóm: Cây lương thực, rau màu, cây ăn quả...
  mainCrops: string[]; // danh sách cây chính trong nhóm
  season: string; // Vụ Đông Xuân, Hè Thu...
  cycleType: "ngan" | "trung-binh" | "dai";
  avgCycleDays: number;
  typicalArea: string; // Vùng áp dụng
  harvestMethod: string;
  soilType: string;
  riskLevel: "thap" | "trung-binh" | "cao";
  varietiesCount: number;
  status: GroupStatus;
  note?: string;
  updatedAt: string;
};

/* ========= MOCK DATA ========= */

const cropGroups: CropGroup[] = [
  {
    id: "G001",
    code: "GR-CORN-SOY",
    name: "Nhóm bắp – đậu nành luân canh",
    category: "Cây lương thực",
    mainCrops: ["Bắp lai DK9955", "Đậu nành DT26"],
    season: "Đông Xuân – Hè Thu",
    cycleType: "trung-binh",
    avgCycleDays: 120,
    typicalArea: "Vùng A – Đất phù sa, thoát nước tốt",
    harvestMethod: "Cơ giới kết hợp thủ công",
    soilType: "Đất phù sa, thịt nhẹ",
    riskLevel: "trung-binh",
    varietiesCount: 6,
    status: "dang-su-dung",
    note: "Mô hình luân canh bắp – đậu nành để cải thiện đất, cân đối dinh dưỡng.",
    updatedAt: "2025-10-30 09:15",
  },
  {
    id: "G002",
    code: "GR-PADDY",
    name: "Nhóm lúa chất lượng cao",
    category: "Lúa nước",
    mainCrops: ["Lúa OM5451", "Lúa ST25"],
    season: "Đông Xuân – Hè Thu – Thu Đông",
    cycleType: "trung-binh",
    avgCycleDays: 100,
    typicalArea: "Vùng B – Đất ruộng chủ động nước",
    harvestMethod: "Gặt đập liên hợp",
    soilType: "Đất thịt trung bình, chủ động thủy lợi",
    riskLevel: "cao",
    varietiesCount: 4,
    status: "dang-su-dung",
    note: "Yêu cầu quản lý dịch hại chặt, bón phân cân đối NPK.",
    updatedAt: "2025-11-02 14:30",
  },
  {
    id: "G003",
    code: "GR-VEG-MIX",
    name: "Nhóm rau màu ngắn ngày",
    category: "Rau màu",
    mainCrops: ["Xà lách", "Cải xanh", "Dưa leo"],
    season: "Quanh năm (chia lứa)",
    cycleType: "ngan",
    avgCycleDays: 35,
    typicalArea: "Vùng C – Đất cao, thoát nước tốt",
    harvestMethod: "Thu hoạch thủ công",
    soilType: "Đất tơi xốp, giàu hữu cơ",
    riskLevel: "trung-binh",
    varietiesCount: 10,
    status: "dang-su-dung",
    note: "Phù hợp làm vùng rau an toàn / VietGAP, yêu cầu ghi chép chặt.",
    updatedAt: "2025-10-28 16:05",
  },
  {
    id: "G004",
    code: "GR-FRUIT-LONG",
    name: "Nhóm cây ăn quả lâu năm (sầu riêng – xoài)",
    category: "Cây ăn quả",
    mainCrops: ["Sầu riêng Ri6", "Xoài cát Hòa Lộc"],
    season: "Theo lứa xử lý ra hoa",
    cycleType: "dai",
    avgCycleDays: 365,
    typicalArea: "Vùng D – Đất bazan, độ dốc nhẹ",
    harvestMethod: "Thu hoạch thủ công, chọn trái",
    soilType: "Đất đỏ bazan, thoát nước tốt",
    riskLevel: "cao",
    varietiesCount: 5,
    status: "tam-ngung",
    note: "Đang tạm dừng mở rộng do rủi ro thị trường & sâu bệnh.",
    updatedAt: "2025-09-20 10:45",
  },
  {
    id: "G005",
    code: "GR-CORN-SINGLE",
    name: "Nhóm bắp đơn vụ thâm canh",
    category: "Cây lương thực",
    mainCrops: ["Bắp lai DK9955", "Bắp LVN10"],
    season: "Đông Xuân",
    cycleType: "trung-binh",
    avgCycleDays: 115,
    typicalArea: "Vùng A – Vùng B",
    harvestMethod: "Máy tuốt bắp / máy gặt bắp",
    soilType: "Đất thịt nhẹ, trung bình",
    riskLevel: "thap",
    varietiesCount: 3,
    status: "luu-tru",
    note: "Mô hình cũ, dùng làm tham khảo so sánh năng suất.",
    updatedAt: "2024-11-01 08:00",
  },
];

/* ========= HELPERS ========= */

function renderStatusBadge(status: GroupStatus) {
  if (status === "dang-su-dung") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px]">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Đang sử dụng
      </Badge>
    );
  }
  if (status === "tam-ngung") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-[11px]">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Tạm ngưng
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-50 text-slate-600 border border-slate-200 text-[11px]">
      <Archive className="mr-1 h-3 w-3" />
      Lưu trữ
    </Badge>
  );
}

function renderCycle(cycleType: CropGroup["cycleType"], days: number) {
  const label =
    cycleType === "ngan"
      ? "Chu kỳ ngắn"
      : cycleType === "trung-binh"
      ? "Chu kỳ trung bình"
      : "Chu kỳ dài";

  const color =
    cycleType === "ngan"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : cycleType === "trung-binh"
      ? "border-sky-200 bg-sky-50 text-sky-700"
      : "border-violet-200 bg-violet-50 text-violet-700";

  return (
    <div className="flex flex-col gap-0.5">
      <Badge variant="outline" className={`px-1.5 py-0.5 text-[10px] ${color}`}>
        <CalendarRange className="mr-1 h-3 w-3" />
        {label}
      </Badge>
      <span className="text-[11px] text-muted-foreground">
        ~ {days} ngày / chu kỳ
      </span>
    </div>
  );
}

/* ========= PAGE ========= */

export default function TechnicalPlansPage() {
  const navigate = useNavigate();
  const [season, setSeason] = useState<"all" | string>("all");
  const [category, setCategory] = useState<"all" | string>("all");
  const [status, setStatus] = useState<"all" | GroupStatus>("all");
  const [search, setSearch] = useState("");

  const total = cropGroups.length;
  const activeCount = cropGroups.filter(
    (g) => g.status === "dang-su-dung"
  ).length;
  const riskHighCount = cropGroups.filter((g) => g.riskLevel === "cao").length;
  const shortCycleCount = cropGroups.filter(
    (g) => g.cycleType === "ngan"
  ).length;

  const seasons = Array.from(new Set(cropGroups.map((g) => g.season)));
  const categories = Array.from(new Set(cropGroups.map((g) => g.category)));

  const filtered = useMemo(() => {
    return cropGroups.filter((g) => {
      if (season !== "all" && g.season !== season) return false;
      if (category !== "all" && g.category !== category) return false;
      if (status !== "all" && g.status !== status) return false;

      if (search.trim()) {
        const text = search.toLowerCase();
        const haystack = (
          g.code +
          g.name +
          g.category +
          g.mainCrops.join(" ") +
          g.typicalArea +
          (g.note ?? "")
        ).toLowerCase();
        if (!haystack.includes(text)) return false;
      }

      return true;
    });
  }, [season, category, status, search]);

  const columns: ColumnDef<CropGroup>[] = [
    {
      accessorKey: "code",
      header: "Mã nhóm",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên nhóm cây trồng",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{row.original.name}</span>
          <span className="text-[11px] text-muted-foreground">
            Cây chính: {row.original.mainCrops.join(" • ")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Loại nhóm",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{row.original.category}</span>
          <span className="text-[11px] text-muted-foreground">
            Vùng: {row.original.typicalArea}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "cycleType",
      header: "Chu kỳ sinh trưởng",
      cell: ({ row }) =>
        renderCycle(row.original.cycleType, row.original.avgCycleDays),
    },
    {
      accessorKey: "season",
      header: "Mùa vụ điển hình",
      cell: ({ row }) => <span className="text-xs">{row.original.season}</span>,
    },
    {
      accessorKey: "varietiesCount",
      header: "Số giống",
      cell: ({ row }) => (
        <span className="text-xs">{row.original.varietiesCount} giống</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => renderStatusBadge(row.original.status),
    },
    {
      accessorKey: "updatedAt",
      header: "Cập nhật",
      cell: ({ row }) => (
        <span className="text-[11px] text-muted-foreground">
          {row.original.updatedAt}
        </span>
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
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
            <Sprout className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Quản lý nhóm cây trồng / mô hình canh tác
            </h1>
            <p className="text-xs text-muted-foreground">
              Tổ chức các cây trồng theo nhóm (luân canh, xen canh, mô hình canh
              tác) để dùng lại trong kế hoạch gieo trồng và tính toán chi phí –
              sản lượng.
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
            onClick={() => navigate("/main/crop/plans/add")}
          >
            Thêm nhóm cây trồng
          </Button>
        </div>
      </header>

      {/* SUMMARY */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Leaf className="h-4 w-4 text-emerald-600" />}
          label="Tổng số nhóm"
          value={total.toString()}
          desc="Bao gồm tất cả trạng thái"
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
          label="Đang áp dụng"
          value={activeCount.toString()}
          desc="Đang dùng trong kế hoạch & nhật ký"
        />
        <SummaryCard
          icon={<Activity className="h-4 w-4 text-sky-600" />}
          label="Nhóm chu kỳ ngắn"
          value={shortCycleCount.toString()}
          desc="Phù hợp xoay vòng vốn nhanh"
        />
        <SummaryCard
          icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
          label="Nhóm rủi ro cao"
          value={riskHighCount.toString()}
          desc="Cần giám sát sâu bệnh & thị trường"
        />
      </div>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bộ lọc & tìm kiếm nhóm cây trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5 text-xs">
          {/* Mùa vụ */}
          <FilterItem label="Mùa vụ tổng hợp">
            <Select
              value={season}
              onValueChange={(v) => setSeason(v as "all" | string)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn mùa vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {seasons.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterItem>

          {/* Loại nhóm */}
          <FilterItem label="Loại nhóm cây">
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as "all" | string)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterItem>

          {/* Trạng thái */}
          <FilterItem label="Trạng thái nhóm">
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as GroupStatus | "all")}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="dang-su-dung">Đang sử dụng</SelectItem>
                <SelectItem value="tam-ngung">Tạm ngưng</SelectItem>
                <SelectItem value="luu-tru">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          {/* Search */}
          <FilterItem label="Tìm kiếm nhanh">
            <div className="relative">
              <Input
                className="h-8 pl-7"
                placeholder="Mã nhóm / tên nhóm / cây trồng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
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
                setSeason("all");
                setCategory("all");
                setStatus("all");
                setSearch("");
              }}
            >
              <Filter className="mr-1 h-4 w-4" />
              Làm mới bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center justify-between">
            <span>Danh sách nhóm cây trồng</span>
            <span className="text-[11px] text-muted-foreground">
              Đang hiển thị{" "}
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              / {total} nhóm
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable<CropGroup>
            columns={columns}
            data={filtered}
            filterColumn="name"
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ========= SUB COMPONENTS ========= */

function SummaryCard({
  icon,
  label,
  value,
  desc,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  desc: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase">
          {label}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="mt-1 text-[11px] text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function FilterItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 text-xs">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
