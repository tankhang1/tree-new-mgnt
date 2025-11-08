"use client";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Boxes,
  Filter,
  Plus,
  AlertTriangle,
  Droplets,
  Sprout,
  Wheat,
  Package2,
} from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";

import { DataTable } from "@/components/data-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";

type MaterialCategory =
  | "phan-bon"
  | "thuoc-bvtv"
  | "giong"
  | "thuc-an"
  | "vat-tu-khac";
type StockStatus = "good" | "low" | "out";

type Material = {
  id: string;
  code: string;
  name: string;
  category: MaterialCategory;
  unit: string;
  warehouse: string;
  location: string;
  stockQty: number;
  minQty: number;
  avgCost: number;
  lastIn: string;
  lastOut?: string;
};

const materials: Material[] = [
  {
    id: "VT-0001",
    code: "PB-NPK-16168",
    name: "Phân bón NPK 16-16-8+TE",
    category: "phan-bon",
    unit: "Bao 50kg",
    warehouse: "Kho vật tư trung tâm",
    location: "Kệ A1-01",
    stockQty: 120,
    minQty: 50,
    avgCost: 450000,
    lastIn: "2025-10-28",
    lastOut: "2025-11-05",
  },
  {
    id: "VT-0002",
    code: "PB-HC-001",
    name: "Phân hữu cơ vi sinh cao cấp",
    category: "phan-bon",
    unit: "Bao 25kg",
    warehouse: "Kho vật tư trung tâm",
    location: "Kệ A1-02",
    stockQty: 40,
    minQty: 80,
    avgCost: 380000,
    lastIn: "2025-10-20",
    lastOut: "2025-11-04",
  },
  {
    id: "VT-0003",
    code: "BVTV-SR-01",
    name: "Thuốc BVTV chuyên dùng cho sầu riêng",
    category: "thuoc-bvtv",
    unit: "Chai 1L",
    warehouse: "Kho vật tư trại sầu riêng",
    location: "Kệ B2-03",
    stockQty: 18,
    minQty: 30,
    avgCost: 250000,
    lastIn: "2025-11-01",
    lastOut: "2025-11-06",
  },
  {
    id: "VT-0004",
    code: "BVTV-CH-02",
    name: "Thuốc trừ cỏ thế hệ mới",
    category: "thuoc-bvtv",
    unit: "Can 5L",
    warehouse: "Kho vật tư trung tâm",
    location: "Kệ B1-05",
    stockQty: 0,
    minQty: 20,
    avgCost: 520000,
    lastIn: "2025-09-15",
    lastOut: "2025-10-01",
  },
  {
    id: "VT-0005",
    code: "GIONG-SR-001",
    name: "Cây giống sầu riêng Ri6",
    category: "giong",
    unit: "Cây",
    warehouse: "Vườn ươm giống",
    location: "Luống G1",
    stockQty: 320,
    minQty: 200,
    avgCost: 90000,
    lastIn: "2025-11-02",
    lastOut: "2025-11-06",
  },
  {
    id: "VT-0006",
    code: "TA-BO-SUA-01",
    name: "Thức ăn hỗn hợp cho bò sữa",
    category: "thuc-an",
    unit: "Bao 25kg",
    warehouse: "Kho thức ăn trại bò sữa",
    location: "Kệ C1-02",
    stockQty: 75,
    minQty: 60,
    avgCost: 320000,
    lastIn: "2025-11-03",
    lastOut: "2025-11-05",
  },
  {
    id: "VT-0007",
    code: "TA-BO-UC-02",
    name: "Khoáng vi lượng bổ sung cho bò",
    category: "thuc-an",
    unit: "Bao 10kg",
    warehouse: "Kho thức ăn trại bò sữa",
    location: "Kệ C1-04",
    stockQty: 15,
    minQty: 40,
    avgCost: 210000,
    lastIn: "2025-10-18",
  },
  {
    id: "VT-0008",
    code: "VT-TUOI-01",
    name: "Béc tưới nhỏ giọt",
    category: "vat-tu-khac",
    unit: "Cái",
    warehouse: "Kho vật tư trung tâm",
    location: "Kệ D2-01",
    stockQty: 450,
    minQty: 200,
    avgCost: 15000,
    lastIn: "2025-10-30",
  },
];

