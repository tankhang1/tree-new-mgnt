"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Filter, TrendingUp, TrendingDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { type ColumnDef } from "@tanstack/react-table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
} from "recharts";

type DebtRecord = {
  partner: string;
  type: "Khách hàng" | "Nhà cung cấp";
  opening: number;
  receivable: number;
  payable: number;
  paid: number;
  closing: number;
};

const debtsData: DebtRecord[] = [
  {
    partner: "Công ty Nông sản Xanh",
    type: "Khách hàng",
    opening: 0,
    receivable: 155_000_000,
    payable: 0,
    paid: 97_000_000,
    closing: 58_000_000,
  },
  {
    partner: "Công ty phân bón Miền Tây",
    type: "Nhà cung cấp",
    opening: 50_000_000,
    receivable: 0,
    payable: 250_000_000,
    paid: 200_000_000,
    closing: 100_000_000,
  },
  {
    partner: "Trang trại Liên kết Hoàng Gia",
    type: "Khách hàng",
    opening: 100_000_000,
    receivable: 60_000_000,
    payable: 0,
    paid: 80_000_000,
    closing: 80_000_000,
  },
  {
    partner: "Nhà cung cấp thuốc BVTV Xanh",
    type: "Nhà cung cấp",
    opening: 0,
    receivable: 0,
    payable: 85_000_000,
    paid: 0,
    closing: 85_000_000,
  },
];

const chartMonthlyNet = [
  { month: "T7/2025", customer: 650, supplier: 540 },
  { month: "T8/2025", customer: 700, supplier: 580 },
  { month: "T9/2025", customer: 780, supplier: 620 },
  { month: "T10/2025", customer: 820, supplier: 690 },
  { month: "T11/2025", customer: 910, supplier: 850 },
  { month: "T12/2025", customer: 720, supplier: 660 },
];

const chartTopPartners = debtsData
  .map((d) => ({
    partner: d.partner,
    closing: Math.round(d.closing / 1_000_000),
    type: d.type,
  }))
  .sort((a, b) => b.closing - a.closing);

const chartAging = [
  { bucket: "0-30 ngày", value: 40 },
  { bucket: "31-60 ngày", value: 30 },
  { bucket: "61-90 ngày", value: 20 },
  { bucket: "> 90 ngày", value: 10 },
];

const chartPerformance = [
  { month: "T8/2025", onTime: 72, late: 28 },
  { month: "T9/2025", onTime: 68, late: 32 },
  { month: "T10/2025", onTime: 75, late: 25 },
  { month: "T11/2025", onTime: 80, late: 20 },
  { month: "T12/2025", onTime: 77, late: 23 },
];

const chartFlow = [
  { stage: "Dư đầu kỳ", value: 300 },
  { stage: "Phát sinh phải thu", value: 210 },
  { stage: "Phát sinh phải trả", value: -160 },
  { stage: "Thanh toán", value: -115 },
  { stage: "Dư cuối kỳ", value: 235 },
];

const pieByType = [
  {
    type: "Khách hàng (Phải thu)",
    value: debtsData
      .filter((d) => d.type === "Khách hàng")
      .reduce((s, d) => s + d.closing, 0),
  },
  {
    type: "Nhà cung cấp (Phải trả)",
    value: debtsData
      .filter((d) => d.type === "Nhà cung cấp")
      .reduce((s, d) => s + d.closing, 0),
  },
];

const pieColors = ["#16a34a", "#dc2626"];

