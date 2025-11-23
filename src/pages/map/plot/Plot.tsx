"use client";

import { useMemo, useState } from "react";
import { Filter, Layers3, FileDown, Plus } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/data-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";

type LotAllocation = {
  id: string;
  code: string;
  name: string;
  areaName: string;
  regionName: string;
  areaSqm: number;
  contourDesc: string;
  rowCount: number;
};

const MOCK_LOTS: LotAllocation[] = [
  {
    id: "1",
    code: "LO-A1",
    name: "Lô A1",
    areaName: "Khu vực A1",
    regionName: "Vùng A",
    areaSqm: 1500,
    contourDesc: "Địa hình dốc nhẹ, từ 48m đến 56m",
    rowCount: 8,
  },
  {
    id: "2",
    code: "LO-B1",
    name: "Lô B1",
    areaName: "Khu vực B1",
    regionName: "Vùng B",
    areaSqm: 2000,
    contourDesc: "Địa hình dốc nhẹ, từ 48m đến 56m",
    rowCount: 12,
  },
  {
    id: "3",
    code: "LO-C1",
    name: "Lô C1",
    areaName: "Khu vực C1",
    regionName: "Vùng C",
    areaSqm: 1800,
    contourDesc: "Địa hình bằng phẳng, cao độ 50m",
    rowCount: 10,
  },
  {
    id: "4",
    code: "LO-D1",
    name: "Lô D1",
    areaName: "Khu vực D1",
    regionName: "Vùng D",
    areaSqm: 2500,
    contourDesc: "Địa hình dốc mạnh, từ 60m đến 70m",
    rowCount: 15,
  },
  {
    id: "5",
    code: "LO-E1",
    name: "Lô E1",
    areaName: "Khu vực E1",
    regionName: "Vùng E",
    areaSqm: 3000,
    contourDesc: "Địa hình trũng, từ 40m đến 45m",
    rowCount: 20,
  },
  {
    id: "6",
    code: "LO-F1",
    name: "Lô F1",
    areaName: "Khu vực F1",
    regionName: "Vùng F",
    areaSqm: 2200,
    contourDesc: "Địa hình đồi núi, từ 55m đến 65m",
    rowCount: 18,
  },
  {
    id: "7",
    code: "LO-G1",
    name: "Lô G1",
    areaName: "Khu vực G1",
    regionName: "Vùng G",
    areaSqm: 1700,
    contourDesc: "Địa hình bằng phẳng, cao độ 52m",
    rowCount: 9,
  },
  {
    id: "8",
    code: "LO-H1",
    name: "Lô H1",
    areaName: "Khu vực H1",
    regionName: "Vùng H",
    areaSqm: 2800,
    contourDesc: "Địa hình dốc nhẹ, từ 50m đến 58m",
    rowCount: 14,
  },
];

const regions = Array.from(new Set(MOCK_LOTS.map((l) => l.regionName)));
const areas = Array.from(new Set(MOCK_LOTS.map((l) => l.areaName)));
const terrainHeads = Array.from(
  new Set(MOCK_LOTS.map((l) => l.contourDesc.split(",")[0]))
);

function formatArea(m2: number) {
  return `${m2.toLocaleString("vi-VN")} m²`;
}

