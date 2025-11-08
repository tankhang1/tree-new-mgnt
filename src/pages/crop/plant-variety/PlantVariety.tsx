"use client";

import * as React from "react";
import {
  Leaf,
  Plus,
  MoreHorizontal,
  Image as ImageIcon,
  Sprout,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import VarietyCreateDialog from "./VarietyCreateDialog";

// 👉 Đổi lại cho đúng đường dẫn DataTable của bạn

type VarietyStatus = "active" | "testing" | "archived";

type Variety = {
  id: string;
  code: string;
  name: string;
  cropName: string;
  seedSupplier: string;
  imageUrl?: string;
  growthCycle: string;
  harvestMethod: string;
  note?: string;
  status: VarietyStatus;
};

/* ================= MOCK DATA ================= */

const MOCK_VARIETIES: Variety[] = [
  {
    id: "1",
    code: "VAR001",
    name: "Lúa thơm ST25",
    cropName: "Lúa",
    seedSupplier: "CTy Giống Lúa Sóc Trăng",
    imageUrl:
      "https://agridrone.vn/wp-content/uploads/2023/10/ky-thuat-canh-tac-giong-lua-st25-1.jpg",
    growthCycle: "95–100 ngày (Đông Xuân)",
    harvestMethod: "Gặt máy liên hợp",
    note: "Giống gạo thơm, chất lượng cao, xuất khẩu.",
    status: "active",
  },
  {
    id: "2",
    code: "VAR002",
    name: "Bắp lai LVN10",
    cropName: "Bắp",
    seedSupplier: "CTy Giống Cây Trồng TW",
    imageUrl:
      "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
    growthCycle: "100–110 ngày (Hè Thu)",
    harvestMethod: "Thu hoạch bán cơ giới hoặc thủ công",
    note: "Chịu hạn khá, phù hợp đất cao ráo.",
    status: "testing",
  },
  {
    id: "3",
    code: "VAR003",
    name: "Đậu nành GV01",
    cropName: "Đậu nành",
    seedSupplier: "Viện Nghiên cứu Cây trồng",
    imageUrl:
      "https://thucphamviet.net/wp-content/uploads/2022/03/Nanh-300g-e1696582813657.png",
    growthCycle: "85–95 ngày",
    harvestMethod: "Thu hoạch thủ công hoặc máy gặt đập nhỏ",
    note: "Hàm lượng đạm cao, phù hợp luân canh với lúa/bắp.",
    status: "active",
  },
  {
    id: "4",
    code: "VAR004",
    name: "Lúa OM5451",
    imageUrl:
      "https://agridrone.vn/wp-content/uploads/2021/04/giong-lua-om-5451-01.jpg",
    cropName: "Lúa",
    seedSupplier: "Viện Lúa ĐBSCL",
    growthCycle: "95–100 ngày",
    harvestMethod: "Gặt máy liên hợp",
    note: "Giống phổ biến, đã dùng lâu năm.",
    status: "archived",
  },
];

/* ================= COLUMNS CHO DATATABLE ================= */

const columns: ColumnDef<Variety>[] = [
  {
    accessorKey: "code",
    header: "Mã giống",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold">
        {row.original.code}
      </span>
    ),
    enableSorting: true,
  },
  {
    id: "image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const img = row.original.imageUrl;
      return (
        <div className="flex items-center justify-center">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={img}
              alt={row.original.name}
              className="h-10 w-10 rounded-md border object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      );
    },
    size: 70,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Tên giống",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-semibold">{row.original.name}</span>
        <span className="text-[11px] text-muted-foreground">
          Nhà cung cấp: {row.original.seedSupplier}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "cropName",
    header: "Cây trồng",
    cell: ({ row }) => (
      <div className="inline-flex items-center gap-1 text-xs">
        <Sprout className="h-3 w-3 text-green-600" />
        <span>{row.original.cropName}</span>
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ row }) => (
      <span className="line-clamp-2 text-[11px] text-muted-foreground">
        {row.original.note || "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "",
    size: 40,
    cell: () => (
      <div className="flex justify-end">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    ),
    enableSorting: false,
  },
];

function StatusBadge({ status }: { status: VarietyStatus }) {
  if (status === "active") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
        Đang sử dụng
      </Badge>
    );
  }
  if (status === "testing") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
        Thử nghiệm
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-50 text-slate-600 border border-slate-200 text-[11px]">
      Lưu trữ
    </Badge>
  );
}

/* ================= PAGE ================= */

export default function PlantVarietyPage() {
  const [search, setSearch] = React.useState("");
  const [cropFilter, setCropFilter] = React.useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = React.useState<"all" | VarietyStatus>(
    "all"
  );
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  // danh sách cây để fill Select
  const cropOptions = React.useMemo(
    () => Array.from(new Set(MOCK_VARIETIES.map((v) => v.cropName))),
    []
  );

  const filtered = React.useMemo(() => {
    let result = [...MOCK_VARIETIES];

    if (cropFilter !== "all") {
      result = result.filter((v) => v.cropName === cropFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter);
    }
    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter((v) => {
        const haystack =
          v.code +
            v.name +
            v.cropName +
            v.seedSupplier +
            v.growthCycle +
            v.note ?? "";
        return haystack.toLowerCase().includes(s);
      });
    }

    return result;
  }, [cropFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
            <Leaf className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-base font-semibold">
              Danh sách giống cây trồng
            </h1>
            <p className="text-xs text-muted-foreground">
              Quản lý mã giống, cây trồng, chu kỳ sinh trưởng và hình thức thu
              hoạch cho từng giống.
            </p>
          </div>
        </div>
        <VarietyCreateDialog />
      </header>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bộ lọc & tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4 text-xs">
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">Tìm kiếm nhanh</p>
            <Input
              className="h-8"
              placeholder="Mã giống, tên giống, cây trồng, ghi chú..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">Cây trồng</p>
            <Select
              value={cropFilter}
              onValueChange={(v) => {
                setCropFilter(v as "all" | string);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn cây trồng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {cropOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">Trạng thái</p>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v as "all" | VarietyStatus);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang sử dụng</SelectItem>
                <SelectItem value="testing">Thử nghiệm</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setSearch("");
                setCropFilter("all");
                setStatusFilter("all");
                setPage(1);
              }}
            >
              Làm mới bộ lọc
            </Button>
          </div>

          <p className="col-span-full text-[11px] text-muted-foreground">
            Đang hiển thị{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            giống cây (trang {currentPage}/{totalPages}).
          </p>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={pageData} />
    </div>
  );
}
