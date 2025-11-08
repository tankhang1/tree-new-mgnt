"use client";

import React, { useMemo, useState } from "react";
import {
  Leaf,
  Filter,
  Sprout,
  Coins,
  TrendingUp,
  Tractor,
  Droplets,
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

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";

/* =============== TYPES =============== */

type RiskLevel = "thap" | "trung-binh" | "cao";

type PlotReportRow = {
  id: string;
  region: string; // Vùng
  areaCode: string; // Mã lô
  areaName: string; // Vùng / lô
  crop: string;
  season: string; // Vụ
  stage: string; // Giai đoạn sinh trưởng

  actualYield: number; // tấn/ha thực tế
  expectedYield: number; // tấn/ha kế hoạch
  forecastNextSeason: number; // tấn/ha dự kiến vụ tới

  totalCost: number; // triệu / ha
  costPerTon: number; // triệu / tấn
  revenue: number; // triệu / ha
  profit: number; // triệu / ha
  roi: number; // lợi nhuận / chi phí

  risk: RiskLevel;
  note?: string;
};

/* =============== MOCK BIỂU ĐỒ =============== */

const yieldChartData = [
  { name: "Vùng A", actual: 12.5, expected: 13.8 },
  { name: "Vùng B", actual: 9.8, expected: 9.5 },
  { name: "Vùng C", actual: 16.2, expected: 15.0 },
  { name: "Vùng D", actual: 7.1, expected: 8.0 },
];

const costPieData = [
  { name: "Phân bón", value: 32 },
  { name: "Thuốc BVTV", value: 15 },
  { name: "Nhân công", value: 27 },
  { name: "Tưới tiêu", value: 10 },
  { name: "Thu hoạch", value: 8 },
];
const profitTrendData = [
  { month: "T7", profit: 95, cost: 68 },
  { month: "T8", profit: 103, cost: 72 },
  { month: "T9", profit: 110, cost: 76 },
  { month: "T10", profit: 115, cost: 79 },
  { month: "T11", profit: 123, cost: 81 },
];
const roiData = [
  { region: "Vùng A", roi: 1.35 },
  { region: "Vùng B", roi: 1.12 },
  { region: "Vùng C", roi: 1.42 },
  { region: "Vùng D", roi: 0.95 },
];
const COLORS = ["#0ea5e9", "#22c55e", "#facc15", "#f97316", "#ef4444"];

/* =============== MOCK DATA TABLE (NHIỀU DÒNG & CÓ DỰ BÁO) =============== */

const plotReportData: PlotReportRow[] = [
  {
    id: "1",
    region: "Vùng A",
    areaCode: "A1-01",
    areaName: "Vùng A - Lô A1-01",
    crop: "Bắp lai DK9955",
    season: "Vụ Đông Xuân 2025",
    stage: "Chuẩn bị thu hoạch",
    actualYield: 12.5,
    expectedYield: 13.0,
    forecastNextSeason: 13.8,
    totalCost: 32,
    costPerTon: 2.56,
    revenue: 75,
    profit: 43,
    roi: 1.34,
    risk: "thap",
    note: "Năng suất ổn định, có thể tăng thêm nếu tối ưu bón thúc lần 2.",
  },
  {
    id: "2",
    region: "Vùng A",
    areaCode: "A1-02",
    areaName: "Vùng A - Lô A1-02",
    crop: "Đậu nành DT26",
    season: "Vụ Đông Xuân 2025",
    stage: "Ra hoa – đậu quả",
    actualYield: 8.2,
    expectedYield: 8.0,
    forecastNextSeason: 8.7,
    totalCost: 25,
    costPerTon: 3.05,
    revenue: 48,
    profit: 23,
    roi: 0.92,
    risk: "trung-binh",
    note: "Khá nhạy cảm với mưa cuối vụ, cần chú ý bệnh đốm lá.",
  },
  {
    id: "3",
    region: "Vùng B",
    areaCode: "B1-01",
    areaName: "Vùng B - Lô B1-01",
    crop: "Bắp lai DK9955",
    season: "Vụ Hè Thu 2025",
    stage: "Làm đòng – trổ cờ",
    actualYield: 9.5,
    expectedYield: 10.2,
    forecastNextSeason: 10.8,
    totalCost: 28,
    costPerTon: 2.95,
    revenue: 57,
    profit: 29,
    roi: 1.04,
    risk: "trung-binh",
    note: "Vùng có địa hình thấp, nguy cơ úng cục bộ khi mưa lớn.",
  },
  {
    id: "4",
    region: "Vùng C",
    areaCode: "C1-01",
    areaName: "Vùng C - Lô C1-01",
    crop: "Lúa OM5451",
    season: "Vụ Đông Xuân 2025",
    stage: "Sau thu hoạch",
    actualYield: 16.0,
    expectedYield: 15.5,
    forecastNextSeason: 16.5,
    totalCost: 40,
    costPerTon: 2.5,
    revenue: 92,
    profit: 52,
    roi: 1.3,
    risk: "thap",
    note: "Quản lý nước tốt, ít sâu bệnh. Tiềm năng giữ ổn định.",
  },
  {
    id: "5",
    region: "Vùng D",
    areaCode: "D2-01",
    areaName: "Vùng D - Lô D2-01",
    crop: "Rau ăn lá (rau muống)",
    season: "Vụ quanh năm 2025",
    stage: "Thu hoạch lần 3",
    actualYield: 6.0,
    expectedYield: 7.0,
    forecastNextSeason: 6.8,
    totalCost: 18,
    costPerTon: 3.0,
    revenue: 32,
    profit: 14,
    roi: 0.78,
    risk: "cao",
    note: "Biến động giá thị trường cao, chi phí nhân công lớn.",
  },
  // thêm một số dòng cho “vài chục” record
  {
    id: "6",
    region: "Vùng A",
    areaCode: "A2-01",
    areaName: "Vùng A - Lô A2-01",
    crop: "Bắp lai DK999",
    season: "Vụ Hè Thu 2025",
    stage: "Sinh trưởng thân lá",
    actualYield: 0,
    expectedYield: 11.5,
    forecastNextSeason: 12.0,
    totalCost: 21,
    costPerTon: 0,
    revenue: 0,
    profit: -21,
    roi: -1.0,
    risk: "trung-binh",
    note: "Đang trong vụ, chưa có sản lượng thực tế.",
  },
  {
    id: "7",
    region: "Vùng B",
    areaCode: "B2-02",
    areaName: "Vùng B - Lô B2-02",
    crop: "Đậu nành DT26",
    season: "Vụ Thu Đông 2024",
    stage: "Sau thu hoạch",
    actualYield: 7.8,
    expectedYield: 7.5,
    forecastNextSeason: 8.1,
    totalCost: 23,
    costPerTon: 2.95,
    revenue: 44,
    profit: 21,
    roi: 0.91,
    risk: "thap",
  },
  {
    id: "8",
    region: "Vùng C",
    areaCode: "C2-03",
    areaName: "Vùng C - Lô C2-03",
    crop: "Lúa OM18",
    season: "Vụ Hè Thu 2024",
    stage: "Sau thu hoạch",
    actualYield: 14.8,
    expectedYield: 15.0,
    forecastNextSeason: 15.2,
    totalCost: 38,
    costPerTon: 2.57,
    revenue: 84,
    profit: 46,
    roi: 1.21,
    risk: "trung-binh",
  },
  {
    id: "9",
    region: "Vùng D",
    areaCode: "D1-01",
    areaName: "Vùng D - Lô D1-01",
    crop: "Rau cải",
    season: "Vụ Đông 2024",
    stage: "Sau thu hoạch",
    actualYield: 5.5,
    expectedYield: 6.2,
    forecastNextSeason: 6.0,
    totalCost: 17,
    costPerTon: 3.09,
    revenue: 29,
    profit: 12,
    roi: 0.71,
    risk: "cao",
    note: "Thời tiết lạnh kéo dài, sâu bệnh lá nhiều.",
  },
  {
    id: "10",
    region: "Vùng A",
    areaCode: "A3-01",
    areaName: "Vùng A - Lô A3-01",
    crop: "Bắp lai DK9955",
    season: "Vụ Đông Xuân 2024",
    stage: "Sau thu hoạch",
    actualYield: 11.8,
    expectedYield: 12.0,
    forecastNextSeason: 12.6,
    totalCost: 30,
    costPerTon: 2.54,
    revenue: 70,
    profit: 40,
    roi: 1.33,
    risk: "thap",
  },
];

/* =============== CỘT DATATABLE =============== */

const columns: ColumnDef<PlotReportRow>[] = [
  {
    accessorKey: "areaName",
    header: "Vùng / Lô",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-semibold">{row.original.areaName}</span>
        <span className="text-[11px] text-muted-foreground">
          {row.original.region} • Mã lô:{" "}
          <span className="font-mono">{row.original.areaCode}</span>
        </span>
      </div>
    ),
  },
  {
    accessorKey: "crop",
    header: "Cây trồng & vụ",
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="font-medium">{row.original.crop}</span>
        <span className="text-[11px] text-muted-foreground">
          {row.original.season}
        </span>
        <span className="text-[11px] text-muted-foreground">
          Giai đoạn: {row.original.stage}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "actualYield",
    header: "Sản lượng (tấn/ha)",
    cell: ({ row }) => {
      const a = row.original.actualYield;
      const e = row.original.expectedYield;
      const diff = a && e ? a - e : 0;
      const diffPct = a && e ? ((a - e) / e) * 100 : 0;

      return (
        <div className="text-right text-xs">
          <div className="font-semibold">{a.toFixed(2)}</div>
          <div className="text-[11px] text-muted-foreground">
            KH: {e.toFixed(2)}{" "}
            <span
              className={
                diff > 0
                  ? "text-emerald-600"
                  : diff < 0
                  ? "text-red-600"
                  : "text-muted-foreground"
              }
            >
              ({diff >= 0 ? "+" : ""}
              {diff.toFixed(2)} / {diffPct >= 0 ? "+" : ""}
              {diffPct.toFixed(1)}%)
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "forecastNextSeason",
    header: "Dự kiến vụ tới",
    cell: ({ row }) => (
      <div className="text-right text-xs">
        <div className="font-semibold">
          {row.original.forecastNextSeason.toFixed(2)} tấn/ha
        </div>
        <div className="text-[11px] text-muted-foreground">
          Mô hình dự báo nội bộ
        </div>
      </div>
    ),
  },
  {
    accessorKey: "totalCost",
    header: "Chi phí & hiệu quả",
    cell: ({ row }) => {
      const d = row.original;
      return (
        <div className="text-right text-xs">
          <div>
            {d.totalCost.toFixed(1)} triệu/ha{" "}
            <span className="text-[11px] text-muted-foreground">
              ({d.costPerTon.toFixed(2)} triệu/tấn)
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            LN:{" "}
            <span className="font-semibold text-foreground">
              {d.profit.toFixed(1)} triệu/ha
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "roi",
    header: "ROI & rủi ro",
    cell: ({ row }) => {
      const d = row.original;
      return (
        <div className="flex flex-col items-end gap-1 text-xs">
          <Badge
            variant="outline"
            className={
              d.roi > 1.3
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : d.roi >= 1
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-red-200 bg-red-50 text-red-700"
            }
          >
            ROI: {d.roi.toFixed(2)}x
          </Badge>
          <RiskBadge risk={d.risk} />
        </div>
      );
    },
  },
  {
    accessorKey: "note",
    header: "Ghi chú & khuyến nghị",
    cell: ({ row }) => (
      <p className="max-w-[260px] text-[11px] text-muted-foreground line-clamp-2">
        {row.original.note || "-"}
      </p>
    ),
  },
];

/* =============== PAGE =============== */

export default function ReportsPage() {
  const [season, setSeason] = useState("2025-Q4");
  const [region, setRegion] = useState<"all" | string>("all");
  const [crop, setCrop] = useState<"all" | string>("all");
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    return plotReportData.filter((r) => {
      if (region !== "all" && r.region !== region) return false;
      if (crop !== "all" && !r.crop.toLowerCase().includes(crop.toLowerCase()))
        return false;

      if (search.trim()) {
        const text = search.toLowerCase();
        const haystack = (
          r.areaName +
          r.areaCode +
          r.crop +
          r.season +
          r.region
        ).toLowerCase();
        if (!haystack.includes(text)) return false;
      }

      return true;
    });
  }, [region, crop, search]);

  const totalActivities = plotReportData.length;

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Leaf className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Báo cáo sản lượng & chi phí chi tiết
            </h1>
            <p className="text-xs text-muted-foreground">
              Phân tích hiệu quả từng vùng / lô theo sản lượng, chi phí, lợi
              nhuận và dự báo vụ tới cho sản xuất nông nghiệp.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end text-xs text-muted-foreground">
          <span>Tổng số lô báo cáo: {totalActivities}</span>
          <span>Mùa vụ hiện tại: {season}</span>
        </div>
      </header>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bộ lọc & tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5 text-xs">
          <FilterItem label="Mùa vụ tổng hợp">
            <Select value={season} onValueChange={setSeason}>
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn mùa vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-Q4">Vụ Đông Xuân 2025</SelectItem>
                <SelectItem value="2025-Q3">Vụ Hè Thu 2025</SelectItem>
                <SelectItem value="2025-Q2">Vụ Đông Xuân 2024</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="Vùng / khu sản xuất">
            <Select
              value={region}
              onValueChange={(v) => setRegion(v as "all" | string)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn vùng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Vùng A">Vùng A</SelectItem>
                <SelectItem value="Vùng B">Vùng B</SelectItem>
                <SelectItem value="Vùng C">Vùng C</SelectItem>
                <SelectItem value="Vùng D">Vùng D</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="Cây trồng chính">
            <Select
              value={crop}
              onValueChange={(v) => setCrop(v as "all" | string)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn cây" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="bắp">Bắp</SelectItem>
                <SelectItem value="đậu nành">Đậu nành</SelectItem>
                <SelectItem value="lúa">Lúa</SelectItem>
                <SelectItem value="rau">Rau màu</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="Tìm kiếm nhanh">
            <Input
              className="h-8"
              placeholder="Nhập mã lô / vùng / cây trồng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FilterItem>

          <div className="flex items-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                setSeason("2025-Q4");
                setRegion("all");
                setCrop("all");
                setSearch("");
              }}
            >
              <Filter className="mr-1 h-4 w-4" />
              Làm mới bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI SUMMARY */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Sprout className="h-4 w-4 text-green-600" />}
          label="Sản lượng trung bình"
          value="12.8 tấn/ha"
          trend="+5.4%"
          color="green"
          desc="So với vụ trước tăng 5%"
        />
        <SummaryCard
          icon={<Coins className="h-4 w-4 text-yellow-500" />}
          label="Chi phí trung bình"
          value="26.8 triệu/ha"
          trend="+1.2%"
          color="yellow"
          desc="Chi phí tăng nhẹ do nhân công"
        />
        <SummaryCard
          icon={<TrendingUp className="h-4 w-4 text-emerald-600" />}
          label="Lợi nhuận ròng"
          value="38.5 triệu/ha"
          trend="+7.1%"
          color="emerald"
          desc="Doanh thu tăng ở vùng C và D"
        />
        <SummaryCard
          icon={<Tractor className="h-4 w-4 text-sky-600" />}
          label="Hiệu suất trung bình"
          value="1.44x ROI"
          trend="↑"
          color="sky"
          desc="Hiệu suất sinh lời ổn định"
        />
      </div>

      {/* CHARTS */}
      <div className="grid gap-4 md:grid-cols-2 auto-rows-[minmax(0,1fr)]">
        {/* Sản lượng: Thực tế – Kế hoạch – Dự báo */}
        <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <Sprout className="h-4 w-4 text-green-600" />
              Sản lượng thực tế – kế hoạch – dự báo
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yieldChartData} barCategoryGap={16}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  unit=" tấn/ha"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: number) => `${val.toFixed(2)} tấn/ha`}
                  labelFormatter={(label) => `Vùng ${label}`}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  verticalAlign="bottom"
                  height={24}
                />
                <Bar
                  dataKey="expected"
                  fill="#e5e7eb"
                  name="Kế hoạch"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="actual"
                  fill="#16a34a"
                  name="Thực tế"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="next"
                  fill="#60a5fa"
                  name="Dự báo vụ tới"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cơ cấu chi phí bình quân (%) */}
        <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <Coins className="h-4 w-4 text-yellow-500" />
              Cơ cấu chi phí bình quân (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={85}
                  labelLine={false}
                  label={(props) => {
                    const { name, percent } = props as {
                      name: string;
                      percent: number;
                    };
                    return `${name} ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {costPieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number, _name, { name }) => [
                    `${val.toFixed(1)} triệu/ha`,
                    name as string,
                  ]}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biểu đồ lợi nhuận theo tháng */}
        <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Biểu đồ lợi nhuận theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  unit=" triệu"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: number, key) => [
                    `${val.toFixed(1)} triệu`,
                    key === "profit" ? "Lợi nhuận" : "Chi phí",
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  verticalAlign="bottom"
                  height={24}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#16a34a"
                  name="Lợi nhuận"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#facc15"
                  name="Chi phí"
                  strokeDasharray="4 2"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Hiệu suất ROI trung bình theo vùng */}
        <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              <Droplets className="h-4 w-4 text-indigo-600" />
              Hiệu suất ROI trung bình theo vùng
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData} barCategoryGap={24}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis
                  dataKey="region"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis domain={[0, 1.6]} tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: number) => `${val.toFixed(2)}x`}
                  labelFormatter={(label) => `Khu vực ${label}`}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11 }}
                  iconType="circle"
                  verticalAlign="bottom"
                  height={24}
                />
                <Bar dataKey="roi" name="Hiệu suất ROI (x)">
                  {roiData.map((d, idx) => (
                    <Cell
                      key={idx}
                      radius={[6, 6, 0, 0]}
                      fill={
                        d.roi >= 1.3
                          ? "#16a34a" // ROI tốt
                          : d.roi >= 1
                          ? "#facc15" // Trung bình
                          : "#ef4444" // Thấp / lỗ
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* DATATABLE CHI TIẾT */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
            <Droplets className="h-4 w-4 text-sky-600" />
            Chi tiết sản lượng, chi phí & dự báo theo từng lô
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredRows}
            filterColumn="areaName"
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* =============== SUB COMPONENTS =============== */

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
  icon,
  label,
  value,
  trend,
  desc,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  desc: string;
  color: string;
}) {
  const gradientMap: Record<string, string> = {
    green: "from-green-50 to-green-100",
    yellow: "from-yellow-50 to-yellow-100",
    emerald: "from-emerald-50 to-emerald-100",
    sky: "from-sky-50 to-sky-100",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${gradientMap[color]} border-none shadow-sm`}
    >
      <CardContent className="flex items-center gap-3 p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-inner">
          {icon}
        </div>
        <div className="flex flex-col">
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <p className="text-base font-semibold">{value}</p>
          <p className="text-[11px] text-muted-foreground">{desc}</p>
        </div>
        <div className="ml-auto text-[11px] font-medium text-emerald-600">
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  if (risk === "thap") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px]">
        Rủi ro thấp
      </Badge>
    );
  }
  if (risk === "trung-binh") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
        Rủi ro trung bình
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-50 text-red-700 border border-red-200 text-[10px]">
      Rủi ro cao
    </Badge>
  );
}