export default function PlotPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [terrainFilter, setTerrainFilter] = useState<string>("all");

  const appliedFilters = useMemo(
    () =>
      [
        !!search.trim(),
        regionFilter !== "all",
        areaFilter !== "all",
        terrainFilter !== "all",
      ].filter(Boolean).length,
    [search, regionFilter, areaFilter, terrainFilter]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return MOCK_LOTS.filter((row) => {
      const matchesSearch =
        !q ||
        row.code.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.areaName.toLowerCase().includes(q) ||
        row.regionName.toLowerCase().includes(q) ||
        row.contourDesc.toLowerCase().includes(q);

      const matchesRegion =
        regionFilter === "all" ? true : row.regionName === regionFilter;
      const matchesArea =
        areaFilter === "all" ? true : row.areaName === areaFilter;
      const head = row.contourDesc.split(",")[0];
      const matchesTerrain =
        terrainFilter === "all" ? true : head === terrainFilter;

      return matchesSearch && matchesRegion && matchesArea && matchesTerrain;
    });
  }, [search, regionFilter, areaFilter, terrainFilter]);

  const columns: ColumnDef<LotAllocation>[] = [
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
      id: "index",
      header: "#",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">{row.index + 1}</span>
      ),
      size: 40,
    },
    {
      accessorKey: "code",
      header: "Mã lô",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: "Lô",
      cell: ({ row }) => (
        <span className="text-xs font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "areaName",
      header: "Khu vực",
      cell: ({ row }) => (
        <span className="text-xs">{row.original.areaName}</span>
      ),
    },
    {
      accessorKey: "regionName",
      header: "Vùng",
      cell: ({ row }) => (
        <span className="text-xs">{row.original.regionName}</span>
      ),
    },
    {
      accessorKey: "areaSqm",
      header: "Diện tích (m²)",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">
          {formatArea(row.original.areaSqm)}
        </span>
      ),
    },
    {
      accessorKey: "contourDesc",
      header: "Đường bình độ",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.contourDesc}
        </span>
      ),
    },
    {
      accessorKey: "rowCount",
      header: "Số hàng",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">{row.original.rowCount}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={() => navigate(`/main/map/plot/detail`)}
          onEdit={() => navigate(`/main/map/plot/edit`)}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Layers3 className="h-5 w-5 text-emerald-600" />
            Phân bổ lô trồng
          </h1>
          <p className="text-xs text-muted-foreground">
            Tìm kiếm và lọc danh sách lô theo vùng, khu vực, địa hình.
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
            onClick={() => navigate("/main/map/plot/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm lô
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Tìm kiếm & lọc lô
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Lọc theo vùng, khu vực, địa hình hoặc tìm nhanh theo mã lô, tên lô,
            khu vực, vùng trồng.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[260px]">
              <Input
                placeholder="Nhập LO-A1, Lô A1, Khu vực A1, Vùng A..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9"
              />
              <Filter className="pointer-events-none absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-10 text-xs"
              onClick={() => {
                setSearch("");
                setRegionFilter("all");
                setAreaFilter("all");
                setTerrainFilter("all");
              }}
            >
              Làm mới bộ lọc
            </Button>
          </div>

          <div className="grid items-end gap-3 md:grid-cols-4">
            <div className="space-y-1 md:col-span-1">
              <p className="text-xs text-muted-foreground">Vùng trồng</p>
              <Select
                value={regionFilter}
                onValueChange={(v) => setRegionFilter(v)}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 md:col-span-1">
              <p className="text-xs text-muted-foreground">Khu vực</p>
              <Select
                value={areaFilter}
                onValueChange={(v) => setAreaFilter(v)}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {areas.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 md:col-span-1">
              <p className="text-xs text-muted-foreground">Địa hình</p>
              <Select
                value={terrainFilter}
                onValueChange={(v) => setTerrainFilter(v)}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {terrainHeads.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden h-full md:col-span-1 md:flex">
              <div className="flex w-full flex-col justify-center rounded-md border border-dashed border-muted-foreground/40 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
                <span className="mb-0.5 font-medium text-foreground">
                  Đang hiển thị {filtered.length} / {MOCK_LOTS.length} lô
                </span>
                <span>
                  Áp dụng{" "}
                  <span className="font-semibold text-foreground">
                    {appliedFilters}
                  </span>{" "}
                  bộ lọc
                </span>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <div className="rounded-md border border-dashed border-muted-foreground/40 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">
                Đang hiển thị {filtered.length} / {MOCK_LOTS.length} lô
              </span>
              <br />
              <span>
                Áp dụng{" "}
                <span className="font-semibold text-foreground">
                  {appliedFilters}
                </span>{" "}
                bộ lọc
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách phân bổ lô
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filtered} filterColumn="name" />
        </CardContent>
      </Card>
    </div>
  );
}
