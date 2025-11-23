"use client";

import { useMemo, useState } from "react";
import {
  Filter,
  Layers3,
  TreesIcon as Trees,
  FileDown,
  Plus,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";

type AreaRow = {
  id: string;
  index: number;
  areaCode: string;
  areaName: string;
  regionName: string;
  mainCrop: string;
  areaM2: number;
  soilType: string;
  terrainTags: string[];
  plotsCount: number;
};

const AREAS: AreaRow[] = [
  {
    id: "1",
    index: 1,
    areaCode: "KV-A1",
    areaName: "Khu vực A1",
    regionName: "Vùng Trồng A",
    mainCrop: "Đậu nành",
    areaM2: 10000,
    soilType: "Đất thịt",
    terrainTags: ["CAO", "DỐC"],
    plotsCount: 5,
  },
  {
    id: "2",
    index: 2,
    areaCode: "KV-B2",
    areaName: "Khu vực B2",
    regionName: "Vùng Trồng B",
    mainCrop: "Đậu nành",
    areaM2: 8500,
    soilType: "Đất phù sa",
    terrainTags: ["THẤP", "TRŨNG"],
    plotsCount: 3,
  },
  {
    id: "3",
    index: 3,
    areaCode: "KV-C1",
    areaName: "Khu vực C1",
    regionName: "Vùng Trồng C",
    mainCrop: "Bắp",
    areaM2: 6000,
    soilType: "Đất cát",
    terrainTags: ["BẰNG PHẲNG"],
    plotsCount: 4,
  },
  {
    id: "4",
    index: 4,
    areaCode: "KV-D3",
    areaName: "Khu vực D3",
    regionName: "Vùng Trồng D",
    mainCrop: "Bắp",
    areaM2: 12000,
    soilType: "Đất đỏ bazan",
    terrainTags: ["CAO", "BẰNG PHẲNG"],
    plotsCount: 6,
  },
  {
    id: "5",
    index: 5,
    areaCode: "KV-E4",
    areaName: "Khu vực E4",
    regionName: "Vùng Trồng E",
    mainCrop: "Đậu nành",
    areaM2: 9500,
    soilType: "Đất sét",
    terrainTags: ["DỐC", "THẤP"],
    plotsCount: 4,
  },
  {
    id: "6",
    index: 6,
    areaCode: "KV-F5",
    areaName: "Khu vực F5",
    regionName: "Vùng Trồng F",
    mainCrop: "Bắp",
    areaM2: 7000,
    soilType: "Đất phù sa",
    terrainTags: ["TRŨNG"],
    plotsCount: 3,
  },
  {
    id: "7",
    index: 7,
    areaCode: "KV-G6",
    areaName: "Khu vực G6",
    regionName: "Vùng Trồng G",
    mainCrop: "Bắp",
    areaM2: 11000,
    soilType: "Đất thịt",
    terrainTags: ["CAO", "DỐC"],
    plotsCount: 5,
  },
  {
    id: "8",
    index: 8,
    areaCode: "KV-H7",
    areaName: "Khu vực H7",
    regionName: "Vùng Trồng H",
    mainCrop: "Đậu nành",
    areaM2: 8000,
    soilType: "Đất đỏ bazan",
    terrainTags: ["BẰNG PHẲNG"],
    plotsCount: 4,
  },
];

const crops = Array.from(new Set(AREAS.map((a) => a.mainCrop)));
const soilTypes = Array.from(new Set(AREAS.map((a) => a.soilType)));
const terrainTags = Array.from(
  new Set(AREAS.flatMap((a) => a.terrainTags))
).sort();

function formatArea(m2: number) {
  const ha = m2 / 10000;
  return `${m2.toLocaleString("vi-VN")} m² (${ha.toFixed(1)} ha)`;
}

function TerrainBadges({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <Badge
          key={t}
          variant="outline"
          className="rounded-full border-muted-foreground/40 bg-muted/60 px-2 py-0 text-[10px] font-medium"
        >
          {t}
        </Badge>
      ))}
    </div>
  );
}

