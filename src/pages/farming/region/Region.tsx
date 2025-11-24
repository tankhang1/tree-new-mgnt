"use client";

import { useMemo, useState } from "react";
import { Filter, TreesIcon as Trees, FileDown, Plus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";

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

type CultivationAreaRow = {
  id: string;
  index: number;
  province: string;
  ward: string;
  regionName: string;
  areaName: string;
  lotName: string;
  areaM2: number;
  cropName: string;
  managerName: string;
  soilType: string;
  terrain: string;
};

const MOCK_AREAS: CultivationAreaRow[] = [
  {
    id: "1",
    index: 1,
    province: "An Giang",
    ward: "TP. Long Xuyên",
    regionName: "Vùng Đậu Nành An Giang",
    areaName: "Khu vực DBSCL",
    lotName: "Cánh đồng A1",
    areaM2: 10000,
    cropName: "Đậu nành",
    managerName: "Nguyễn Văn A",
    soilType: "Đất phù sa",
    terrain: "Bằng phẳng, ven sông",
  },
  {
    id: "2",
    index: 2,
    province: "Vĩnh Long",
    ward: "Thị xã Bình Minh",
    regionName: "Vùng Bắp Vĩnh Long",
    areaName: "Khu vực DBSCL",
    lotName: "Cánh đồng C2",
    areaM2: 7000,
    cropName: "Bắp (Ngô)",
    managerName: "Hoàng Thị F",
    soilType: "Đất phù sa",
    terrain: "Đồng bằng, ven kênh",
  },
  {
    id: "3",
    index: 3,
    province: "Tiền Giang",
    ward: "TP. Mỹ Tho",
    regionName: "Vùng Bắp Tiền Giang",
    areaName: "Khu vực DBSCL",
    lotName: "Cánh đồng G3",
    areaM2: 8500,
    cropName: "Bắp (Ngô)",
    managerName: "Trần Thị B",
    soilType: "Đất thịt nhẹ",
    terrain: "Bằng phẳng",
  },
  {
    id: "4",
    index: 4,
    province: "Long An",
    ward: "Huyện Đức Hòa",
    regionName: "Vùng Đậu Nành Long An",
    areaName: "Khu vực Đông Nam Bộ",
    lotName: "Lô ĐN-01",
    areaM2: 6000,
    cropName: "Đậu nành",
    managerName: "Lê Văn C",
    soilType: "Đất đỏ bazan",
    terrain: "Thoai thoải",
  },
  {
    id: "5",
    index: 5,
    province: "Đồng Tháp",
    ward: "Huyện Tháp Mười",
    regionName: "Vùng Bắp Đồng Tháp",
    areaName: "Khu vực DBSCL",
    lotName: "Cánh đồng B5",
    areaM2: 12000,
    cropName: "Bắp (Ngô)",
    managerName: "Phạm Thị D",
    soilType: "Đất phù sa",
    terrain: "Đồng trũng",
  },
  {
    id: "6",
    index: 6,
    province: "Kiên Giang",
    ward: "Huyện Tân Hiệp",
    regionName: "Vùng Đậu Nành Kiên Giang",
    areaName: "Khu vực DBSCL",
    lotName: "Cánh đồng K1",
    areaM2: 9500,
    cropName: "Đậu nành",
    managerName: "Nguyễn Văn E",
    soilType: "Đất thịt",
    terrain: "Bằng phẳng",
  },
];

const crops = Array.from(new Set(MOCK_AREAS.map((a) => a.cropName)));
const provinces = Array.from(new Set(MOCK_AREAS.map((a) => a.province)));
const wards = Array.from(new Set(MOCK_AREAS.map((a) => a.ward)));
const soilTypes = Array.from(new Set(MOCK_AREAS.map((a) => a.soilType)));
const terrains = Array.from(new Set(MOCK_AREAS.map((a) => a.terrain)));

function formatArea(m2: number) {
  return `${m2.toLocaleString("vi-VN")} m²`;
}

function TerrainBadge({ value }: { value: string }) {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-muted-foreground/40 bg-muted/60 px-2 py-0 text-[10px] font-medium"
    >
      {value}
    </Badge>
  );
}

