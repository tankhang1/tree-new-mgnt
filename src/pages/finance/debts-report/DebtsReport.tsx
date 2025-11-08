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
    receivable: 155000000,
    payable: 0,
    paid: 97000000,
    closing: 58000000,
  },
  {
    partner: "Công ty phân bón Miền Tây",
    type: "Nhà cung cấp",
    opening: 50000000,
    receivable: 0,
    payable: 250000000,
    paid: 200000000,
    closing: 100000000,
  },
  {
    partner: "Trang trại Liên kết Hoàng Gia",
    type: "Khách hàng",
    opening: 100000000,
    receivable: 60000000,
    payable: 0,
    paid: 80000000,
    closing: 80000000,
  },
  {
    partner: "Nhà cung cấp thuốc BVTV Xanh",
    type: "Nhà cung cấp",
    opening: 0,
    receivable: 0,
    payable: 85000000,
    paid: 0,
    closing: 85000000,
  },
];

const chartData = [
  { name: "T10/2025", phaiThu: 820, phaiTra: 690 },
  { name: "T11/2025", phaiThu: 910, phaiTra: 850 },
  { name: "T12/2025", phaiThu: 720, phaiTra: 660 },
];

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
            nhanh tình hình tài chính.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Xuất Excel
        </Button>
      </div>

      {/* Summary cards */}
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
          desc="Theo dõi cho kỳ tiếp theo"
        />
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Biểu đồ công nợ theo tháng
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(v: number) => `${v} triệu đ`} />
              <Legend />
              <Bar
                dataKey="phaiThu"
                fill="#16a34a"
                name="Phải thu"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="phaiTra"
                fill="#dc2626"
                name="Phải trả"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Filters */}
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
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Loại công nợ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="customer">Khách hàng (Phải thu)</SelectItem>
            <SelectItem value="supplier">Nhà cung cấp (Phải trả)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
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
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}
