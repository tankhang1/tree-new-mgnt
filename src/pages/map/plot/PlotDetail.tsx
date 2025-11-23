"use client";

import { useMemo } from "react";
import {
  ArrowLeft,
  BadgeInfo,
  FileDown,
  Map as MapIcon,
  MapPin,
  MountainSnow,
  Pencil,
  Rows,
  Ruler,
  Trash2,
  Trees,
} from "lucide-react";
import { useNavigate } from "react-router";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { SummaryCard } from "../region/components/SummaryCard";

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

type LotRow = {
  id: string;
  index: number;
  rowCode: string;
  label: string;
  cropType: string;
  seedVariety: string;
  plants: number;
  lengthMeter: number;
  note?: string;
};

const LOT: LotAllocation = {
  id: "1",
  code: "LO-A1",
  name: "Lô A1",
  areaName: "Khu vực A1",
  regionName: "Vùng A",
  areaSqm: 1500,
  contourDesc: "Địa hình dốc nhẹ, từ 48m đến 56m",
  rowCount: 8,
};

const LOT_ROWS: LotRow[] = [
  {
    id: "r1",
    index: 1,
    rowCode: "HÀNG A",
    label: "Hàng sát đường",
    cropType: "Bắp",
    seedVariety: "LVN10",
    plants: 20,
    lengthMeter: 45,
    note: "Ưu tiên thu hoạch sớm",
  },
  {
    id: "r2",
    index: 2,
    rowCode: "HÀNG B",
    label: "Hàng giữa lô",
    cropType: "Bắp",
    seedVariety: "LVN10",
    plants: 18,
    lengthMeter: 42,
  },
  {
    id: "r3",
    index: 3,
    rowCode: "HÀNG C",
    label: "Hàng gần mương",
    cropType: "Bắp",
    seedVariety: "MX2",
    plants: 25,
    lengthMeter: 50,
    note: "Đất ẩm, dễ ngập",
  },
];

const LOT_POLYGON: LatLngLiteral[] = [
  { lat: 10.7625, lng: 106.6595 },
  { lat: 10.7627, lng: 106.6607 },
  { lat: 10.7618, lng: 106.6609 },
  { lat: 10.7616, lng: 106.6598 },
];

const DEFAULT_CENTER = LOT_POLYGON[0] ?? {
  lat: 10.762622,
  lng: 106.660172,
};

function formatArea(m2: number) {
  const ha = m2 / 10000;
  return `${m2.toLocaleString("vi-VN")} m² · ${ha.toFixed(2)} ha`;
}

export default function PlotDetailPage() {
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<LotRow>[]>(
    () => [
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
        accessorKey: "rowCode",
        header: "Mã hàng",
        cell: ({ row }) => (
          <span className="text-xs font-semibold">{row.original.rowCode}</span>
        ),
      },
      {
        accessorKey: "label",
        header: "Tên hàng",
        cell: ({ row }) => (
          <div className="flex flex-col text-xs">
            <span className="font-medium">{row.original.label}</span>
            {row.original.note ? (
              <span className="text-[11px] text-muted-foreground">
                {row.original.note}
              </span>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: "cropType",
        header: "Loại cây",
        cell: ({ row }) => (
          <span className="text-xs">{row.original.cropType}</span>
        ),
      },
      {
        accessorKey: "seedVariety",
        header: "Giống",
        cell: ({ row }) => (
          <span className="text-xs">{row.original.seedVariety}</span>
        ),
      },
      {
        accessorKey: "plants",
        header: "Số cây",
        cell: ({ row }) => (
          <span className="text-xs font-semibold">
            {row.original.plants.toLocaleString("vi-VN")}
          </span>
        ),
      },
      {
        accessorKey: "lengthMeter",
        header: "Chiều dài (m)",
        cell: ({ row }) => (
          <span className="text-xs">
            {row.original.lengthMeter.toLocaleString("vi-VN")} m
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              <Trees className="h-5 w-5 text-emerald-600" />
              Chi tiết lô trồng · {LOT.code}
            </h1>
            <p className="text-xs text-muted-foreground">
              Xem thông tin lô, vị trí trên bản đồ và danh sách hàng cây.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-1 h-4 w-4" />
            Xuất file
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/main/map/plot/edit")}
          >
            <Pencil className="mr-1 h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button variant="destructive" size="sm" className="bg-red-500!">
            <Trash2 className="mr-1 h-4 w-4" />
            Xóa
          </Button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-4">
        <SummaryCard
          title="Diện tích lô"
          value={formatArea(LOT.areaSqm)}
          sub="Tổng diện tích"
          icon={<Ruler className="h-4 w-4 text-muted-foreground" />}
        />

        <SummaryCard
          title="Địa hình"
          value={LOT.contourDesc}
          sub="Mô tả địa hình"
          icon={<MountainSnow className="h-4 w-4 text-muted-foreground" />}
        />

        <SummaryCard
          title="Số hàng cây"
          value={String(LOT.rowCount)}
          sub="Tổng số hàng"
          icon={<Rows className="h-4 w-4 text-muted-foreground" />}
        />

        <SummaryCard
          title="Thuộc khu"
          value={LOT.areaName}
          sub={LOT.regionName}
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <BadgeInfo className="h-4 w-4 text-emerald-600" />
            Thông tin chung
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Mã lô</p>
              <p className="font-semibold">{LOT.code}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Tên lô</p>
              <p className="font-semibold">{LOT.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Khu vực</p>
              <p>{LOT.areaName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Vùng trồng</p>
              <p>{LOT.regionName}</p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">Thẻ nhanh:</span>
            <Badge
              variant="outline"
              className="rounded-full border-emerald-500/40 bg-emerald-50 text-[11px] text-emerald-700"
            >
              Lô gần đường
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-sky-500/40 bg-sky-50 text-[11px] text-sky-700"
            >
              Thuận tiện thu hoạch
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <MapIcon className="h-4 w-4 text-emerald-600" />
            Bản đồ lô
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <p className="text-muted-foreground">
            Xem nhanh vị trí và hình dạng lô trên bản đồ. Có thể dùng chung
            component với màn tạo mới.
          </p>
          <div className="h-[260px] w-full overflow-hidden rounded-md border">
            <MapContainer
              center={DEFAULT_CENTER}
              zoom={17}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Polygon
                positions={LOT_POLYGON.map((p) => [p.lat, p.lng])}
                pathOptions={{ color: "green" }}
              />
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách hàng cây trong lô ({LOT_ROWS.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={LOT_ROWS} filterColumn="label" />
        </CardContent>
      </Card>
    </div>
  );
}
