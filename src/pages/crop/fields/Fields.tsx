"use client";

import { useMemo, useState } from "react";
import {
  FileDown,
  Filter,
  Leaf,
  Map,
  MapPin,
  Plus,
  Sprout,
  TreesIcon as Trees,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { useNavigate } from "react-router";

// ====== TYPES ======

type PlotStatus = "chuan-bi" | "dang-khai-thac" | "cai-tao" | "tam-ngung";

type GardenPlot = {
  id: string;
  farmName: string;
  blockCode: string; // Khu / lô lớn
  plotCode: string; // Mã lô chi tiết
  crop: string; // Cây trồng chính
  variety: string;
  area: number; // ha
  trees: number;
  plantingDate: string; // YYYY-MM-DD
  ageMonth: number;
  irrigation: "co-tuoi" | "khong-tuoi" | "mot-phan";
  soilType: string;
  status: PlotStatus;
  locationNote?: string;
  note?: string;
};

// ====== SAMPLE DATA ======
const plots: GardenPlot[] = [
  // KHU A – BẮP
  {
    id: "1",
    farmName: "Vườn bắp Khu A",
    blockCode: "A1",
    plotCode: "A1-01",
    crop: "Bắp",
    variety: "Bắp lai NK4300",
    area: 1.2,
    trees: 62000, // cây/ha * ha (ví dụ 52.000 cây/ha)
    plantingDate: "2025-08-10",
    ageMonth: 2,
    irrigation: "co-tuoi",
    soilType: "Đất phù sa",
    status: "dang-khai-thac",
    locationNote: "Gần mương tưới chính, vào từ cổng đông 200m.",
    note: "Sinh trưởng đồng đều, ít sâu bệnh, chuẩn bị bón thúc lần 2.",
  },
  {
    id: "2",
    farmName: "Vườn bắp Khu A",
    blockCode: "A1",
    plotCode: "A1-02",
    crop: "Bắp",
    variety: "Bắp lai CP999",
    area: 0.9,
    trees: 45000,
    plantingDate: "2025-08-15",
    ageMonth: 2,
    irrigation: "mot-phan",
    soilType: "Đất thịt nhẹ",
    status: "dang-khai-thac",
    locationNote: "Giáp ranh lô A1-01, hơi thấp trũng.",
    note: "Một số chỗ bị úng nhẹ sau mưa lớn, đã rút nước.",
  },
  {
    id: "3",
    farmName: "Vườn bắp Khu A",
    blockCode: "A2",
    plotCode: "A2-01",
    crop: "Bắp",
    variety: "Bắp nếp lai",
    area: 1.5,
    trees: 75000,
    plantingDate: "2025-07-20",
    ageMonth: 3,
    irrigation: "co-tuoi",
    soilType: "Đất cát pha",
    status: "dang-khai-thac",
    note: "Đã trổ cờ, dự kiến thu hoạch sau 35–40 ngày.",
  },
  {
    id: "4",
    farmName: "Vườn bắp Khu A",
    blockCode: "A2",
    plotCode: "A2-02",
    crop: "Bắp",
    variety: "Bắp lai NK7328",
    area: 1.0,
    trees: 52000,
    plantingDate: "2025-09-01",
    ageMonth: 1,
    irrigation: "khong-tuoi",
    soilType: "Đất xám bạc màu",
    status: "chuan-bi",
    note: "Vừa gieo xong, đang cân nhắc lắp hệ thống tưới di động.",
  },

  // KHU B – ĐẬU NÀNH
  {
    id: "5",
    farmName: "Vườn đậu nành Khu B",
    blockCode: "B1",
    plotCode: "B1-01",
    crop: "Đậu nành",
    variety: "Đậu nành VNĐN-01",
    area: 0.7,
    trees: 280000, // số cây theo mật độ gieo hạt
    plantingDate: "2025-08-05",
    ageMonth: 2,
    irrigation: "co-tuoi",
    soilType: "Đất phù sa",
    status: "dang-khai-thac",
    locationNote: "Lô nằm sát đường nội đồng phía tây.",
    note: "Đang giai đoạn ra hoa rộ, cần chú ý phòng sâu xanh.",
  },
  {
    id: "6",
    farmName: "Vườn đậu nành Khu B",
    blockCode: "B1",
    plotCode: "B1-02",
    crop: "Đậu nành",
    variety: "Đậu nành DT2008",
    area: 0.9,
    trees: 360000,
    plantingDate: "2025-07-30",
    ageMonth: 2,
    irrigation: "mot-phan",
    soilType: "Đất thịt trung bình",
    status: "dang-khai-thac",
    note: "Sinh trưởng tốt, dự kiến năng suất khá.",
  },
  {
    id: "7",
    farmName: "Vườn đậu nành Khu B",
    blockCode: "B2",
    plotCode: "B2-01",
    crop: "Đậu nành",
    variety: "Đậu nành địa phương",
    area: 1.1,
    trees: 420000,
    plantingDate: "2025-09-05",
    ageMonth: 1,
    irrigation: "co-tuoi",
    soilType: "Đất cát pha",
    status: "dang-khai-thac",
    note: "Giai đoạn cây con, cần kiểm tra cỏ dại thường xuyên.",
  },

  // KHU C – LUÂN CANH BẮP / ĐẬU NÀNH
  {
    id: "8",
    farmName: "Vườn luân canh Khu C",
    blockCode: "C1",
    plotCode: "C1-01",
    crop: "Bắp",
    variety: "Bắp lai NK4300",
    area: 1.0,
    trees: 50000,
    plantingDate: "2025-06-15",
    ageMonth: 4,
    irrigation: "co-tuoi",
    soilType: "Đất đỏ bazan",
    status: "dang-khai-thac",
    locationNote: "Lô bắp trên đất luân canh với đậu nành vụ trước.",
    note: "Chuẩn bị thu hoạch, sau đó chuyển sang đậu nành vụ Đông Xuân.",
  },
  {
    id: "9",
    farmName: "Vườn luân canh Khu C",
    blockCode: "C1",
    plotCode: "C1-02",
    crop: "Đậu nành",
    variety: "Đậu nành VNĐN-02",
    area: 1.0,
    trees: 380000,
    plantingDate: "2025-09-20",
    ageMonth: 1,
    irrigation: "khong-tuoi",
    soilType: "Đất đỏ bazan",
    status: "chuan-bi",
    note: "Dùng lượng phân hữu cơ nhiều, đang theo dõi độ ẩm đất.",
  },

  // KHU D – CẢI TẠO / TẠM NGƯNG
  {
    id: "10",
    farmName: "Vườn bắp cải tạo Khu D",
    blockCode: "D1",
    plotCode: "D1-01",
    crop: "Bắp",
    variety: "Bắp lai cũ",
    area: 0.8,
    trees: 0,
    plantingDate: "2023-05-01",
    ageMonth: 24,
    irrigation: "khong-tuoi",
    soilType: "Đất xám bạc màu",
    status: "cai-tao",
    note: "Vừa phá bỏ bắp cũ, đang xử lý đất chuẩn bị trồng đậu nành.",
  },
  {
    id: "11",
    farmName: "Vườn đậu nành nghỉ vụ Khu D",
    blockCode: "D2",
    plotCode: "D2-01",
    crop: "Đậu nành",
    variety: "Đậu nành địa phương",
    area: 0.6,
    trees: 0,
    plantingDate: "2024-02-10",
    ageMonth: 18,
    irrigation: "khong-tuoi",
    soilType: "Đất thịt nhẹ",
    status: "tam-ngung",
    note: "Đang để đất nghỉ, có thể trồng cỏ che phủ trong vụ tới.",
  },
];

// ====== HELPERS ======

function renderStatusBadge(status: PlotStatus) {
  switch (status) {
    case "chuan-bi":
      return (
        <Badge className="bg-sky-50 text-sky-700 border-sky-200 text-[11px]">
          Đang chuẩn bị
        </Badge>
      );
    case "dang-khai-thac":
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]">
          Đang khai thác
        </Badge>
      );
    case "cai-tao":
      return (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[11px]">
          Cải tạo / tái canh
        </Badge>
      );
    case "tam-ngung":
      return (
        <Badge className="bg-slate-50 text-slate-700 border-slate-200 text-[11px]">
          Tạm ngưng
        </Badge>
      );
    default:
      return null;
  }
}

