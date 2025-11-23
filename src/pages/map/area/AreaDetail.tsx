"use client";

import { MapContainer, TileLayer, Polygon, Marker } from "react-leaflet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Leaf,
  FileDown,
  Map as MapIcon,
  PencilLine,
} from "lucide-react";
import { useNavigate } from "react-router";

export type LatLngPoint = {
  lat: number;
  lng: number;
};

export type Plot = {
  id: string;
  code: string;
  name: string;
  area: string;
  contour: string;
  coords: LatLngPoint[];
};

export type RegionSummary = {
  id: string;
  code: string;
  name: string;
  owner: string;
  province: string;
};

type AreaDetailProps = {
  region: RegionSummary | null;
  areaName: string;
  areaSize: string;
  soilType: string;
  terrain: string;
  note: string;
  lat: string;
  lng: string;
  areaCoords: LatLngPoint[];
  plots: Plot[];
};

export const DEFAULT_CENTER: LatLngPoint = {
  lat: 10.776889,
  lng: 106.700897,
};

export function AreaDetailPage() {
  const region: RegionSummary = {
    id: "region-1",
    code: "KV-AG01",
    name: "Vùng Trồng Đậu Nành An Giang",
    owner: "HTX Nông nghiệp Vàm Nao",
    province: "An Giang",
  };

  const areaCoords: LatLngPoint[] = [
    { lat: 10.3825, lng: 105.4191 },
    { lat: 10.3838, lng: 105.4221 },
    { lat: 10.3812, lng: 105.4242 },
    { lat: 10.3799, lng: 105.421 },
  ];

  const plots: Plot[] = [
    {
      id: "plot-1",
      code: "LO-01",
      name: "Lô ven kênh",
      area: "8.000",
      contour: "Cao độ trung bình 1.2 m",
      coords: [
        { lat: 10.3826, lng: 105.4192 },
        { lat: 10.3833, lng: 105.4205 },
        { lat: 10.382, lng: 105.4211 },
      ],
    },
    {
      id: "plot-2",
      code: "LO-02",
      name: "Lô gò cao",
      area: "7.000",
      contour: "Cao độ trung bình 1.5 m",
      coords: [],
    },
  ];

  return (
    <AreaDetail
      region={region}
      areaName="Khu vực 1 – Ven sông"
      areaSize="15.000"
      soilType="Đất phù sa"
      terrain="Bằng phẳng, ven kênh"
      note="Ưu tiên sản xuất đậu nành vụ Đông Xuân."
      lat="10.3825"
      lng="105.4210"
      areaCoords={areaCoords}
      plots={plots}
    />
  );
}

export function AreaDetail({
  region,
  areaName,
  areaSize,
  soilType,
  terrain,
  note,
  lat,
  lng,
  areaCoords,
  plots,
}: AreaDetailProps) {
  const navigate = useNavigate();
  const safeCoords = Array.isArray(areaCoords) ? areaCoords : [];
  const plotsWithCoords = plots.filter((p) => (p.coords ?? []).length > 0);

  return (
    <div className="flex flex-col gap-5 mb-2">
      <div className="flex items-center justify-between rounded-lg border bg-white px-4 py-2 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Leaf className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold">
                {region?.name ?? "Tên vùng chưa xác định"}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Mã vùng:{" "}
              <span className="font-medium">{region?.code ?? "-"}</span> ·{" "}
              {region?.province ?? "-"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 rounded-md border-slate-200 text-xs"
          >
            <FileDown className="h-4 w-4" />
            Xuất file
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 rounded-md border-slate-200 text-xs"
          >
            <MapIcon className="h-4 w-4" />
            Xem bản đồ
          </Button>
          <Button
            size="sm"
            className="h-8 gap-1 rounded-md bg-emerald-600! text-xs text-white! hover:bg-emerald-700!"
          >
            <PencilLine className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Chi tiết khu vực: {areaName}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm md:grid-cols-2">
          <p>
            <span className="text-muted-foreground">Thuộc vùng:</span>{" "}
            <span className="font-semibold">{region?.name ?? "-"}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Diện tích:</span>{" "}
            <span className="font-semibold">{areaSize} m²</span>
          </p>
          <p>
            <span className="text-muted-foreground">Loại đất:</span>{" "}
            <span className="font-semibold">{soilType}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Địa hình:</span>{" "}
            <span className="font-semibold">{terrain}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Quản lý bởi:</span>{" "}
            <span className="font-semibold">{region?.owner ?? "-"}</span>
          </p>
          {note && (
            <p className="md:col-span-2">
              <span className="text-muted-foreground">Ghi chú:</span> {note}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bản đồ khu vực
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[320px] w-full overflow-hidden rounded-md border">
            <MapContainer
              center={safeCoords[0] ?? DEFAULT_CENTER}
              zoom={15}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {safeCoords.length > 0 && (
                <Polygon
                  positions={safeCoords.map((p) => [p.lat, p.lng])}
                  pathOptions={{ color: "green", weight: 2 }}
                />
              )}
              {lat && lng && (
                <Marker position={{ lat: Number(lat), lng: Number(lng) }} />
              )}
            </MapContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Đa giác có tổng{" "}
            <span className="font-semibold">{safeCoords.length}</span> điểm
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase">
            Thống kê khu vực
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border bg-emerald-50 p-3">
            <p className="text-[11px] text-emerald-700">Số lượng lô</p>
            <p className="text-xl font-bold">{plots.length}</p>
          </div>
          <div className="rounded-md border bg-sky-50 p-3">
            <p className="text-[11px] text-sky-700">Lô đã có bản đồ</p>
            <p className="text-xl font-bold">
              {plotsWithCoords.length}/{plots.length}
            </p>
          </div>
          <div className="rounded-md border bg-amber-50 p-3">
            <p className="text-[11px] text-amber-700">Tổng điểm bản đồ</p>
            <p className="text-xl font-bold">
              {safeCoords.length +
                plots.reduce((acc, p) => acc + (p.coords?.length ?? 0), 0)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách lô trong khu vực ({plots.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
          {plots.map((p, i) => {
            const coordCount = p.coords?.length ?? 0;
            return (
              <div
                key={p.id}
                className="space-y-1 rounded-lg border bg-muted/20 p-2"
              >
                <p className="font-semibold">
                  Lô {i + 1}: {p.code || "-"}
                </p>
                <p>Tên lô: {p.name || "-"}</p>
                <p>Diện tích: {p.area || "0"} m²</p>
                <p>Đường bình độ: {p.contour || "-"}</p>
                <p>
                  Trạng thái bản đồ:{" "}
                  {coordCount > 0 ? (
                    <span className="font-medium text-emerald-600">
                      Đã có ({coordCount} điểm)
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Chưa có</span>
                  )}
                </p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
