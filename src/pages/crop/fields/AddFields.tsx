"use client";

import { useState } from "react";
import {
  MapPin,
  Leaf,
  Sprout,
  Layers3,
  SquareKanban,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  PauseCircle,
  Wrench,
  Clock,
  Wheat,
} from "lucide-react";

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
import OwnerSelectCard from "./OwnerSelectCard";
import { useNavigate } from "react-router";

type CropType = "corn" | "soybean";

type Area = {
  id: string;
  name: string;
  area: string;
  soilType: string;
  topo: string;
  note: string;
};

type Plot = {
  id: string;
  areaName: string;
  plotCode: string;
  crop: CropType;
  variety: string;
  size: string;
  plantingDate: string;
  rowSpacing: string;
  plantSpacing: string;
  irrigation: string;
  note: string;
};

function createId() {
  return crypto.randomUUID();
}

export default function AddFieldsPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const navigate = useNavigate();
  // Step 1 – Vùng
  const [regionCode, setRegionCode] = useState("KV-CORN-01");
  const [regionName, setRegionName] = useState("Vùng bắp An Giang");
  const [cropMain, setCropMain] = useState<CropType>("corn");
  const [province, setProvince] = useState("An Giang");
  const [district, setDistrict] = useState("TP. Long Xuyên");
  const [commune, setCommune] = useState("Phường Mỹ Hòa");
  const [address, setAddress] = useState(
    "Ấp Bình Hòa, Phường Mỹ Hòa, TP. Long Xuyên"
  );
  const [owner, setOwner] = useState("Hợp tác xã Nông nghiệp A");
  const [regionArea, setRegionArea] = useState("25.000");
  const [terrain, setTerrain] = useState("Đất bằng phẳng, ven kênh tưới tiêu");
  const [regionNote, setRegionNote] = useState(
    "Vùng trọng điểm sản xuất bắp lai, có hệ thống kênh mương hiện hữu."
  );

  // Step 2 – Khu vực
  const [areas, setAreas] = useState<Area[]>([
    {
      id: createId(),
      name: "Khu vực 1 – Gần trục lộ chính",
      area: "8.000",
      soilType: "Đất phù sa",
      topo: "Bằng phẳng",
      note: "Ưu tiên gieo bắp lai vụ Đông Xuân.",
    },
    {
      id: createId(),
      name: "Khu vực 2 – Ven kênh",
      area: "10.000",
      soilType: "Đất thịt nhẹ",
      topo: "Bằng phẳng, dễ thoát nước",
      note: "Phù hợp trồng đậu nành luân canh với bắp.",
    },
  ]);

  // Step 3 – Lô chi tiết
  const [plots, setPlots] = useState<Plot[]>([
    {
      id: createId(),
      areaName: "Khu vực 1 – Gần trục lộ chính",
      plotCode: "KV1-LO1",
      crop: "corn",
      variety: "Bắp lai LVN10",
      size: "3.000",
      plantingDate: "2025-10-01",
      rowSpacing: "70",
      plantSpacing: "25",
      irrigation: "Tưới tràn theo rãnh",
      note: "Áp dụng cơ giới hoá gieo hạt.",
    },
    {
      id: createId(),
      areaName: "Khu vực 1 – Gần trục lộ chính",
      plotCode: "KV1-LO2",
      crop: "corn",
      variety: "Bắp nếp lai MX2",
      size: "5.000",
      plantingDate: "2025-10-03",
      rowSpacing: "65",
      plantSpacing: "22",
      irrigation: "Tưới phun mưa",
      note: "",
    },
    {
      id: createId(),
      areaName: "Khu vực 2 – Ven kênh",
      plotCode: "KV2-LO1",
      crop: "soybean",
      variety: "Đậu nành giống DT84",
      size: "4.000",
      plantingDate: "2025-11-05",
      rowSpacing: "40",
      plantSpacing: "15",
      irrigation: "Tưới nhỏ giọt",
      note: "Gieo sau vụ bắp, phục hồi đất.",
    },
  ]);

  const handleAddArea = () => {
    setAreas((prev) => [
      ...prev,
      {
        id: createId(),
        name: "",
        area: "",
        soilType: "",
        topo: "",
        note: "",
      },
    ]);
  };

  const handleChangeArea = (id: string, field: keyof Area, value: string) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleRemoveArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddPlot = () => {
    setPlots((prev) => [
      ...prev,
      {
        id: createId(),
        areaName: areas[0]?.name || "",
        plotCode: "",
        crop: cropMain,
        variety: "",
        size: "",
        plantingDate: "",
        rowSpacing: "",
        plantSpacing: "",
        irrigation: "",
        note: "",
      },
    ]);
  };

  const handleChangePlot = (id: string, field: keyof Plot, value: string) => {
    setPlots((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: field === "crop" ? (value as CropType) : value,
            }
          : p
      )
    );
  };

  const handleRemovePlot = (id: string) => {
    setPlots((prev) => prev.filter((p) => p.id !== id));
  };

  const goNext = () => {
    if (step < 4) setStep((s) => (s + 1) as typeof step);
  };
  const goPrev = () => {
    if (step > 1) setStep((s) => (s - 1) as typeof step);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER + STEPPER */}
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3">
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
              Thêm mới vùng sản xuất bắp / đậu nành
            </h1>
            <p className="text-xs text-muted-foreground">
              Phân cấp theo{" "}
              <span className="font-semibold">Vùng ➜ Khu vực ➜ Lô</span> để quản
              lý chi tiết sản xuất.
            </p>
          </div>
        </div>
        <Stepper step={step} />
      </header>

      {step === 1 && (
        <Step1Region
          regionCode={regionCode}
          setRegionCode={setRegionCode}
          regionName={regionName}
          setRegionName={setRegionName}
          cropMain={cropMain}
          setCropMain={setCropMain}
          province={province}
          setProvince={setProvince}
          district={district}
          setDistrict={setDistrict}
          commune={commune}
          setCommune={setCommune}
          address={address}
          setAddress={setAddress}
          owner={owner}
          setOwner={setOwner}
          regionArea={regionArea}
          setRegionArea={setRegionArea}
          terrain={terrain}
          setTerrain={setTerrain}
          regionNote={regionNote}
          setRegionNote={setRegionNote}
        />
      )}

      {step === 2 && (
        <Step2Areas
          areas={areas}
          onAddArea={handleAddArea}
          onChangeArea={handleChangeArea}
          onRemoveArea={handleRemoveArea}
        />
      )}

      {step === 3 && (
        <Step3Plots
          plots={plots}
          areas={areas}
          onAddPlot={handleAddPlot}
          onChangePlot={handleChangePlot}
          onRemovePlot={handleRemovePlot}
        />
      )}

      {step === 4 && (
        <Step4Review
          region={{
            regionCode,
            regionName,
            cropMain,
            province,
            district,
            commune,
            address,
            owner,
            regionArea,
            terrain,
            regionNote,
          }}
          areas={areas}
          plots={plots}
        />
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between border-t pt-3 mb-2">
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
          onClick={goNext}
        >
          {step === 4 ? "Hoàn thành" : "Tiếp theo"}
        </Button>
      </div>
    </div>
  );
}

