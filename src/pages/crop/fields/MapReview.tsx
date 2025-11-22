"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression, LatLng } from "leaflet";
import L from "leaflet";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
// import "leaflet/dist/leaflet.css";

type CropType = "corn" | "soybean";

type LatLngPoint = { lat: number; lng: number };

type Region = {
  id: string;
  code: string;
  name: string;
  province: string;
  cropMain: CropType;
  centerLat: number;
  centerLng: number;
  boundary: LatLngPoint[]; // điểm người dùng vẽ
};

type Area = {
  id: string;
  regionId: string;
  code: string;
  name: string;
  centerLat: number;
  centerLng: number;
  boundary: LatLngPoint[];
};

type Plot = {
  id: string;
  areaId: string;
  code: string;
  name: string;
  crop: CropType;
  centerLat: number;
  centerLng: number;
  boundary: LatLngPoint[];
};
type Row = {
  id: string;
  plotId: string;
  code: string;
  name: string;
  centerLat: number;
  centerLng: number;
  boundary: LatLngPoint[];
};
type EditLevel = "region" | "area" | "plot" | "row";

/* --------------------- SAMPLE HIERARCHY (chưa có boundary) --------------------- */

const initialRegions: Region[] = [
  {
    id: "r1",
    code: "KV-BAP-01",
    name: "Vùng Bắp Đông Nam 1",
    province: "Đồng Nai",
    cropMain: "corn",
    centerLat: 11.02,
    centerLng: 107.15,
    boundary: [],
  },
  {
    id: "r2",
    code: "KV-DAU-01",
    name: "Vùng Đậu nành Tây Nguyên 1",
    province: "Gia Lai",
    cropMain: "soybean",
    centerLat: 13.98,
    centerLng: 108.05,
    boundary: [],
  },
];

const initialAreas: Area[] = [
  {
    id: "a1",
    regionId: "r1",
    code: "KV1-KV01",
    name: "Khu vực 1 – Gần trục lộ chính",
    centerLat: 11.021,
    centerLng: 107.148,
    boundary: [],
  },
  {
    id: "a2",
    regionId: "r1",
    code: "KV1-KV02",
    name: "Khu vực 2 – Ven mương nội đồng",
    centerLat: 11.019,
    centerLng: 107.152,
    boundary: [],
  },
  {
    id: "a3",
    regionId: "r2",
    code: "KV2-KV01",
    name: "Khu vực 1 – Chân đồi thoải",
    centerLat: 13.979,
    centerLng: 108.048,
    boundary: [],
  },
];

const initialPlots: Plot[] = [
  {
    id: "p1",
    areaId: "a1",
    code: "KV1-LO1",
    name: "Lô 1 – Bắp lai CP999",
    crop: "corn",
    centerLat: 11.0215,
    centerLng: 107.1475,
    boundary: [],
  },
  {
    id: "p2",
    areaId: "a1",
    code: "KV1-LO2",
    name: "Lô 2 – Bắp nếp địa phương",
    crop: "corn",
    centerLat: 11.0212,
    centerLng: 107.1485,
    boundary: [],
  },
  {
    id: "p3",
    areaId: "a3",
    code: "KV3-LO1",
    name: "Lô 1 – Đậu nành VX93",
    crop: "soybean",
    centerLat: 13.9792,
    centerLng: 108.0488,
    boundary: [],
  },
];
const initialRows: Row[] = [
  {
    id: "row1",
    plotId: "p1",
    code: "R1",
    name: "Hàng 1",
    centerLat: 11.02155,
    centerLng: 107.14756,
    boundary: [],
  },
  {
    id: "row2",
    plotId: "p1",
    code: "R2",
    name: "Hàng 2",
    centerLat: 11.02145,
    centerLng: 107.14745,
    boundary: [],
  },
];
/* ----------------------------- LEAFLET ICON FIX ----------------------------- */

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
(L.Marker.prototype as any).options.icon = defaultIcon;