function renderIrrigationLabel(v: GardenPlot["irrigation"]) {
  if (v === "co-tuoi") return "Có tưới tự động";
  if (v === "khong-tuoi") return "Không có tưới";
  return "Một phần có tưới";
}

// ====== PAGE ======

export default function FieldsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [farmFilter, setFarmFilter] = useState<string>("all");
  const [cropFilter, setCropFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<PlotStatus | "all">("all");

  const totalPlots = plots.length;
  const totalArea = plots.reduce((s, p) => s + p.area, 0);
  const exploitingArea = plots
    .filter((p) => p.status === "dang-khai-thac")
    .reduce((s, p) => s + p.area, 0);
  const irrigatedArea = plots
    .filter((p) => p.irrigation === "co-tuoi" || p.irrigation === "mot-phan")
    .reduce((s, p) => s + p.area, 0);

  const farmOptions = Array.from(new Set(plots.map((p) => p.farmName)));
  const cropOptions = Array.from(new Set(plots.map((p) => p.crop)));

  const filteredPlots = useMemo(() => {
    const q = search.toLowerCase().trim();
    return plots.filter((p) => {
      const matchesSearch =
        !q ||
        p.plotCode.toLowerCase().includes(q) ||
        p.blockCode.toLowerCase().includes(q) ||
        p.farmName.toLowerCase().includes(q) ||
        p.crop.toLowerCase().includes(q) ||
        p.variety.toLowerCase().includes(q);

      const matchesFarm =
        farmFilter === "all" ? true : p.farmName === farmFilter;
      const matchesCrop = cropFilter === "all" ? true : p.crop === cropFilter;
      const matchesStatus =
        statusFilter === "all" ? true : p.status === statusFilter;

      return matchesSearch && matchesFarm && matchesCrop && matchesStatus;
    });
  }, [search, farmFilter, cropFilter, statusFilter]);

  const columns: ColumnDef<GardenPlot>[] = [
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
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "plotCode",
      header: "Lô / ô",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-sm">{row.original.plotCode}</span>
          <span className="text-[11px] text-muted-foreground">
            Khu: {row.original.blockCode}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "farmName",
      header: "Trang trại / vườn",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs max-w-[220px]">
          <span className="font-medium">{row.original.farmName}</span>
          {row.original.locationNote && (
            <span className="text-[11px] text-muted-foreground line-clamp-1">
              {row.original.locationNote}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "crop",
      header: "Cây trồng",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{row.original.crop}</span>
          <span className="text-[11px] text-muted-foreground">
            Giống: {row.original.variety}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "area",
      header: "Diện tích / mật độ",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-semibold">
            {row.original.area.toFixed(2)} ha
          </span>
          <span className="text-[11px] text-muted-foreground">
            {row.original.trees} cây •{" "}
            {Math.round(row.original.trees / row.original.area)} cây/ha
          </span>
        </div>
      ),
    },
    {
      accessorKey: "plantingDate",
      header: "Tuổi vườn",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span>
            Trồng ngày:{" "}
            {new Date(row.original.plantingDate).toLocaleDateString("vi-VN")}
          </span>
          <span className="text-[11px] text-muted-foreground">
            ~{row.original.ageMonth} tháng tuổi
          </span>
        </div>
      ),
    },
    {
      accessorKey: "irrigation",
      header: "Tưới & đất",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs max-w-[180px]">
          <span className="text-[11px] mb-0.5">
            {renderIrrigationLabel(row.original.irrigation)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Đất: {row.original.soilType}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => renderStatusBadge(row.original.status),
    },
    {
      accessorKey: "note",
      header: "Ghi chú",
      cell: ({ row }) => (
        <span className="text-[11px] text-muted-foreground line-clamp-2 max-w-[220px]">
          {row.original.note || "-"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={() => navigate("/main/crop/fields/detail")}
          more={[
            {
              label: "Xem bảng đồ",
              onClick: () => navigate("/main/crop/fields/map"),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Trees className="h-5 w-5 text-emerald-600" />
            Danh mục vườn cây & lô đất
          </h1>
          <p className="text-xs text-muted-foreground">
            Quản lý toàn bộ vườn cây, lô đất, diện tích, cây trồng và trạng thái
            khai thác theo từng trang trại.
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
            onClick={() => navigate("/main/crop/fields/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm vườn / lô mới
          </Button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tổng số lô vườn"
          value={totalPlots.toString()}
          sub="Số lô / ô đang quản lý trong hệ thống"
          icon={<Map className="h-5 w-5 text-emerald-600" />}
        />
        <SummaryCard
          title="Tổng diện tích"
          value={`${totalArea.toFixed(2)} ha`}
          sub="Tổng diện tích tất cả vườn / lô"
          icon={<MapPin className="h-5 w-5 text-sky-600" />}
        />
        <SummaryCard
          title="Diện tích đang khai thác"
          value={`${exploitingArea.toFixed(2)} ha`}
          sub="Vườn đang cho thu hoặc đã vào kinh doanh"
          icon={<Leaf className="h-5 w-5 text-lime-600" />}
        />
        <SummaryCard
          title="Diện tích có hệ thống tưới"
          value={`${irrigatedArea.toFixed(2)} ha`}
          sub="Đã có tưới hoặc một phần có tưới"
          icon={<Sprout className="h-5 w-5 text-amber-600" />}
        />
      </div>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Tìm kiếm & lọc danh mục vườn
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Lọc theo trang trại, loại cây trồng, trạng thái vườn hoặc tìm
                nhanh theo tên / mã lô.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Hàng 1: Search + reset */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-[220px] md:flex-1">
              <Input
                placeholder="Nhập tên trang trại, cây trồng, mã lô..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8"
              />
              <Filter className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start md:self-auto"
              onClick={() => {
                setSearch("");
                setFarmFilter("all");
                setCropFilter("all");
                setStatusFilter("all");
              }}
            >
              Làm mới bộ lọc
            </Button>
          </div>

          {/* Hàng 2: các select */}
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4 items-end">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Trang trại / vườn
              </p>
              <Select
                value={farmFilter}
                onValueChange={(v) => setFarmFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn trang trại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {farmOptions.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Cây trồng chính
              </p>
              <Select
                value={cropFilter}
                onValueChange={(v) => setCropFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn cây trồng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {cropOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Trạng thái vườn
              </p>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as PlotStatus | "all")}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="chuan-bi">Đang chuẩn bị</SelectItem>
                  <SelectItem value="dang-khai-thac">Đang khai thác</SelectItem>
                  <SelectItem value="cai-tao">Cải tạo / tái canh</SelectItem>
                  <SelectItem value="tam-ngung">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ô thông tin nhanh */}
            <div className="hidden lg:flex flex-col justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground mb-0.5">
                Đang hiển thị {filteredPlots.length} / {totalPlots} lô vườn
              </span>
              <span>
                Áp dụng{" "}
                <span className="font-semibold text-foreground">
                  {
                    [
                      farmFilter !== "all",
                      cropFilter !== "all",
                      statusFilter !== "all",
                    ].filter(Boolean).length
                  }
                </span>{" "}
                bộ lọc
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách vườn cây & lô đất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredPlots}
            filterColumn="farmName"
          />
        </CardContent>
      </Card>
    </div>
  );
}

// ====== SUMMARY CARD ======

function SummaryCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
