"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";

type Receivable = {
  id: string;
  code: string;
  customer: string;
  docDate: string;
  dueDate: string;
  amount: number;
  status: "unpaid" | "overdue" | "partial" | "paid";
};

const columns: ColumnDef<Receivable>[] = [
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
  {
    accessorKey: "code",
    header: "Số chứng từ",
  },
  {
    accessorKey: "customer",
    header: "Khách hàng",
  },
  {
    accessorKey: "docDate",
    header: "Ngày chứng từ",
  },
  {
    accessorKey: "dueDate",
    header: "Ngày đến hạn",
  },
  {
    accessorKey: "amount",
    header: "Số tiền",
    cell: ({ row }) => {
      const value = row.getValue<number>("amount");
      return (
        <span className="font-medium">{value.toLocaleString("vi-VN")} đ</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue<Receivable["status"]>("status");
      const map = {
        unpaid: { label: "Chưa thu", color: "bg-amber-100 text-amber-800" },
        overdue: { label: "Quá hạn", color: "bg-red-100 text-red-700" },
        partial: { label: "Thu một phần", color: "bg-blue-100 text-blue-700" },
        paid: { label: "Đã thu đủ", color: "bg-emerald-100 text-emerald-700" },
      } as const;
      const style = map[status] || {
        label: "Không xác định",
        color: "bg-gray-100 text-gray-700",
      };
      return (
        <Badge className={`${style.color} hover:opacity-90`}>
          {style.label}
        </Badge>
      );
    },
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

const data: Receivable[] = [
  {
    id: "1",
    code: "AR-0001",
    customer: "Công ty Nông sản Xanh",
    docDate: "28/10/2025",
    dueDate: "10/11/2025",
    amount: 155000000,
    status: "unpaid",
  },
  {
    id: "2",
    code: "AR-0002",
    customer: "Siêu thị Vinmart Đồng Nai",
    docDate: "15/10/2025",
    dueDate: "01/11/2025",
    amount: 250000000,
    status: "overdue",
  },
  {
    id: "3",
    code: "AR-0003",
    customer: "Cửa hàng Thực phẩm Sạch An Lộc",
    docDate: "20/10/2025",
    dueDate: "15/11/2025",
    amount: 97000000,
    status: "partial",
  },
  {
    id: "4",
    code: "AR-0004",
    customer: "Trang trại Liên kết Hoàng Gia",
    docDate: "10/10/2025",
    dueDate: "25/10/2025",
    amount: 180000000,
    status: "paid",
  },
];

export default function ReceivablesPage() {
  const [status, setStatus] = useState("all");
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Công nợ phải thu (Khách hàng)
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các hóa đơn và chứng từ công nợ từ khách hàng.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Xuất Excel
          </Button>
          <Button
            onClick={() => navigate("/main/finance/receivables/add")}
            size="sm"
            className="bg-primary! text-white hover:bg-primary/90!"
          >
            <Plus className="mr-2 h-4 w-4" /> Tạo mới
          </Button>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Tổng công nợ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              682,000,000 đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tổng các hóa đơn còn phải thu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Quá hạn thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">250,000,000 đ</div>
            <p className="text-xs text-muted-foreground mt-1">
              Cần thu hồi gấp
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Đến hạn trong 7 ngày
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              155,000,000 đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cần theo dõi tiến độ thanh toán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Đã thu đủ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              180,000,000 đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tỷ lệ thu hồi 26.4%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Tìm theo khách hàng..." className="h-9 pr-10" />
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="unpaid">Chưa thu</SelectItem>
            <SelectItem value="overdue">Quá hạn</SelectItem>
            <SelectItem value="partial">Thu một phần</SelectItem>
            <SelectItem value="paid">Đã thu đủ</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Từ ngày</span>
          <Input
            type="date"
            className="h-9 w-[150px]"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span className="text-xs text-muted-foreground">Đến ngày</span>
          <Input
            type="date"
            className="h-9 w-[150px]"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* DATATABLE */}
      <DataTable columns={columns} data={data} filterColumn="customer" />
    </div>
  );
}
