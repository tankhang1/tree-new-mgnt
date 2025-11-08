"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  TrendingUp,
  Factory,
  LineChartIcon,
  PieChart as PieChartIcon,
  BarChart4,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// =================== TYPES & MOCK DATA ===================
type ReportRecord = {
  id: string;
  month: string;
  farm: string;
  category: string;
  production: number;
  revenue: number;
  cost: number;
  profit: number;
  roi: number;
  trend: "up" | "down" | "stable";
  cause: string;
};

const sampleFarms = ["Trại A", "Trại B", "Trại C", "Trại D"];
const sampleCategories = [
  "Thức ăn",
  "Thuốc thú y",
  "Nhân công",
  "Điện nước",
  "Khác",
];
const sampleCauses = [
  "Giá thức ăn tăng",
  "Giảm bệnh viêm vú",
  "Tăng năng suất sữa",
  "Tăng tỷ lệ đẻ",
  "Giảm nhân công tạm thời",
  "Mưa lớn ảnh hưởng vận chuyển",
  "Thay đổi khẩu phần ăn",
  "Chi phí điện tăng",
  "Cải thiện quy trình vệ sinh",
  "Nâng cấp hệ thống chuồng trại",
];

// Tạo 40 bản ghi mô phỏng
const generateData = (): ReportRecord[] => {
  const data: ReportRecord[] = [];
  const months = ["01/2025", "02/2025", "03/2025", "04/2025", "05/2025"];
  for (let i = 1; i <= 40; i++) {
    const farm = sampleFarms[Math.floor(Math.random() * sampleFarms.length)];
    const month = months[Math.floor(Math.random() * months.length)];
    const category =
      sampleCategories[Math.floor(Math.random() * sampleCategories.length)];
    const production = Math.floor(Math.random() * 5000 + 3000); // 3.000–8.000
    const revenue = Math.floor(production * 1200 + Math.random() * 500_000);
    const cost = Math.floor(revenue * (0.6 + Math.random() * 0.2)); // 60–80% doanh thu
    const profit = revenue - cost;
    const roi = Math.round((profit / cost) * 100);
    const trend: ReportRecord["trend"] =
      roi > 85 ? "up" : roi < 65 ? "down" : "stable";
    const cause = sampleCauses[Math.floor(Math.random() * sampleCauses.length)];

    data.push({
      id: `row-${i}`,
      month,
      farm,
      category,
      production,
      revenue,
      cost,
      profit,
      roi,
      trend,
      cause,
    });
  }
  return data;
};

const rawData = generateData();

