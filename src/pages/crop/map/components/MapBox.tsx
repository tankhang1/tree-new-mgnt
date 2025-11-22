import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Pane, Marker } from "react-leaflet";
import type { GeoJsonObject, Feature, Point } from "geojson";
import L, { type Map as LeafletMap } from "leaflet";
import ZoomListener from "./ZoomListener";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon, MapIcon, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayerConfig {
  key: string;
  color?: string;
  fill?: boolean;
  label: string;
}

const LAYERS: LayerConfig[] = [
  { key: "zone", color: "#2b8cbe", fill: true, label: "Vùng" },
  { key: "area", color: "#f97316", fill: true, label: "Khu vực" },
  { key: "plot", color: "#22c55e", fill: true, label: "Lô" },
  { key: "row", color: "#6b7280", fill: false, label: "Hàng" },
];

type TMapBox = {
  h?: number | string;
  zoom?: number;
  zone?: boolean;
  area?: boolean;
  plot?: boolean;
  row?: boolean;
  plant?: boolean;
  marker?: boolean;
};

const CENTER: [number, number] = [11.553203605968022, 107.12999664743181];

const crops = [
  "Sầu riêng Ri6",
  "Sầu riêng Musang King",
  "Sầu riêng Dona",
  "Cà phê Robusta",
  "Cà phê Arabica",
  "Tiêu Vĩnh Linh",
];

const cultivationTypes = [
  "Hữu cơ",
  "Bán hữu cơ",
  "Theo VietGAP",
  "Theo GlobalGAP",
];

const soilTypes = ["Đất đỏ bazan", "Đất pha cát", "Đất thịt nhẹ", "Đất phù sa"];

const terrains = ["Bằng phẳng", "Dốc nhẹ", "Dốc vừa", "Thoai thoải"];

const treeStatusList = [
  "Tốt",
  "Đang phục hồi",
  "Cần kiểm tra",
  "Đang ra hoa",
  "Đang mang trái",
];

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = <T,>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

const formatArea = (min: number, max: number) => {
  const value = randomInt(min, max) * 100;
  return value.toLocaleString("vi-VN") + " m²";
};

const randomDateString = () => {
  const now = new Date();
  const daysAgo = randomInt(1, 30);
  const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString("vi-VN");
};