function getStatus(m: Material): StockStatus {
  if (m.stockQty <= 0) return "out";
  if (m.stockQty <= m.minQty) return "low";
  return "good";
}

function statusBadge(status: StockStatus) {
  if (status === "good") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        <Boxes className="mr-1 h-3 w-3" />
        Đủ tồn
      </Badge>
    );
  }
  if (status === "low") {
    return (
      <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Sắp hết
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
      <AlertTriangle className="mr-1 h-3 w-3" />
      Hết hàng
    </Badge>
  );
}

function categoryChip(cat: MaterialCategory) {
  if (cat === "phan-bon")
    return (
      <Badge className="bg-lime-100 text-lime-700 hover:bg-lime-100">
        <Sprout className="mr-1 h-3 w-3" />
        Phân bón
      </Badge>
    );
  if (cat === "thuoc-bvtv")
    return (
      <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">
        <Droplets className="mr-1 h-3 w-3" />
        Thuốc BVTV
      </Badge>
    );
  if (cat === "giong")
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        <Wheat className="mr-1 h-3 w-3" />
        Giống cây / con
      </Badge>
    );
  if (cat === "thuc-an")
    return (
      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
        <Package2 className="mr-1 h-3 w-3" />
        Thức ăn
      </Badge>
    );
  return (
    <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
      Vật tư khác
    </Badge>
  );
}

