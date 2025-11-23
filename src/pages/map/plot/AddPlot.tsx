"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, MapPin, Map, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { MapContainer, Polygon, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";

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
import { ScrollArea } from "@/components/ui/scroll-area";

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

type RegionArea = {
  id: string;
  code: string;
  name: string;
  regionId: string;
  areaSqm: number;
  soilType: string;
  terrain: string;
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

const AREAS: RegionArea[] = [
  {
    id: "kv-bac",
    code: "KV-BAC",
    name: "Khu vực phía Bắc",
    regionId: "vt-003",
    areaSqm: 4500,
    soilType: "Đất thịt",
    terrain: "Cao",
  },
  {
    id: "kv-nam",
    code: "KV-NAM",
    name: "Khu vực phía Nam",
    regionId: "vt-003",
    areaSqm: 5500,
    soilType: "Đất đỏ",
    terrain: "Dốc",
  },
  {
    id: "kv-tay",
    code: "KV-TAY",
    name: "Khu vực phía Tây",
    regionId: "vt-001",
    areaSqm: 6000,
    soilType: "Đất đỏ bazan",
    terrain: "Thoai thoải",
  },
  {
    id: "kv-dong",
    code: "KV-DONG",
    name: "Khu vực phía Đông",
    regionId: "vt-002",
    areaSqm: 7200,
    soilType: "Đất cát pha",
    terrain: "Bằng phẳng",
  },
];

const CROP_TYPES = ["Bắp", "Đậu nành", "Lúa", "Cây ăn trái"];
const SEED_VARIETIES = ["LVN10", "MX2", "DT84", "Giống nội bộ"];

const DEFAULT_CENTER: LatLngPoint = {
  lat: 10.762622,
  lng: 106.660172,
};

function createId() {
  return crypto.randomUUID();
}

export default function AddPlotPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [regionSearch, setRegionSearch] = useState("");
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    REGIONS[0]?.id ?? null
  );

  const [areaSearch, setAreaSearch] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const [lotCode, setLotCode] = useState("LO-01");
  const [lotName, setLotName] = useState("Lô 01 – Gần đường");
  const [lotArea, setLotArea] = useState("3500");
  const [contourInfo, setContourInfo] = useState(
    "Địa hình thấp, thoát nước tốt"
  );
  const [elevation, setElevation] = useState("110");
  const [cropType, setCropType] = useState<string>("Bắp");
  const [seedVariety, setSeedVariety] = useState<string>("LVN10");
  const [rowCount, setRowCount] = useState("20");
  const [note, setNote] = useState("");

  const [lat, setLat] = useState(String(DEFAULT_CENTER.lat));
  const [lng, setLng] = useState(String(DEFAULT_CENTER.lng));
  const [lotCoords, setLotCoords] = useState<LatLngPoint[]>([
    { lat: 10.7625, lng: 106.6595 },
    { lat: 10.7627, lng: 106.6607 },
    { lat: 10.7618, lng: 106.6609 },
    { lat: 10.7616, lng: 106.6598 },
  ]);

  const region = useMemo(
    () => REGIONS.find((item) => item.id === selectedRegionId) ?? null,
    [selectedRegionId]
  );

  const area = useMemo(
    () => AREAS.find((item) => item.id === selectedAreaId) ?? null,
    [selectedAreaId]
  );

  const goNext = () => {
    if (step < 4) setStep((value) => (value + 1) as typeof step);
  };

  const goPrev = () => {
    if (step > 1) setStep((value) => (value - 1) as typeof step);
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
            <h1 className="text-lg font-semibold">Tạo mới phân bổ lô</h1>
            <p className="text-xs text-muted-foreground">
              Bước 1: Vùng trồng & Khu vực · Bước 2: Thông tin lô · Bước 3: Bản
              đồ lô · Bước 4: Xác nhận.
            </p>
          </div>
        </div>
        <Stepper step={step} />
      </header>

      {step === 1 && (
        <Step1RegionArea
          regionSearch={regionSearch}
          onChangeRegionSearch={setRegionSearch}
          selectedRegionId={selectedRegionId}
          onSelectRegion={setSelectedRegionId}
          areaSearch={areaSearch}
          onChangeAreaSearch={setAreaSearch}
          selectedAreaId={selectedAreaId}
          onSelectArea={setSelectedAreaId}
        />
      )}

      {step === 2 && (
        <Step2LotInfo
          region={region}
          area={area}
          lotCode={lotCode}
          setLotCode={setLotCode}
          lotName={lotName}
          setLotName={setLotName}
          lotArea={lotArea}
          setLotArea={setLotArea}
          contourInfo={contourInfo}
          setContourInfo={setContourInfo}
          elevation={elevation}
          setElevation={setElevation}
          cropType={cropType}
          setCropType={setCropType}
          seedVariety={seedVariety}
          setSeedVariety={setSeedVariety}
          rowCount={rowCount}
          setRowCount={setRowCount}
          note={note}
          setNote={setNote}
        />
      )}

      {step === 3 && (
        <Step3LotMap
          lat={lat}
          lng={lng}
          onChangeLat={setLat}
          onChangeLng={setLng}
          lotCoords={lotCoords}
          setLotCoords={setLotCoords}
        />
      )}

      {step === 4 && (
        <Step4Review
          region={region}
          area={area}
          lotCode={lotCode}
          lotName={lotName}
          lotArea={lotArea}
          contourInfo={contourInfo}
          elevation={elevation}
          cropType={cropType}
          seedVariety={seedVariety}
          rowCount={rowCount}
          note={note}
          lat={lat}
          lng={lng}
          lotCoords={lotCoords}
        />
      )}

      <div className="mt-2 mb-2 flex items-center justify-between border-t pt-3">
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
              navigate("/main/crop/lots");
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
    { id: 1, label: "Vùng trồng & Khu vực" },
    { id: 2, label: "Tạo lô" },
    { id: 3, label: "Bản đồ lô" },
    { id: 4, label: "Xác nhận" },
  ];

  return (
    <div className="flex flex-1 items-center gap-3">
      {steps.map((item, index) => {
        const isActive = item.id === step;
        const isDone = item.id < step;

        return (
          <div key={item.id} className="flex flex-1 items-center gap-2">
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
                  item.id
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase">
                  Bước {item.id}
                </span>
                <span className="text-[10px]">{item.label}</span>
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

type Step1RegionAreaProps = {
  regionSearch: string;
  onChangeRegionSearch: (value: string) => void;
  selectedRegionId: string | null;
  onSelectRegion: (id: string) => void;
  areaSearch: string;
  onChangeAreaSearch: (value: string) => void;
  selectedAreaId: string | null;
  onSelectArea: (id: string) => void;
};

function Step1RegionArea({
  regionSearch,
  onChangeRegionSearch,
  selectedRegionId,
  onSelectRegion,
  areaSearch,
  onChangeAreaSearch,
  selectedAreaId,
  onSelectArea,
}: Step1RegionAreaProps) {
  const filteredRegions = useMemo(
    () =>
      REGIONS.filter((item) => {
        const q = regionSearch.toLowerCase().trim();
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.owner.toLowerCase().includes(q)
        );
      }),
    [regionSearch]
  );

  const filteredAreas = useMemo(
    () =>
      AREAS.filter((item) => {
        if (selectedRegionId && item.regionId !== selectedRegionId)
          return false;
        const q = areaSearch.toLowerCase().trim();
        if (!q) return true;
        return (
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q)
        );
      }),
    [areaSearch, selectedRegionId]
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Bước 1 · Chọn vùng trồng & khu vực
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
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
              {filteredRegions.map((item) => {
                const isActive = item.id === selectedRegionId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectRegion(item.id)}
                    className={`min-w-[260px] flex-1 rounded-lg border px-4 py-3 text-left text-xs shadow-sm ${
                      isActive
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">{item.name}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {item.code}
                      </span>
                    </div>
                    <p className="mt-1">
                      <span className="font-semibold">Diện tích:</span>{" "}
                      {item.area} m²
                    </p>
                    <p>
                      <span className="font-semibold">Loại đất:</span>{" "}
                      {item.soilType}
                    </p>
                    <p>
                      <span className="font-semibold">Địa hình:</span>{" "}
                      {item.terrain}
                    </p>
                    <p>
                      <span className="font-semibold">
                        Doanh nghiệp / nông hộ:
                      </span>{" "}
                      {item.owner}
                    </p>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-foreground">Khu vực</p>
          <div className="relative mb-2">
            <Input
              placeholder="Tìm kiếm khu vực"
              value={areaSearch}
              onChange={(e) => onChangeAreaSearch(e.target.value)}
              className="h-9 pl-8"
            />
            <Map className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filteredAreas.map((item) => {
              const isActive = item.id === selectedAreaId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectArea(item.id)}
                  className={`rounded-lg border px-4 py-3 text-left text-xs shadow-sm ${
                    isActive
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                      {item.code}
                    </span>
                  </div>
                  <p className="mt-1">
                    <span className="font-semibold">Vùng trồng:</span>{" "}
                    {REGIONS.find((r) => r.id === item.regionId)?.name ?? "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Diện tích:</span>{" "}
                    {item.areaSqm.toLocaleString("vi-VN")} m²
                  </p>
                  <p>
                    <span className="font-semibold">Đất:</span> {item.soilType}
                    {" · "}
                    <span className="font-semibold">Địa hình:</span>{" "}
                    {item.terrain}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type Step2LotInfoProps = {
  region: RegionSummary | null;
  area: RegionArea | null;
  lotCode: string;
  setLotCode: (value: string) => void;
  lotName: string;
  setLotName: (value: string) => void;
  lotArea: string;
  setLotArea: (value: string) => void;
  contourInfo: string;
  setContourInfo: (value: string) => void;
  elevation: string;
  setElevation: (value: string) => void;
  cropType: string;
  setCropType: (value: string) => void;
  seedVariety: string;
  setSeedVariety: (value: string) => void;
  rowCount: string;
  setRowCount: (value: string) => void;
  note: string;
  setNote: (value: string) => void;
};

function Step2LotInfo({
  region,
  area,
  lotCode,
  setLotCode,
  lotName,
  setLotName,
  lotArea,
  setLotArea,
  contourInfo,
  setContourInfo,
  elevation,
  setElevation,
  cropType,
  setCropType,
  seedVariety,
  setSeedVariety,
  rowCount,
  setRowCount,
  note,
  setNote,
}: Step2LotInfoProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Bước 2 · Thông tin lô
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 text-xs">
          <div className="space-y-1 rounded-md bg-muted/40 px-3 py-2">
            <p className="font-semibold text-foreground">Vùng trồng</p>
            <p>{region ? `${region.name} (${region.code})` : "-"}</p>
            <p>
              Diện tích vùng:{" "}
              {region ? `${region.area} m² · ${region.soilType}` : "-"}
            </p>
          </div>
          <div className="space-y-1 rounded-md bg-muted/40 px-3 py-2">
            <p className="font-semibold text-foreground">Khu vực</p>
            <p>{area ? `${area.name} (${area.code})` : "-"}</p>
            <p>
              Diện tích khu vực:{" "}
              {area ? `${area.areaSqm.toLocaleString("vi-VN")} m²` : "-"}
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">
              Mã lô <span className="text-red-500">*</span>
            </p>
            <Input
              className="h-9"
              value={lotCode}
              onChange={(e) => setLotCode(e.target.value)}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Tên lô <span className="text-red-500">*</span>
            </p>
            <Input
              className="h-9"
              value={lotName}
              onChange={(e) => setLotName(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">
              Diện tích lô (m²) <span className="text-red-500">*</span>
            </p>
            <Input
              className="h-9"
              type="number"
              min={0}
              value={lotArea}
              onChange={(e) => setLotArea(e.target.value)}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              Cao độ trung bình (m)
            </p>
            <Input
              className="h-9"
              type="number"
              value={elevation}
              onChange={(e) => setElevation(e.target.value)}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Số hàng cây trên lô</p>
            <Input
              className="h-9"
              type="number"
              value={rowCount}
              onChange={(e) => setRowCount(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Loại cây trồng</p>
            <Select value={cropType} onValueChange={setCropType}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Chọn loại cây" />
              </SelectTrigger>
              <SelectContent>
                {CROP_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Giống / hạt giống</p>
            <Select value={seedVariety} onValueChange={setSeedVariety}>
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="Chọn giống" />
              </SelectTrigger>
              <SelectContent>
                {SEED_VARIETIES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground">
            Thông tin đường bình độ
          </p>
          <Input
            className="h-9"
            value={contourInfo}
            onChange={(e) => setContourInfo(e.target.value)}
            placeholder="VD: Địa hình thấp, thoát nước tốt; dốc nhẹ về phía Đông..."
          />
        </div>

        <div>
          <p className="text-xs text-muted-foreground">Ghi chú thêm</p>
          <Textarea
            className="min-h-[70px]"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type Step3LotMapProps = {
  lat: string;
  lng: string;
  onChangeLat: (value: string) => void;
  onChangeLng: (value: string) => void;
  lotCoords: LatLngPoint[];
  setLotCoords: React.Dispatch<React.SetStateAction<LatLngPoint[]>>;
};

function Step3LotMap({
  lat,
  lng,
  onChangeLat,
  onChangeLng,
  lotCoords,
  setLotCoords,
}: Step3LotMapProps) {
  const numericCenter: LatLngPoint = {
    lat: Number(lat) || DEFAULT_CENTER.lat,
    lng: Number(lng) || DEFAULT_CENTER.lng,
  };

  const positions = lotCoords.map(
    (item) => [item.lat, item.lng] as [number, number]
  );

  const handleAddPoint = (point: LatLngLiteral) => {
    setLotCoords((prev) => [...prev, point]);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Bước 3 · Bản đồ lô
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
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              setLotCoords([{ lat: numericCenter.lat, lng: numericCenter.lng }])
            }
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm điểm tại tâm
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

type Step4ReviewProps = {
  region: RegionSummary | null;
  area: RegionArea | null;
  lotCode: string;
  lotName: string;
  lotArea: string;
  contourInfo: string;
  elevation: string;
  cropType: string;
  seedVariety: string;
  rowCount: string;
  note: string;
  lat: string;
  lng: string;
  lotCoords: LatLngPoint[];
};

function Step4Review({
  region,
  area,
  lotCode,
  lotName,
  lotArea,
  contourInfo,
  elevation,
  cropType,
  seedVariety,
  rowCount,
  note,
  lat,
  lng,
  lotCoords,
}: Step4ReviewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin lô trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
          <div className="space-y-1">
            <p>
              Vùng trồng:{" "}
              <span className="font-semibold">
                {region ? `${region.name} (${region.code})` : "-"}
              </span>
            </p>
            <p>
              Khu vực:{" "}
              <span className="font-semibold">
                {area ? `${area.name} (${area.code})` : "-"}
              </span>
            </p>
            <p>
              Mã lô: <span className="font-semibold">{lotCode || "-"}</span>
            </p>
            <p>
              Tên lô: <span className="font-semibold">{lotName || "-"}</span>
            </p>
            <p>
              Diện tích:{" "}
              <span className="font-semibold">{lotArea || "0"} m²</span>
            </p>
          </div>
          <div className="space-y-1">
            <p>
              Loại cây trồng:{" "}
              <span className="font-semibold">{cropType || "-"}</span>
            </p>
            <p>
              Giống: <span className="font-semibold">{seedVariety || "-"}</span>
            </p>
            <p>
              Số hàng cây:{" "}
              <span className="font-semibold">{rowCount || "0"}</span>
            </p>
            <p>
              Cao độ:{" "}
              <span className="font-semibold">
                {elevation ? `${elevation} m` : "-"}
              </span>
            </p>
            <p>
              Đường bình độ:{" "}
              <span className="font-semibold">{contourInfo || "-"}</span>
            </p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p>Ghi chú: {note || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Tọa độ lô & bản đồ xem trước
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <p>
            Lat: <span className="font-semibold">{lat}</span> · Lng:{" "}
            <span className="font-semibold">{lng}</span>
          </p>
          <p>
            Tổng số điểm:{" "}
            <span className="font-semibold">{lotCoords.length}</span>
          </p>

          <div className="h-[260px] w-full overflow-hidden rounded-md border">
            <MapContainer
              center={lotCoords[0] ?? DEFAULT_CENTER}
              zoom={16}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {lotCoords.length > 0 && (
                <Polygon
                  positions={lotCoords.map((item) => [item.lat, item.lng])}
                  pathOptions={{ color: "green" }}
                />
              )}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
