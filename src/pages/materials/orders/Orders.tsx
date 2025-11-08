"use client";

import { useMemo, useState } from "react";
import {
  Filter,
  Plus,
  FileText,
  CheckCircle2,
  XCircle,
  CircleDot,
  Truck,
  Clock4,
} from "lucide-react";
import { useNavigate } from "react-router";
import { type ColumnDef } from "@tanstack/react-table";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { DataTable } from "@/components/data-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { Checkbox } from "@/components/ui/checkbox";

type PurchaseOrderStatus =
  | "draft"
  | "approved"
  | "ordered"
  | "received"
  | "cancelled";

type PurchaseOrder = {
  id: string;
  orderNo: string;
  supplierName: string;
  supplierCode: string;
  orderDate: string; // ISO date
  expectedDate: string; // ISO date
  totalAmount: number;
  vatRate: number;
  status: PurchaseOrderStatus;
  note?: string;
};

const orders: PurchaseOrder[] = [
  {
    id: "PO-AGRI-0001",
    orderNo: "PO-AGRI-0001",
    supplierName: "Công ty TNHH Nông nghiệp Xanh",
    supplierCode: "NCC-001",
    orderDate: "2025-11-01",
    expectedDate: "2025-11-10",
    totalAmount: 325000000,
    vatRate: 10,
    status: "ordered",
    note: "Đơn mua phân bón cho vườn sầu riêng.",
  },
  {
    id: "PO-AGRI-0002",
    orderNo: "PO-AGRI-0002",
    supplierName: "Công ty CP Vật tư Nông nghiệp Miền Tây",
    supplierCode: "NCC-002",
    orderDate: "2025-11-05",
    expectedDate: "2025-11-15",
    totalAmount: 188000000,
    vatRate: 8,
    status: "approved",
    note: "Thức ăn hỗn hợp cho bò sữa – đợt 1.",
  },
  {
    id: "PO-AGRI-0003",
    orderNo: "PO-AGRI-0003",
    supplierName: "Nhà cung cấp Thuốc BVTV An Toàn",
    supplierCode: "NCC-003",
    orderDate: "2025-10-25",
    expectedDate: "2025-11-02",
    totalAmount: 92000000,
    vatRate: 10,
    status: "received",
    note: "Thuốc BVTV cho vườn cây ăn trái.",
  },
  {
    id: "PO-AGRI-0004",
    orderNo: "PO-AGRI-0004",
    supplierName: "Công ty TNHH Nông nghiệp Xanh",
    supplierCode: "NCC-001",
    orderDate: "2025-10-20",
    expectedDate: "2025-10-28",
    totalAmount: 145000000,
    vatRate: 5,
    status: "draft",
    note: "Dự kiến mua thêm phân hữu cơ, chưa duyệt.",
  },
  {
    id: "PO-AGRI-0005",
    orderNo: "PO-AGRI-0005",
    supplierName: "Công ty CP Vật tư Nông nghiệp Miền Tây",
    supplierCode: "NCC-002",
    orderDate: "2025-09-30",
    expectedDate: "2025-10-05",
    totalAmount: 210000000,
    vatRate: 10,
    status: "cancelled",
    note: "Đơn cũ, đã hủy do thay đổi kế hoạch.",
  },
];

function statusLabel(status: PurchaseOrderStatus) {
  switch (status) {
    case "draft":
      return "Nháp";
    case "approved":
      return "Đã duyệt";
    case "ordered":
      return "Đã đặt hàng";
    case "received":
      return "Đã nhận đủ";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
}

function statusBadge(status: PurchaseOrderStatus) {
  if (status === "draft") {
    return (
      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
        <Clock4 className="mr-1 h-3 w-3" />
        Nháp
      </Badge>
    );
  }
  if (status === "approved") {
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Đã duyệt
      </Badge>
    );
  }
  if (status === "ordered") {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        <CircleDot className="mr-1 h-3 w-3" />
        Đã đặt hàng
      </Badge>
    );
  }
  if (status === "received") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        <Truck className="mr-1 h-3 w-3" />
        Đã nhận đủ
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
      <XCircle className="mr-1 h-3 w-3" />
      Đã hủy
    </Badge>
  );
}