const MapBox = ({
  h = 400,
  zoom = 17,
  zone = false,
  area = false,
  plot = false,
  row = false,
  plant = false,
  marker = false,
}: TMapBox) => {
  const [data, setData] = useState<Record<string, GeoJsonObject>>({});
  const [plantFeatures, setPlantFeatures] = useState<Feature<Point>[]>([]);
  const [zoomLevel, setZoomLevel] = useState(zoom);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    zone,
    area,
    plot,
    row,
    plant,
  });

  const mapRef = useRef<LeafletMap | null>(null);
  const mapHeight = typeof h === "number" ? `${h}px` : h;

  const handleZoomChange = (value: number) => {
    setZoomLevel(value);

    if (value <= 17) {
      setVisibleLayers({
        zone: true,
        area: false,
        plot: false,
        row: false,
        plant: false,
      });
      return;
    }

    if (value === 18) {
      setVisibleLayers({
        zone: false,
        area: true,
        plot: false,
        row: false,
        plant: false,
      });
      return;
    }

    if (value === 19) {
      setVisibleLayers({
        zone: false,
        area: false,
        plot: true,
        row: false,
        plant: false,
      });
      return;
    }

    setVisibleLayers({
      zone: false,
      area: false,
      plot: true,
      row: true,
      plant: true,
    });
  };

  useEffect(() => {
    Promise.all(
      [...LAYERS, { key: "plant" }].map((layer) =>
        fetch(`/${layer.key}.geojson`).then((r) => r.json())
      )
    ).then((results) => {
      const all: Record<string, GeoJsonObject> = {};
      LAYERS.forEach((layer, i) => {
        all[layer.key] = results[i];
      });
      setData(all);

      const plantGeo = results[LAYERS.length] as GeoJsonObject;
      if (plantGeo && "features" in plantGeo) {
        // @ts-ignore
        setPlantFeatures(plantGeo.features);
      }
    });
  }, []);

  const currentLayerLabel =
    (visibleLayers.zone && "Vùng") ||
    (visibleLayers.area && "Khu vực") ||
    (visibleLayers.plot && !visibleLayers.row && "Lô") ||
    (visibleLayers.plot && visibleLayers.row && "Lô • Hàng • Cây") ||
    "Tổng quan";

  return (
    <Card className="relative w-full overflow-hidden border border-slate-200 bg-white shadow-lg mb-3 gap-0!">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 bg-white">
        <div>
          <CardTitle className="text-base font-semibold text-slate-800">
            Bản đồ vùng trồng
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Thông tin vùng, khu vực, lô và cây trồng hiển thị ngẫu nhiên để demo
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-slate-300 bg-slate-100 text-[11px]"
          >
            Zoom {zoomLevel}
          </Badge>

          <Badge className="bg-blue-100 text-blue-700 text-[11px] shadow-sm">
            {currentLayerLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative">
          <MapContainer
            preferCanvas
            center={CENTER}
            zoom={zoom}
            minZoom={17}
            maxZoom={22}
            scrollWheelZoom
            zoomControl
            //@ts-expect-error
            whenCreated={(map) => {
              mapRef.current = map;
            }}
            style={{ height: mapHeight, width: "100%" }}
          >
            <ZoomListener onChange={handleZoomChange} />

            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

            {marker && <Marker position={CENTER} />}

            {LAYERS.map(
              ({ key, color, fill }) =>
                visibleLayers[key] &&
                data[key] && (
                  <Pane key={key} name={key}>
                    <GeoJSON
                      data={data[key]}
                      style={() => ({
                        color,
                        weight: 2,
                        fillOpacity: fill ? 0.25 : 0,
                        fillColor: color,
                        dashArray: key === "row" ? "4" : undefined,
                      })}
                      onEachFeature={(feature, layer) => {
                        const props: any = feature.properties || {};
                        const name =
                          props.name ||
                          `${key.toUpperCase()}-${randomInt(1, 50)}`;
                        const code = props.code || `Mã-${randomInt(100, 999)}`;
                        const crop = randomItem(crops);
                        const cultivation = randomItem(cultivationTypes);
                        const soil = randomItem(soilTypes);
                        const terrain = randomItem(terrains);
                        const elevation = randomInt(400, 650);
                        const treeCount =
                          key === "zone"
                            ? randomInt(800, 2000)
                            : key === "area"
                            ? randomInt(300, 800)
                            : key === "plot"
                            ? randomInt(80, 200)
                            : randomInt(10, 60);
                        const density = randomInt(180, 280);
                        const areaText =
                          key === "zone"
                            ? formatArea(80, 150)
                            : key === "area"
                            ? formatArea(30, 60)
                            : key === "plot"
                            ? formatArea(10, 30)
                            : formatArea(2, 10);

                        const popupHtml = `
                          <div style="
                            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                            min-width: 230px;
                            padding: 10px 10px 8px 10px;
                          ">
                            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                              <div>
                                <div style="font-weight:600;font-size:14px;margin-bottom:2px;">
                                  ${name}
                                </div>
                                <div style="font-size:11px;color:#6b7280;">
                                  ${
                                    key === "zone"
                                      ? "Vùng"
                                      : key === "area"
                                      ? "Khu vực"
                                      : key === "plot"
                                      ? "Lô"
                                      : "Hàng"
                                  } · Nông trại demo
                                </div>
                              </div>
                              <div style="
                                background:#e5e7eb;
                                border-radius:999px;
                                padding:2px 10px;
                                font-size:11px;
                                font-weight:600;
                                color:#111827;
                                white-space:nowrap;
                              ">
                                ${code}
                              </div>
                            </div>

                            <div style="
                              margin-top:8px;
                              padding-top:8px;
                              border-top:1px solid #e5e7eb;
                              display:grid;
                              row-gap:4px;
                              font-size:12px;
                              color:#111827;
                            ">
                              <div><b>Diện tích:</b> ${areaText}</div>
                              <div><b>Giống chính:</b> ${crop}</div>
                              <div><b>Số cây:</b> ${treeCount.toLocaleString(
                                "vi-VN"
                              )} cây</div>
                              <div><b>Mật độ trồng:</b> ~${density} cây/ha</div>
                              <div><b>Loại đất:</b> ${soil}</div>
                              <div><b>Địa hình:</b> ${terrain} · ${elevation} m</div>
                              <div><b>Hình thức canh tác:</b> ${cultivation}</div>
                            </div>
                          </div>
                        `;

                        layer.on("click", () => {
                          if (mapRef.current) {
                            const map = mapRef.current;
                            const bounds = (layer as any).getBounds?.();
                            if (bounds) {
                              map.fitBounds(bounds, {
                                maxZoom: 19,
                                padding: [24, 24],
                              });
                            }
                          }
                          layer.bindPopup(popupHtml).openPopup();
                        });
                      }}
                    />
                  </Pane>
                )
            )}
            {LAYERS.map(
              ({ key }) =>
                visibleLayers[key] &&
                data?.[key] &&
                "features" in data[key] &&
                //@ts-expect-error no check
                data[key]?.features?.map((feature: Feature, index: number) => {
                  //@ts-expect-error no check
                  const { center, properties } = feature;
                  if (!center) return null;

                  const icon = L.divIcon({
                    className: "text-label",
                    html: `<div style="color:#fff;font-size:16px;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,0.7);">${
                      properties?.name || ""
                    }</div>`,
                  });

                  return (
                    <Marker
                      key={properties?.id ?? `${key}-${index}`}
                      position={[center[1], center[0]]}
                      icon={icon}
                    />
                  );
                })
            )}

            {visibleLayers.plant && plantFeatures.length > 0 && (
              <Pane name="plant" style={{ zIndex: 999 }}>
                <GeoJSON
                  data={{
                    type: "FeatureCollection",
                    // @ts-ignore
                    features: plantFeatures,
                  }}
                  pointToLayer={(feature, latlng) => {
                    const name = feature.properties?.name || "";
                    let color = "#22c55e";
                    if (name.includes("Ri6")) color = "#f97316";
                    if (name.includes("Musang")) color = "#0284c7";

                    return L.circleMarker(latlng, {
                      radius: 4,
                      color,
                      fillColor: color,
                      fillOpacity: 0.9,
                      weight: 1,
                    });
                  }}
                  onEachFeature={(feature, layer) => {
                    const props: any = feature.properties || {};
                    const name = props.name || `Cây ${randomInt(1, 500)}`;
                    const code = props.code || `CT-${randomInt(1000, 9999)}`;
                    const crop = randomItem(crops);
                    const age = randomInt(2, 8);
                    const status = randomItem(treeStatusList);
                    const lastCare = randomDateString();

                    const popupHtml = `
                      <div style="
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        min-width: 180px;
                        padding: 8px 10px;
                      ">
                        <div style="font-weight:600;font-size:13px;margin-bottom:2px;">
                          ${name}
                        </div>
                        <div style="font-size:11px;color:#6b7280;margin-bottom:4px;">
                          Mã cây: ${code}
                        </div>
                        <div style="font-size:12px;color:#111827;">
                          <div><b>Giống:</b> ${crop}</div>
                          <div><b>Tuổi cây:</b> ${age} năm</div>
                          <div><b>Tình trạng:</b> ${status}</div>
                          <div><b>Chăm sóc gần nhất:</b> ${lastCare}</div>
                        </div>
                      </div>
                    `;

                    layer.on("click", () => {
                      layer.bindPopup(popupHtml).openPopup();
                    });
                  }}
                />
              </Pane>
            )}
          </MapContainer>

          <div className="pointer-events-none absolute right-3 bottom-3 z-400">
            <Card className="pointer-events-auto rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-md">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Chú thích
              </div>

              {LAYERS.map((layer) => (
                <div key={layer.key} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm border border-slate-300"
                    style={{
                      backgroundColor: layer.fill ? layer.color : "transparent",
                    }}
                  />
                  <span className="text-xs text-slate-600">{layer.label}</span>
                </div>
              ))}
            </Card>
          </div>
          <div className="absolute right-3 top-3 z-400">
            <Card className="pointer-events-auto rounded-xl bg-white p-4 shadow-lg backdrop-blur">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <MapIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">
                    Thông tin tìm kiếm
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Lọc doanh nghiệp, vùng trồng, giống cây trồng trên bản đồ
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Doanh nghiệp / nông hộ */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-700">
                    Doanh nghiệp / nông hộ
                  </span>
                  <Select>
                    <SelectTrigger className="h-8 border-slate-200 bg-white text-xs w-full">
                      <SelectValue placeholder="Chọn đơn vị" />
                    </SelectTrigger>
                    <SelectContent className="z-1000">
                      <SelectItem value="farm_a">Nông hộ A</SelectItem>
                      <SelectItem value="farm_b">Nông hộ B</SelectItem>
                      <SelectItem value="company_x">Doanh nghiệp X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Giống cây trồng */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-700">
                    Giống cây trồng
                  </span>
                  <Select>
                    <SelectTrigger className="h-8 border-slate-200 bg-white text-xs w-full">
                      <SelectValue placeholder="Chọn giống" />
                    </SelectTrigger>
                    <SelectContent className="z-1000">
                      <SelectItem value="all">Tất cả giống</SelectItem>
                      <SelectItem value="ri6">Sầu riêng Ri6</SelectItem>
                      <SelectItem value="musang">Musang King</SelectItem>
                      <SelectItem value="other">Giống khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mã định danh */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-700">
                    Mã định danh
                  </span>
                  <Select>
                    <SelectTrigger className="h-8 border-slate-200 bg-white text-xs w-full">
                      <SelectValue placeholder="Chọn mã hoặc gõ ở dưới" />
                    </SelectTrigger>
                    <SelectContent className="z-1000">
                      <SelectItem value="CT-001">CT-001</SelectItem>
                      <SelectItem value="CT-002">CT-002</SelectItem>
                      <SelectItem value="CT-003">CT-003</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Vùng trồng */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-700">
                    Vùng trồng
                  </span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Tìm kiếm vùng trồng"
                      className="h-8 pl-7 text-xs"
                    />
                  </div>
                </div>

                {/* Khu vực */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-700">
                    Khu vực
                  </span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Tìm theo địa danh"
                      className="h-8 pl-7 text-xs"
                    />
                  </div>
                </div>

                {/* Lô */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-700">Lô</span>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Tìm kiếm lô"
                      className="h-8 pl-7 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="h-8 border-emerald-200 bg-emerald-50 text-xs text-emerald-700 hover:bg-emerald-100"
                >
                  <RotateCcw className="mr-1.5 h-3 w-3" />
                  Xoá bộ lọc
                </Button>

                <Button
                  type="button"
                  className="h-8 bg-emerald-600! text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <FilterIcon className="mr-1.5 h-3.5 w-3.5" />
                  Lọc dữ liệu
                </Button>
              </div>
            </Card>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-3">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Thống kê cây trồng
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Ri6 */}
            <div className="flex flex-col items-center rounded-lg border border-emerald-200 bg-emerald-50 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xl">
                🌳
              </div>
              <div className="mt-1 text-xs font-medium text-emerald-800">
                Sầu riêng Ri6
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                11,000 cây
              </div>
            </div>

            {/* Musang King */}
            <div className="flex flex-col items-center rounded-lg border border-orange-200 bg-orange-50 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-xl">
                🌳
              </div>
              <div className="mt-1 text-xs font-medium text-orange-800">
                Musang King
              </div>
              <div className="text-[11px] text-orange-700 font-semibold">
                2,000 cây
              </div>
            </div>

            {/* Other */}
            <div className="flex flex-col items-center rounded-lg border border-sky-200 bg-sky-50 py-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xl">
                🌳
              </div>
              <div className="mt-1 text-xs font-medium text-sky-800">
                Giống khác
              </div>
              <div className="text-[11px] text-sky-700 font-semibold">
                1,000 cây
              </div>
            </div>
          </div>

          <div className="mt-1 text-xs font-medium text-slate-700 text-center">
            Tổng số cây hiển thị:&nbsp;
            <span className="font-bold text-slate-900">14,000</span>
            &nbsp;cây
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapBox;