/* ----------------- STEPPER ----------------- */

function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = [
    { id: 1, label: "Thông tin vùng" },
    { id: 2, label: "Khu vực trong vùng" },
    { id: 3, label: "Lô chi tiết" },
    { id: 4, label: "Xác nhận" },
  ];
  return (
    <div className="flex flex-1 items-center gap-3">
      {steps.map((s, idx) => {
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
            {idx < steps.length - 1 && (
              <div className="h-px flex-1 bg-emerald-500/60" />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ----------------- STEP 1 – REGION ----------------- */

function Step1Region(props: {
  regionCode: string;
  setRegionCode: (v: string) => void;
  regionName: string;
  setRegionName: (v: string) => void;
  cropMain: CropType;
  setCropMain: (v: CropType) => void;
  province: string;
  setProvince: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  commune: string;
  setCommune: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  owner: string;
  setOwner: (v: string) => void;
  regionArea: string;
  setRegionArea: (v: string) => void;
  terrain: string;
  setTerrain: (v: string) => void;
  regionNote: string;
  setRegionNote: (v: string) => void;
}) {
  const {
    regionCode,
    setRegionCode,
    regionName,
    setRegionName,
    cropMain,
    setCropMain,
    province,
    setProvince,
    district,
    setDistrict,
    commune,
    setCommune,
    address,
    setAddress,
    owner,
    setOwner,
    regionArea,
    setRegionArea,
    terrain,
    setTerrain,
    regionNote,
    setRegionNote,
  } = props;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.3fr,1fr]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Layers3 className="h-4 w-4 text-primary" />
            Thông tin vùng sản xuất
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Mã vùng (định danh nhà nước) *
              </p>
              <Input
                className="h-9"
                value={regionCode}
                onChange={(e) => setRegionCode(e.target.value)}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tên vùng trồng *</p>
              <Input
                className="h-9"
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
                placeholder="VD: Vùng bắp lai Đông Xuân"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trạng thái *</p>
              <Select>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn trạng thái canh tác" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chuan-bi">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-sky-500" />
                      <span>Chuẩn bị gieo trồng</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dang-trong">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-3 w-3 text-emerald-600" />
                      <span>Đang sinh trưởng</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="thu-hoach">
                    <div className="flex items-center gap-2">
                      <Wheat className="h-3 w-3 text-amber-600" />
                      <span>Đang thu hoạch</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sau-thu-hoach">
                    <div className="flex items-center gap-2">
                      <PauseCircle className="h-3 w-3 text-slate-500" />
                      <span>Sau thu hoạch / nghỉ đất</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="cai-tao">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-3 w-3 text-orange-500" />
                      <span>Cải tạo đất / chuyển đổi giống</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Loại cây chính *</p>
              <Select
                value={cropMain}
                onValueChange={(v: CropType) => setCropMain(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corn">
                    <div className="flex items-center gap-2">
                      <Leaf className="h-3 w-3 text-amber-600" />
                      <span>Bắp (Ngô)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="soybean">
                    <div className="flex items-center gap-2">
                      <Sprout className="h-3 w-3 text-emerald-600" />
                      <span>Đậu nành</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Diện tích vùng (m²)
              </p>
              <Input
                className="h-9"
                value={regionArea}
                onChange={(e) => setRegionArea(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {/* Tỉnh / Thành phố */}
            <div>
              <p className="text-xs text-muted-foreground">Tỉnh / Thành phố</p>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn tỉnh / thành" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="An Giang">An Giang</SelectItem>
                  <SelectItem value="Đồng Tháp">Đồng Tháp</SelectItem>
                  <SelectItem value="Vĩnh Long">Vĩnh Long</SelectItem>
                  <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                  <SelectItem value="Gia Lai">Gia Lai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quận / Huyện */}
            <div>
              <p className="text-xs text-muted-foreground">Quận / Huyện</p>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn quận / huyện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TP. Long Xuyên">TP. Long Xuyên</SelectItem>
                  <SelectItem value="Huyện Châu Thành">
                    Huyện Châu Thành
                  </SelectItem>
                  <SelectItem value="Huyện Thoại Sơn">
                    Huyện Thoại Sơn
                  </SelectItem>
                  <SelectItem value="Huyện Lấp Vò">Huyện Lấp Vò</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Phường / Xã */}
            <div>
              <p className="text-xs text-muted-foreground">Phường / Xã</p>
              <Select value={commune} onValueChange={setCommune}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn phường / xã" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phường Mỹ Hòa">Phường Mỹ Hòa</SelectItem>
                  <SelectItem value="Xã Bình Thạnh">Xã Bình Thạnh</SelectItem>
                  <SelectItem value="Xã Tân Lập">Xã Tân Lập</SelectItem>
                  <SelectItem value="Xã Hòa An">Xã Hòa An</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Địa chỉ chi tiết</p>
            <div className="relative">
              <Input
                className="h-9 pl-7"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, tên đường, ấp/thôn..."
              />
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <OwnerSelectCard />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <SquareKanban className="h-4 w-4 text-primary" />
            Điều kiện sản xuất & Ghi chú
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 md:grid-cols-2 mt-2">
            {/* Loại đất */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Loại đất *
              </p>
              <Select value={"dat-phu-sa"} onValueChange={() => {}}>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Chọn loại đất canh tác" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dat-phu-sa">Đất phù sa</SelectItem>
                  <SelectItem value="dat-do-bazan">Đất đỏ bazan</SelectItem>
                  <SelectItem value="dat-cat-pha">Đất cát pha</SelectItem>
                  <SelectItem value="dat-thit-nhe">Đất thịt nhẹ</SelectItem>
                  <SelectItem value="dat-xam">Đất xám bạc màu</SelectItem>
                  <SelectItem value="khac">Loại đất khác</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Thông tin này dùng để phân tích năng suất, khuyến nghị giống &
                phân bón.
              </p>
            </div>

            {/* Địa hình */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Địa hình *
              </p>
              <Select value={terrain} onValueChange={setTerrain}>
                <SelectTrigger className="h-9 text-sm w-full">
                  <SelectValue placeholder="Chọn đặc điểm địa hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bang-phang">Bằng phẳng</SelectItem>
                  <SelectItem value="doc-nhe">Dốc nhẹ (0–8%)</SelectItem>
                  <SelectItem value="doc-vua">Dốc vừa (8–15%)</SelectItem>
                  <SelectItem value="doc-manh">Dốc mạnh (&gt;15%)</SelectItem>
                  <SelectItem value="ven-song">
                    Vùng ven sông / kênh rạch
                  </SelectItem>
                  <SelectItem value="vung-trung">
                    Vùng trũng, dễ ngập
                  </SelectItem>
                  <SelectItem value="go-doi">Gò đồi / cao ráo</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Dùng để đánh giá nguy cơ ngập úng, xói mòn và thiết kế hệ thống
                tưới tiêu.
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Ghi chú thêm</p>
            <Textarea
              value={regionNote}
              onChange={(e) => setRegionNote(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div className="rounded-md border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">
              Gợi ý: Gắn vùng này với bản đồ GIS
            </p>
            <p>
              Sau khi lưu, bạn có thể vào chức năng bản đồ để vẽ đa giác
              (polygon) cho vùng, phục vụ truy xuất vùng trồng.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ----------------- STEP 2 – AREAS ----------------- */

function Step2Areas(props: {
  areas: Area[];
  onAddArea: () => void;
  onChangeArea: (id: string, field: keyof Area, value: string) => void;
  onRemoveArea: (id: string) => void;
}) {
  const { areas, onAddArea, onChangeArea, onRemoveArea } = props;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Layers3 className="h-4 w-4 text-primary" />
          Khu vực trong vùng (chia nhỏ theo địa hình, thủy lợi…)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {areas.map((a, idx) => (
          <div
            key={a.id}
            className="rounded-lg border bg-muted/10 p-3 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Khu vực {idx + 1}
              </p>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-red-500 hover:text-red-600"
                onClick={() => onRemoveArea(a.id)}
                disabled={areas.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <p className="text-xs text-muted-foreground">Tên khu vực *</p>
                <Input
                  className="h-9"
                  value={a.name}
                  onChange={(e) => onChangeArea(a.id, "name", e.target.value)}
                  placeholder="VD: Khu vực ven kênh, khu vực gò cao..."
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Diện tích (m²) *
                </p>
                <Input
                  className="h-9"
                  value={a.area}
                  onChange={(e) => onChangeArea(a.id, "area", e.target.value)}
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {/* Loại đất */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Loại đất</p>
                  <Select
                    value={a.soilType}
                    onValueChange={(v) => onChangeArea(a.id, "soilType", v)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Chọn loại đất" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dat-phu-sa">Đất phù sa</SelectItem>
                      <SelectItem value="dat-do-bazan">Đất đỏ bazan</SelectItem>
                      <SelectItem value="dat-cat-pha">Đất cát pha</SelectItem>
                      <SelectItem value="dat-thit-nhe">Đất thịt nhẹ</SelectItem>
                      <SelectItem value="dat-xam">Đất xám bạc màu</SelectItem>
                      <SelectItem value="dat-pha-set">Đất pha sét</SelectItem>
                      <SelectItem value="khac">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Địa hình */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Địa hình</p>
                  <Select
                    value={a.topo}
                    onValueChange={(v) => onChangeArea(a.id, "topo", v)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Chọn địa hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bang-phang">Bằng phẳng</SelectItem>
                      <SelectItem value="doc-nhe">Dốc nhẹ (0–8%)</SelectItem>
                      <SelectItem value="doc-vua">Dốc vừa (8–15%)</SelectItem>
                      <SelectItem value="doc-manh">
                        Dốc mạnh (&gt;15%)
                      </SelectItem>
                      <SelectItem value="ven-song">
                        Ven sông / gần kênh
                      </SelectItem>
                      <SelectItem value="vung-trung">
                        Vùng trũng, dễ ngập
                      </SelectItem>
                      <SelectItem value="go-doi">Gò đồi / cao ráo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="xl:col-span-2">
                <p className="text-xs text-muted-foreground">Ghi chú</p>
                <Input
                  className="h-9"
                  value={a.note}
                  onChange={(e) => onChangeArea(a.id, "note", e.target.value)}
                  placeholder="Ưu tiên trồng bắp hay đậu nành, điều kiện canh tác..."
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed"
          onClick={onAddArea}
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm khu vực
        </Button>
      </CardContent>
    </Card>
  );
}

/* ----------------- STEP 3 – PLOTS ----------------- */

function Step3Plots(props: {
  plots: Plot[];
  areas: Area[];
  onAddPlot: () => void;
  onChangePlot: (id: string, field: keyof Plot, value: string) => void;
  onRemovePlot: (id: string) => void;
}) {
  const { plots, areas, onAddPlot, onChangePlot, onRemovePlot } = props;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <SquareKanban className="h-4 w-4 text-primary" />
          Thông tin từng lô trong khu vực
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs md:text-sm">
        {plots.map((p, idx) => (
          <div
            key={p.id}
            className="rounded-lg border bg-muted/10 p-3 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Lô {idx + 1}
              </p>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-red-500 hover:text-red-600"
                onClick={() => onRemovePlot(p.id)}
                disabled={plots.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Thuộc khu vực *</p>
                <Select
                  value={p.areaName}
                  onValueChange={(v) => onChangePlot(p.id, "areaName", v)}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn khu vực" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((a) => (
                      <SelectItem key={a.id} value={a.name}>
                        {a.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mã lô *</p>
                <Input
                  className="h-9"
                  value={p.plotCode}
                  onChange={(e) =>
                    onChangePlot(p.id, "plotCode", e.target.value)
                  }
                  placeholder="VD: KV1-LO1"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Loại cây & giống
                </p>
                <div className="grid grid-cols-[110px,1fr] gap-2">
                  <Select
                    value={p.crop}
                    onValueChange={(v) => onChangePlot(p.id, "crop", v)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corn">Bắp</SelectItem>
                      <SelectItem value="soybean">Đậu nành</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className="h-9"
                    value={p.variety}
                    onChange={(e) =>
                      onChangePlot(p.id, "variety", e.target.value)
                    }
                    placeholder="Giống LVN10, DT84..."
                  />
                </div>
              </div>
            </div>

            <div className="mt-2 grid gap-3 md:grid-cols-5">
              <div>
                <p className="text-xs text-muted-foreground">
                  Diện tích lô (m²)
                </p>
                <Input
                  className="h-9"
                  value={p.size}
                  onChange={(e) => onChangePlot(p.id, "size", e.target.value)}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Đường bình độ</p>
                <Input
                  className="h-9"
                  value={p.size}
                  onChange={(e) => onChangePlot(p.id, "size", e.target.value)}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ngày gieo trồng</p>
                <Input
                  type="date"
                  className="h-9"
                  value={p.plantingDate}
                  onChange={(e) =>
                    onChangePlot(p.id, "plantingDate", e.target.value)
                  }
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Khoảng cách hàng (cm)
                </p>
                <Input
                  className="h-9"
                  value={p.rowSpacing}
                  onChange={(e) =>
                    onChangePlot(p.id, "rowSpacing", e.target.value)
                  }
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Khoảng cách cây (cm)
                </p>
                <Input
                  className="h-9"
                  value={p.plantSpacing}
                  onChange={(e) =>
                    onChangePlot(p.id, "plantSpacing", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Hình thức tưới
                </p>
                <Select
                  value={p.irrigation}
                  onValueChange={(v) => onChangePlot(p.id, "irrigation", v)}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn hình thức tưới" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tuoi-tran">
                      Tưới tràn theo rãnh
                    </SelectItem>
                    <SelectItem value="tuoi-phun">Tưới phun mưa</SelectItem>
                    <SelectItem value="tuoi-nho-giot">Tưới nhỏ giọt</SelectItem>
                    <SelectItem value="tuoi-tham">Tưới thấm (ngầm)</SelectItem>
                    <SelectItem value="tuoi-thu-cong">
                      Tưới thủ công (xô, vòi...)
                    </SelectItem>
                    <SelectItem value="tuoi-tu-dong">
                      Tưới tự động / cảm biến
                    </SelectItem>
                    <SelectItem value="khong-tuoi">
                      Không tưới (chỉ dùng nước mưa)
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Lựa chọn hình thức tưới phù hợp giúp tính toán chi phí và năng
                  suất cây trồng chính xác hơn.
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ghi chú</p>
                <Input
                  className="h-9"
                  value={p.note}
                  onChange={(e) => onChangePlot(p.id, "note", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed"
          onClick={onAddPlot}
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm lô
        </Button>
      </CardContent>
    </Card>
  );
}

/* ----------------- STEP 4 – REVIEW ----------------- */

function Step4Review(props: {
  region: {
    regionCode: string;
    regionName: string;
    cropMain: CropType;
    province: string;
    district: string;
    commune: string;
    address: string;
    owner: string;
    regionArea: string;
    terrain: string;
    regionNote: string;
  };
  areas: Area[];
  plots: Plot[];
}) {
  const { region, areas, plots } = props;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            1. Thông tin vùng
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
          <div className="space-y-1">
            <p>
              Mã vùng:{" "}
              <span className="font-semibold">{region.regionCode}</span>
            </p>
            <p>
              Tên vùng:{" "}
              <span className="font-semibold">{region.regionName}</span>
            </p>
            <p>
              Cây chính:{" "}
              <span className="font-semibold">
                {region.cropMain === "corn" ? "Bắp" : "Đậu nành"}
              </span>
            </p>
            <p>
              Diện tích:{" "}
              <span className="font-semibold">{region.regionArea} m²</span>
            </p>
          </div>
          <div className="space-y-1">
            <p>
              Địa điểm:{" "}
              <span className="font-semibold">
                {region.address}, {region.commune}, {region.district},{" "}
                {region.province}
              </span>
            </p>
            <p>
              Đơn vị quản lý:{" "}
              <span className="font-semibold">{region.owner}</span>
            </p>
          </div>
          <div className="md:col-span-2 space-y-1">
            <p>Địa hình: {region.terrain || "-"}</p>
            <p>Ghi chú: {region.regionNote || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            2. Danh sách khu vực ({areas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
          {areas.map((a, idx) => (
            <div
              key={a.id}
              className="rounded-lg border bg-muted/20 p-2 space-y-1"
            >
              <p className="font-semibold">
                Khu vực {idx + 1}: {a.name || "-"}
              </p>
              <p>Diện tích: {a.area || "-"} m²</p>
              <p>Loại đất: {a.soilType || "-"}</p>
              <p>Địa hình: {a.topo || "-"}</p>
              <p>Ghi chú: {a.note || "-"}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            3. Danh sách lô ({plots.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
          {plots.map((p, idx) => (
            <div
              key={p.id}
              className="rounded-lg border bg-muted/20 p-2 space-y-1"
            >
              <p className="font-semibold">
                Lô {idx + 1}: {p.plotCode || "-"} – {p.areaName || "-"}
              </p>
              <p>
                Cây trồng: {p.crop === "corn" ? "Bắp" : "Đậu nành"} | Giống:{" "}
                {p.variety || "-"}
              </p>
              <p>Diện tích: {p.size || "-"} m²</p>
              <p>
                Gieo trồng:{" "}
                {p.plantingDate
                  ? new Date(p.plantingDate).toLocaleDateString("vi-VN")
                  : "-"}
              </p>
              <p>
                Mật độ: hàng {p.rowSpacing || "-"} cm – cây{" "}
                {p.plantSpacing || "-"} cm
              </p>
              <p>Tưới: {p.irrigation || "-"}</p>
              <p>Ghi chú: {p.note || "-"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
