"use client";

import { useMemo, useState } from "react";
import {
  Filter,
  Map,
  MapPin,
  TreesIcon as Trees,
  FileDown,
  Plus,
} from "lucide-react";

import { useNavigate } from "react-router";
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
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "@/components/data-table-row-actions";
import { SummaryCard } from "./components/SummaryCard";

type TerrainTag =
  | "bang-phang"
  | "ven-song"
  | "ven-bien"
  | "trung-nhe"
  | "doi-thap"
  | "thoai-thoai"
  | "ven-kenh";

type Region = {
  id: string;
  index: number;
  regionCode: string;
  regionName: string;
  farmerName: string;
  province: string;
  district: string;
  ward: string;
  areaM2: number;
  soilType: string;
  terrain: TerrainTag[];
};

const regions: Region[] = [
  {
    id: "1",
    index: 1,
    regionCode: "KV-AG01",
    regionName: "Vùng Trồng Đậu Nành An Giang",
    farmerName: "HTX Nông nghiệp Vạn Nao",
    province: "An Giang",
    district: "TP. Long Xuyên",
    ward: "P. Long Xuyên",
    areaM2: 15000,
    soilType: "Đất phù sa",
    terrain: ["bang-phang", "ven-song"],
  },
  {
    id: "2",
    index: 2,
    regionCode: "KV-TG01",
    regionName: "Vùng Đậu Nành Tiền Giang",
    farmerName: "Hộ Ông Trần Văn H.",
    province: "Tiền Giang",
    district: "TP. Mỹ Tho",
    ward: "P. Mỹ Tho",
    areaM2: 12000,
    soilType: "Đất phù sa",
    terrain: ["bang-phang", "trung-nhe"],
  },
  {
    id: "3",
    index: 3,
    regionCode: "KV-CT01",
    regionName: "Vùng Đậu Nành Cần Thơ – Hậu Giang",
    farmerName: "Hộ Bà Nguyễn Thị L.",
    province: "Cần Thơ",
    district: "Quận Cái Răng",
    ward: "P. Cái Răng",
    areaM2: 18000,
    soilType: "Đất phù sa",
    terrain: ["bang-phang", "ven-kenh"],
  },
  {
    id: "4",
    index: 4,
    regionCode: "KV-LA01",
    regionName: "Vùng Đậu Nành Long An",
    farmerName: "HTX Đức Hòa",
    province: "Long An",
    district: "Huyện Đức Hòa",
    ward: "X. Đức Hòa",
    areaM2: 25000,
    soilType: "Đất thịt nhẹ",
    terrain: ["bang-phang"],
  },
  {
    id: "5",
    index: 5,
    regionCode: "KV-GL01",
    regionName: "Vùng Đậu Nành Tây Nguyên",
    farmerName: "Công ty TNHH GreenFarm",
    province: "Gia Lai",
    district: "Huyện Ia Grai",
    ward: "X. Ia Grai",
    areaM2: 32000,
    soilType: "Đất đỏ bazan",
    terrain: ["thoai-thoai", "doi-thap"],
  },
];

function formatTerrainTag(tag: TerrainTag) {
  if (tag === "bang-phang") return "Bằng phẳng";
  if (tag === "ven-song") return "Ven sông";
  if (tag === "ven-bien") return "Ven biển";
  if (tag === "trung-nhe") return "Trũng nhẹ";
  if (tag === "doi-thap") return "Đồi thấp";
  if (tag === "thoai-thoai") return "Thoải thoải";
  return tag;
}

function TerrainBadges({ tags }: { tags: TerrainTag[] }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => (
        <Badge
          key={t}
          variant="outline"
          className="border-muted-foreground/40 bg-muted/40 px-2 py-0 text-[10px] font-medium"
        >
          {formatTerrainTag(t)}
        </Badge>
      ))}
    </div>
  );
}