/* ----------------------------- HELPER FUNCTIONS ----------------------------- */

function pointsToLatLng(points: LatLngPoint[]): LatLngExpression[] {
  return points.map((p) => [p.lat, p.lng]) as LatLngExpression[];
}

function pointsToString(points: LatLngPoint[]): string {
  return points.map((p) => `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`).join(";");
}

/* ---------------------------- DRAW LAYER COMPONENT --------------------------- */

type DrawLayerProps = {
  onAddPoint: (latlng: LatLng) => void;
};

function DrawLayer({ onAddPoint }: DrawLayerProps) {
  useMapEvents({
    click(e) {
      onAddPoint(e.latlng);
    },
  });

  return null;
}

/* ----------------------------- MAIN UI COMPONENT ---------------------------- */

export default function FieldCoordinateEditorPage() {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Region[]>(initialRegions);
  const [areas, setAreas] = useState<Area[]>(initialAreas);
  const [points, setPoints] = useState<
    {
      lat: number;
      lng: number;
    }[]
  >();
  const [plots, setPlots] = useState<Plot[]>(initialPlots);
  const [isEditingCoords, setIsEditingCoords] = useState(false);
  const [coordinateDraft, setCoordinateDraft] = useState("");
  const [regionId, setRegionId] = useState<string>("r1");
  const [areaId, setAreaId] = useState<string>("a1");
  const [plotId, setPlotId] = useState<string>("p1");
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [rowId, setRowId] = useState<string>("row1");

  const [editLevel, setEditLevel] = useState<EditLevel>("plot");
  // auto sync khi đổi region / area
  useEffect(() => {
    const firstArea = areas.find((a) => a.regionId === regionId);
    if (firstArea) setAreaId(firstArea.id);
  }, [regionId, areas]);

  useEffect(() => {
    const firstPlot = plots.find((p) => p.areaId === areaId);
    if (firstPlot) setPlotId(firstPlot.id);
  }, [areaId, plots]);

  const currentRegion = regions.find((r) => r.id === regionId)!;
  const regionAreas = areas.filter((a) => a.regionId === regionId);
  const currentArea =
    regionAreas.find((a) => a.id === areaId) ?? regionAreas[0];
  const areaPlots = plots.filter((p) => p.areaId === currentArea?.id);
  const currentPlot = areaPlots.find((p) => p.id === plotId) ?? areaPlots[0];
  const plotRows = rows.filter((r) => r.plotId === currentPlot?.id);
  const currentRow = plotRows.find((r) => r.id === rowId) ?? plotRows[0];

  // cấp đang chỉnh sửa
  const activePoints: LatLngPoint[] = useMemo(() => {
    if (editLevel === "region") return currentRegion.boundary;
    if (editLevel === "area") return currentArea?.boundary ?? [];
    if (editLevel === "plot") return currentPlot?.boundary ?? [];
    if (editLevel === "row") return currentRow?.boundary ?? [];
    return [];
  }, [editLevel, currentRegion, currentArea, currentPlot, currentRow]);
  const mapCenter = useMemo(() => {
    if (activePoints.length > 0) {
      const last = activePoints[activePoints.length - 1];
      return { lat: last.lat, lng: last.lng };
    }
    if (editLevel === "region") {
      return { lat: currentRegion.centerLat, lng: currentRegion.centerLng };
    }
    if (editLevel === "area" && currentArea) {
      return { lat: currentArea.centerLat, lng: currentArea.centerLng };
    }
    if (currentPlot) {
      return { lat: currentPlot.centerLat, lng: currentPlot.centerLng };
    }
    if (editLevel === "row" && currentRow) {
      return { lat: currentRow.centerLat, lng: currentRow.centerLng };
    }
    return { lat: currentRegion.centerLat, lng: currentRegion.centerLng };
  }, [activePoints, editLevel, currentRegion, currentArea, currentPlot]);

  /* ------------------------ HANDLER THÊM / XOÁ ĐIỂM ------------------------ */

  const handleAddPoint = (latlng: LatLng) => {
    const point = { lat: latlng.lat, lng: latlng.lng };

    if (editLevel === "region") {
      setRegions((prev) =>
        prev.map((r) =>
          r.id === currentRegion.id
            ? { ...r, boundary: [...r.boundary, point] }
            : r
        )
      );
    } else if (editLevel === "area" && currentArea) {
      setAreas((prev) =>
        prev.map((a) =>
          a.id === currentArea.id
            ? { ...a, boundary: [...a.boundary, point] }
            : a
        )
      );
    } else if (editLevel === "plot" && currentPlot) {
      setPlots((prev) =>
        prev.map((p) =>
          p.id === currentPlot.id
            ? { ...p, boundary: [...p.boundary, point] }
            : p
        )
      );
    } else if (editLevel === "row" && currentRow) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === currentRow.id
            ? { ...r, boundary: [...r.boundary, point] }
            : r
        )
      );
    }
  };

  const handleUndoPoint = () => {
    if (!activePoints.length) return;

    if (editLevel === "region") {
      setRegions((prev) =>
        prev.map((r) =>
          r.id === currentRegion.id
            ? { ...r, boundary: r.boundary.slice(0, -1) }
            : r
        )
      );
    } else if (editLevel === "area" && currentArea) {
      setAreas((prev) =>
        prev.map((a) =>
          a.id === currentArea.id
            ? { ...a, boundary: a.boundary.slice(0, -1) }
            : a
        )
      );
    } else if (editLevel === "plot" && currentPlot) {
      setPlots((prev) =>
        prev.map((p) =>
          p.id === currentPlot.id
            ? { ...p, boundary: p.boundary.slice(0, -1) }
            : p
        )
      );
    } else if (editLevel === "row" && currentRow) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === currentRow.id
            ? { ...r, boundary: r.boundary.slice(0, -1) }
            : r
        )
      );
    }
  };

  const handleClearPoints = () => {
    if (editLevel === "region") {
      setRegions((prev) =>
        prev.map((r) =>
          r.id === currentRegion.id ? { ...r, boundary: [] } : r
        )
      );
    } else if (editLevel === "area" && currentArea) {
      setAreas((prev) =>
        prev.map((a) => (a.id === currentArea.id ? { ...a, boundary: [] } : a))
      );
    } else if (editLevel === "plot" && currentPlot) {
      setPlots((prev) =>
        prev.map((p) => (p.id === currentPlot.id ? { ...p, boundary: [] } : p))
      );
    } else if (editLevel === "row" && currentRow) {
      setRows((prev) =>
        prev.map((r) => (r.id === currentRow.id ? { ...r, boundary: [] } : r))
      );
    }
  };

  const coordinateString = pointsToString(activePoints);
  useEffect(() => {
    // mỗi lần polygon thay đổi thì sync sang bản nháp
    setCoordinateDraft(coordinateString);
  }, [coordinateString]);

  const applyCoordinateDraft = () => {
    if (!coordinateDraft.trim()) return;

    const parts = coordinateDraft
      .split(";")
      .map((p) => p.trim())
      .filter(Boolean);

    const newPoints: { lat: number; lng: number }[] = [];

    for (const part of parts) {
      const [latStr, lngStr] = part.split(",").map((x) => x.trim());
      const lat = Number(latStr);
      const lng = Number(lngStr);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        newPoints.push({ lat, lng });
      }
    }

    if (!newPoints.length) {
      // tuỳ bạn: có thể dùng toast hoặc alert
      alert("Chuỗi toạ độ không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    setPoints(newPoints); // state đang dùng để vẽ polygon
    setIsEditingCoords(false);
  };
  /* --------------------------------- RENDER -------------------------------- */

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <header className="flex flex-wrap items-center gap-3 justify-between rounded-lg border bg-card px-4 py-3">
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
            <h1 className="text-lg font-semibold">
              Thiết lập toạ độ vùng trồng (Vùng → Khu vực → Lô)
            </h1>
            <p className="text-xs text-muted-foreground">
              Click trực tiếp trên bản đồ vệ tinh để tạo polygon cho từng cấp.
              Mỗi điểm click là một đỉnh của khung hình (vùng / khu vực / lô).
            </p>
          </div>
        </div>
        <Button variant="default" className="bg-primary!">
          Lưu thông tin
        </Button>
      </header>

      {/* CHỌN VÙNG / KHU VỰC / LÔ + CẤP ĐANG VẼ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            1. Chọn vùng – khu vực – lô & cấp cần vẽ toạ độ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {/* VÙNG */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Vùng</p>
              <Select value={regionId} onValueChange={setRegionId}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn vùng" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      <div className="flex items-center justify-between gap-2">
                        <span>
                          {r.code} – {r.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px]",
                            r.cropMain === "corn"
                              ? "border-amber-500 text-amber-700"
                              : "border-emerald-500 text-emerald-700"
                          )}
                        >
                          {r.cropMain === "corn" ? "Bắp" : "Đậu nành"}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* KHU VỰC */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Khu vực
              </p>
              <Select
                value={currentArea?.id}
                onValueChange={(v) => setAreaId(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn khu vực" />
                </SelectTrigger>
                <SelectContent>
                  {regionAreas.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.code} – {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* LÔ */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Lô</p>
              <Select
                value={currentPlot?.id}
                onValueChange={(v) => setPlotId(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn lô" />
                </SelectTrigger>
                <SelectContent>
                  {areaPlots.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.code} – {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/*Hàng */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Hàng</p>
              <Select value={currentRow?.id} onValueChange={(v) => setRowId(v)}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn hàng" />
                </SelectTrigger>
                <SelectContent>
                  {plotRows.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.code} – {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CẤP ĐANG VẼ */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground mr-2">
              Cấp đang thiết lập toạ độ:
            </span>
            <Button
              size="sm"
              className={editLevel === "region" ? "bg-primary!" : ""}
              variant={editLevel === "region" ? "default" : "outline"}
              onClick={() => setEditLevel("region")}
            >
              Vùng
            </Button>
            <Button
              size="sm"
              className={editLevel === "area" ? "bg-primary!" : ""}
              variant={editLevel === "area" ? "default" : "outline"}
              onClick={() => setEditLevel("area")}
            >
              Khu vực
            </Button>
            <Button
              size="sm"
              className={editLevel === "plot" ? "bg-primary!" : ""}
              variant={editLevel === "plot" ? "default" : "outline"}
              onClick={() => setEditLevel("plot")}
            >
              Lô
            </Button>
            <Button
              size="sm"
              className={editLevel === "row" ? "bg-primary!" : ""}
              variant={editLevel === "row" ? "default" : "outline"}
              onClick={() => setEditLevel("row")}
            >
              Hàng
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* BẢN ĐỒ + NÚT HÀNH ĐỘNG */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            2. Vẽ khung toạ độ trên bản đồ vệ tinh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Nút xử lý điểm */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleUndoPoint}
                disabled={!activePoints.length}
              >
                Hoàn tác 1 điểm
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleClearPoints}
                disabled={!activePoints.length}
              >
                Xoá toàn bộ điểm
              </Button>
              <span className="text-muted-foreground">
                Đã vẽ{" "}
                <span className="font-semibold">{activePoints.length}</span>{" "}
                điểm cho{" "}
                <span className="font-semibold">
                  {editLevel === "region"
                    ? `Vùng ${currentRegion.code}`
                    : editLevel === "area"
                    ? `Khu vực ${currentArea?.code}`
                    : `Lô ${currentPlot?.code}`}
                </span>
              </span>
            </div>
          </div>

          {/* Map */}
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={16}
            scrollWheelZoom
            className="h-[420px] w-full rounded-xl border"
          >
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
              attribution="&copy; Google"
            />

            {/* Vùng: viền mờ */}
            {regions.map((r) =>
              r.boundary.length ? (
                <Polygon
                  key={r.id}
                  positions={pointsToLatLng(r.boundary)}
                  pathOptions={{
                    color:
                      editLevel === "region" && r.id === currentRegion.id
                        ? "#22c55e"
                        : "#6b7280",
                    weight:
                      editLevel === "region" && r.id === currentRegion.id
                        ? 3
                        : 1,
                    fillOpacity: 0.05,
                  }}
                />
              ) : null
            )}

            {/* Khu vực */}
            {areas.map((a) =>
              a.boundary.length ? (
                <Polygon
                  key={a.id}
                  positions={pointsToLatLng(a.boundary)}
                  pathOptions={{
                    color:
                      editLevel === "area" && a.id === currentArea?.id
                        ? "#0ea5e9"
                        : "#9ca3af",
                    weight:
                      editLevel === "area" && a.id === currentArea?.id ? 3 : 1,
                    fillOpacity: 0.08,
                  }}
                />
              ) : null
            )}

            {/* Lô */}
            {plots.map((p) =>
              p.boundary.length ? (
                <Polygon
                  key={p.id}
                  positions={pointsToLatLng(p.boundary)}
                  pathOptions={{
                    color:
                      editLevel === "plot" && p.id === currentPlot?.id
                        ? "#f97316"
                        : "#e5e7eb",
                    weight:
                      editLevel === "plot" && p.id === currentPlot?.id ? 3 : 1,
                    fillOpacity: 0.2,
                  }}
                />
              ) : null
            )}
            {rows.map((r) =>
              r.boundary.length ? (
                <Polygon
                  key={r.id}
                  positions={pointsToLatLng(r.boundary)}
                  pathOptions={{
                    color:
                      editLevel === "row" && r.id === currentRow?.id
                        ? "#14b8a6"
                        : "#a7f3d0",
                    weight:
                      editLevel === "row" && r.id === currentRow?.id ? 3 : 1,
                    fillOpacity: 0.25,
                  }}
                />
              ) : null
            )}

            {/* Marker center */}
            <Marker position={[mapCenter.lat, mapCenter.lng]}>
              <Popup>
                {(editLevel === "region" && currentRegion.name) ||
                  (editLevel === "area" && currentArea?.name) ||
                  (editLevel === "plot" && currentPlot?.name)}
              </Popup>
            </Marker>

            {/* Layer nhận click để thêm điểm */}
            <DrawLayer onAddPoint={handleAddPoint} />
          </MapContainer>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <p className="font-medium text-muted-foreground">
                Chuỗi toạ độ (lưu DB)
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2"
                onClick={() => setIsEditingCoords((v) => !v)}
                disabled={!coordinateString}
              >
                {isEditingCoords ? "Đóng chỉnh sửa" : "Chỉnh sửa toạ độ"}
              </Button>
            </div>

            {!isEditingCoords ? (
              <>
                <div className="rounded-md border bg-muted/40 p-2 font-mono text-[11px] break-all">
                  {coordinateString || "Chưa có điểm nào"}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Định dạng: <code>lat,lng;lat,lng;...</code>. Mỗi lần bạn click
                  trên bản đồ sẽ thêm một cặp toạ độ mới.
                </p>
              </>
            ) : (
              <div className="space-y-2 rounded-md border bg-muted/40 p-2">
                <textarea
                  className="w-full min-h-[80px] resize-y rounded-md border bg-background p-1.5 font-mono text-[11px] outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  value={coordinateDraft}
                  onChange={(e) => setCoordinateDraft(e.target.value)}
                  placeholder="Ví dụ: 10.1234,105.1234;10.2345,105.2345;..."
                />

                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] text-muted-foreground">
                    Định dạng: <code>lat,lng;lat,lng;...</code> – mỗi cặp cách
                    nhau dấu chấm phẩy.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    className="h-7 px-2"
                    onClick={applyCoordinateDraft}
                  >
                    Áp dụng toạ độ
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
