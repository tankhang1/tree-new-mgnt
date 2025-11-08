"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";

type Collection = {
  id: string;
  code: string;
  customer: string;
  receiptDate: string;
  method: "Tiền mặt" | "Chuyển khoản";
  amount: number;
  status: "pending" | "partial" | "completed" | "refunded";
};

const columns: ColumnDef<Collection>[] = [
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
    accessorKey: "receiptDate",
    header: "Ngày thu tiền",
  },
  {
    accessorKey: "method",
    header: "Hình thức thu",
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
      const status = row.getValue<Collection["status"]>("status");
      const map = {
        pending: {
          label: "Chờ thu",
          color: "bg-amber-100 text-amber-800",
        },
        partial: {
          label: "Thu một phần",
          color: "bg-blue-100 text-blue-700",
        },
        completed: {
          label: "Đã thu đủ",
          color: "bg-emerald-100 text-emerald-700",
        },
        refunded: {
          label: "Hoàn tiền",
          color: "bg-red-100 text-red-700",
        },
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

const data: Collection[] = [
  {
    id: "1",
    code: "RC-0001",
    customer: "Công ty Nông sản Xanh",
    receiptDate: "03/11/2025",
    method: "Chuyển khoản",
    amount: 155000000,
    status: "pending",
  },
  {
    id: "2",
    code: "RC-0002",
    customer: "Siêu thị Vinmart Đồng Nai",
    receiptDate: "02/11/2025",
    method: "Chuyển khoản",
    amount: 250000000,
    status: "completed",
  },
  {
    id: "3",
    code: "RC-0003",
    customer: "Cửa hàng Thực phẩm Sạch An Lộc",
    receiptDate: "01/11/2025",
    method: "Tiền mặt",
    amount: 97000000,
    status: "partial",
  },
  {
    id: "4",
    code: "RC-0004",
    customer: "Trang trại Liên kết Hoàng Gia",
    receiptDate: "29/10/2025",
    method: "Chuyển khoản",
    amount: 60000000,
    status: "refunded",
  },
];

export default function CollectionsPage() {
  const [status, setStatus] = useState("all");
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Chứng từ thu tiền
          </h1>
          <p className="text-sm text-muted-foreground">
            Ghi nhận các khoản thu tiền từ khách hàng theo từng chứng từ.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất Excel
          </Button>
          <Button
            onClick={() => navigate("/main/finance/collections/add")}
            size="sm"
            className="bg-primary! text-primary-foreground hover:bg-primary/90!"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo mới
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Tổng thu trong tháng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              562,000,000 đ
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Bao gồm tất cả chứng từ thu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Chờ thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              155,000,000 đ
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Cần theo dõi lịch thanh toán
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
              250,000,000 đ
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Đã hoàn tất ghi nhận doanh thu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
              Hoàn tiền / điều chỉnh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">60,000,000 đ</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Cần đối chiếu với công nợ phải thu
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-64">
          <Input placeholder="Tìm theo khách hàng..." className="h-9 pr-10" />
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-[200px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ thu</SelectItem>
            <SelectItem value="partial">Thu một phần</SelectItem>
            <SelectItem value="completed">Đã thu đủ</SelectItem>
            <SelectItem value="refunded">Hoàn tiền</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable columns={columns} data={data} filterColumn="customer" />
    </div>
  );
}
