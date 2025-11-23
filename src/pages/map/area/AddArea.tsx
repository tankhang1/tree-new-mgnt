"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Map,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { MapContainer, Polygon, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";

type LatLngPoint = LatLngLiteral;

type RegionSummary = {
  id: string;
  code: string;
  name: string;
  area: string;
  soilType: string;
  terrain: string;
  owner: string;
};

const REGIONS: RegionSummary[] = [
  {
    id: "vt-001",
    code: "VT-001",
    name: "Vùng Trồng Tây Nguyên",
    area: "50.000",
    soilType: "Đất đỏ bazan",
    terrain: "Cao, Thoai thoải",
    owner: "Nguyễn Văn A",
  },
  {
    id: "vt-002",
    code: "VT-002",
    name: "Vùng Trồng Miền Tây",
    area: "65.000",
    soilType: "Đất phù sa",
    terrain: "Thấp, Trũng",
    owner: "Nguyễn Văn A",
  },
  {
    id: "vt-003",
    code: "VT-003",
    name: "Vùng Trồng Đông Nam Bộ",
    area: "80.000",
    soilType: "Đất xám bạc màu",
    terrain: "Bằng phẳng, Thoai thoải",
    owner: "Nguyễn Văn A",
  },
  {
    id: "vt-004",
    code: "VT-004",
    name: "Vùng Trồng Bắc Trung Bộ",
    area: "45.000",
    soilType: "Đất cát pha",
    terrain: "Đồi núi thấp, Bằng phẳng",
    owner: "Nguyễn Văn A",
  },
];

const SOIL_TYPES = [
  "Đất phù sa",
  "Đất thịt",
  "Đất đỏ bazan",
  "Đất cát pha",
  "Đất xám bạc màu",
];

const TERRAIN_TAGS = [
  "Bằng phẳng",
  "Thấp, Trũng",
  "Cao, Thoai thoải",
  "Đồi núi thấp",
  "Gò đồi",
];

type Plot = {
  id: string;
  code: string;
  name: string;
  area: string;
  contour: string;
  coords: LatLngPoint[];
};

function createId() {
  return crypto.randomUUID();
}

const DEFAULT_CENTER: LatLngPoint = {
  lat: 10.762622,
  lng: 106.660172,
};

