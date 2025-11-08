"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  FileDown,
  Filter,
  Mail,
  MapPin,
  Phone,
  Plus,
  Star,
  Truck,
  TrendingUp,
  AlertTriangle,
  Ban,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";
import { DataTableRowActions } from "@/components/data-table-row-actions";

type SupplierStatus = "active" | "warning" | "blocked";

type SupplierRow = {
  id: string;
  code: string;
  name: string;
  type: "Doanh nghiệp" | "Cá nhân";
  phone: string;
  email: string;
  province: string;
  address: string;
  totalPurchase: number; // tổng giá trị mua
  currentDebt: number; // công nợ hiện tại
  onTimeRate: number; // % giao hàng đúng hẹn
  rating: number; // 1–5
  tags: string[];
  status: SupplierStatus;
};

const SUPPLIERS: SupplierRow[] = [
  {
    id: "1",
    code: "NCC001",
    name: "Công ty Phân bón Miền Nam",
    type: "Doanh nghiệp",
    phone: "0901234567",
    email: "contact@phanbonmiennam.vn",
    province: "TP.HCM",
    address: "123 Quốc lộ 1A, Quận 12, TP.HCM",
    totalPurchase: 850_000_000,
    currentDebt: 120_000_000,
    onTimeRate: 96,
    rating: 5,
    tags: ["Phân NPK", "Ure", "Đối tác chiến lược"],
    status: "active",
  },
  {
    id: "2",
    code: "NCC002",
    name: "Công ty Hữu Cơ Việt",
    type: "Doanh nghiệp",
    phone: "0902345678",
    email: "sales@huucoviet.vn",
    province: "Đồng Nai",
    address: "KCN Long Thành, Đồng Nai",
    totalPurchase: 420_000_000,
    currentDebt: 40_000_000,
    onTimeRate: 88,
    rating: 4,
    tags: ["Phân hữu cơ", "Phân vi sinh"],
    status: "warning",
  },
  {
    id: "3",
    code: "NCC003",
    name: "Nhà cung cấp thuốc BVTV Xanh",
    type: "Doanh nghiệp",
    phone: "0933456789",
    email: "info@bvtvxanh.vn",
    province: "Cần Thơ",
    address: "Số 45, Đường 30/4, Ninh Kiều, Cần Thơ",
    totalPurchase: 310_000_000,
    currentDebt: 0,
    onTimeRate: 91,
    rating: 4,
    tags: ["Thuốc trừ sâu", "Thuốc trừ bệnh"],
    status: "active",
  },
  {
    id: "4",
    code: "NCC004",
    name: "Hộ kinh doanh Nguyễn Văn B",
    type: "Cá nhân",
    phone: "0911222333",
    email: "nguyenvanb@example.com",
    province: "Bà Rịa - Vũng Tàu",
    address: "Ấp 3, Xã Hòa Bình, H.Xuyên Mộc, BR-VT",
    totalPurchase: 95_000_000,
    currentDebt: 25_000_000,
    onTimeRate: 72,
    rating: 3,
    tags: ["Đại lý cấp 2"],
    status: "warning",
  },
  {
    id: "5",
    code: "NCC005",
    name: "Công ty Nông nghiệp Minh Phát",
    type: "Doanh nghiệp",
    phone: "0988777666",
    email: "support@minhphat-agri.vn",
    province: "An Giang",
    address: "Khu CN Bình Hòa, An Giang",
    totalPurchase: 150_000_000,
    currentDebt: 0,
    onTimeRate: 60,
    rating: 2,
    tags: ["Cung cấp không ổn định"],
    status: "blocked",
  },
];

