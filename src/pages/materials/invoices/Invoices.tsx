"use client";

import { useMemo, useState } from "react";
import {
  FileDown,
  Plus,
  Filter,
  FileText,
  Warehouse,
  Calendar,
  Truck,
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
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";

type PurchaseDocStatus =
  | "da-nhap-kho"
  | "cho-doi-chieu"
  | "thieu-chung-tu"
  | "da-huy";

type PurchaseDocType = "invoice" | "goods-receipt" | "other";

type PurchaseDoc = {
  id: string;
  code: string;
  poCode: string;
  docType: PurchaseDocType;
  supplier: string;
  issueDate: string; // yyyy-mm-dd
  totalAmount: number;
  paidAmount: number;
  warehouse: string;
  status: PurchaseDocStatus;
};

const docs: PurchaseDoc[] = [
  {
    id: "1",
    code: "HDN-2025-001",
    poCode: "PO-0001",
    docType: "invoice",
    supplier: "Công ty Phân bón Miền Nam",
    issueDate: "2025-08-01",
    totalAmount: 100000000,
    paidAmount: 70000000,
    warehouse: "Kho Vật tư A",
    status: "cho-doi-chieu",
  },
  {
    id: "2",
    code: "PNK-2025-015",
    poCode: "PO-0002",
    docType: "goods-receipt",
    supplier: "Công ty Thuốc BVTV Xanh",
    issueDate: "2025-08-03",
    totalAmount: 65000000,
    paidAmount: 65000000,
    warehouse: "Kho Thuốc BVTV",
    status: "da-nhap-kho",
  },
  {
    id: "3",
    code: "HDN-2025-002",
    poCode: "PO-0003",
    docType: "invoice",
    supplier: "Trang trại Liên kết Hoàng Gia",
    issueDate: "2025-08-05",
    totalAmount: 42000000,
    paidAmount: 0,
    warehouse: "Kho Vật tư B",
    status: "thieu-chung-tu",
  },
  {
    id: "4",
    code: "PNK-2025-016",
    poCode: "PO-0004",
    docType: "goods-receipt",
    supplier: "Nhà cung cấp bao bì An Phát",
    issueDate: "2025-08-06",
    totalAmount: 12000000,
    paidAmount: 12000000,
    warehouse: "Kho Tổng",
    status: "da-nhap-kho",
  },
];

function formatMoney(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

function statusBadge(status: PurchaseDocStatus) {
  switch (status) {
    case "da-nhap-kho":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-0">
          Đã nhập kho
        </Badge>
      );
    case "cho-doi-chieu":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-0">
          Chờ đối chiếu
        </Badge>
      );
    case "thieu-chung-tu":
      return (
        <Badge className="bg-red-100 text-red-700 border-0">
          Thiếu chứng từ
        </Badge>
      );
    case "da-huy":
      return (
        <Badge className="bg-slate-100 text-slate-600 border-0">Đã hủy</Badge>
      );
  }
}