export default function CreateAreaPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [regionSearch, setRegionSearch] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    REGIONS[0]?.id ?? null
  );

  const [areaName, setAreaName] = useState("Khu vực D4");
  const [areaSize, setAreaSize] = useState("11200");
  const [soilType, setSoilType] = useState<string>("Đất đỏ");
  const [terrain, setTerrain] = useState<string>("Bằng phẳng");
  const [note, setNote] = useState("Khu vực ven đường, thuận tiện thu hoạch.");

  const [lat, setLat] = useState(String(DEFAULT_CENTER.lat));
  const [lng, setLng] = useState(String(DEFAULT_CENTER.lng));

  const [areaCoords, setAreaCoords] = useState<LatLngPoint[]>([
    { lat: 10.763, lng: 106.659 },
    { lat: 10.7635, lng: 106.662 },
    { lat: 10.7615, lng: 106.663 },
    { lat: 10.761, lng: 106.66 },
  ]);

  const [plots, setPlots] = useState<Plot[]>([
    {
      id: createId(),
      code: "LO-01",
      name: "Lô 01 – Gần đường",
      area: "3.500",
      contour: "110m",
      coords: [
        { lat: 10.7625, lng: 106.6595 },
        { lat: 10.7627, lng: 106.6607 },
        { lat: 10.7618, lng: 106.6609 },
        { lat: 10.7616, lng: 106.6598 },
      ],
    },
    {
      id: createId(),
      code: "LO-02",
      name: "Lô 02 – Giữa khu vực",
      area: "4.000",
      contour: "120m",
      coords: [
        { lat: 10.7621, lng: 106.661 },
        { lat: 10.7623, lng: 106.6621 },
        { lat: 10.7614, lng: 106.6623 },
        { lat: 10.7612, lng: 106.6612 },
      ],
    },
  ]);
  const [openPlotMap, setOpenPlotMap] = useState(false);
  const [activePlotId, setActivePlotId] = useState<string | null>(null);

  const region = useMemo(
    () => REGIONS.find((r) => r.id === selectedRegionId) ?? null,
    [selectedRegionId]
  );

  const goNext = () => {
    if (step < 4) setStep((s) => (s + 1) as typeof step);
  };

  const goPrev = () => {
    if (step > 1) setStep((s) => (s - 1) as typeof step);
  };

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
            <h1 className="text-lg font-semibold">Tạo mới khu vực trồng</h1>
            <p className="text-xs text-muted-foreground">
              Bước 1: Thông tin · Bước 2: Biểu đồ khu vực · Bước 3: Lô · Bước 4:
              Xác nhận.
            </p>
          </div>
        </div>
        <Stepper step={step} />
      </header>

      {step === 1 && (
        <Step1Info
          regionSearch={regionSearch}
          onChangeRegionSearch={setRegionSearch}
          selectedRegionId={selectedRegionId}
          onSelectRegion={setSelectedRegionId}
          areaName={areaName}
          onChangeAreaName={setAreaName}
          areaSize={areaSize}
          onChangeAreaSize={setAreaSize}
          soilType={soilType}
          onChangeSoilType={setSoilType}
          terrain={terrain}
          onChangeTerrain={setTerrain}
          note={note}
          onChangeNote={setNote}
        />
      )}

      {step === 2 && (
        <Step2Map
          lat={lat}
          lng={lng}
          onChangeLat={setLat}
          onChangeLng={setLng}
          areaCoords={areaCoords}
          setAreaCoords={setAreaCoords}
        />
      )}

      {step === 3 && (
        <Step3Plots
          plots={plots}
          setPlots={setPlots}
          openPlotMap={openPlotMap}
          setOpenPlotMap={setOpenPlotMap}
          activePlotId={activePlotId}
          setActivePlotId={setActivePlotId}
        />
      )}

      {step === 4 && (
        <Step4Review
          region={region}
          areaName={areaName}
          areaSize={areaSize}
          soilType={soilType}
          terrain={terrain}
          note={note}
          lat={lat}
          lng={lng}
          areaCoords={areaCoords}
          plots={plots}
        />
      )}

      <div className="mt-2 flex items-center justify-between border-t pt-3 mb-2">
        <Button
          variant="outline"
          size="sm"
          disabled={step === 1}
          onClick={goPrev}
        >
          Quay lại
        </Button>
        <Button
          size="sm"
          className="bg-primary! text-primary-foreground!"
          onClick={() => {
            if (step === 4) {
              navigate("/main/crop/areas");
            } else {
              goNext();
            }
          }}
        >
          {step === 4 ? "Hoàn thành" : "Tiếp tục"}
        </Button>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = [
    { id: 1, label: "Thông tin" },
    { id: 2, label: "Biểu đồ khu vực" },
    { id: 3, label: "Lô" },
    { id: 4, label: "Xác nhận thông tin" },
  ];

  return (
    <div className="flex flex-1 items-center gap-3">
      {steps.map((s, index) => {
        const isActive = s.id === step;
        const isDone = s.id < step;

        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-9 items-center rounded-full border px-3 text-xs font-medium ${
                isDone
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isActive
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted text-muted-foreground"
              }`}
            >
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  s.id
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase">
                  Bước {s.id}
                </span>
                <span className="text-[10px]">{s.label}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="h-px flex-1 bg-emerald-500/60" />
            )}
          </div>
        );
      })}
    </div>
  );
}

type Step1Props = {
  regionSearch: string;
  onChangeRegionSearch: (v: string) => void;
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
  areaName: string;
  onChangeAreaName: (v: string) => void;
  areaSize: string;
  onChangeAreaSize: (v: string) => void;
  soilType: string;
  onChangeSoilType: (v: string) => void;
  terrain: string;
  onChangeTerrain: (v: string) => void;
  note: string;
  onChangeNote: (v: string) => void;
};

function Step1Info({
  regionSearch,
  onChangeRegionSearch,
  selectedRegionId,
  onSelectRegion,
  areaName,
  onChangeAreaName,
  areaSize,
  onChangeAreaSize,
  soilType,
  onChangeSoilType,
  terrain,
  onChangeTerrain,
  note,
  onChangeNote,
}: Step1Props) {
  const filteredRegions = useMemo(
    () =>
      REGIONS.filter((r) => {
        const q = regionSearch.toLowerCase().trim();
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q)
        );
      }),
    [regionSearch]
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Bước 1 · Thông tin
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">Vùng trồng</p>
          <div className="relative mb-2">
            <Input
              placeholder="Tìm kiếm vùng trồng"
              value={regionSearch}
              onChange={(e) => onChangeRegionSearch(e.target.value)}
              className="h-9 pl-8"
            />
            <MapPin className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {filteredRegions.map((r) => {
                const isActive = r.id === selectedRegionId;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onSelectRegion(r.id)}
                    className={`min-w-[260px] flex-1 rounded-lg border px-4 py-3 text-left text-xs shadow-sm ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{r.name}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {r.code}
                      </span>
                    </div>
                    <p className="mt-1">
                      <span className="font-semibold">Diện tích:</span> {r.area}{" "}
                      m²
                    </p>
                    <p>
                      <span className="font-semibold">Loại đất:</span>{" "}
                      {r.soilType}
                    </p>
                    <p>
                      <span className="font-semibold">Địa hình:</span>{" "}
                      {r.terrain}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Doanh nghiệp / nông hộ:
                      </span>{" "}
                      {r.owner}
                    </p>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="grid gap-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Tên khu vực <span className="text-red-500">*</span>
            </p>
            <Input
              className="h-9"
              value={areaName}
              onChange={(e) => onChangeAreaName(e.target.value)}
            />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Diện tích (m²) <span className="text-red-500">*</span>
            </p>
            <Input
              className="h-9"
              type="number"
              min={0}
              value={areaSize}
              onChange={(e) => onChangeAreaSize(e.target.value)}
            />
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Loại đất</p>
            <Select value={soilType} onValueChange={onChangeSoilType}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Chọn loại đất" />
              </SelectTrigger>
              <SelectContent>
                {SOIL_TYPES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Địa hình</p>
            <Select value={terrain} onValueChange={onChangeTerrain}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Chọn địa hình" />
              </SelectTrigger>
              <SelectContent>
                {TERRAIN_TAGS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Ghi chú</p>
            <Textarea
              className="min-h-[70px]"
              value={note}
              onChange={(e) => onChangeNote(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
type Step2Props = {
  lat: string;
  lng: string;
  onChangeLat: (v: string) => void;
  onChangeLng: (v: string) => void;
  areaCoords: LatLngPoint[] | undefined; // có thể nhận undefined
  setAreaCoords: Dispatch<SetStateAction<LatLngPoint[]>>;
};

function Step2Map({
  lat,
  lng,
  onChangeLat,
  onChangeLng,
  areaCoords,
  setAreaCoords,
}: Step2Props) {
  // đảm bảo luôn là mảng
  const safeCoords: LatLngPoint[] = Array.isArray(areaCoords) ? areaCoords : [];

  const numericCenter: LatLngPoint = {
    lat: Number(lat) || DEFAULT_CENTER.lat,
    lng: Number(lng) || DEFAULT_CENTER.lng,
  };

  const handleAddPoint = (point: LatLngLiteral) => {
    setAreaCoords((prev) => [...prev, point]);
  };

  const positions = safeCoords.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Bước 2 · Biểu đồ khu vực
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Latitude</p>
            <Input
              className="h-9"
              value={lat}
              onChange={(e) => onChangeLat(e.target.value)}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Longitude</p>
            <Input
              className="h-9"
              value={lng}
              onChange={(e) => onChangeLng(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm" variant="outline">
            <Plus className="mr-1 h-4 w-4" />
            Thêm tọa độ
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Bản đồ Leaflet với polygon (click lên bản đồ để thêm điểm)
          </p>
          <div className="h-[360px] w-full overflow-hidden rounded-md border">
            <MapContainer
              center={numericCenter}
              zoom={16}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {positions.length > 0 && (
                <Polygon
                  positions={positions}
                  pathOptions={{ color: "green" }}
                />
              )}
              <ClickAddPoint onAdd={handleAddPoint} />
            </MapContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClickAddPoint({ onAdd }: { onAdd: (p: LatLngLiteral) => void }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

type Step3Props = {
  plots?: Plot[]; // cho phép undefined
  setPlots: Dispatch<SetStateAction<Plot[]>>;
  openPlotMap: boolean;
  setOpenPlotMap: (v: boolean) => void;
  activePlotId: string | null;
  setActivePlotId: (id: string | null) => void;
};

function Step3Plots({
  plots,
  setPlots,
  openPlotMap,
  setOpenPlotMap,
  activePlotId,
  setActivePlotId,
}: Step3Props) {
  const safePlots: Plot[] = Array.isArray(plots) ? plots : [];

  const handleChange = (id: string, field: keyof Plot, value: string) => {
    setPlots((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleAdd = () => {
    setPlots((prev) => [
      ...prev,
      {
        id: createId(),
        code: "",
        name: "",
        area: "",
        contour: "",
        coords: [], // luôn có mảng rỗng
      },
    ]);
  };

  const handleRemove = (id: string) => {
    setPlots((prev) =>
      prev.length === 1 ? prev : prev.filter((p) => p.id !== id)
    );
  };

  const activePlot = safePlots.find((p) => p.id === activePlotId) ?? null;

  const handleAddPointToPlot = (point: LatLngLiteral) => {
    if (!activePlotId) return;

    setPlots((prev) =>
      prev.map((p) =>
        p.id === activePlotId
          ? { ...p, coords: [...(p.coords ?? []), point] }
          : p
      )
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bước 3 · Lô trong khu vực
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {safePlots.map((p, idx) => {
            const safeCoords = p.coords ?? [];

            return (
              <div
                key={p.id}
                className="space-y-3 rounded-lg border bg-muted/10 p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Lô {idx + 1}
                  </p>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-red-500 hover:text-red-600"
                    disabled={safePlots.length === 1}
                    onClick={() => handleRemove(p.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Mã lô <span className="text-red-500">*</span>
                    </p>
                    <Input
                      className="h-9"
                      value={p.code}
                      onChange={(e) =>
                        handleChange(p.id, "code", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Tên lô <span className="text-red-500">*</span>
                    </p>
                    <Input
                      className="h-9"
                      value={p.name}
                      onChange={(e) =>
                        handleChange(p.id, "name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Diện tích (m²) <span className="text-red-500">*</span>
                    </p>
                    <Input
                      className="h-9"
                      type="number"
                      min={0}
                      value={p.area}
                      onChange={(e) =>
                        handleChange(p.id, "area", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Đường bình độ (cao độ)
                    </p>
                    <Input
                      className="h-9"
                      value={p.contour}
                      onChange={(e) =>
                        handleChange(p.id, "contour", e.target.value)
                      }
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-1 flex w-full items-center justify-center gap-2 border-emerald-500 text-emerald-600"
                    onClick={() => {
                      setActivePlotId(p.id);
                      setOpenPlotMap(true);
                    }}
                  >
                    <Map className="h-4 w-4" />
                    Tạo bản đồ lô
                  </Button>

                  <div className="space-y-1 text-xs">
                    <p className="font-medium text-muted-foreground">
                      Tọa độ lô (tổng {safeCoords.length} điểm)
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <Button
            type="button"
            variant="ghost"
            className="w-full justify-center rounded-none border-t border-dashed text-xs text-emerald-700 hover:bg-emerald-50"
            onClick={handleAdd}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm lô
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openPlotMap} onOpenChange={setOpenPlotMap}>
        <DialogContent className="max-w-3xl p-0">
          <DialogHeader className="border-b px-4 py-3">
            <DialogTitle className="text-base font-semibold">
              Bản đồ lô
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 px-4 pb-4 pt-3">
            {activePlot ? (
              <>
                <p className="text-xs text-muted-foreground">
                  Lô:{" "}
                  <span className="font-semibold">
                    {activePlot.code} – {activePlot.name}
                  </span>
                </p>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Bản đồ Leaflet với polygon (click để thêm điểm)
                  </p>
                  <div className="h-[340px] w-full overflow-hidden rounded-md border">
                    <MapContainer
                      center={
                        (activePlot.coords && activePlot.coords[0]) ??
                        DEFAULT_CENTER
                      }
                      zoom={17}
                      className="h-full w-full"
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      {(activePlot.coords ?? []).length > 0 && (
                        <Polygon
                          positions={(activePlot.coords ?? []).map((c) => [
                            c.lat,
                            c.lng,
                          ])}
                          pathOptions={{ color: "orange" }}
                        />
                      )}
                      <ClickAddPoint onAdd={handleAddPointToPlot} />
                    </MapContainer>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Chưa chọn lô.</p>
            )}

            <div className="flex items-center justify-between pt-1">
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  <X className="mr-1 h-4 w-4" />
                  Đóng
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button size="sm" className="bg-emerald-600 text-white">
                  Lưu bản đồ lô
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

type Step4Props = {
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
function Step4Review({
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
}: Step4Props) {
  const safeCoords: LatLngPoint[] = Array.isArray(areaCoords) ? areaCoords : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin khu vực
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            Tên khu vực:{" "}
            <span className="font-semibold">{areaName || "-"}</span>
          </p>
          <p>
            Diện tích:{" "}
            <span className="font-semibold">{areaSize || "0"} m²</span>
          </p>
          <p>
            Loại đất: <span className="font-semibold">{soilType || "-"}</span>
          </p>
          <p>
            Địa hình: <span className="font-semibold">{terrain || "-"}</span>
          </p>
          <p>
            Đơn vị quản lý:{" "}
            <span className="font-semibold">{region?.owner ?? "-"}</span>
          </p>
          <p>Ghi chú: {note || "-"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Tọa độ khu vực
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <p className="text-red-500">
            ⚠ Demo: cần đủ điểm để tạo đa giác chính xác.
          </p>
          <p>
            Lat: <span className="font-semibold">{lat}</span> · Lng:{" "}
            <span className="font-semibold">{lng}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Xem trước khu vực trên bản đồ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px] w-full overflow-hidden rounded-md border">
            <MapContainer
              center={safeCoords[0] ?? DEFAULT_CENTER}
              zoom={15}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {safeCoords.length > 0 && (
                <Polygon
                  positions={safeCoords.map((c) => [c.lat, c.lng])}
                  pathOptions={{ color: "green" }}
                />
              )}
            </MapContainer>
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
          {plots.map((p, idx) => (
            <div
              key={p.id}
              className="space-y-1 rounded-lg border bg-muted/20 p-2"
            >
              <p className="font-semibold">
                Lô {idx + 1}: {p.code || "-"}
              </p>
              <p>Tên lô: {p.name || "-"}</p>
              <p>Diện tích: {p.area || "0"} m²</p>
              <p>Đường bình độ: {p.contour || "-"}</p>
              <p>Tổng số điểm: {p.coords?.length ?? 0}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