function formatCurrency(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

export default function OrdersPage() {
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<"all" | PurchaseOrderStatus>(
    "all"
  );
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;

      if (fromDate && o.orderDate < fromDate) return false;
      if (toDate && o.orderDate > toDate) return false;

      return true;
    });
  }, [statusFilter, fromDate, toDate]);

  const columns: ColumnDef<PurchaseOrder>[] = [
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
      size: 40,
    },
    {
      accessorKey: "orderNo",
      header: "Số đơn mua",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm text-foreground">
            {row.original.orderNo}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Mã NCC: {row.original.supplierCode}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "supplierName",
      header: "Nhà cung cấp",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">
            {row.original.supplierName}
          </span>
          {row.original.note && (
            <span className="text-[11px] text-muted-foreground line-clamp-1">
              {row.original.note}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "orderDate",
      header: "Ngày lập / Dự kiến",
      cell: ({ row }) => (
        <div className="text-xs">
          <p>
            Lập:{" "}
            <span className="font-medium">
              {new Date(row.original.orderDate).toLocaleDateString("vi-VN")}
            </span>
          </p>
          <p className="text-muted-foreground">
            Dự kiến:{" "}
            {new Date(row.original.expectedDate).toLocaleDateString("vi-VN")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Giá trị đơn",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-right text-sm">
          <p className="font-semibold text-emerald-700">
            {formatCurrency(row.original.totalAmount)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            VAT {row.original.vatRate}%
          </p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <div className="text-xs">{statusBadge(row.original.status)}</div>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];

  const totalOrder = orders.length;
  const totalDraft = orders.filter((o) => o.status === "draft").length;
  const totalOpen = orders.filter((o) =>
    ["approved", "ordered"].includes(o.status)
  ).length;
  const totalReceived = orders.filter((o) => o.status === "received").length;

  const totalValue = orders.reduce((s, o) => s + o.totalAmount, 0);
  const openValue = orders
    .filter((o) => ["approved", "ordered"].includes(o.status))
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Đơn mua vật tư nông nghiệp
          </h1>
          <p className="text-sm text-muted-foreground">
            Danh sách đơn mua vật tư phục vụ sản xuất và chăn nuôi trên toàn
            trang trại.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="mr-1.5 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
            onClick={() => navigate("add")}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Thêm đơn mua
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Tổng số đơn mua"
          value={totalOrder.toString()}
          sublabel={`${totalDraft} nháp · ${totalOpen} đang mở`}
        />
        <SummaryCard
          label="Giá trị đơn mua (tổng)"
          value={formatCurrency(totalValue)}
          color="text-emerald-600"
          sublabel="Bao gồm tất cả trạng thái"
        />
        <SummaryCard
          label="Giá trị đơn đang mở"
          value={formatCurrency(openValue)}
          color="text-amber-600"
          sublabel="Đơn đã duyệt / đã đặt hàng"
        />
        <SummaryCard
          label="Đơn đã nhận đủ"
          value={totalReceived.toString()}
          color="text-blue-600"
          sublabel="Đã hoàn tất nhập kho"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            Bộ lọc danh sách
            <Filter className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3 text-sm">
          <div className="w-full sm:w-52">
            <p className="mb-1 text-xs text-muted-foreground">Trạng thái</p>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as "all" | PurchaseOrderStatus)
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="ordered">Đã đặt hàng</SelectItem>
                <SelectItem value="received">Đã nhận đủ</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-40">
            <p className="mb-1 text-xs text-muted-foreground">Từ ngày</p>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="w-full sm:w-40">
            <p className="mb-1 text-xs text-muted-foreground">Đến ngày</p>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="flex-1" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setFromDate("");
              setToDate("");
            }}
          >
            Xóa bộ lọc
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách đơn mua vật tư
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredOrders}
            filterColumn="supplierName"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sublabel,
  color,
}: {
  label: string;
  value: string;
  sublabel?: string;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`text-xl font-bold leading-tight ${
            color ? color : "text-foreground"
          }`}
        >
          {value}
        </div>
        {sublabel && (
          <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>
        )}
      </CardContent>
    </Card>
  );
}