// ============== PAGE / MAIN COMPONENT ==============
export default function ReportPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [farmFilter, setFarmFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");

  // Lọc dữ liệu theo trại + search
  const filteredData = React.useMemo(() => {
    return rawData.filter((row) => {
      const matchesFarm = farmFilter === "all" || row.farm === farmFilter;
      const matchesSearch =
        search.trim() === "" ||
        row.farm.toLowerCase().includes(search.toLowerCase()) ||
        row.category.toLowerCase().includes(search.toLowerCase()) ||
        row.cause.toLowerCase().includes(search.toLowerCase());
      return matchesFarm && matchesSearch;
    });
  }, [farmFilter, search]);

  // ======= AGGREGATION FOR CHARTS =======
  const {
    totalRevenue,
    totalCost,
    totalProfit,
    avgRoi,
    monthlyAgg,
    farmAgg,
    categoryCost,
    roiBuckets,
  } = React.useMemo(() => {
    const d = filteredData.length ? filteredData : rawData;

    let totalRevenue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    const monthlyMap = new Map<
      string,
      {
        month: string;
        production: number;
        revenue: number;
        cost: number;
        profit: number;
      }
    >();
    const farmMap = new Map<
      string,
      { farm: string; revenue: number; cost: number; profit: number }
    >();
    const categoryMap = new Map<string, { category: string; cost: number }>();
    const roiList: number[] = [];

    d.forEach((r) => {
      totalRevenue += r.revenue;
      totalCost += r.cost;
      totalProfit += r.profit;
      roiList.push(r.roi);

      // theo tháng
      if (!monthlyMap.has(r.month)) {
        monthlyMap.set(r.month, {
          month: r.month,
          production: 0,
          revenue: 0,
          cost: 0,
          profit: 0,
        });
      }
      const m = monthlyMap.get(r.month)!;
      m.production += r.production;
      m.revenue += r.revenue;
      m.cost += r.cost;
      m.profit += r.profit;

      // theo trại
      if (!farmMap.has(r.farm)) {
        farmMap.set(r.farm, {
          farm: r.farm,
          revenue: 0,
          cost: 0,
          profit: 0,
        });
      }
      const f = farmMap.get(r.farm)!;
      f.revenue += r.revenue;
      f.cost += r.cost;
      f.profit += r.profit;

      // theo danh mục chi phí
      if (!categoryMap.has(r.category)) {
        categoryMap.set(r.category, {
          category: r.category,
          cost: 0,
        });
      }
      const c = categoryMap.get(r.category)!;
      c.cost += r.cost;
    });

    const avgRoi =
      roiList.length > 0
        ? Math.round(roiList.reduce((sum, v) => sum + v, 0) / roiList.length)
        : 0;

    const monthlyAgg = Array.from(monthlyMap.values()).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
    const farmAgg = Array.from(farmMap.values()).map((f) => ({
      ...f,
      roi: f.cost ? Math.round((f.profit / f.cost) * 100) : 0,
    }));
    const categoryCost = Array.from(categoryMap.values());

    // phân bucket ROI
    const roiBuckets = [
      { label: "< 60%", range: [0, 60], count: 0 },
      { label: "60–80%", range: [60, 80], count: 0 },
      { label: "> 80%", range: [80, Infinity], count: 0 },
    ];
    roiList.forEach((v) => {
      const bucket = roiBuckets.find((b) => v >= b.range[0] && v < b.range[1]);
      if (bucket) bucket.count += 1;
    });

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      avgRoi,
      monthlyAgg,
      farmAgg,
      categoryCost,
      roiBuckets,
    };
  }, [filteredData]);

  // ======= TABLE COLUMNS =======
  const columns: ColumnDef<ReportRecord>[] = [
    { accessorKey: "month", header: "Tháng" },
    { accessorKey: "farm", header: "Trại" },
    { accessorKey: "category", header: "Danh mục" },
    {
      accessorKey: "production",
      header: "Sản lượng (kg / lít)",
      cell: ({ getValue }) => (
        <span>{Number(getValue<number>()).toLocaleString("vi-VN")}</span>
      ),
    },
    {
      accessorKey: "revenue",
      header: "Doanh thu (₫)",
      cell: ({ getValue }) => (
        <span className="font-medium text-emerald-700">
          {Number(getValue<number>()).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      accessorKey: "cost",
      header: "Chi phí (₫)",
      cell: ({ getValue }) => (
        <span className="text-red-600">
          {Number(getValue<number>()).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      accessorKey: "profit",
      header: "Lợi nhuận (₫)",
      cell: ({ getValue }) => (
        <span className="text-blue-600 font-semibold">
          {Number(getValue<number>()).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      accessorKey: "roi",
      header: "ROI (%)",
      cell: ({ row }) => {
        const roi = row.getValue<number>("roi");
        return (
          <Badge
            className={`text-xs ${
              roi > 85
                ? "bg-emerald-100 text-emerald-700"
                : roi < 65
                ? "bg-rose-100 text-rose-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {roi}%
          </Badge>
        );
      },
    },
    {
      accessorKey: "trend",
      header: "Xu hướng",
      cell: ({ row }) => {
        const trend = row.original.trend;
        if (trend === "up")
          return (
            <span className="flex items-center gap-1 text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5" /> Tăng
            </span>
          );
        if (trend === "down")
          return (
            <span className="flex items-center gap-1 text-red-600">
              <DollarSign className="h-3.5 w-3.5 rotate-180" /> Giảm
            </span>
          );
        return <span className="text-gray-500">Ổn định</span>;
      },
    },
    {
      accessorKey: "cause",
      header: "Nguyên nhân / Ghi chú",
      cell: ({ getValue }) => (
        <span className="line-clamp-2 text-muted-foreground text-xs">
          {getValue<string>()}
        </span>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // màu cho Pie
  const pieColors = ["#22c55e", "#3b82f6", "#f97316", "#eab308", "#a855f7"];

  return (
    <div className="flex flex-col gap-5">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Factory className="h-5 w-5 text-primary" />
            Báo cáo sản lượng & chi phí chăn nuôi
          </h1>
          <p className="text-xs text-muted-foreground">
            Theo dõi chi tiết sản lượng, doanh thu, chi phí, lợi nhuận và ROI
            theo từng trại, từng tháng và từng khoản mục.
          </p>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tổng doanh thu"
          value={`${totalRevenue.toLocaleString("vi-VN")} ₫`}
          sub="Từ toàn bộ sản phẩm chăn nuôi"
          icon={<LineChartIcon className="h-4 w-4 text-emerald-600" />}
          color="text-emerald-700"
        />
        <SummaryCard
          title="Tổng chi phí"
          value={`${totalCost.toLocaleString("vi-VN")} ₫`}
          sub="Thức ăn, thú y, nhân công, điện nước..."
          icon={<BarChart4 className="h-4 w-4 text-red-600" />}
          color="text-red-700"
        />
        <SummaryCard
          title="Tổng lợi nhuận"
          value={`${totalProfit.toLocaleString("vi-VN")} ₫`}
          sub="Sau khi trừ toàn bộ chi phí"
          icon={<DollarSign className="h-4 w-4 text-blue-600" />}
          color="text-blue-700"
        />
        <SummaryCard
          title="ROI trung bình"
          value={`${avgRoi}%`}
          sub="Hiệu quả sử dụng chi phí"
          icon={<PieChartIcon className="h-4 w-4 text-amber-500" />}
          color={
            avgRoi > 85
              ? "text-emerald-700"
              : avgRoi < 65
              ? "text-red-700"
              : "text-amber-700"
          }
        />
      </div>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc dữ liệu báo cáo
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 text-xs">
          <Input
            placeholder="Tìm theo trại, danh mục, nguyên nhân..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 h-8 text-xs"
          />
          <Select value={farmFilter} onValueChange={setFarmFilter}>
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue placeholder="Lọc theo trại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trại</SelectItem>
              {sampleFarms.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setFarmFilter("all");
              setSearch("");
            }}
          >
            Làm mới
          </Button>
          <span className="text-muted-foreground">
            Đang hiển thị{" "}
            <span className="font-semibold text-foreground">
              {filteredData.length}
            </span>{" "}
            bản ghi
          </span>
        </CardContent>
      </Card>

      {/* ==== HÀNG 1: DOANH THU – CHI PHÍ – LỢI NHUẬN ==== */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Linechart: Doanh thu – Chi phí – Lợi nhuận */}
        <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
              Doanh thu – Chi phí – Lợi nhuận theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAgg}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    (v / 1_000_000).toFixed(0).toString() + "tr"
                  }
                />
                <Tooltip
                  formatter={(v: number, n) => [
                    `${v.toLocaleString("vi-VN")} ₫`,
                    n,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  name="Chi phí"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Lợi nhuận"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Barchart: Lợi nhuận & ROI theo trại */}
        <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Lợi nhuận & ROI theo từng trại
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={farmAgg} margin={{ left: 24, right: 16 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.4}
                />
                <XAxis
                  dataKey="farm"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) =>
                    (v / 1_000_000).toFixed(0).toString() + "tr"
                  }
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                  domain={[0, 200]}
                />
                <Tooltip
                  formatter={(value: any, name) =>
                    name === "ROI"
                      ? [`${value}%`, "ROI"]
                      : [`${Number(value).toLocaleString("vi-VN")} ₫`, name]
                  }
                />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Bar
                  yAxisId="left"
                  dataKey="profit"
                  name="Lợi nhuận"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="roi"
                  name="ROI (%)"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ==== HÀNG 2: CƠ CẤU CHI PHÍ – PHÂN BỐ ROI ==== */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Piechart: Cơ cấu chi phí */}
        <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Cơ cấu chi phí theo danh mục
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-[260px] items-center gap-4">
            <div className="h-full flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    formatter={(v: number) => v.toLocaleString("vi-VN") + " ₫"}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{ fontSize: 11 }}
                    iconType="circle"
                  />
                  <Pie
                    data={categoryCost}
                    dataKey="cost"
                    nameKey="category"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={3}
                    label={(props) =>
                      `${props.name}: ${((props.percent || 0) * 100).toFixed(
                        0
                      )}%`
                    }
                  >
                    {categoryCost.map((entry, idx) => (
                      <Cell
                        key={entry.category}
                        fill={pieColors[idx % pieColors.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bảng chi tiết */}
            <div className="w-44 space-y-2 text-xs">
              {categoryCost.map((c, idx) => (
                <div
                  key={c.category}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: pieColors[idx % pieColors.length],
                      }}
                    />
                    <span className="text-muted-foreground">{c.category}</span>
                  </div>
                  <span className="font-semibold">
                    {c.cost.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Barchart: Phân bố ROI */}
        <Card className="shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Phân bố ROI theo mức hiệu quả
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiBuckets} barCategoryGap={24}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.4}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => `${v} bản ghi`} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
                <Bar dataKey="count" name="Số bản ghi" radius={[6, 6, 0, 0]}>
                  {roiBuckets.map((b, idx) => (
                    <Cell
                      key={b.label}
                      fill={
                        idx === 0
                          ? "#ef4444"
                          : idx === 1
                          ? "#facc15"
                          : "#22c55e"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* TABLE DETAIL */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bảng chi tiết sản lượng & chi phí
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border bg-card shadow-sm">
            <Table className="text-xs min-w-[900px]">
              <TableHeader className="bg-muted/40">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="cursor-pointer select-none whitespace-nowrap"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " ↑",
                          desc: " ↓",
                        }[header.column.getIsSorted() as string] ?? ""}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Tổng cộng{" "}
              <span className="font-semibold text-foreground">
                {filteredData.length}
              </span>{" "}
              bản ghi
            </span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                ← Trước
              </Button>
              <span>
                Trang{" "}
                <span className="font-semibold text-foreground">
                  {table.getState().pagination.pageIndex + 1}
                </span>{" "}
                / {table.getPageCount() || 1}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Sau →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============== SMALL SUMMARY CARD ==============
function SummaryCard({
  title,
  value,
  sub,
  icon,
  color,
}: {
  title: string;
  value: string;
  sub: string;
  icon?: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2 flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <CardTitle className="text-xs font-semibold text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`text-lg font-bold ${color}`}>{value}</div>
        </div>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