function formatCurrency(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

export default function SuppliesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | MaterialCategory
  >("all");
  const [statusFilter, setStatusFilter] = useState<"all" | StockStatus>("all");
  const [warehouseFilter, setWarehouseFilter] = useState<string>("all");

  const warehouses = useMemo(
    () => Array.from(new Set(materials.map((m) => m.warehouse))),
    []
  );

  const filteredData = useMemo(() => {
    return materials.filter((m) => {
      const status = getStatus(m);

      if (search) {
        const s = search.toLowerCase();
        if (
          !(
            m.name.toLowerCase().includes(s) ||
            m.code.toLowerCase().includes(s) ||
            m.warehouse.toLowerCase().includes(s)
          )
        ) {
          return false;
        }
      }

      if (categoryFilter !== "all" && m.category !== categoryFilter)
        return false;
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (warehouseFilter !== "all" && m.warehouse !== warehouseFilter)
        return false;

      return true;
    });
  }, [search, categoryFilter, statusFilter, warehouseFilter]);

  const columns: ColumnDef<Material>[] = [
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
      accessorKey: "code",
      header: "Mã vật tư",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{row.original.code}</span>
          <span className="text-[11px] text-muted-foreground">
            {row.original.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Nhóm vật tư",
      cell: ({ row }) => (
        <div className="text-xs">{categoryChip(row.original.category)}</div>
      ),
    },
    {
      accessorKey: "warehouse",
      header: "Kho / Vị trí",
      cell: ({ row }) => (
        <div className="text-xs">
          <p className="font-medium">{row.original.warehouse}</p>
          <p className="text-muted-foreground">
            Vị trí: {row.original.location}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "stockQty",
      header: "Tồn kho",
      enableSorting: true,
      cell: ({ row }) => {
        const status = getStatus(row.original);
        const color =
          status === "good"
            ? "text-emerald-700"
            : status === "low"
            ? "text-amber-700"
            : "text-red-700";
        return (
          <div className="text-right text-xs">
            <p className={`font-semibold ${color}`}>
              {row.original.stockQty.toLocaleString("vi-VN")}{" "}
              {row.original.unit}
            </p>
            <p className="text-[11px] text-muted-foreground">
              Mức tối thiểu: {row.original.minQty.toLocaleString("vi-VN")}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: "avgCost",
      header: "Giá vốn TB",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-right text-xs">
          <p className="font-semibold">
            {formatCurrency(row.original.avgCost)}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Giá trị tồn:{" "}
            {formatCurrency(row.original.avgCost * row.original.stockQty)}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "lastIn",
      header: "Nhập / Xuất gần nhất",
      cell: ({ row }) => (
        <div className="text-xs">
          <p>
            Nhập:{" "}
            <span className="font-medium">
              {new Date(row.original.lastIn).toLocaleDateString("vi-VN")}
            </span>
          </p>
          <p className="text-muted-foreground">
            Xuất:{" "}
            {row.original.lastOut
              ? new Date(row.original.lastOut).toLocaleDateString("vi-VN")
              : "-"}
          </p>
        </div>
      ),
    },
    {
      id: "status",
      header: "Trạng thái",
      cell: ({ row }) => (
        <div className="text-xs">{statusBadge(getStatus(row.original))}</div>
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

  const totalItems = materials.length;
  const lowItems = materials.filter((m) => getStatus(m) === "low").length;
  const outItems = materials.filter((m) => getStatus(m) === "out").length;
  const totalValue = materials.reduce(
    (sum, m) => sum + m.avgCost * m.stockQty,
    0
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-primary">
            Quản lý vật tư nông nghiệp
          </h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi tồn kho phân bón, thuốc BVTV, giống, thức ăn và các vật tư
            phục vụ sản xuất.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => console.log("Export inventory")}
          >
            <Filter className="mr-1.5 h-4 w-4" />
            Xuất báo cáo tồn kho
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
            onClick={() => navigate("add")}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Thêm vật tư
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Boxes className="h-4 w-4 text-emerald-600" />}
          label="Tổng số vật tư"
          value={totalItems.toString()}
          sublabel="Tính trên toàn bộ kho"
        />
        <SummaryCard
          icon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
          label="Vật tư sắp hết"
          value={lowItems.toString()}
          color="text-amber-700"
          sublabel="Cần lập kế hoạch mua thêm"
        />
        <SummaryCard
          icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
          label="Vật tư hết hàng"
          value={outItems.toString()}
          color="text-red-700"
          sublabel="Ưu tiên nhập bổ sung"
        />
        <SummaryCard
          icon={<Package2 className="h-4 w-4 text-sky-600" />}
          label="Giá trị tồn kho"
          value={formatCurrency(totalValue)}
          color="text-emerald-700"
          sublabel="Ước tính giá vốn hiện tại"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            Bộ lọc vật tư
            <Filter className="h-4 w-4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3 text-sm">
          <div className="w-full sm:w-64">
            <p className="mb-1 text-xs text-muted-foreground">
              Tìm kiếm theo mã / tên / kho
            </p>
            <div className="relative ">
              <Input
                placeholder="VD: NPK, thuốc BVTV, kho trung tâm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pr-8 "
              />
            </div>
          </div>

          <div className="w-full sm:w-44">
            <p className="mb-1 text-xs text-muted-foreground">Nhóm vật tư</p>
            <Select
              value={categoryFilter}
              onValueChange={(v) => setCategoryFilter(v as any)}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Chọn nhóm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="phan-bon">Phân bón</SelectItem>
                <SelectItem value="thuoc-bvtv">Thuốc BVTV</SelectItem>
                <SelectItem value="giong">Giống cây / con</SelectItem>
                <SelectItem value="thuc-an">Thức ăn</SelectItem>
                <SelectItem value="vat-tu-khac">Vật tư khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-44">
            <p className="mb-1 text-xs text-muted-foreground">Trạng thái tồn</p>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as any)}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="good">Đủ tồn</SelectItem>
                <SelectItem value="low">Sắp hết</SelectItem>
                <SelectItem value="out">Hết hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-52">
            <p className="mb-1 text-xs text-muted-foreground">Kho</p>
            <Select
              value={warehouseFilter}
              onValueChange={(v) => setWarehouseFilter(v)}
            >
              <SelectTrigger className="h-9 w-fulls">
                <SelectValue placeholder="Chọn kho" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả kho</SelectItem>
                {warehouses.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1" />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setCategoryFilter("all");
              setStatusFilter("all");
              setWarehouseFilter("all");
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
            Danh sách vật tư
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
  icon,
  label,
  value,
  sublabel,
  color,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sublabel?: string;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-1 flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          {label}
        </CardTitle>
        {icon}
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