function typeBadge(type: PurchaseDocType) {
  switch (type) {
    case "invoice":
      return (
        <Badge variant="outline" className="border-blue-200 text-blue-700">
          Hóa đơn mua hàng
        </Badge>
      );
    case "goods-receipt":
      return (
        <Badge
          variant="outline"
          className="border-emerald-200 text-emerald-700"
        >
          Phiếu nhập kho
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="border-slate-200 text-slate-700">
          Khác
        </Badge>
      );
  }
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<PurchaseDocStatus | "all">("all");
  const [docType, setDocType] = useState<PurchaseDocType | "all">("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");

  const filteredData = useMemo(() => {
    return docs.filter((d) => {
      if (
        query &&
        !`${d.code} ${d.poCode} ${d.supplier}`
          .toLowerCase()
          .includes(query.toLowerCase())
      )
        return false;

      if (status !== "all" && d.status !== status) return false;
      if (docType !== "all" && d.docType !== docType) return false;

      if (fromDate && d.issueDate < fromDate) return false;
      if (toDate && d.issueDate > toDate) return false;

      return true;
    });
  }, [query, status, docType, fromDate, toDate]);

  const totalDocs = filteredData.length;
  const totalValue = filteredData.reduce((s, d) => s + d.totalAmount, 0);
  const totalUnpaid = filteredData.reduce(
    (s, d) => s + Math.max(d.totalAmount - d.paidAmount, 0),
    0
  );

  const columns: ColumnDef<PurchaseDoc>[] = [
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
      accessorKey: "code",
      header: "Mã chứng từ",
      cell: ({ row }) => (
        <span className="font-medium text-primary">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "poCode",
      header: "Mã đơn mua hàng",
    },
    {
      accessorKey: "docType",
      header: "Loại chứng từ",
      cell: ({ row }) => typeBadge(row.original.docType),
    },
    {
      accessorKey: "supplier",
      header: "Nhà cung cấp",
    },
    {
      accessorKey: "issueDate",
      header: "Ngày chứng từ",
      cell: ({ row }) => (
        <span>
          {new Date(row.original.issueDate).toLocaleDateString("vi-VN")}
        </span>
      ),
    },
    {
      accessorKey: "warehouse",
      header: "Kho nhập",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Warehouse className="h-3 w-3" />
          {row.original.warehouse}
        </span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Tổng tiền",
      cell: ({ row }) => (
        <span className="font-medium">
          {formatMoney(row.original.totalAmount)}
        </span>
      ),
    },
    {
      accessorKey: "paidAmount",
      header: "Đã thanh toán",
      cell: ({ row }) => (
        <span className="text-emerald-600">
          {formatMoney(row.original.paidAmount)}
        </span>
      ),
    },
    {
      id: "remaining",
      header: "Còn phải trả",
      cell: ({ row }) => {
        const remain = row.original.totalAmount - row.original.paidAmount;
        return (
          <span
            className={
              remain > 0
                ? "font-semibold text-red-600"
                : "font-semibold text-emerald-600"
            }
          >
            {formatMoney(remain)}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => statusBadge(row.original.status),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold text-foreground">
            Hóa đơn & chứng từ nhập hàng
          </h1>
          <p className="text-xs text-muted-foreground">
            Quản lý hóa đơn mua vật tư, phiếu nhập kho và tình trạng thanh toán
            với nhà cung cấp.
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
            onClick={() => navigate("/main/materials/invoices/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm chứng từ
          </Button>
        </div>
      </header>

      {/* SUMMARY */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tổng số chứng từ"
          value={totalDocs.toString()}
          icon={<FileText className="h-5 w-5 text-primary" />}
          color="text-primary"
          sub="Bao gồm hóa đơn & phiếu nhập kho"
        />
        <SummaryCard
          title="Giá trị chứng từ"
          value={formatMoney(totalValue)}
          icon={<Truck className="h-5 w-5 text-emerald-600" />}
          color="text-emerald-600"
          sub="Tổng giá trị nhập mua"
        />
        <SummaryCard
          title="Còn phải trả NCC"
          value={formatMoney(totalUnpaid)}
          icon={<Warehouse className="h-5 w-5 text-amber-500" />}
          color="text-amber-600"
          sub="Chưa thanh toán cho nhà cung cấp"
        />
        <SummaryCard
          title="Chứng từ chờ đối chiếu"
          value={
            filteredData.filter((d) => d.status === "cho-doi-chieu").length + ""
          }
          icon={<Filter className="h-5 w-5 text-sky-600" />}
          color="text-sky-600"
          sub="Cần kiểm tra & đối chiếu"
        />
      </div>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Tìm kiếm & lọc hóa đơn
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Lọc nhanh theo nhà cung cấp, loại chứng từ, khoảng ngày và trạng
                thái thanh toán.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Input
                placeholder="Tìm theo mã chứng từ, nhà cung cấp..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-9 pl-8"
              />
              <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-9 w-36"
                />
                <span className="text-xs text-muted-foreground">đến</span>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-9 w-36"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setStatus("all");
                  setDocType("all");
                  setFromDate("");
                  setToDate("");
                }}
              >
                Làm mới
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Loại chứng từ
              </p>
              <Select
                value={docType}
                onValueChange={(v: PurchaseDocType | "all") => setDocType(v)}
              >
                <SelectTrigger className="h-9 w-[170px]">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="invoice">Hóa đơn mua hàng</SelectItem>
                  <SelectItem value="goods-receipt">Phiếu nhập kho</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Trạng thái
              </p>
              <Select
                value={status}
                onValueChange={(v: PurchaseDocStatus | "all") => setStatus(v)}
              >
                <SelectTrigger className="h-9 w-[170px]">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="da-nhap-kho">Đã nhập kho</SelectItem>
                  <SelectItem value="cho-doi-chieu">Chờ đối chiếu</SelectItem>
                  <SelectItem value="thieu-chung-tu">Thiếu chứng từ</SelectItem>
                  <SelectItem value="da-huy">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách hóa đơn & chứng từ nhập hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            filterColumn="code"
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
  sub,
  icon,
}: {
  title: string;
  value: string;
  color: string;
  sub: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-xl font-bold ${color}`}>{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