export default function AreaPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState<string>("all");
  const [soilFilter, setSoilFilter] = useState<string>("all");
  const [terrainFilter, setTerrainFilter] = useState<string>("all");
  const appliedFilters = useMemo(
    () =>
      [
        cropFilter !== "all",
        soilFilter !== "all",
        terrainFilter !== "all",
        !!search.trim(),
      ].filter(Boolean).length,
    [cropFilter, soilFilter, terrainFilter, search]
  );
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return AREAS.filter((row) => {
      const matchesSearch =
        !q ||
        row.areaCode.toLowerCase().includes(q) ||
        row.areaName.toLowerCase().includes(q) ||
        row.regionName.toLowerCase().includes(q) ||
        row.mainCrop.toLowerCase().includes(q);

      const matchesCrop =
        cropFilter === "all" ? true : row.mainCrop === cropFilter;
      const matchesSoil =
        soilFilter === "all" ? true : row.soilType === soilFilter;
      const matchesTerrain =
        terrainFilter === "all"
          ? true
          : row.terrainTags.includes(terrainFilter);

      return matchesSearch && matchesCrop && matchesSoil && matchesTerrain;
    });
  }, [search, cropFilter, soilFilter, terrainFilter]);

  const columns: ColumnDef<AreaRow>[] = [
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
      accessorKey: "areaCode",
      header: "Mã khu vực",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">{row.original.areaCode}</span>
      ),
    },
    {
      accessorKey: "areaName",
      header: "Khu vực",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{row.original.areaName}</span>
          <span className="text-[11px] text-muted-foreground">
            Cây trồng chính: {row.original.mainCrop}
          </span>
        </div>
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
      accessorKey: "areaM2",
      header: "Diện tích (m²)",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">
          {formatArea(row.original.areaM2)}
        </span>
      ),
    },
    {
      accessorKey: "soilType",
      header: "Loại đất",
      cell: ({ row }) => (
        <span className="text-xs">{row.original.soilType}</span>
      ),
    },
    {
      accessorKey: "terrainTags",
      header: "Địa hình",
      cell: ({ row }) => <TerrainBadges tags={row.original.terrainTags} />,
    },
    {
      accessorKey: "plotsCount",
      header: "Số lô",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">{row.original.plotsCount}</span>
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
          onView={() => navigate(`/main/map/area/detail`)}
          more={[
            {
              label: "Xem vùng trồng",
              onClick: () =>
                navigate(`/main/crop/fields/${row.original.regionName}`),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Trees className="h-5 w-5 text-emerald-600" />
            Tìm kiếm khu vực
          </h1>
          <p className="text-xs text-muted-foreground">
            Điền từ khóa hoặc lọc theo cây trồng chính, loại đất, địa hình.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch("");
              setCropFilter("all");
              setSoilFilter("all");
              setTerrainFilter("all");
            }}
          >
            Làm mới
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={() => navigate("/main/map/area/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm khu vực
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Tìm kiếm & lọc khu vực
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Lọc theo cây trồng chính, loại đất, địa hình hoặc tìm nhanh theo mã
            khu vực, tên khu vực, vùng trồng.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Hàng 1: search + làm mới */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[260px]">
              <Input
                placeholder="Nhập KV-AG01, Vùng Trồng Đậu Nành, HTX Vàm Nao..."
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
                setCropFilter("all");
                setSoilFilter("all");
                setTerrainFilter("all");
              }}
            >
              Làm mới bộ lọc
            </Button>
          </div>

          {/* Hàng 2: 3 filter + box thông tin */}
          <div className="grid gap-3 md:grid-cols-4 items-end">
            {/* Cây trồng chính */}
            <div className="space-y-1 md:col-span-1">
              <p className="text-xs text-muted-foreground">Cây trồng chính</p>
              <Select
                value={cropFilter}
                onValueChange={(v) => setCropFilter(v)}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Tất cả" />
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

            {/* Loại đất */}
            <div className="space-y-1 md:col-span-1">
              <p className="text-xs text-muted-foreground">Loại đất</p>
              <Select
                value={soilFilter}
                onValueChange={(v) => setSoilFilter(v)}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {soilTypes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Địa hình */}
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
                  {terrainTags.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Box thông tin bên phải */}
            <div className="hidden md:flex md:col-span-1 h-full">
              <div className="flex flex-col justify-center rounded-md border border-dashed border-muted-foreground/40 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground w-full">
                <span className="font-medium text-foreground mb-0.5">
                  Đang hiển thị {filtered.length} / {AREAS.length} khu vực
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

          {/* Box thông tin cho mobile */}
          <div className="md:hidden">
            <div className="rounded-md border border-dashed border-muted-foreground/40 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">
                Đang hiển thị {filtered.length} / {AREAS.length} khu vực
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
            Danh sách khu vực
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filtered}
            filterColumn="areaName"
          />
        </CardContent>
      </Card>
    </div>
  );
}