export default function SuppliersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SupplierStatus>(
    "all"
  );
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "Doanh nghiệp" | "Cá nhân"
  >("all");

  const totalSuppliers = SUPPLIERS.length;
  const totalActive = SUPPLIERS.filter((s) => s.status === "active").length;
  const totalWarning = SUPPLIERS.filter((s) => s.status === "warning").length;
  const totalBlocked = SUPPLIERS.filter((s) => s.status === "blocked").length;
  const totalDebt = SUPPLIERS.reduce((sum, s) => sum + s.currentDebt, 0);

  const filteredData = useMemo(() => {
    return SUPPLIERS.filter((s) => {
      const matchesSearch =
        search.trim() === "" ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.phone.includes(search);

      const matchesStatus =
        statusFilter === "all" ? true : s.status === statusFilter;

      const matchesProvince =
        provinceFilter === "all" ? true : s.province === provinceFilter;

      const matchesType = typeFilter === "all" ? true : s.type === typeFilter;

      return matchesSearch && matchesStatus && matchesProvince && matchesType;
    });
  }, [search, statusFilter, provinceFilter, typeFilter]);

  const columns: ColumnDef<SupplierRow>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(val) => table.toggleAllPageRowsSelected(!!val)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(val) => row.toggleSelected(!!val)}
          aria-label="Chọn dòng"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: "Mã NCC",
      cell: ({ row }) => (
        <span className="font-medium text-xs">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên nhà cung cấp",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{row.original.name}</span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Building2 className="h-3 w-3" />
            {row.original.type} • {row.original.province}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Liên hệ",
      cell: ({ row }) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span>{row.original.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="truncate max-w-[180px]">{row.original.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Địa chỉ",
      cell: ({ row }) => (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-2 max-w-[260px]">
            {row.original.address}
          </span>
        </span>
      ),
    },
    {
      accessorKey: "totalPurchase",
      header: "Tổng giá trị mua",
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.totalPurchase.toLocaleString("vi-VN")} đ
        </span>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "currentDebt",
      header: "Công nợ hiện tại",
      cell: ({ row }) => {
        const v = row.original.currentDebt;
        return (
          <span
            className={`text-xs font-semibold ${
              v > 0 ? "text-amber-700" : "text-emerald-600"
            }`}
          >
            {v.toLocaleString("vi-VN")} đ
          </span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "onTimeRate",
      header: "Đúng hẹn",
      cell: ({ row }) => {
        const rate = row.original.onTimeRate;
        const color =
          rate >= 95
            ? "text-emerald-600"
            : rate >= 80
            ? "text-blue-600"
            : "text-red-600";
        return (
          <span className={`text-xs font-semibold ${color}`}>{rate}%</span>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "tags",
      header: "Nhóm / tag",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-emerald-100 bg-emerald-50 text-[10px] text-emerald-700"
            >
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        if (status === "active") {
          return (
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
              <TrendingUp className="mr-1 h-3 w-3" />
              Đang hợp tác
            </Badge>
          );
        }
        if (status === "warning") {
          return (
            <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Cần lưu ý
            </Badge>
          );
        }
        return (
          <Badge className="bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
            <Ban className="mr-1 h-3 w-3" />
            Tạm ngưng
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ];

  const uniqueProvinces = Array.from(new Set(SUPPLIERS.map((s) => s.province)));

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">Theo dõi nhà cung cấp</h1>
          <p className="text-xs text-muted-foreground">
            Quản lý lịch sử mua hàng, công nợ và chất lượng giao hàng của các
            nhà cung cấp.
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
            onClick={() => navigate("/main/materials/suppliers/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm nhà cung cấp
          </Button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tổng số nhà cung cấp"
          value={totalSuppliers.toString()}
          sub="Đang có trong hệ thống"
          icon={<Building2 className="h-5 w-5 text-primary" />}
        />
        <SummaryCard
          title="Đang hợp tác"
          value={totalActive.toString()}
          sub="Trạng thái hoạt động tốt"
          icon={<TrendingUp className="h-5 w-5 text-emerald-600" />}
          color="text-emerald-600"
        />
        <SummaryCard
          title="Cần lưu ý / chậm"
          value={totalWarning.toString()}
          sub="Tỷ lệ giao hàng trễ, nợ cao"
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          color="text-amber-600"
        />
        <SummaryCard
          title="Đã tạm ngưng"
          value={totalBlocked.toString()}
          sub="Không còn đặt đơn mới"
          icon={<Ban className="h-5 w-5 text-slate-500" />}
          color="text-slate-700"
          extra={
            <p className="text-[11px] text-muted-foreground">
              Tổng công nợ:{" "}
              <span className="font-semibold text-red-600">
                {totalDebt.toLocaleString("vi-VN")} đ
              </span>
            </p>
          }
        />
      </div>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Tìm kiếm & lọc nhà cung cấp
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Input
                placeholder="Tìm theo tên, mã, số điện thoại..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8"
              />
              <Truck className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setProvinceFilter("all");
                setTypeFilter("all");
              }}
            >
              <Filter className="mr-1 h-4 w-4" />
              Làm mới bộ lọc
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Loại NCC */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Loại NCC
              </p>
              <Select
                value={typeFilter}
                onValueChange={(v: "all" | "Doanh nghiệp" | "Cá nhân") =>
                  setTypeFilter(v)
                }
              >
                <SelectTrigger className="h-9 w-[150px]">
                  <SelectValue placeholder="Loại nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Doanh nghiệp">Doanh nghiệp</SelectItem>
                  <SelectItem value="Cá nhân">Cá nhân</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tỉnh / khu vực */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Khu vực
              </p>
              <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {uniqueProvinces.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trạng thái */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Trạng thái
              </p>
              <Select
                value={statusFilter}
                onValueChange={(v: "all" | SupplierStatus) =>
                  setStatusFilter(v)
                }
              >
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang hợp tác</SelectItem>
                  <SelectItem value="warning">Cần lưu ý</SelectItem>
                  <SelectItem value="blocked">Tạm ngưng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              Đang hiển thị {filteredData.length} / {totalSuppliers} nhà cung
              cấp
            </span>
            <span>
              Sử dụng{" "}
              <span className="font-semibold text-foreground">
                {
                  [
                    typeFilter !== "all",
                    provinceFilter !== "all",
                    statusFilter !== "all",
                  ].filter(Boolean).length
                }
              </span>{" "}
              bộ lọc
            </span>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách nhà cung cấp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            filterColumn="name"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  sub,
  icon,
  color,
  extra,
}: {
  title: string;
  value: string;
  sub: string;
  icon?: React.ReactNode;
  color?: string;
  extra?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        {icon}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className={`text-2xl font-bold ${color ?? "text-foreground"}`}>
          {value}
        </div>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
        {extra}
      </CardContent>
    </Card>
  );
}
