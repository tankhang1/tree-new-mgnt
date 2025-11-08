"use client";

import { useMemo, useState } from "react";
import {
  Map,
  MapPin,
  Focus,
  Layers,
  Grid3X3,
  Sprout,
  Leaf,
  Droplets,
  Mountain,
  Wheat,
  Info,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

type CropType = "corn" | "soybean";

type Region = {
  id: string;
  name: string;
  code: string;
  province: string;
  areaHa: number;
  note?: string;
};

type Area = {
  id: string;
  regionId: string;
  name: string;
  code: string;
  totalAreaHa: number;
  soilType: string;
  topo: string;
  note?: string;
};

type Plot = {
  id: string;
  areaId: string;
  code: string;
  name: string;
  crop: CropType;
  areaHa: number;
  irrigation: "khong-tuoi" | "tran-ranh" | "phun-mua" | "nho-giot";
  sowingDate?: string;
  status: "chuan-bi" | "dang-trong" | "thu-hoach" | "sau-thu-hoach" | "cai-tao";
  soilType: string;
  topo: string;
  note?: string;
};

// ===== DATA MẪU =====

const regions: Region[] = [
  {
    id: "r1",
    name: "Vùng Bắc A",
    code: "V-BA",
    province: "Gia Lai",
    areaHa: 120,
    note: "Khu trung tâm sản xuất bắp lai.",
  },
  {
    id: "r2",
    name: "Vùng Nam B",
    code: "V-NB",
    province: "Đắk Lắk",
    areaHa: 85,
    note: "Chuyên đậu nành và luân canh bắp.",
  },
  {
    id: "r3",
    name: "Vùng Đông C",
    code: "V-DC",
    province: "Đồng Nai",
    areaHa: 60,
    note: "Khu thí nghiệm giống và sản xuất giống nền.",
  },
];

const areas: Area[] = [
  {
    id: "a1",
    regionId: "r1",
    name: "Khu A1",
    code: "A1",
    totalAreaHa: 40,
    soilType: "Đất đỏ bazan",
    topo: "Bằng phẳng",
    note: "Phù hợp trồng bắp lai năng suất cao.",
  },
  {
    id: "a2",
    regionId: "r1",
    name: "Khu A2",
    code: "A2",
    totalAreaHa: 80,
    soilType: "Đất thịt nhẹ",
    topo: "Đồi thoải",
  },
  {
    id: "a3",
    regionId: "r2",
    name: "Khu B1",
    code: "B1",
    totalAreaHa: 35,
    soilType: "Đất phù sa",
    topo: "Bằng phẳng",
  },
  {
    id: "a4",
    regionId: "r2",
    name: "Khu B2",
    code: "B2",
    totalAreaHa: 50,
    soilType: "Đất xám",
    topo: "Dốc nhẹ",
    note: "Cần chú ý xói mòn mùa mưa.",
  },
  {
    id: "a5",
    regionId: "r3",
    name: "Khu C1",
    code: "C1",
    totalAreaHa: 60,
    soilType: "Đất đỏ bazan",
    topo: "Đồi thoải",
    note: "Khu thí nghiệm giống mới.",
  },
];

const plots: Plot[] = [
  {
    id: "p1",
    areaId: "a1",
    code: "A1-01",
    name: "Lô bắp lai 1",
    crop: "corn",
    areaHa: 8,
    irrigation: "nho-giot",
    sowingDate: "2025-07-10",
    status: "dang-trong",
    soilType: "Đất đỏ bazan",
    topo: "Bằng phẳng",
    note: "Đã bón lót đủ NPK, sinh trưởng tốt.",
  },
  {
    id: "p2",
    areaId: "a1",
    code: "A1-02",
    name: "Lô bắp lai 2",
    crop: "corn",
    areaHa: 12,
    irrigation: "phun-mua",
    sowingDate: "2025-07-18",
    status: "dang-trong",
    soilType: "Đất đỏ bazan",
    topo: "Bằng phẳng",
  },
  {
    id: "p3",
    areaId: "a2",
    code: "A2-01",
    name: "Lô luân canh bắp – đậu nành",
    crop: "corn",
    areaHa: 15,
    irrigation: "tran-ranh",
    sowingDate: "2025-06-25",
    status: "thu-hoach",
    soilType: "Đất thịt nhẹ",
    topo: "Đồi thoải",
    note: "Chuẩn bị chuyển sang đậu nành vụ sau.",
  },
  {
    id: "p4",
    areaId: "a2",
    code: "A2-02",
    name: "Lô đậu nành 1",
    crop: "soybean",
    areaHa: 10,
    irrigation: "phun-mua",
    sowingDate: "2025-08-02",
    status: "dang-trong",
    soilType: "Đất thịt nhẹ",
    topo: "Đồi thoải",
  },
  {
    id: "p5",
    areaId: "a3",
    code: "B1-01",
    name: "Lô đậu nành thấp",
    crop: "soybean",
    areaHa: 12,
    irrigation: "khong-tuoi",
    sowingDate: "2025-07-05",
    status: "sau-thu-hoach",
    soilType: "Đất phù sa",
    topo: "Bằng phẳng",
  },
  {
    id: "p6",
    areaId: "a4",
    code: "B2-01",
    name: "Lô bắp đồi",
    crop: "corn",
    areaHa: 20,
    irrigation: "tran-ranh",
    sowingDate: "2025-06-15",
    status: "dang-trong",
    soilType: "Đất xám",
    topo: "Dốc nhẹ",
  },
  {
    id: "p7",
    areaId: "a5",
    code: "C1-01",
    name: "Lô thử nghiệm giống bắp mới",
    crop: "corn",
    areaHa: 5,
    irrigation: "nho-giot",
    sowingDate: "2025-08-20",
    status: "chuan-bi",
    soilType: "Đất đỏ bazan",
    topo: "Đồi thoải",
    note: "Giống bắp lai F1 đang thử nghiệm.",
  },
  {
    id: "p8",
    areaId: "a5",
    code: "C1-02",
    name: "Lô đậu nành giống nền",
    crop: "soybean",
    areaHa: 8,
    irrigation: "nho-giot",
    sowingDate: "2025-07-30",
    status: "dang-trong",
    soilType: "Đất đỏ bazan",
    topo: "Đồi thoải",
  },
];

// ===== COMPONENT CHÍNH =====

export default function FieldsDetailPage() {
  const navigate = useNavigate();
  const [selectedRegionId, setSelectedRegionId] = useState<string>("r1");
  const [selectedAreaId, setSelectedAreaId] = useState<string>("a1");
  const [selectedPlotId, setSelectedPlotId] = useState<string>("p1");

  const selectedRegion = useMemo(
    () => regions.find((r) => r.id === selectedRegionId) || regions[0],
    [selectedRegionId]
  );

  const filteredAreas = useMemo(
    () => areas.filter((a) => a.regionId === selectedRegion.id),
    [selectedRegion]
  );

  const selectedArea = useMemo(
    () =>
      filteredAreas.find((a) => a.id === selectedAreaId) ||
      filteredAreas[0] ||
      null,
    [filteredAreas, selectedAreaId]
  );

  const filteredPlots = useMemo(
    () =>
      selectedArea ? plots.filter((p) => p.areaId === selectedArea.id) : [],
    [selectedArea]
  );

  const selectedPlot = useMemo(
    () =>
      filteredPlots.find((p) => p.id === selectedPlotId) ||
      filteredPlots[0] ||
      null,
    [filteredPlots, selectedPlotId]
  );

  const areaStats = useMemo(() => {
    if (!selectedArea) return null;
    const areaCorn = filteredPlots
      .filter((p) => p.crop === "corn")
      .reduce((s, p) => s + p.areaHa, 0);
    const areaSoy = filteredPlots
      .filter((p) => p.crop === "soybean")
      .reduce((s, p) => s + p.areaHa, 0);
    return {
      plots: filteredPlots.length,
      corn: areaCorn,
      soybean: areaSoy,
    };
  }, [selectedArea, filteredPlots]);

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-lg font-semibold">
              Phân cấp vùng – khu vực – lô gieo trồng
            </h1>
            <p className="text-xs text-muted-foreground">
              Theo dõi cấu trúc vùng canh tác, khu vực sản xuất và từng lô bắp /
              đậu nành.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate("/main/crop/fields/map")}
        >
          <Info className="mr-1 h-4 w-4" />
          Hướng dẫn thiết lập sơ đồ
        </Button>
      </header>

      {/* 3 CỘT: VÙNG – KHU VỰC – LÔ */}
      <div className="grid gap-4 lg:grid-cols-[260px,320px,1fr]">
        {/* VÙNG */}
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              Vùng canh tác
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-[11px] text-muted-foreground">
              Chọn vùng theo địa lý / cụm trang trại. Mỗi vùng có nhiều khu vực.
            </p>
            <div className="mt-1 space-y-2">
              {regions.map((r) => {
                const selected = r.id === selectedRegionId;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedRegionId(r.id);
                      // reset khu vực & lô khi đổi vùng
                      const firstArea = areas.find((a) => a.regionId === r.id);
                      if (firstArea) {
                        setSelectedAreaId(firstArea.id);
                        const firstPlot = plots.find(
                          (p) => p.areaId === firstArea.id
                        );
                        if (firstPlot) setSelectedPlotId(firstPlot.id);
                      }
                    }}
                    className={`flex w-full flex-col rounded-md border px-3 py-2 text-left text-xs transition hover:border-primary/60 hover:bg-muted/60 ${
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                        : "border-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{r.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Mã vùng: <span className="font-medium">{r.code}</span>
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
                      >
                        {r.areaHa} ha
                      </Badge>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Tỉnh: {r.province}
                    </p>
                    {r.note && (
                      <p className="mt-1 text-[11px] italic text-muted-foreground">
                        {r.note}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* KHU VỰC */}
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between gap-2 text-sm font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Khu vực trong vùng
              </div>
              {selectedRegion && (
                <span className="text-[11px] text-muted-foreground">
                  Thuộc:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedRegion.name}
                  </span>
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredAreas.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Vùng này chưa có khu vực nào.
              </p>
            )}

            <div className="space-y-2">
              {filteredAreas.map((a) => {
                const selected = a.id === selectedAreaId;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setSelectedAreaId(a.id);
                      const firstPlot = plots.find((p) => p.areaId === a.id);
                      if (firstPlot) setSelectedPlotId(firstPlot.id);
                    }}
                    className={`flex w-full flex-col rounded-md border px-3 py-2 text-left text-xs transition hover:border-primary/60 hover:bg-muted/60 ${
                      selected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                        : "border-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{a.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Mã khu: <span className="font-medium">{a.code}</span>
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-amber-200 bg-amber-50 text-[10px] text-amber-700"
                      >
                        ~ {a.totalAreaHa} ha
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Đất: {a.soilType} • Địa hình: {a.topo}
                    </p>
                    {a.note && (
                      <p className="mt-1 text-[11px] italic text-muted-foreground">
                        {a.note}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedArea && areaStats && (
              <div className="mt-2 rounded-md border border-dashed border-muted-foreground/30 bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
                <p className="mb-1 text-xs font-semibold text-foreground">
                  Tổng quan khu vực {selectedArea.name}
                </p>
                <p>
                  Số lô:{" "}
                  <span className="font-semibold text-foreground">
                    {areaStats.plots}
                  </span>
                </p>
                <p>
                  Diện tích bắp:{" "}
                  <span className="font-semibold text-amber-700">
                    {areaStats.corn} ha
                  </span>{" "}
                  • Đậu nành:{" "}
                  <span className="font-semibold text-emerald-700">
                    {areaStats.soybean} ha
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LÔ + CHI TIẾT LÔ */}
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between gap-2 text-sm font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-primary" />
                Danh sách lô & chi tiết lô
              </div>
              {selectedArea && (
                <span className="text-[11px] text-muted-foreground">
                  Thuộc khu vực:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedArea.name}
                  </span>
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-[240px,1fr]">
            {/* LIST LÔ */}
            <div className="space-y-2">
              {filteredPlots.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Khu vực này chưa có lô nào.
                </p>
              )}

              <div className="space-y-2">
                {filteredPlots.map((p) => {
                  const selected = p.id === selectedPlotId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlotId(p.id)}
                      className={`flex w-full flex-col rounded-md border px-3 py-2 text-left text-xs transition hover:border-primary/60 hover:bg-muted/60 ${
                        selected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                          : "border-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Mã lô: <span className="font-medium">{p.code}</span>
                          </p>
                        </div>
                        <CropBadge crop={p.crop} />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Diện tích:{" "}
                        <span className="font-semibold">{p.areaHa} ha</span> •
                        Tưới: {renderIrrigationLabel(p.irrigation)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Trạng thái: {renderStatusLabel(p.status)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CHI TIẾT LÔ ĐANG CHỌN */}
            <div className="space-y-2 rounded-md border bg-muted/40 p-3 text-xs">
              {selectedPlot ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Wheat className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-semibold">
                          {selectedPlot.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Mã lô: {selectedPlot.code}
                        </p>
                      </div>
                    </div>
                    <CropBadge crop={selectedPlot.crop} large />
                  </div>

                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="space-y-1">
                      <p>
                        Diện tích:{" "}
                        <span className="font-semibold">
                          {selectedPlot.areaHa} ha
                        </span>
                      </p>
                      <p>
                        Loại đất:{" "}
                        <span className="font-semibold">
                          {selectedPlot.soilType}
                        </span>
                      </p>
                      <p>
                        Địa hình:{" "}
                        <span className="font-semibold">
                          {selectedPlot.topo}
                        </span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p>
                        Hình thức tưới:{" "}
                        <span className="font-semibold">
                          {renderIrrigationLabel(selectedPlot.irrigation)}
                        </span>
                      </p>
                      <p>
                        Ngày gieo trồng:{" "}
                        <span className="font-semibold">
                          {selectedPlot.sowingDate
                            ? new Date(
                                selectedPlot.sowingDate
                              ).toLocaleDateString("vi-VN")
                            : "-"}
                        </span>
                      </p>
                      <p>
                        Trạng thái:{" "}
                        <span className="font-semibold">
                          {renderStatusLabel(selectedPlot.status)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {selectedPlot.note && (
                    <div className="mt-2 rounded-md bg-card/70 p-2 text-[11px]">
                      <p className="mb-1 font-semibold">Ghi chú canh tác</p>
                      <p className="text-muted-foreground">
                        {selectedPlot.note}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Chọn một lô bên trái để xem chi tiết.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ====== COMPONENT PHỤ ======

function CropBadge({ crop, large }: { crop: CropType; large?: boolean }) {
  const isCorn = crop === "corn";
  const Icon = isCorn ? Leaf : Sprout;
  const label = isCorn ? "Bắp (Ngô)" : "Đậu nành";
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 border-emerald-200 bg-emerald-50 ${
        large ? "px-2 py-1 text-[11px]" : "px-1.5 py-0.5 text-[10px]"
      }`}
    >
      <Icon
        className={`${large ? "h-3.5 w-3.5" : "h-3 w-3"} ${
          isCorn ? "text-amber-600" : "text-emerald-600"
        }`}
      />
      <span className="font-medium">{label}</span>
    </Badge>
  );
}

function renderIrrigationLabel(v: Plot["irrigation"]): string {
  switch (v) {
    case "khong-tuoi":
      return "Không tưới (phụ thuộc mưa)";
    case "tran-ranh":
      return "Tưới tràn theo rãnh";
    case "phun-mua":
      return "Tưới phun mưa";
    case "nho-giot":
      return "Tưới nhỏ giọt";
    default:
      return v;
  }
}

function renderStatusLabel(s: Plot["status"]): string {
  switch (s) {
    case "chuan-bi":
      return "Chuẩn bị gieo trồng";
    case "dang-trong":
      return "Đang sinh trưởng";
    case "thu-hoach":
      return "Đang thu hoạch";
    case "sau-thu-hoach":
      return "Sau thu hoạch / nghỉ đất";
    case "cai-tao":
      return "Cải tạo đất / chuyển đổi";
    default:
      return s;
  }
}