export default function RegionPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [soilFilter, setSoilFilter] = useState<string>("all");
  const [wardFilter, setWardFilter] = useState<string>("all");

  const totalRegions = regions.length;
  const totalAreaM2 = regions.reduce((s, r) => s + r.areaM2, 0);

  const uniqueProvinces = Array.from(new Set(regions.map((r) => r.province)));
  const uniqueSoils = Array.from(new Set(regions.map((r) => r.soilType)));
  const uniqueWards = Array.from(new Set(regions.map((r) => r.ward)));

  const filteredRegions = useMemo(() => {
    const q = search.toLowerCase().trim();

    return regions.filter((r) => {
      const matchesSearch =
        !q ||
        r.regionCode.toLowerCase().includes(q) ||
        r.regionName.toLowerCase().includes(q) ||
        r.farmerName.toLowerCase().includes(q) ||
        r.province.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        r.ward.toLowerCase().includes(q);

      const matchesProvince =
        provinceFilter === "all" ? true : r.province === provinceFilter;

      const matchesSoil =
        soilFilter === "all" ? true : r.soilType === soilFilter;

      const matchesWard = wardFilter === "all" ? true : r.ward === wardFilter;

      return matchesSearch && matchesProvince && matchesSoil && matchesWard;
    });
  }, [search, provinceFilter, soilFilter, wardFilter]);

  const activeFilterCount = [
    provinceFilter !== "all",
    soilFilter !== "all",
    wardFilter !== "all",
  ].filter(Boolean).length;

  const columns: ColumnDef<Region>[] = useMemo(
    () => [
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
        accessorKey: "regionCode",
        header: "Mã vùng",
        cell: ({ row }) => (
          <span className="text-xs font-semibold">
            {row.original.regionCode}
          </span>
        ),
      },
      {
        accessorKey: "regionName",
        header: "Vùng",
        cell: ({ row }) => (
          <div className="flex flex-col text-xs max-w-[260px]">
            <span className="font-medium">{row.original.regionName}</span>
          </div>
        ),
      },
      {
        accessorKey: "farmerName",
        header: "Doanh nghiệp / nông hộ",
        cell: ({ row }) => (
          <span className="text-xs">{row.original.farmerName}</span>
        ),
      },
      {
        accessorKey: "province",
        header: "Tỉnh/Thành phố",
        cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <span>{row.original.province}</span>
            <span className="text-[11px] text-muted-foreground">
              {row.original.district}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "ward",
        header: "Phường/Xã",
        cell: ({ row }) => <span className="text-xs">{row.original.ward}</span>,
      },
      {
        accessorKey: "areaM2",
        header: "Diện tích (m²)",
        cell: ({ row }) => (
          <span className="text-xs font-semibold">
            {row.original.areaM2.toLocaleString("vi-VN")} m²
          </span>
        ),
      },
      {
        accessorKey: "soilType",
        header: "Loại đất",
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="border-emerald-100 bg-emerald-50 text-[10px] font-medium text-emerald-700"
          >
            {row.original.soilType}
          </Badge>
        ),
      },
      {
        accessorKey: "terrain",
        header: "Địa hình",
        cell: ({ row }) => <TerrainBadges tags={row.original.terrain} />,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        enableHiding: false,
        cell: ({ row }) => (
          <DataTableRowActions
            row={row}
            onView={() => navigate("/main/map/region/detail")}
            onEdit={() => navigate("/main/map/region/edit")}
          />
        ),
      },
    ],
    [navigate]
  );

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <Trees className="h-5 w-5 text-emerald-600" />
            Phân bổ vùng trồng
          </h1>
          <p className="text-xs text-muted-foreground">
            Quản lý danh mục vùng trồng, doanh nghiệp/nông hộ, tỉnh thành và
            diện tích theo từng vùng.
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
            onClick={() => navigate("/main/map/region/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm vùng mới
          </Button>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tổng số vùng"
          value={totalRegions.toString()}
          sub="Số vùng đang quản lý"
          icon={<Map className="h-5 w-5 text-emerald-600" />}
        />
        <SummaryCard
          title="Tổng diện tích"
          value={`${totalAreaM2.toLocaleString("vi-VN")} m²`}
          sub="Diện tích tất cả vùng"
          icon={<MapPin className="h-5 w-5 text-sky-600" />}
        />
        <SummaryCard
          title="Số tỉnh/thành"
          value={uniqueProvinces.length.toString()}
          sub="Phân bổ vùng theo địa bàn"
          icon={<Trees className="h-5 w-5 text-lime-600" />}
        />
        <SummaryCard
          title="Loại đất"
          value={uniqueSoils.length.toString()}
          sub="Số loại đất khác nhau"
          icon={<Map className="h-5 w-5 text-amber-600" />}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Tìm kiếm & lọc vùng trồng
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Lọc theo tỉnh thành, loại đất, phường/xã hoặc tìm nhanh theo mã
                vùng, tên vùng, doanh nghiệp/nông hộ.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-[220px] md:flex-1">
              <Input
                placeholder="Nhập mã vùng, tên vùng, doanh nghiệp/nông hộ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8"
              />
              <Filter className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start md:self-auto"
              onClick={() => {
                setSearch("");
                setProvinceFilter("all");
                setSoilFilter("all");
                setWardFilter("all");
              }}
            >
              Làm mới bộ lọc
            </Button>
          </div>

          <div className="grid items-end gap-3 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Tỉnh/Thành phố
              </p>
              <Select
                value={provinceFilter}
                onValueChange={(v) => setProvinceFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn tỉnh/thành" />
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

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Loại đất
              </p>
              <Select
                value={soilFilter}
                onValueChange={(v) => setSoilFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn loại đất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {uniqueSoils.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Phường/Xã
              </p>
              <Select
                value={wardFilter}
                onValueChange={(v) => setWardFilter(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {uniqueWards.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden lg:flex flex-col justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
              <span className="mb-0.5 font-medium text-foreground">
                Đang hiển thị {filteredRegions.length} / {totalRegions} vùng
              </span>
              <span>
                Áp dụng{" "}
                <span className="font-semibold text-foreground">
                  {activeFilterCount}
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
            Danh sách phân bổ vùng trồng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredRegions}
            filterColumn="regionName"
          />
        </CardContent>
      </Card>
    </div>
  );
}