export default function DebtsReportPage() {
  const [period, setPeriod] = useState("T11/2025");
  const [type, setType] = useState("all");

  const filteredData = useMemo(() => {
    if (type === "all") return debtsData;
    return debtsData.filter((d) =>
      type === "customer" ? d.type === "Khách hàng" : d.type === "Nhà cung cấp"
    );
  }, [type]);

  const columns: ColumnDef<DebtRecord>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Chọn dòng"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "partner", header: "Đối tác" },
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => (
        <Badge
          className={
            row.original.type === "Khách hàng"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-blue-100 text-blue-700"
          }
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "opening",
      header: "Dư đầu kỳ",
      cell: ({ row }) => (
        <span>{row.getValue<number>("opening").toLocaleString("vi-VN")} đ</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "receivable",
      header: "Phát sinh phải thu",
      cell: ({ row }) => (
        <span>
          {row.getValue<number>("receivable").toLocaleString("vi-VN")} đ
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "payable",
      header: "Phát sinh phải trả",
      cell: ({ row }) => (
        <span>{row.getValue<number>("payable").toLocaleString("vi-VN")} đ</span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "paid",
      header: "Đã thanh toán",
      cell: ({ row }) => (
        <span>{row.getValue<number>("paid").toLocaleString("vi-VN")} đ</span>
      ),
    },
    {
      accessorKey: "closing",
      header: "Dư cuối kỳ",
      cell: ({ row }) => {
        const value = row.getValue<number>("closing");
        const color =
          row.original.type === "Khách hàng"
            ? "text-emerald-600"
            : "text-red-600";
        return (
          <span className={`font-semibold ${color}`}>
            {value.toLocaleString("vi-VN")} đ
          </span>
        );
      },
      enableSorting: true,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Báo cáo công nợ tổng hợp
          </h1>
          <p className="text-sm text-muted-foreground">
            Tổng hợp công nợ phải thu và phải trả theo kỳ, giúp kế toán theo dõi
            nhanh tình hình tài chính và rủi ro công nợ.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Xuất Excel
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tổng công nợ phải thu"
          value="215,000,000 đ"
          color="text-emerald-600"
          desc="Tổng dư nợ từ khách hàng"
          icon={<TrendingUp className="text-emerald-600 h-5 w-5" />}
        />
        <SummaryCard
          title="Tổng công nợ phải trả"
          value="435,000,000 đ"
          color="text-red-600"
          desc="Tổng dư nợ với nhà cung cấp"
          icon={<TrendingDown className="text-red-600 h-5 w-5" />}
        />
        <SummaryCard
          title="Đã thanh toán trong kỳ"
          value="280,000,000 đ"
          color="text-blue-600"
          desc="Tổng số tiền đã chi và thu"
        />
        <SummaryCard
          title="Dư nợ cuối kỳ"
          value="315,000,000 đ"
          color="text-amber-600"
          desc="Cần theo dõi cho kỳ tiếp theo"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 1️⃣ Xu hướng công nợ */}
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Xu hướng công nợ phải thu / phải trả theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartMonthlyNet}>
                <defs>
                  <linearGradient
                    id="colorCustomer"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient
                    id="colorSupplier"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v: number) => `${v} triệu đ`}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Legend iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="customer"
                  name="Phải thu (Khách hàng)"
                  stroke="#16a34a"
                  fill="url(#colorCustomer)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="supplier"
                  name="Phải trả (Nhà cung cấp)"
                  stroke="#dc2626"
                  fill="url(#colorSupplier)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 2️⃣ Top đối tác */}
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Top đối tác theo dư nợ cuối kỳ (triệu đồng)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartTopPartners}
                layout="vertical"
                margin={{ left: 120, right: 16, top: 16, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#e5e7eb"
                />
                <XAxis type="number" />
                <YAxis
                  dataKey="partner"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(v: number) => `${v} triệu đ`}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Bar dataKey="closing" name="Dư cuối kỳ" radius={[4, 4, 4, 4]}>
                  {chartTopPartners.map((entry) => (
                    <Cell
                      key={entry.partner}
                      fill={entry.type === "Khách hàng" ? "#16a34a" : "#dc2626"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3️⃣ Pie + Aging */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cơ cấu công nợ */}
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Cơ cấu công nợ theo loại đối tác
            </CardTitle>
          </CardHeader>
          <CardContent className="flex h-[280px] items-center gap-6">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(v: number) => `${v.toLocaleString("vi-VN")} đ`}
                />
                <Pie
                  data={pieByType}
                  dataKey="value"
                  nameKey="type"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  label={({ percent }) =>
                    `${((percent as number) * 100).toFixed(0)}%`
                  }
                >
                  {pieByType.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 text-xs">
              {pieByType.map((p, idx) => (
                <div
                  key={p.type}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: pieColors[idx] }}
                    />
                    <span className="text-muted-foreground">{p.type}</span>
                  </div>
                  <span className="font-semibold">
                    {p.value.toLocaleString("vi-VN")} đ
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Phân bố tuổi nợ */}
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Phân bố tuổi công nợ (Aging)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartAging}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis dataKey="bucket" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartAging.map((b, i) => (
                    <Cell
                      key={b.bucket}
                      fill={["#86efac", "#a5b4fc", "#fcd34d", "#fca5a5"][i]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4️⃣ Tỷ lệ thanh toán + Waterfall */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* LineChart */}
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Tỷ lệ thanh toán đúng hạn theo tháng
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="onTime"
                  name="Đúng hạn"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="late"
                  name="Trễ hạn"
                  stroke="#dc2626"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Waterfall */}
        <Card className="shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Dòng biến động công nợ trong kỳ
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip formatter={(v: number) => `${v} triệu đ`} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartFlow.map((f) => (
                    <Cell
                      key={f.stage}
                      fill={
                        f.stage.includes("Dư")
                          ? "#0ea5e9"
                          : f.value >= 0
                          ? "#16a34a"
                          : "#dc2626"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Tìm theo đối tác..." className="h-9 pr-10" />
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Kỳ báo cáo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="T10/2025">Tháng 10/2025</SelectItem>
            <SelectItem value="T11/2025">Tháng 11/2025</SelectItem>
            <SelectItem value="T12/2025">Tháng 12/2025</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-9 w-[200px]">
            <SelectValue placeholder="Loại công nợ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="customer">Khách hàng (Phải thu)</SelectItem>
            <SelectItem value="supplier">Nhà cung cấp (Phải trả)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="mb-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Chi tiết công nợ tổng hợp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            filterColumn="partner"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  color,
  desc,
  icon,
}: {
  title: string;
  value: string;
  color: string;
  desc: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}