export default function FarmingRegionPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [cropFilter, setCropFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [wardFilter, setWardFilter] = useState("all");
  const [soilFilter, setSoilFilter] = useState("all");
  const [terrainFilter, setTerrainFilter] = useState("all");

  const appliedFilters = useMemo(
    () =>
      [
        cropFilter !== "all",
        provinceFilter !== "all",
        wardFilter !== "all",
        soilFilter !== "all",
        terrainFilter !== "all",
        !!search.trim(),
      ].filter(Boolean).length,
    [cropFilter, provinceFilter, wardFilter, soilFilter, terrainFilter, search]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return MOCK_AREAS.filter((row) => {
      const matchesSearch =
        !q ||
        row.regionName.toLowerCase().includes(q) ||
        row.areaName.toLowerCase().includes(q) ||
        row.lotName.toLowerCase().includes(q) ||
        row.managerName.toLowerCase().includes(q);

      const matchesCrop =
        cropFilter === "all" ? true : row.cropName === cropFilter;
      const matchesProvince =
        provinceFilter === "all" ? true : row.province === provinceFilter;
      const matchesWard = wardFilter === "all" ? true : row.ward === wardFilter;
      const matchesSoil =
        soilFilter === "all" ? true : row.soilType === soilFilter;
      const matchesTerrain =
        terrainFilter === "all" ? true : row.terrain === terrainFilter;

      return (
        matchesSearch &&
        matchesCrop &&
        matchesProvince &&
        matchesWard &&
        matchesSoil &&
        matchesTerrain
      );
    });
  }, [
    search,
    cropFilter,
    provinceFilter,
    wardFilter,
    soilFilter,
    terrainFilter,
  ]);

  const columns: ColumnDef<CultivationAreaRow>[] = [
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
      accessorKey: "province",
      header: "Tỉnh/Thành phố",
      cell: ({ row }) => (
        <span className="text-xs font-medium">{row.original.province}</span>
      ),
    },
    {
      accessorKey: "ward",
      header: "Phường/Xã",
      cell: ({ row }) => <span className="text-xs">{row.original.ward}</span>,
    },
    {
      accessorKey: "regionName",
      header: "Vùng",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{row.original.regionName}</span>
          <span className="text-[11px] text-muted-foreground">
            Khu vực: {row.original.areaName}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "lotName",
      header: "Lô",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">{row.original.lotName}</span>
      ),
    },
    {
      accessorKey: "areaM2",
      header: "Diện tích canh tác (m²)",
      cell: ({ row }) => (
        <span className="text-xs font-semibold">
          {formatArea(row.original.areaM2)}
        </span>
      ),
    },
    {
      accessorKey: "cropName",
      header: "Cây trồng",
      cell: ({ row }) => (
        <span className="text-xs">{row.original.cropName}</span>
      ),
    },
    {
      accessorKey: "managerName",
      header: "Người quản lý",
      cell: ({ row }) => (
        <span className="text-xs">{row.original.managerName}</span>
      ),
    },
    {
      accessorKey: "terrain",
      header: "Địa hình",
      cell: ({ row }) => <TerrainBadge value={row.original.terrain} />,
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onView={() => navigate(`/main/cultivation-areas/${row.original.id}`)}
          onEdit={() =>
            navigate(`/main/cultivation-areas/${row.original.id}/edit`)
          }
        />
      ),
    },
  ];

  const resetFilters = () => {
    setSearch("");
    setCropFilter("all");
    setProvinceFilter("all");
    setWardFilter("all");
    setSoilFilter("all");
    setTerrainFilter("all");
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Trees className="h-5 w-5 text-emerald-600" />
            Khu vực canh tác
          </h1>
          <p className="text-xs text-muted-foreground">
            Quản lý danh mục khu vực canh tác theo vùng, lô, cây trồng và người
            quản lý.
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
            onClick={() => navigate("/main/farming/region/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm mới
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Tìm kiếm khu vực canh tác
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Điền từ khóa hoặc chọn lọc theo cây trồng chính, loại đất, địa hình,
            tỉnh/thành phố, phường/xã.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[260px]">
              <Input
                placeholder="Nhập tên vùng, khu vực, người quản lý..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 pl-9"
              />
              <Filter className="pointer-events-none absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetFilters}
              >
                Làm mới
              </Button>
              <Button type="button" size="sm" variant="outline">
                Lọc thông tin
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-5 items-end">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Cây trồng chính</p>
              <Select
                value={cropFilter}
                onValueChange={(v) => setCropFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
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

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Loại đất</p>
              <Select
                value={soilFilter}
                onValueChange={(v) => setSoilFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
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

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Địa hình</p>
              <Select
                value={terrainFilter}
                onValueChange={(v) => setTerrainFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {terrains.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Tỉnh/Thành phố</p>
              <Select
                value={provinceFilter}
                onValueChange={(v) => setProvinceFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {provinces.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Phường/Xã</p>
              <Select
                value={wardFilter}
                onValueChange={(v) => setWardFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {wards.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border border-dashed border-muted-foreground/40 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">
              Đang hiển thị {filtered.length} / {MOCK_AREAS.length} khu vực canh
              tác
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách khu vực canh tác
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filtered}
            filterColumn="regionName"
          />
        </CardContent>
      </Card>
    </div>
  );
}
