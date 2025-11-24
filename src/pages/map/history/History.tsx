"use client";

import { useMemo, useState } from "react";
import { FileDown, Clock, Filter } from "lucide-react";
import { useNavigate } from "react-router";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { DataTable } from "@/components/data-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import type { ColumnDef } from "@tanstack/react-table";

type HistoryRow = {
  id: string;
  index: number;
  executedAt: string;
  action: string;
  infoType: "Lot" | "Row" | "Other";
  infoCode: string;
  actor: string;
};

const MOCK_HISTORY: HistoryRow[] = [
  {
    id: "1",
    index: 1,
    executedAt: "22:01:00 27/6/2025",
    action: "Tạo mới lô LO001 tại KV001",
    infoType: "Lot",
    infoCode: "LO001",
    actor: "Nguyễn Văn A",
  },
  {
    id: "2",
    index: 2,
    executedAt: "22:05:00 27/6/2025",
    action: "Thêm hàng HR001 gồm 20 cây Xoài",
    infoType: "Row",
    infoCode: "HR001",
    actor: "Nguyễn Văn A",
  },
  {
    id: "3",
    index: 3,
    executedAt: "22:10:00 27/6/2025",
    action: "Cập nhật tọa độ GPS cho lô LO001",
    infoType: "Lot",
    infoCode: "LO001",
    actor: "Nguyễn Văn A",
  },
];

const infoTypes = [
  { value: "all", label: "Tất cả loại thông tin" },
  { value: "Lot", label: "Lot" },
  { value: "Row", label: "Row" },
  { value: "Other", label: "Khác" },
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "Lot" | "Row" | "Other">(
    "all"
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return MOCK_HISTORY.filter((row) => {
      const matchesSearch =
        !q ||
        row.action.toLowerCase().includes(q) ||
        row.infoCode.toLowerCase().includes(q) ||
        row.actor.toLowerCase().includes(q);

      const matchesType =
        typeFilter === "all" ? true : row.infoType === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  const columns: ColumnDef<HistoryRow>[] = [
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
      size: 32,
    },
    {
      accessorKey: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.index}
        </span>
      ),
      size: 40,
    },
    {
      accessorKey: "executedAt",
      header: "Thời gian thực hiện",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{row.original.executedAt}</span>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Hành động",
      cell: ({ row }) => <span className="text-xs">{row.original.action}</span>,
    },
    {
      accessorKey: "infoType",
      header: "Loại thông tin",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">{row.original.infoType}</span>
      ),
    },
    {
      accessorKey: "infoCode",
      header: "Mã thông tin",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">{row.original.infoCode}</span>
      ),
    },
    {
      accessorKey: "actor",
      header: "Người thực hiện",
      cell: ({ row }) => <span className="text-xs">{row.original.actor}</span>,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={() => navigate(`/main/lot/${row.original.infoCode}`)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Quản lý lịch sử thay đổi</h1>
          <p className="text-xs text-muted-foreground">
            Theo dõi các thao tác tạo mới, chỉnh sửa, cập nhật GPS… theo từng lô
            và hàng cây.
          </p>
        </div>
        <Button variant="outline" size="sm">
          <FileDown className="mr-1 h-4 w-4" />
          Xuất file
        </Button>
      </header>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Tìm kiếm & lọc lịch sử
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[260px]">
              <Input
                placeholder="Tìm theo hành động, mã thông tin, người thực hiện..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8"
              />
              <Filter className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(v) =>
                setTypeFilter(v as "all" | "Lot" | "Row" | "Other")
              }
            >
              <SelectTrigger className="h-9 w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {infoTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setTypeFilter("all");
              }}
            >
              Làm mới bộ lọc
            </Button>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Đang hiển thị{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            / {MOCK_HISTORY.length} bản ghi.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách lịch sử thay đổi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filtered} filterColumn="action" />
        </CardContent>
      </Card>
    </div>
  );
}
