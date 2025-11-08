"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { Sprout, MoreHorizontal, Search, Filter } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/data-table";
import { useNavigate } from "react-router";

// ================== TYPES & MOCK DATA ==================

export type GrowthCycleStatus = "active" | "draft" | "archived";

export type GrowthCycle = {
  id: string;
  code: string;
  name: string;
  mainCrop: string;
  seasonPattern: string;
  totalDays: number;
  stageCount: number;
  description: string;
  status: GrowthCycleStatus;
  updatedAt: string; // ISO string
};

const MOCK_CYCLES: GrowthCycle[] = [
  {
    id: "1",
    code: "CYCLE-DSX-110",
    name: "Chu kỳ 110 ngày – Đậu nành Đông Xuân",
    mainCrop: "Đậu nành",
    seasonPattern: "Đông Xuân (gieo 10–20/11)",
    totalDays: 110,
    stageCount: 5,
    description:
      "Luân canh sau lúa, phù hợp đất thịt nhẹ, có tưới chủ động. Tập trung năng suất hạt khô.",
    status: "active",
    updatedAt: "2025-10-05T08:00:00Z",
  },
  {
    id: "2",
    code: "CYCLE-BAP-120",
    name: "Chu kỳ 120 ngày – Bắp LVN10",
    mainCrop: "Bắp lai",
    seasonPattern: "Đông Xuân / Hè Thu",
    totalDays: 120,
    stageCount: 6,
    description:
      "Bắp LVN10 trồng trên đất cao, yêu cầu thoát nước tốt. Nhấn mạnh giai đoạn bón thúc & phòng sâu keo.",
    status: "active",
    updatedAt: "2025-09-20T02:00:00Z",
  },
  {
    id: "3",
    code: "CYCLE-LUA-95",
    name: "Chu kỳ 95 ngày – Lúa thơm",
    mainCrop: "Lúa",
    seasonPattern: "Vụ Hè Thu muộn",
    totalDays: 95,
    stageCount: 4,
    description:
      "Chu kỳ lúa ngắn ngày, ưu tiên giống thơm ST25. Lịch sạ dày hơn, cần quản lý bệnh đạo ôn chặt.",
    status: "draft",
    updatedAt: "2025-08-15T04:30:00Z",
  },
  {
    id: "4",
    code: "CYCLE-RAU-60",
    name: "Chu kỳ 60 ngày – Rau màu luân canh",
    mainCrop: "Rau màu",
    seasonPattern: "Quanh năm, 4–5 lứa/năm",
    totalDays: 60,
    stageCount: 3,
    description:
      "Chuỗi luân canh rau ăn lá – rau ăn quả, áp dụng cho vùng chuyên canh, sử dụng nhiều nhà lưới.",
    status: "archived",
    updatedAt: "2024-12-01T07:15:00Z",
  },
];

// ================== COLUMNS ==================

const columns: ColumnDef<GrowthCycle>[] = [
  {
    accessorKey: "code",
    header: "Mã chu kỳ",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold">
        {row.original.code}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên chu kỳ",
    cell: ({ row }) => {
      const cycle = row.original;
      return (
        <div className="space-y-0.5">
          <p className="text-xs font-semibold">{cycle.name}</p>
          <p className="text-[11px] text-muted-foreground line-clamp-1">
            {cycle.description}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "mainCrop",
    header: "Cây trồng chính",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-medium">{row.original.mainCrop}</span>
        <span className="text-[11px] text-muted-foreground">
          {row.original.seasonPattern}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "totalDays",
    header: "Thời gian (ngày)",
    cell: ({ row }) => (
      <span className="text-xs font-medium">{row.original.totalDays} ngày</span>
    ),
  },
  {
    accessorKey: "stageCount",
    header: "Số giai đoạn",
    cell: ({ row }) => (
      <span className="text-xs">{row.original.stageCount} giai đoạn</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "updatedAt",
    header: "Cập nhật",
    cell: ({ row }) => {
      const d = new Date(row.original.updatedAt);
      return (
        <span className="text-[11px] text-muted-foreground">
          {d.toLocaleDateString("vi-VN")}{" "}
          {d.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="text-xs">
          <DropdownMenuItem>Chi tiết chu kỳ</DropdownMenuItem>
          <DropdownMenuItem>Nhân bản chu kỳ</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            Ngừng áp dụng
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

// ================== PAGE ==================

export function SeasonCyclePage() {
  const navigate = useNavigate();
  const [cropFilter, setCropFilter] = React.useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | GrowthCycleStatus
  >("all");
  const [search, setSearch] = React.useState("");

  const crops = Array.from(new Set(MOCK_CYCLES.map((c) => c.mainCrop)));

  const filteredData = React.useMemo(() => {
    return MOCK_CYCLES.filter((c) => {
      if (cropFilter !== "all" && c.mainCrop !== cropFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;

      if (search.trim()) {
        const text = search.toLowerCase();
        const haystack =
          `${c.code} ${c.name} ${c.mainCrop} ${c.seasonPattern} ${c.description}`.toLowerCase();
        if (!haystack.includes(text)) return false;
      }

      return true;
    });
  }, [cropFilter, statusFilter, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
            <Sprout className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">
              Quản lý chu kỳ sinh trưởng cây trồng
            </h1>
            <p className="text-xs text-muted-foreground">
              Theo dõi các mô hình chu kỳ (đông xuân, hè thu…) và giai đoạn sinh
              trưởng chuẩn để dùng cho mùa vụ, nhật ký canh tác.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="text-xs bg-primary!"
          onClick={() => navigate("/main/season/cycle/add")}
        >
          + Tạo chu kỳ mới
        </Button>
      </header>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bộ lọc & tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[2fr,1fr,1fr]">
          <div className="md:col-span-1">
            <p className="mb-1 text-[11px] text-muted-foreground">
              Tìm nhanh chu kỳ
            </p>
            <div className="relative">
              <Input
                className="h-8 pl-7"
                placeholder="Nhập mã / tên chu kỳ, cây trồng, mô tả..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="pointer-events-none absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          <div>
            <p className="mb-1 text-[11px] text-muted-foreground">
              Cây trồng chính
            </p>
            <Select
              value={cropFilter}
              onValueChange={(v) => setCropFilter(v as "all" | string)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn cây trồng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {crops.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="mb-1 text-[11px] text-muted-foreground">
              Trạng thái áp dụng
            </p>
            <Select
              value={statusFilter}
              onValueChange={(v) =>
                setStatusFilter(v as "all" | GrowthCycleStatus)
              }
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang áp dụng</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-3 flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => {
                setCropFilter("all");
                setStatusFilter("all");
                setSearch("");
              }}
            >
              <Filter className="mr-1 h-3.5 w-3.5" />
              Xoá bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách chu kỳ sinh trưởng
          </CardTitle>
          <span className="text-[11px] text-muted-foreground">
            Đang hiển thị{" "}
            <span className="font-semibold text-foreground">
              {filteredData.length}
            </span>{" "}
            chu kỳ / {MOCK_CYCLES.length} chu kỳ.
          </span>
        </CardHeader>
        <CardContent>
          {/* DataTable của bạn, truyền columns & data */}
          <DataTable columns={columns} data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}

// ================== SUB COMPONENTS ==================

function StatusBadge({ status }: { status: GrowthCycleStatus }) {
  if (status === "active") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px]">
        Đang áp dụng
      </Badge>
    );
  }
  if (status === "draft") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-[11px]">
        Nháp / đang xây dựng
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-50 text-slate-600 border border-slate-100 text-[11px]">
      Lưu trữ
    </Badge>
  );
}
