"use client";

import * as React from "react";
import {
  Sprout,
  Wheat,
  CalendarRange,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Tractor,
  Layers,
  Search,
  Clock3,
  StickyNote,
  X,
  Plus,
  Sparkles,
  UploadCloud,
  ClipboardList,
  Leaf,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";

type RiskLevel = "thap" | "trung-binh" | "cao";
type CycleType = "ngan" | "trung-binh" | "dai";

type CropOption = {
  id: string;
  name: string;
  category: string;
  image?: string;
  description: string;
  typicalSeason: string;
};

type VarietyOption = {
  id: string;
  code: string;
  name: string;
  cropName: string;
  origin: string;
  yield: string;
  note?: string;
};

const MOCK_CROPS: CropOption[] = [
  {
    id: "c1",
    name: "Đậu nành",
    category: "Cây lương thực",
    typicalSeason: "Đông Xuân – Hè Thu",
    description:
      "Phù hợp đất phù sa, tơi xốp, tận dụng tốt vụ sau lúa hoặc bắp. Cải thiện độ phì đất.",
    image:
      "https://suckhoedoisong.qltns.mediacdn.vn/Images/duylinh/2018/11/25/1_VF445_HNMR.jpg",
  },
  {
    id: "c2",
    name: "Bắp lai",
    category: "Cây lương thực",
    typicalSeason: "Đông Xuân",
    description:
      "Năng suất khá, chịu hạn vừa, thích hợp vùng đất thịt nhẹ, chủ động tưới.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSplrDQiKVAbRket___3GU0GmMoQ0Gi4B5blA&s",
  },
  {
    id: "c3",
    name: "Lúa chất lượng cao",
    category: "Lúa nước",
    typicalSeason: "Đông Xuân – Hè Thu – Thu Đông",
    description:
      "Yêu cầu quản lý dịch hại chặt, bón phân cân đối; thích hợp vùng chủ động nước.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDia4-O6X8J8Qo1wq5ujCg19HYPLAEZlBfAg&s",
  },
  {
    id: "c4",
    name: "Rau màu ngắn ngày",
    category: "Rau màu",
    typicalSeason: "Quanh năm (chia lứa)",
    description:
      "Chu kỳ ngắn, quay vòng vốn nhanh, cần quy trình an toàn thuốc BVTV rõ ràng.",
    image:
      "https://mangphunhakinh.com/wp-content/uploads/2023/02/rau-trong-vao-thang-3-15.jpg",
  },
];

const MOCK_VARIETIES: VarietyOption[] = [
  {
    id: "v1",
    code: "DN-GV01",
    name: "Đậu nành GV01",
    cropName: "Đậu nành",
    origin: "Viện Nghiên cứu Cây trồng Việt Nam",
    yield: "2.5–3 tấn/ha",
    note: "Giống phổ biến, dễ canh tác, phù hợp luân canh sau lúa.",
  },
  {
    id: "v2",
    code: "BP-LVN10",
    name: "Bắp LVN10",
    cropName: "Bắp lai",
    origin: "Công ty Giống cây trồng Trung ương",
    yield: "8.5–9 tấn/ha",
    note: "Cây khỏe, chịu sâu bệnh khá, phù hợp thâm canh.",
  },
  {
    id: "v3",
    code: "LU-OM5451",
    name: "Lúa OM5451",
    cropName: "Lúa chất lượng cao",
    origin: "ĐBSCL",
    yield: "6–7 tấn/ha",
    note: "Chất lượng gạo tốt, thị trường ưa chuộng.",
  },
  {
    id: "v4",
    code: "RAU-MIX01",
    name: "Tập hợp giống rau an toàn",
    cropName: "Rau màu ngắn ngày",
    origin: "Nhiều đơn vị",
    yield: "15–20 tấn/ha (quy đổi)",
    note: "Gồm xà lách, cải xanh, dưa leo… cho mô hình luân canh.",
  },
];

export default function AddTechinicalPlansPage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);

  // BƯỚC 1 – Thông tin chung
  const [code, setCode] = React.useState("GR-NEW-001");
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<string | undefined>();
  const [region, setRegion] = React.useState<string | undefined>();
  const [season, setSeason] = React.useState<string | undefined>();
  const [cycleType, setCycleType] = React.useState<CycleType>("trung-binh");
  const [avgCycleDays, setAvgCycleDays] = React.useState("120");
  const [risk, setRisk] = React.useState<RiskLevel>("trung-binh");
  const [description, setDescription] = React.useState("");

  // BƯỚC 2 – Cây & giống trong nhóm
  const [selectedCropIds, setSelectedCropIds] = React.useState<string[]>([
    "c1",
    "c2",
  ]);
  const [selectedVarietyIds, setSelectedVarietyIds] = React.useState<string[]>([
    "v1",
    "v2",
  ]);

  // BƯỚC 3 – Chu kỳ sinh trưởng & mùa vụ
  const [cycleName, setCycleName] = React.useState("Chu kỳ luân canh 2 vụ/năm");
  const [phaseRows, setPhaseRows] = React.useState<
    { id: string; phase: string; duration: string; note?: string }[]
  >([
    {
      id: crypto.randomUUID(),
      phase: "Vụ 1: Bắp lai (Đông Xuân)",
      duration: "110–120 ngày",
      note: "Ưu tiên gieo trước 15/12, thu hoạch trước cao điểm mưa.",
    },
    {
      id: crypto.randomUUID(),
      phase: "Vụ 2: Đậu nành (Hè Thu)",
      duration: "90–100 ngày",
      note: "Giữ ẩm tốt giai đoạn làm quả, chú ý sâu đục quả.",
    },
  ]);

  // BƯỚC 4 – Kỹ thuật & ghi chú
  const [techNotes, setTechNotes] = React.useState(
    "1. Làm đất tối thiểu, giữ lại tàn dư vụ trước để bảo vệ đất.\n2. Bón lót phân hữu cơ hoai mục + lân trước gieo.\n3. Ưu tiên dùng chế phẩm sinh học khi phòng trừ sâu bệnh."
  );
  const [qualityStandard, setQualityStandard] = React.useState(
    "Áp dụng tiêu chuẩn VietGAP/GlobalGAP tuỳ định hướng vùng; ghi chép đầy đủ nhật ký canh tác."
  );
  const [pestControl, setPestControl] = React.useState(
    "Xây dựng lịch phun phòng sinh học định kỳ, chỉ dùng thuốc hóa học khi mật số vượt ngưỡng."
  );

  const handleToggleCrop = (id: string) => {
    setSelectedCropIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleToggleVariety = (id: string) => {
    setSelectedVarietyIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleAddPhase = () => {
    setPhaseRows((prev) => [
      ...prev,
      { id: crypto.randomUUID(), phase: "", duration: "", note: "" },
    ]);
  };

  const handleChangePhase = (
    id: string,
    field: "phase" | "duration" | "note",
    value: string
  ) => {
    setPhaseRows((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleRemovePhase = (id: string) => {
    setPhaseRows((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = () => {
    const payload = {
      code,
      name,
      category,
      region,
      season,
      cycleType,
      avgCycleDays: avgCycleDays ? Number(avgCycleDays) : undefined,
      risk,
      description,
      crops: MOCK_CROPS.filter((c) => selectedCropIds.includes(c.id)),
      varieties: MOCK_VARIETIES.filter((v) =>
        selectedVarietyIds.includes(v.id)
      ),
      cycleName,
      phases: phaseRows,
      techNotes,
      qualityStandard,
      pestControl,
    };

    console.log("NEW CROP GROUP PAYLOAD:", payload);
    // TODO: call API
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="px-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
              <Sprout className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                Thêm mới nhóm cây trồng / mô hình canh tác
              </h1>
              <p className="text-xs text-muted-foreground">
                Khai báo 1 lần, dùng lại cho kế hoạch gieo trồng, dự toán chi
                phí và nhật ký canh tác về sau.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end text-[11px] text-muted-foreground">
          <span>Mã nhóm tạm: {code}</span>
          <span>
            Bước {step} / 4 •{" "}
            {step === 1
              ? "Thông tin chung"
              : step === 2
              ? "Cây & giống trong nhóm"
              : step === 3
              ? "Chu kỳ sinh trưởng & mùa vụ"
              : "Kỹ thuật & xác nhận"}
          </span>
        </div>
      </header>

      {/* STEPPER */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-3 text-xs">
          <Stepper step={step} />
        </CardContent>
      </Card>

      {/* STEP CONTENT */}
      {step === 1 && (
        <Step1BasicInfo
          code={code}
          setCode={setCode}
          name={name}
          setName={setName}
          category={category}
          setCategory={setCategory}
          region={region}
          setRegion={setRegion}
          season={season}
          setSeason={setSeason}
          cycleType={cycleType}
          setCycleType={setCycleType}
          avgCycleDays={avgCycleDays}
          setAvgCycleDays={setAvgCycleDays}
          risk={risk}
          setRisk={setRisk}
          description={description}
          setDescription={setDescription}
        />
      )}

      {step === 2 && (
        <Step2CropsVarieties
          selectedCropIds={selectedCropIds}
          selectedVarietyIds={selectedVarietyIds}
          onToggleCrop={handleToggleCrop}
          onToggleVariety={handleToggleVariety}
        />
      )}

      {step === 3 && (
        <Step3Cycle
          cycleName={cycleName}
          setCycleName={setCycleName}
          phaseRows={phaseRows}
          onAddPhase={handleAddPhase}
          onChangePhase={handleChangePhase}
          onRemovePhase={handleRemovePhase}
        />
      )}

      {step === 4 && (
        <Step4Technical
          techNotes={techNotes}
          setTechNotes={setTechNotes}
          qualityStandard={qualityStandard}
          setQualityStandard={setQualityStandard}
          pestControl={pestControl}
          setPestControl={setPestControl}
        />
      )}
      {step === 5 && (
        <Step5Confirm
          cycleName={cycleName}
          onBack={() => {}}
          onSubmit={() => {}}
          qualityStandard={qualityStandard}
          selectedCrops={selectedCropIds}
          selectedVarieties={selectedVarietyIds}
          techNotes={techNotes}
          pdfFileName={""}
        />
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <AlertTriangle className="h-3 w-3 text-amber-500" />
          <span>
            Thông tin nhóm cây trồng sẽ dùng chung cho nhiều kế hoạch – hãy kiểm
            tra kỹ trước khi lưu.
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
          {step < 5 ? (
            <Button
              size="sm"
              className="bg-primary! text-primary-foreground!"
              onClick={() => setStep((s) => Math.min(5, s + 1))}
            >
              Tiếp theo
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-primary! text-primary-foreground!"
              onClick={handleSubmit}
            >
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Lưu nhóm cây trồng
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────── Stepper item ───────── */

function Stepper({ step }: { step: number }) {
  const steps = [
    { id: 1, label: "Thông tin nhóm" },
    { id: 2, label: "Cây & giống" },
    { id: 3, label: "Chu kỳ & mùa vụ" },
    { id: 4, label: "Tài liệu kĩ thuật" },
    { id: 5, label: "Xác nhận" },
  ];

  return (
    <div className="flex flex-1 items-center gap-3">
      {steps.map((s, idx) => {
        const isActive = s.id === step;
        const isDone = s.id < step;

        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-9 items-center rounded-full border px-3 text-xs font-medium transition-colors ${
                isDone
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isActive
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted text-muted-foreground bg-background"
              }`}
            >
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  s.id
                )}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-semibold uppercase">
                  Bước {s.id}
                </span>
                <span className="text-[10px]">{s.label}</span>
              </div>
            </div>

            {/* line nối giữa các bước */}
            {idx < steps.length - 1 && (
              <div className="h-px flex-1 bg-emerald-500/60" />
            )}
          </div>
        );
      })}
    </div>
  );
}
/* ───────── STEP 1 ───────── */

type Step1Props = {
  code: string;
  setCode: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  category?: string;
  setCategory: (v?: string) => void;
  region?: string;
  setRegion: (v?: string) => void;
  season?: string;
  setSeason: (v?: string) => void;
  cycleType: CycleType;
  setCycleType: (v: CycleType) => void;
  avgCycleDays: string;
  setAvgCycleDays: (v: string) => void;
  risk: RiskLevel;
  setRisk: (v: RiskLevel) => void;
  description: string;
  setDescription: (v: string) => void;
};

function Step1BasicInfo(props: Step1Props) {
  const {
    code,
    setCode,
    name,
    setName,
    category,
    setCategory,
    region,
    setRegion,
    season,
    setSeason,
    cycleType,
    setCycleType,
    avgCycleDays,
    setAvgCycleDays,
    risk,
    setRisk,
    description,
    setDescription,
  } = props;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Bước 1 – Thông tin chung nhóm cây trồng
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-[2fr,1.5fr] text-xs">
        {/* LEFT */}
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Mã nhóm *</p>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-8 font-mono text-xs"
                placeholder="VD: GR-CORN-SOY"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Tên nhóm / mô hình *
              </p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8"
                placeholder="VD: Nhóm bắp – đậu nành luân canh"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Loại nhóm cây *</p>
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Chọn loại nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cây lương thực">Cây lương thực</SelectItem>
                  <SelectItem value="Lúa nước">Lúa nước</SelectItem>
                  <SelectItem value="Rau màu">Rau màu</SelectItem>
                  <SelectItem value="Cây ăn quả">Cây ăn quả</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Vùng / khu sản xuất chính *
              </p>
              <Select value={region} onValueChange={(v) => setRegion(v)}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Chọn vùng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vùng A">Vùng A</SelectItem>
                  <SelectItem value="Vùng B">Vùng B</SelectItem>
                  <SelectItem value="Vùng C">Vùng C</SelectItem>
                  <SelectItem value="Vùng D">Vùng D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Mùa vụ điển hình</p>
              <Select value={season} onValueChange={(v) => setSeason(v)}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Chọn mùa vụ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đông Xuân">Đông Xuân</SelectItem>
                  <SelectItem value="Hè Thu">Hè Thu</SelectItem>
                  <SelectItem value="Thu Đông">Thu Đông</SelectItem>
                  <SelectItem value="Quanh năm">Quanh năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Loại chu kỳ *</p>
              <Select
                value={cycleType}
                onValueChange={(v: CycleType) => setCycleType(v)}
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngan">
                    Chu kỳ ngắn (&lt; 60 ngày)
                  </SelectItem>
                  <SelectItem value="trung-binh">
                    Chu kỳ trung bình (60–150 ngày)
                  </SelectItem>
                  <SelectItem value="dai">
                    Chu kỳ dài (&gt; 150 ngày / cây lâu năm)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Thời gian chu kỳ (ước tính)
              </p>
              <Input
                value={avgCycleDays}
                onChange={(e) =>
                  setAvgCycleDays(e.target.value.replace(/\D/g, ""))
                }
                className="h-8"
                placeholder="VD: 120 ngày"
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                Mức độ rủi ro kỹ thuật / thị trường
              </p>
              <Select value={risk} onValueChange={(v: RiskLevel) => setRisk(v)}>
                <SelectTrigger className="h-8 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thap">Thấp</SelectItem>
                  <SelectItem value="trung-binh">Trung bình</SelectItem>
                  <SelectItem value="cao">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Mô tả ngắn về nhóm / mô hình
            </p>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="VD: Nhóm luân canh bắp – đậu nành giúp cải thiện độ phì đất, cân đối dinh dưỡng, phù hợp vùng A – B..."
            />
          </div>
        </div>

        {/* RIGHT – SUMMARY */}
        <div className="space-y-3 rounded-md border bg-muted/40 p-3">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Tóm tắt nhóm cây trồng
          </p>
          <div className="space-y-1 text-xs">
            <p>
              <span className="text-muted-foreground">Mã:</span>{" "}
              <span className="font-mono font-semibold">{code || "-"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Tên nhóm:</span>{" "}
              <span className="font-medium">{name || "-"}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Loại nhóm:</span>{" "}
              <span className="font-medium">{category || "-"}</span>
            </p>
            <p className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-600" />
              <span>
                Vùng áp dụng:{" "}
                <span className="font-medium">{region || "Chưa chọn"}</span>
              </span>
            </p>
            <p className="flex items-center gap-1">
              <Tractor className="h-3 w-3 text-sky-600" />
              <span>
                Mùa vụ:{" "}
                <span className="font-medium">{season || "Chưa chọn"}</span>
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Chu kỳ:</span>{" "}
              <Badge
                variant="outline"
                className={
                  cycleType === "ngan"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : cycleType === "trung-binh"
                    ? "border-sky-200 bg-sky-50 text-sky-700"
                    : "border-violet-200 bg-violet-50 text-violet-700"
                }
              >
                {cycleType === "ngan"
                  ? "Ngắn"
                  : cycleType === "trung-binh"
                  ? "Trung bình"
                  : "Dài"}
              </Badge>{" "}
              • {avgCycleDays || "--"} ngày
            </p>
            <p>
              <span className="text-muted-foreground">Rủi ro:</span>{" "}
              <span className="font-medium">
                {risk === "thap"
                  ? "Thấp"
                  : risk === "trung-binh"
                  ? "Trung bình"
                  : "Cao"}
              </span>
            </p>
          </div>
          <Separator />
          <p className="text-[11px] text-muted-foreground">
            Thông tin này sẽ xuất hiện trong kế hoạch gieo trồng, dự toán chi
            phí và báo cáo sản lượng cho toàn vùng.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───────── STEP 2 ───────── */

type Step2Props = {
  selectedCropIds: string[];
  selectedVarietyIds: string[];
  onToggleCrop: (id: string) => void;
  onToggleVariety: (id: string) => void;
};
const CROP_PAGE_SIZE = 6;
const VARIETY_PAGE_SIZE = 6;
function Step2CropsVarieties({
  selectedCropIds,
  selectedVarietyIds,
  onToggleCrop,
  onToggleVariety,
}: Step2Props) {
  const [cropSearch, setCropSearch] = React.useState("");
  const [varietySearch, setVarietySearch] = React.useState("");
  const [cropPage, setCropPage] = React.useState(1);
  const [varietyPage, setVarietyPage] = React.useState(1);
  const filteredCrops = React.useMemo(() => {
    const q = cropSearch.trim().toLowerCase();
    if (!q) return MOCK_CROPS;
    return MOCK_CROPS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [cropSearch]);

  const cropTotalPages = Math.max(
    1,
    Math.ceil(filteredCrops.length / CROP_PAGE_SIZE)
  );
  const pagedCrops = React.useMemo(
    () =>
      filteredCrops.slice(
        (cropPage - 1) * CROP_PAGE_SIZE,
        cropPage * CROP_PAGE_SIZE
      ),
    [filteredCrops, cropPage]
  );

  // nếu search đổi thì về page 1
  React.useEffect(() => {
    setCropPage(1);
  }, [cropSearch]);

  // ====== FILTER + PAGINATION GIỐNG ======
  const filteredVarieties = React.useMemo(() => {
    const q = varietySearch.trim().toLowerCase();
    if (!q) return MOCK_VARIETIES;
    return MOCK_VARIETIES.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.cropName.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        (v.note ?? "").toLowerCase().includes(q)
    );
  }, [varietySearch]);

  const varietyTotalPages = Math.max(
    1,
    Math.ceil(filteredVarieties.length / VARIETY_PAGE_SIZE)
  );
  const pagedVarieties = React.useMemo(
    () =>
      filteredVarieties.slice(
        (varietyPage - 1) * VARIETY_PAGE_SIZE,
        varietyPage * VARIETY_PAGE_SIZE
      ),
    [filteredVarieties, varietyPage]
  );

  React.useEffect(() => {
    setVarietyPage(1);
  }, [varietySearch]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Bước 2 – Chọn cây trồng & giống
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 text-xs">
        {/* CÂY TRỒNG CHÍNH */}
        <section>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Cây trồng chính trong nhóm
              </p>
              <p className="text-[11px] text-muted-foreground">
                Đã chọn{" "}
                <span className="font-semibold text-foreground">
                  {selectedCropIds.length}
                </span>{" "}
                loại cây •{" "}
                <span className="font-semibold">{filteredCrops.length}</span>{" "}
                kết quả
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  value={cropSearch}
                  onChange={(e) => setCropSearch(e.target.value)}
                  placeholder="Tìm theo tên, mô tả, loại cây..."
                  className="h-8 w-56 pl-7 text-[11px]"
                />
                <Search className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <PaginationMini
                current={cropPage}
                total={cropTotalPages}
                onPrev={() => setCropPage((p) => Math.max(1, p - 1))}
                onNext={() =>
                  setCropPage((p) => Math.min(cropTotalPages, p + 1))
                }
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {pagedCrops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                selected={selectedCropIds.includes(crop.id)}
                onToggle={() => onToggleCrop(crop.id)}
              />
            ))}
            {!pagedCrops.length && (
              <p className="col-span-full text-center text-[11px] text-muted-foreground">
                Không tìm thấy cây trồng phù hợp.
              </p>
            )}
          </div>
        </section>

        <Separator />

        {/* GIỐNG CÂY TRỒNG */}
        <section>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Giống cây trồng thường dùng trong nhóm
              </p>
              <p className="text-[11px] text-muted-foreground">
                Đã chọn{" "}
                <span className="font-semibold text-foreground">
                  {selectedVarietyIds.length}
                </span>{" "}
                giống •{" "}
                <span className="font-semibold">
                  {filteredVarieties.length}
                </span>{" "}
                kết quả
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  value={varietySearch}
                  onChange={(e) => setVarietySearch(e.target.value)}
                  placeholder="Tìm theo tên giống, mã, cây, ghi chú..."
                  className="h-8 w-64 pl-7 text-[11px]"
                />
                <Search className="pointer-events-none absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <PaginationMini
                current={varietyPage}
                total={varietyTotalPages}
                onPrev={() => setVarietyPage((p) => Math.max(1, p - 1))}
                onNext={() =>
                  setVarietyPage((p) => Math.min(varietyTotalPages, p + 1))
                }
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {pagedVarieties.map((v) => (
              <VarietyCard
                key={v.id}
                variety={v}
                selected={selectedVarietyIds.includes(v.id)}
                onToggle={() => onToggleVariety(v.id)}
              />
            ))}
            {!pagedVarieties.length && (
              <p className="col-span-full text-center text-[11px] text-muted-foreground">
                Không tìm thấy giống phù hợp.
              </p>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
function PaginationMini({
  current,
  total,
  onPrev,
  onNext,
}: {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-2 py-1 text-[11px]">
      <span className="text-muted-foreground">
        Trang <span className="font-semibold text-foreground">{current}</span> /{" "}
        {total}
      </span>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={current <= 1}
          onClick={onPrev}
        >
          ‹
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          disabled={current >= total}
          onClick={onNext}
        >
          ›
        </Button>
      </div>
    </div>
  );
}

/* ───────── Sub-components ───────── */

type CropCardProps = {
  crop: (typeof MOCK_CROPS)[number];
  selected: boolean;
  onToggle: () => void;
};

function CropCard({ crop, selected, onToggle }: CropCardProps) {
  return (
    <div
      className={cn(
        "flex flex-row overflow-hidden rounded-md border bg-card shadow-sm transition hover:shadow-md",
        selected && "border-emerald-500 ring-1 ring-emerald-300"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={crop.image ?? "/placeholder.png"}
        alt={crop.name}
        className="h-full w-[200px] object-cover"
      />

      <div className="flex flex-1 flex-col gap-1 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold truncate">{crop.name}</p>
          <Badge
            variant="outline"
            className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
          >
            {crop.category}
          </Badge>
        </div>

        <p className="line-clamp-3 text-[11px] text-muted-foreground">
          {crop.description}
        </p>

        <p className="mt-1 text-[11px] text-muted-foreground">
          Mùa vụ điển hình:{" "}
          <span className="font-medium text-foreground">
            {crop.typicalSeason}
          </span>
        </p>
        <div className="flex-1" />
        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            size="sm"
            variant={selected ? "default" : "outline"}
            className={cn(
              "h-7 px-2 text-[11px]",
              selected && "bg-primary! text-primary-foreground!"
            )}
            onClick={onToggle}
          >
            {selected ? "Đang chọn" : "Chọn vào nhóm"}
          </Button>
        </div>
      </div>
    </div>
  );
}

type VarietyCardProps = {
  variety: (typeof MOCK_VARIETIES)[number];
  selected: boolean;
  onToggle: () => void;
};

function VarietyCard({ variety, selected, onToggle }: VarietyCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md border bg-card p-2.5 text-xs shadow-sm transition hover:shadow-md",
        selected && "border-primary ring-1 ring-primary/40"
      )}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <p className="text-xs font-semibold truncate">{variety.name}</p>
        <Badge className="font-mono text-[10px]">{variety.code}</Badge>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Cây:{" "}
        <span className="font-medium text-foreground">{variety.cropName}</span>
      </p>
      <p className="text-[11px] text-muted-foreground">
        Xuất xứ:{" "}
        <span className="font-medium text-foreground">{variety.origin}</span>
      </p>
      <p className="text-[11px] text-muted-foreground">
        Năng suất:{" "}
        <span className="font-medium text-foreground">{variety.yield}</span>
      </p>

      {variety.note && (
        <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
          {variety.note}
        </p>
      )}

      <div className="mt-2 flex justify-end">
        <Button
          type="button"
          size="sm"
          variant={selected ? "default" : "outline"}
          className={cn("h-7 px-2 text-[11px]", selected && "bg-primary!")}
          onClick={onToggle}
        >
          {selected ? "Đang chọn" : "Thêm giống"}
        </Button>
      </div>
    </div>
  );
}

/* ───────── STEP 3 ───────── */

type Step3Props = {
  cycleName: string;
  setCycleName: (v: string) => void;
  phaseRows: { id: string; phase: string; duration: string; note?: string }[];
  onAddPhase: () => void;
  onChangePhase: (
    id: string,
    field: "phase" | "duration" | "note",
    value: string
  ) => void;
  onRemovePhase: (id: string) => void;
};

function Step3Cycle({
  cycleName,
  setCycleName,
  phaseRows,
  onAddPhase,
  onChangePhase,
  onRemovePhase,
}: Step3Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Bước 3 – Chu kỳ sinh trưởng & sắp xếp mùa vụ
            </CardTitle>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Mô tả{" "}
              <span className="font-medium">chu kỳ luân canh / mùa vụ</span>{" "}
              theo từng giai đoạn trong năm để hệ thống gợi ý lịch gieo – thu
              hoạch và phân tích hiệu quả.
            </p>
          </div>
          <Badge
            variant="outline"
            className="hidden md:inline-flex items-center gap-1 border-dashed text-[10px]"
          >
            <CalendarRange className="h-3 w-3" />
            {phaseRows.length} giai đoạn trong chu kỳ
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-xs">
        <div className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
          {/* LEFT: FORM CHU KỲ & CÁC GIAI ĐOẠN */}
          <div className="space-y-3">
            {/* Tên chu kỳ */}
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Tên chu kỳ / mô hình áp dụng
              </p>
              <Input
                value={cycleName}
                onChange={(e) => setCycleName(e.target.value)}
                className="h-8 text-xs"
                placeholder="VD: Chu kỳ luân canh 2 vụ/năm (bắp – đậu nành)"
              />
              <p className="text-[10px] text-muted-foreground">
                Gợi ý: đặt tên dễ nhớ, gắn với vùng/cụm sản xuất (VD: “Luân canh
                bắp–đậu vùng A1”).
              </p>
            </div>

            {/* Danh sách giai đoạn */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-muted-foreground">
                  Các giai đoạn sinh trưởng / mùa vụ trong năm
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Đang có{" "}
                  <span className="font-semibold text-foreground">
                    {phaseRows.length}
                  </span>{" "}
                  giai đoạn
                </span>
              </div>

              <div className="space-y-2">
                {phaseRows.map((p, idx) => (
                  <div
                    key={p.id}
                    className="rounded-md border border-muted bg-background/60 p-2.5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                  >
                    {/* Header giai đoạn */}
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="h-5 rounded-full border-primary/40 bg-primary/5 px-2 text-[10px] font-semibold text-primary"
                        >
                          GĐ {idx + 1}
                        </Badge>
                        <p className="text-[11px] font-medium text-foreground">
                          {p.phase || "Chưa đặt tên giai đoạn"}
                        </p>
                      </div>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-red-500"
                        onClick={() => onRemovePhase(p.id)}
                        disabled={phaseRows.length === 1}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Nội dung giai đoạn */}
                    <div className="space-y-1.5">
                      <div className="space-y-1">
                        <p className="text-[11px] text-muted-foreground">
                          Tên giai đoạn / mùa vụ
                        </p>
                        <Input
                          value={p.phase}
                          onChange={(e) =>
                            onChangePhase(p.id, "phase", e.target.value)
                          }
                          className="h-8 text-xs"
                          placeholder="VD: Vụ 1 – Bắp (Đông Xuân)"
                        />
                      </div>

                      <div className="grid gap-2 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock3 className="h-3 w-3" />
                            Thời gian / thời lượng
                          </p>
                          <Input
                            value={p.duration}
                            onChange={(e) =>
                              onChangePhase(p.id, "duration", e.target.value)
                            }
                            className="h-8 text-xs"
                            placeholder="VD: 110–120 ngày, từ tháng 11–3"
                          />
                        </div>

                        <div className="space-y-1">
                          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <StickyNote className="h-3 w-3" />
                            Ghi chú kỹ thuật
                          </p>
                          <Input
                            value={p.note ?? ""}
                            onChange={(e) =>
                              onChangePhase(p.id, "note", e.target.value)
                            }
                            className="h-8 text-xs"
                            placeholder="Lưu ý: thời điểm gieo, nguy cơ hạn/mưa, giống ưu tiên..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-1 border-dashed text-[11px]"
                onClick={onAddPhase}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Thêm giai đoạn sinh trưởng
              </Button>
            </div>
          </div>

          {/* RIGHT: MINI SUMMARY */}
          <div className="rounded-md border bg-muted/40 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Gợi ý cách sử dụng chu kỳ
              </p>
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <Separator className="my-1" />
            <ul className="list-disc space-y-1.5 pl-4 text-[11px] text-muted-foreground">
              <li>
                Tự động gợi ý{" "}
                <span className="font-medium">lịch gieo – thu hoạch</span> cho
                từng lô theo chu kỳ đã khai báo.
              </li>
              <li>
                Kết nối với{" "}
                <span className="font-medium">nhật ký canh tác</span> để so sánh
                kế hoạch – thực tế (trễ vụ, kéo dài thời gian sinh trưởng...).
              </li>
              <li>
                Kết hợp với{" "}
                <span className="font-medium">báo cáo chi phí & sản lượng</span>{" "}
                để đánh giá hiệu quả từng vụ trong chu kỳ và tối ưu luân canh.
              </li>
              <li>
                Có thể tạo nhiều chu kỳ khác nhau cho từng{" "}
                <span className="font-medium">vùng / nhóm cây trồng</span> để
                thử nghiệm mô hình.
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ───────── STEP 4 ───────── */

type Step4Props = {
  techNotes: string;
  setTechNotes: (v: string) => void;
  qualityStandard: string;
  setQualityStandard: (v: string) => void;
  pestControl: string;
  setPestControl: (v: string) => void;
};

function Step4Technical({
  techNotes,
  setTechNotes,
  qualityStandard,
  setQualityStandard,
  pestControl,
  setPestControl,
}: Step4Props) {
  const [pdfSummary, setPdfSummary] = React.useState("");
  const [pdfFileName, setPdfFileName] = React.useState("");
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground">
          Bước 4 – Kỹ thuật canh tác & tiêu chuẩn chất lượng
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-xs">
        {/* KHỐI MÔ TẢ TEXT */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-[11px] font-medium text-muted-foreground">
              Hướng dẫn kỹ thuật canh tác chính
            </p>
            <Textarea
              value={techNotes}
              onChange={(e) => setTechNotes(e.target.value)}
              rows={6}
              className="text-xs"
              placeholder="VD: mật độ gieo, khoảng cách hàng – cây, lượng nước tưới, thời điểm bón phân chính, lưu ý về đất & thời tiết..."
            />
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Tiêu chuẩn chất lượng & thu hoạch
              </p>
              <Textarea
                value={qualityStandard}
                onChange={(e) => setQualityStandard(e.target.value)}
                rows={3}
                className="text-xs"
                placeholder="VD: độ già thu hoạch, độ ẩm hạt, kích cỡ bắp/trái, tiêu chuẩn loại 1/loại 2..."
              />
            </div>

            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Giải pháp & nguyên tắc phòng trừ sâu bệnh
              </p>
              <Textarea
                value={pestControl}
                onChange={(e) => setPestControl(e.target.value)}
                rows={3}
                className="text-xs"
                placeholder="VD: nguyên tắc 4 đúng, ưu tiên sinh học trước hoá học, ngưỡng phun, cây chỉ báo sâu bệnh..."
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* KHỐI UPLOAD / NHẬP PDF */}
        <div className="grid gap-3 md:grid-cols-[1.3fr,1.2fr]">
          {/* Upload file */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Tài liệu quy trình chi tiết (PDF / file hướng dẫn)
            </p>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20 px-3 py-5 text-center transition hover:border-primary/60 hover:bg-primary/5">
              <UploadCloud className="mb-2 h-5 w-5 text-primary" />
              <p className="text-[11px] font-medium text-foreground">
                Chọn file PDF / tài liệu quy trình
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Hỗ trợ: PDF, DOC, DOCX • Khuyến nghị &lt; 20MB
              </p>

              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPdfFileName(file ? file.name : null);
                }}
              />

              {pdfFileName && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-background px-2 py-1 text-[10px] text-muted-foreground">
                  <FileText className="h-3 w-3" />
                  <span className="font-medium">{pdfFileName}</span>
                </div>
              )}
            </label>

            <p className="text-[10px] text-muted-foreground">
              File này được lưu kèm nhóm cây trồng / mô hình canh tác. Người
              dùng khác có thể tải về xem chi tiết khi cần.
            </p>
          </div>

          {/* Tóm tắt nội dung PDF */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Tóm tắt nội dung chính từ tài liệu / PDF
            </p>
            <Textarea
              value={pdfSummary}
              onChange={(e) => setPdfSummary(e.target.value)}
              rows={5}
              className="text-xs"
              placeholder="Dán nhanh các ý chính từ PDF: bước chính, yêu cầu an toàn, các mốc quan trọng... Phần này sẽ hiển thị ngay trong UI mà không cần mở file."
            />
            <p className="text-[10px] text-muted-foreground">
              Đây là phần mô tả rút gọn để đọc nhanh. Phần file PDF dùng để tra
              cứu chi tiết khi cần.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
type Step5ConfirmProps = {
  cycleName: string;
  selectedCrops: string[];
  selectedVarieties: string[];
  techNotes: string;
  qualityStandard: string;
  pdfFileName?: string | null;
  onSubmit: () => void;
  onBack: () => void;
};

export function Step5Confirm({
  cycleName,
  selectedCrops,
  selectedVarieties,
  techNotes,
  qualityStandard,
  pdfFileName,
  onSubmit,
  onBack,
}: Step5ConfirmProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          Bước 5 – Xác nhận & hoàn tất thiết lập nhóm cây trồng
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-xs">
        <div className="text-[11px] text-muted-foreground">
          Vui lòng kiểm tra lại toàn bộ thông tin trước khi hoàn tất. Dữ liệu sẽ
          được dùng để tự động sinh{" "}
          <span className="font-medium">lịch canh tác, nhật ký</span> và{" "}
          <span className="font-medium">báo cáo sản lượng</span> trong hệ thống.
        </div>

        <Separator />

        {/* TÓM TẮT */}
        <div className="grid gap-3 md:grid-cols-2">
          {/* Cột trái */}
          <div className="space-y-2">
            <div className="rounded-md border bg-muted/30 p-3">
              <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                <Layers className="h-3.5 w-3.5 text-primary" />
                Chu kỳ & mô hình canh tác
              </p>
              <p className="text-xs font-medium">
                {cycleName || "Chưa đặt tên"}
              </p>
            </div>

            <div className="rounded-md border bg-muted/30 p-3 space-y-2">
              <p className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                <Leaf className="h-3.5 w-3.5 text-green-600" />
                Cây trồng & giống
              </p>
              <div className="text-[11px] text-muted-foreground">
                <span className="font-medium">Cây trồng chính:</span>{" "}
                {selectedCrops.length > 0
                  ? selectedCrops.join(", ")
                  : "Chưa chọn"}{" "}
                <br />
                <span className="font-medium">Giống được chọn:</span>{" "}
                {selectedVarieties.length > 0
                  ? selectedVarieties.join(", ")
                  : "Chưa chọn"}
              </div>
            </div>

            <div className="rounded-md border bg-muted/30 p-3">
              <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                <ClipboardList className="h-3.5 w-3.5 text-sky-600" />
                Kỹ thuật canh tác & tiêu chuẩn
              </p>
              <div className="space-y-1 text-[11px] text-muted-foreground">
                <p>
                  <span className="font-medium">Kỹ thuật chính:</span>{" "}
                  {techNotes ? techNotes.slice(0, 100) + "..." : "Chưa nhập"}
                </p>
                <p>
                  <span className="font-medium">Tiêu chuẩn chất lượng:</span>{" "}
                  {qualityStandard
                    ? qualityStandard.slice(0, 100) + "..."
                    : "Chưa nhập"}
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải */}
          <div className="space-y-2">
            <div className="rounded-md border bg-muted/30 p-3 space-y-2">
              <p className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                <CalendarRange className="h-3.5 w-3.5 text-amber-600" />
                Tổng quan chu kỳ & giai đoạn
              </p>
              <ul className="list-disc pl-4 text-[11px] text-muted-foreground space-y-1">
                <li>Tự động gợi ý lịch gieo trồng và thu hoạch theo chu kỳ.</li>
                <li>
                  Kết nối với nhật ký canh tác để đánh giá tiến độ từng vụ.
                </li>
                <li>
                  Phân tích chi phí – năng suất – lợi nhuận theo từng giai đoạn.
                </li>
              </ul>
            </div>

            <div className="rounded-md border bg-muted/30 p-3">
              <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                <UploadCloud className="h-3.5 w-3.5 text-indigo-600" />
                Tệp đính kèm / tài liệu kỹ thuật
              </p>
              {pdfFileName ? (
                <div className="inline-flex items-center gap-2 rounded-md border bg-background px-2 py-1 text-[11px]">
                  <Badge variant="outline" className="text-[10px]">
                    PDF
                  </Badge>
                  <span>{pdfFileName}</span>
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground italic">
                  Chưa có file đính kèm
                </p>
              )}
            </div>

            <div className="rounded-md border border-dashed bg-muted/10 p-3 text-[11px] text-muted-foreground">
              Sau khi xác nhận, dữ liệu sẽ được lưu trong cơ sở dữ liệu nông hộ
              và có thể được chỉnh sửa trong module{" "}
              <span className="font-medium">“Quản lý nhóm cây trồng”</span>.
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          Quay lại
        </Button>
        <Button size="sm" onClick={onSubmit} className="bg-primary text-white">
          Xác nhận & hoàn tất
        </Button>
      </CardFooter>
    </Card>
  );
}
