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

type Payment = {
  id: string;
  code: string;
  payee: string;
  paymentDate: string;
  method: "Tiền mặt" | "Chuyển khoản";
  amount: number;
  status: "draft" | "processing" | "completed" | "cancelled";
};

const columns: ColumnDef<Payment>[] = [
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
    accessorKey: "payee",
    header: "Người nhận",
  },
  {
    accessorKey: "paymentDate",
    header: "Ngày chi tiền",
  },
  {
    accessorKey: "method",
    header: "Hình thức chi",
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
      const status = row.getValue<Payment["status"]>("status");
      const map = {
        draft: { label: "Nháp", color: "bg-gray-100 text-gray-700" },
        processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-700" },
        completed: {
          label: "Hoàn tất",
          color: "bg-emerald-100 text-emerald-700",
        },
        cancelled: { label: "Hủy bỏ", color: "bg-red-100 text-red-700" },
      } as const;
      const style = map[status] || {
        label: "Không xác định",
        color: "bg-gray-50 text-gray-600",
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

const data: Payment[] = [
  {
    id: "1",
    code: "PT-0001",
    payee: "Công ty phân bón Miền Tây",
    paymentDate: "03/11/2025",
    method: "Chuyển khoản",
    amount: 250000000,
    status: "completed",
  },
  {
    id: "2",
    code: "PT-0002",
    payee: "Nhà cung cấp thuốc BVTV Xanh",
    paymentDate: "04/11/2025",
    method: "Tiền mặt",
    amount: 85000000,
    status: "processing",
  },
  {
    id: "3",
    code: "PT-0003",
    payee: "Trang trại giống bò An Phú",
    paymentDate: "02/11/2025",
    method: "Chuyển khoản",
    amount: 120000000,
    status: "draft",
  },
  {
    id: "4",
    code: "PT-0004",
    payee: "Công ty xây dựng chuồng trại Hòa Bình",
    paymentDate: "01/11/2025",
    method: "Chuyển khoản",
    amount: 50000000,
    status: "cancelled",
  },
];

export default function PaymentsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Chứng từ chi tiền
          </h1>
          <p className="text-sm text-muted-foreground">
            Quản lý các khoản chi tiền cho nhà cung cấp, vật tư và hoạt động sản
            xuất.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Xuất Excel
          </Button>
          <Button
            onClick={() => navigate("/main/finance/payments/add")}
            size="sm"
            className="bg-primary! text-white hover:bg-primary/90!"
          >
            <Plus className="mr-2 h-4 w-4" /> Tạo mới
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Tổng chi trong tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              505,000,000 đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Bao gồm tất cả các chứng từ chi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Chi đang xử lý
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">85,000,000 đ</div>
            <p className="text-xs text-muted-foreground mt-1">
              Đang chờ phê duyệt hoặc xác nhận
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Chi hoàn tất
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              250,000,000 đ
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Đã hoàn tất thanh toán
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Chứng từ bị hủy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">50,000,000 đ</div>
            <p className="text-xs text-muted-foreground mt-1">
              Các khoản chi bị hủy hoặc lỗi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Tìm theo người nhận..." className="h-9 pr-10" />
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="processing">Đang xử lý</SelectItem>
            <SelectItem value="completed">Hoàn tất</SelectItem>
            <SelectItem value="cancelled">Hủy bỏ</SelectItem>
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
      <DataTable columns={columns} data={data} filterColumn="payee" />
    </div>
  );
}
