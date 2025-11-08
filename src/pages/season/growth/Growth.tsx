// src/pages/season/SeasonListPage.tsx
"use client";

import * as React from "react";
import { CalendarRange, FileDown, Plus, Filter, Search } from "lucide-react";

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

import { DataTable } from "@/components/data-table"; // data table của bạn
import { Sprout, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { useNavigate } from "react-router";

export type Season = {
  id: number;
  code: string;
  name: string;
  estimatedDays: number;
  crop: string;
  growthCycle: string;
};

export const seasonColumns: ColumnDef<Season>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.index + 1}</span>
    ),
    size: 40,
  },
  {
    accessorKey: "code",
    header: "Mã mùa vụ",
    cell: ({ row }) => (
      <span className="font-mono text-[11px]">{row.original.code}</span>
    ),
    size: 120,
  },
  {
    accessorKey: "name",
    header: "Mùa vụ",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-medium">{row.original.name}</span>
      </div>
    ),
    size: 220,
  },
  {
    accessorKey: "estimatedDays",
    header: () => <span className="text-xs">Thời gian ước tính (ngày)</span>,
    cell: ({ row }) => (
      <div className="flex items-center ">
        <Badge
          variant="outline"
          className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
        >
          {row.original.estimatedDays} ngày
        </Badge>
      </div>
    ),

    enableSorting: true,
    size: 130,
  },
  {
    accessorKey: "crop",
    header: "Cây trồng chính",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Sprout className="h-3.5 w-3.5 text-emerald-600" />
        <span className="text-xs">{row.original.crop}</span>
      </div>
    ),
    size: 180,
  },
  {
    accessorKey: "growthCycle",
    header: "Chu kỳ sinh trưởng",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.growthCycle}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    size: 60,
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

// ===== MOCK DATA =====
const MOCK_SEASONS: Season[] = [
  {
    id: 1,
    code: "MSV2025XUAN",
    name: "Mùa vụ Xuân 2025",
    estimatedDays: 95,
    crop: "Đậu nành DT84",
    growthCycle: "Nảy mầm (5–7 ngày)",
  },
  {
    id: 2,
    code: "MSV2025HE",
    name: "Mùa vụ Hè 2025",
    estimatedDays: 105,
    crop: "Đậu nành DX11",
    growthCycle: "Ra hoa (7–10 ngày)",
  },
  {
    id: 3,
    code: "MSV2025THU",
    name: "Mùa vụ Thu 2025",
    estimatedDays: 115,
    crop: "Bắp LVN10",
    growthCycle: "Trổ cờ / Phun râu (7–10 ngày)",
  },
  {
    id: 4,
    code: "MSV2025DONG",
    name: "Mùa vụ Đông 2025",
    estimatedDays: 120,
    crop: "Bắp NK66",
    growthCycle: "Làm hạt (25–35 ngày)",
  },
  {
    id: 5,
    code: "MSV2026XUAN",
    name: "Mùa vụ Xuân 2026",
    estimatedDays: 100,
    crop: "Đậu nành DT84",
    growthCycle: "Tạo hạt (25–35 ngày)",
  },
  {
    id: 6,
    code: "MSV2026HE",
    name: "Mùa vụ Hè 2026",
    estimatedDays: 110,
    crop: "Đậu nành DX11",
    growthCycle: "Chín (10–15 ngày)",
  },
  {
    id: 7,
    code: "MSV2026THU",
    name: "Mùa vụ Thu 2026",
    estimatedDays: 125,
    crop: "Bắp LVN10",
    growthCycle: "Trổ cờ / Phun râu (7–10 ngày)",
  },
  {
    id: 8,
    code: "MSV2026DONG",
    name: "Mùa vụ Đông 2026",
    estimatedDays: 130,
    crop: "Bắp NK66",
    growthCycle: "Chín sáp / Chín khô (20–30 ngày)",
  },
];

export default function SeasonGrowthPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = React.useState("");
  const [cropFilter, setCropFilter] = React.useState<"all" | string>("all");
  const [cycleFilter, setCycleFilter] = React.useState<"all" | string>("all");

  const cropOptions = Array.from(new Set(MOCK_SEASONS.map((s) => s.crop)));
  const cycleOptions = Array.from(
    new Set(MOCK_SEASONS.map((s) => s.growthCycle))
  );

  const filteredData = React.useMemo(() => {
    let list = MOCK_SEASONS;

    if (cropFilter !== "all") {
      list = list.filter((s) => s.crop === cropFilter);
    }
    if (cycleFilter !== "all") {
      list = list.filter((s) => s.growthCycle === cycleFilter);
    }
    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      list = list.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.crop.toLowerCase().includes(q)
      );
    }

    return list;
  }, [keyword, cropFilter, cycleFilter]);

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
            <CalendarRange className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Quản lý mùa vụ</h1>
            <p className="text-xs text-muted-foreground">
              Danh sách mùa vụ gieo trồng, thời gian ước tính và cây trồng
              chính.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Button variant="outline" size="sm">
            <FileDown className="mr-1 h-4 w-4" />
            Xuất file
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={() => navigate("/main/season/growth/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm mùa vụ
          </Button>
        </div>
      </header>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bộ lọc & tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[2fr,1fr,1fr] text-xs">
          {/* search */}
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">
              Từ khóa (mã / tên mùa vụ / cây trồng)
            </p>
            <div className="relative">
              <Input
                className="h-8 pl-7"
                placeholder="VD: Xuân 2025, Đậu nành..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <Search className="pointer-events-none absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>

          {/* crop */}
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">Cây trồng chính</p>
            <Select
              value={cropFilter}
              onValueChange={(v) => setCropFilter(v as "all" | string)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Tất cả cây" />
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

          {/* cycle */}
          <div className="space-y-1">
            <p className="text-[11px] text-muted-foreground">
              Chu kỳ sinh trưởng
            </p>
            <Select
              value={cycleFilter}
              onValueChange={(v) => setCycleFilter(v as "all" | string)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Tất cả chu kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {cycleOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* reset */}
          <div className="md:col-span-3 flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-1 text-[11px]"
              onClick={() => {
                setKeyword("");
                setCropFilter("all");
                setCycleFilter("all");
              }}
            >
              <Filter className="mr-1 h-3.5 w-3.5" />
              Làm mới bộ lọc
            </Button>
          </div>

          <p className="md:col-span-3 text-[11px] text-muted-foreground">
            Đang hiển thị{" "}
            <span className="font-semibold text-foreground">
              {filteredData.length}
            </span>{" "}
            mùa vụ.
          </p>
        </CardContent>
      </Card>

      {/* DATATABLE */}
      <Card>
        <CardContent className="pt-3">
          {/* DataTable của bạn lo phần sort / paging nội bộ */}
          <DataTable columns={seasonColumns} data={filteredData} />
        </CardContent>
      </Card>
    </div>
  );
}
