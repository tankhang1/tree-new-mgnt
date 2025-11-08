"use client";

import * as React from "react";
import {
  CheckCircle2,
  Leaf,
  Sprout,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";

// ================== MOCK DATA ==================

type Crop = {
  id: string;
  name: string;
  category: string;
  image?: string;
  harvestMethod: string;
  cycleHint: string;
};

type Seed = {
  id: string;
  code: string;
  name: string;
  cropName: string;
  origin: string;
  yield: string;
  image?: string;
};

const MOCK_CROPS: Crop[] = [
  {
    id: "crop-1",
    name: "Đậu nành",
    category: "Cây ngắn ngày",
    image:
      "https://bizweb.dktcdn.net/thumb/1024x1024/100/390/808/products/thuong-thuc-dau-nanh-theo-phong-cach-singapore-1.jpg?v=1592987555860",
    harvestMethod: "Thu hoạch hạt, cơ giới hoặc thủ công",
    cycleHint: "Chu kỳ 95–110 ngày (Đông Xuân / Hè Thu)",
  },
  {
    id: "crop-2",
    name: "Bắp lai",
    category: "Cây lương thực",
    image:
      "https://storage.vinaseed.com.vn/Data/2020/02/14/ngo-lai-don-lvn10-700-3-637172784104183900.jpg?w=620&h=350",
    harvestMethod: "Thu hoạch bắp khô hoặc bắp non",
    cycleHint: "Chu kỳ 100–115 ngày (Đông Xuân)",
  },
  {
    id: "crop-3",
    name: "Lúa",
    category: "Lúa nước",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE-DBs3nxPEl7cq7KDBtus69pOoR35WD4xuQ&s",
    harvestMethod: "Thu hoạch bằng máy gặt đập liên hợp",
    cycleHint: "Chu kỳ 90–105 ngày tuỳ giống",
  },
];

const MOCK_SEEDS: Seed[] = [
  {
    id: "seed-1",
    code: "DN-DT84",
    name: "Đậu nành DT84",
    cropName: "Đậu nành",
    origin: "Việt Nam",
    yield: "2.5–2.8 tấn/ha",
    image:
      "https://media.vietnamplus.vn/images/c14f6479e83e315b4cf3a2906cc6a51e875525f3bbe20f9343607ad07a01c92f147aae408267e18cb342aaa0dd834e734827afe323f4eee8886d1806df7f097c/dautuong.jpg.webp",
  },
  {
    id: "seed-2",
    code: "BP-LVN10",
    name: "Bắp LVN10",
    cropName: "Bắp lai",
    origin: "Việt Nam",
    yield: "8.5–9.0 tấn/ha",
    image:
      "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
  },
  {
    id: "seed-3",
    code: "LU-ST25",
    name: "Lúa thơm ST25",
    cropName: "Lúa",
    origin: "Sóc Trăng",
    yield: "6.5–7.5 tấn/ha",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiJCUmb5f6UiiKCzq-GnV7lIEQnbdsgalqfQ&s",
  },
];

// ================== TYPES ==================

type SeasonCycle = {
  id: string;
  name: string;
  stage: string;
  note?: string;
};

type Step = 1 | 2 | 3;

// ================== MAIN PAGE ==================

export default function AddGrowthPage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<Step>(1);

  // step 1
  const [seasonCode, setSeasonCode] = React.useState("MSV2025XUAN");
  const [seasonName, setSeasonName] = React.useState("Mùa vụ Xuân 2025");
  const [durationDays, setDurationDays] = React.useState("110");
  const [mainCropId, setMainCropId] = React.useState<string>("crop-1");
  const [seedId, setSeedId] = React.useState<string>("seed-1");
  const [note, setNote] = React.useState(
    "Ưu tiên gieo trên đất tơi xốp, có tưới chủ động."
  );

  // step 2
  const [cycles, setCycles] = React.useState<SeasonCycle[]>([
    {
      id: crypto.randomUUID(),
      name: "Chu kỳ 1 – Đông Xuân",
      stage: "Gieo đậu nành DT84 sau lúa, thu hoạch hạt khô.",
      note: "Bón lót hữu cơ, tránh ngập úng đầu vụ.",
    },
    {
      id: crypto.randomUUID(),
      name: "Chu kỳ 2 – Hè Thu",
      stage: "Trồng bắp LVN10 trên chân đất cao.",
      note: "Theo dõi sâu keo mùa mưa, ưu tiên phun sinh học.",
    },
  ]);

  const handleAddCycle = () => {
    setCycles((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        stage: "",
        note: "",
      },
    ]);
  };

  const handleChangeCycle = (
    id: string,
    field: keyof SeasonCycle,
    value: string
  ) => {
    setCycles((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleRemoveCycle = (id: string) => {
    setCycles((prev) => prev.filter((c) => c.id !== id));
  };

  const mainCrop = MOCK_CROPS.find((c) => c.id === mainCropId);
  const mainSeed = MOCK_SEEDS.find((s) => s.id === seedId);

  const handleSubmit = () => {
    const payload = {
      seasonCode,
      seasonName,
      durationDays: Number(durationDays || 0),
      mainCropId,
      seedId,
      note,
      cycles,
    };
    console.log("NEW SEASON PAYLOAD:", payload);
    // TODO: call API
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="mr-1 h-7 w-7"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
              <Leaf className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">
                Tạo mới mùa vụ / kế hoạch gieo trồng
              </h1>
              <p className="text-xs text-muted-foreground">
                Thiết lập mùa vụ, cây trồng chính, giống sử dụng và chu kỳ sinh
                trưởng theo năm.
              </p>
            </div>
          </div>
        </div>

        <Stepper step={step} />
      </header>

      {/* BODY STEPS */}
      {step === 1 && (
        <Step1BasicInfo
          seasonCode={seasonCode}
          seasonName={seasonName}
          durationDays={durationDays}
          mainCropId={mainCropId}
          seedId={seedId}
          note={note}
          onChangeSeasonCode={setSeasonCode}
          onChangeSeasonName={setSeasonName}
          onChangeDurationDays={(v) => setDurationDays(v.replace(/\D/g, ""))}
          onChangeMainCrop={setMainCropId}
          onChangeSeed={setSeedId}
          onChangeNote={setNote}
        />
      )}

      {step === 2 && (
        <Step2Cycles
          cycles={cycles}
          onAddCycle={handleAddCycle}
          onChangeCycle={handleChangeCycle}
          onRemoveCycle={handleRemoveCycle}
        />
      )}

      {step === 3 && (
        <Step3Review
          seasonCode={seasonCode}
          seasonName={seasonName}
          durationDays={durationDays}
          note={note}
          mainCrop={mainCrop}
          mainSeed={mainSeed}
          cycles={cycles}
        />
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between border-t pt-3">
        <p className="text-[11px] text-muted-foreground">
          Bạn có thể chỉnh sửa lại sau khi tạo nếu có thay đổi về giống hoặc chu
          kỳ.
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
            disabled={step === 1}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
          {step < 3 ? (
            <Button
              className="bg-primary! text-primary-foreground!"
              size="sm"
              onClick={() => setStep((s) => (s < 3 ? ((s + 1) as Step) : s))}
            >
              Tiếp tục
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-primary! text-primary-foreground!"
              onClick={handleSubmit}
            >
              <CheckCircle2 className="mr-1 h-4 w-4" />
              Tạo mùa vụ
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================== STEP 1 ==================

type Step1Props = {
  seasonCode: string;
  seasonName: string;
  durationDays: string;
  mainCropId: string;
  seedId: string;
  note: string;
  onChangeSeasonCode: (v: string) => void;
  onChangeSeasonName: (v: string) => void;
  onChangeDurationDays: (v: string) => void;
  onChangeMainCrop: (id: string) => void;
  onChangeSeed: (id: string) => void;
  onChangeNote: (v: string) => void;
};

function Step1BasicInfo(props: Step1Props) {
  const {
    seasonCode,
    seasonName,
    durationDays,
    mainCropId,
    seedId,
    note,
    onChangeSeasonCode,
    onChangeSeasonName,
    onChangeDurationDays,
    onChangeMainCrop,
    onChangeSeed,
    onChangeNote,
  } = props;

  const selectedCrop = MOCK_CROPS.find((c) => c.id === mainCropId);
  const selectedSeed = MOCK_SEEDS.find((s) => s.id === seedId);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <CalendarDays className="h-4 w-4 text-emerald-600" />
          Bước 1 – Thông tin cơ bản & chọn cây / giống chính
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        <div className="grid gap-3 md:grid-cols-[1.8fr,1.2fr]">
          {/* Form left */}
          <div className="space-y-3">
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Mã mùa vụ *</p>
                <Input
                  className="h-8 font-mono text-[11px]"
                  value={seasonCode}
                  onChange={(e) => onChangeSeasonCode(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">Tên mùa vụ *</p>
                <Input
                  className="h-8"
                  value={seasonName}
                  onChange={(e) => onChangeSeasonName(e.target.value)}
                  placeholder="VD: Mùa vụ Xuân 2025 – Đậu nành luân canh bắp"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">
                  Thời gian dự kiến (ngày)
                </p>
                <Input
                  className="h-8"
                  value={durationDays}
                  onChange={(e) => onChangeDurationDays(e.target.value)}
                  placeholder="VD: 110"
                />
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">Ghi chú chung</p>
                <Input
                  className="h-8"
                  value={note}
                  onChange={(e) => onChangeNote(e.target.value)}
                  placeholder="Điều kiện đất đai, lưu ý tưới tiêu, thời tiết..."
                />
              </div>
            </div>
          </div>

          {/* Summary right */}
          <div className="space-y-2 rounded-md border bg-muted/30 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Thông tin tóm tắt
            </p>
            <div className="space-y-1 text-[11px]">
              <p>
                <span className="text-muted-foreground">Mã mùa vụ:</span>{" "}
                <span className="font-mono font-semibold">
                  {seasonCode || "-"}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Tên mùa vụ:</span>{" "}
                <span className="font-medium">{seasonName || "-"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">
                  Thời gian dự kiến:
                </span>{" "}
                {durationDays ? `${durationDays} ngày` : "-"}
              </p>
              {selectedCrop && (
                <p>
                  <span className="text-muted-foreground">Cây chính:</span>{" "}
                  <span className="font-medium">{selectedCrop.name}</span>
                </p>
              )}
              {selectedSeed && (
                <p>
                  <span className="text-muted-foreground">Giống:</span>{" "}
                  <span className="font-medium">{selectedSeed.name}</span>{" "}
                  <span className="font-mono text-[10px]">
                    ({selectedSeed.code})
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Crops cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Chọn cây trồng chính cho mùa vụ
            </p>
          </div>
          <ScrollArea className="h-[170px]">
            <div className="grid min-w-[640px] grid-cols-1 gap-3 md:grid-cols-3 pt-2">
              {MOCK_CROPS.map((c) => {
                const selected = c.id === mainCropId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onChangeMainCrop(c.id)}
                    className={`flex flex-row overflow-hidden rounded-md border bg-card text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      selected
                        ? "border-emerald-500 ring-1 ring-emerald-300"
                        : "border-muted"
                    }`}
                  >
                    <img
                      src={c.image ?? "/placeholder.png"}
                      alt={c.name}
                      className="h-full w-[130px] object-cover"
                    />
                    <div className="flex flex-1 flex-col gap-1 p-2.5 text-[11px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">{c.name}</span>
                        <Badge
                          variant="outline"
                          className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
                        >
                          {c.category}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-muted-foreground">
                        Hình thức thu hoạch:{" "}
                        <span className="font-medium">{c.harvestMethod}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Gợi ý chu kỳ: {c.cycleHint}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Seed cards */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Chọn giống hạt giống sử dụng trong mùa vụ
            </p>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-[11px]"
            >
              <Filter className="mr-1 h-3.5 w-3.5" />
              Lọc theo cây trồng
            </Button>
          </div>
          <ScrollArea className="h-[190px]">
            <div className="grid min-w-[640px] grid-cols-1 gap-3 md:grid-cols-3">
              {MOCK_SEEDS.map((s) => {
                const selected = s.id === seedId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onChangeSeed(s.id)}
                    className={`flex gap-2 rounded-md border bg-card p-2.5 text-left text-[11px] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                      selected
                        ? "border-primary ring-1 ring-primary/40"
                        : "border-muted"
                    }`}
                  >
                    <div className="h-14 w-14 overflow-hidden rounded bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.image ?? "/placeholder.png"}
                        alt={s.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">{s.name}</span>
                        <Badge className="font-mono text-[10px]">
                          {s.code}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Cây: <span className="font-medium">{s.cropName}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Nguồn gốc:{" "}
                        <span className="font-medium">{s.origin}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Năng suất tham khảo:{" "}
                        <span className="font-medium">{s.yield}</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

// ================== STEP 2 ==================

type Step2Props = {
  cycles: SeasonCycle[];
  onAddCycle: () => void;
  onChangeCycle: (id: string, field: keyof SeasonCycle, value: string) => void;
  onRemoveCycle: (id: string) => void;
};

function Step2Cycles({
  cycles,
  onAddCycle,
  onChangeCycle,
  onRemoveCycle,
}: Step2Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Sprout className="h-4 w-4 text-emerald-600" />
          Bước 2 – Chu kỳ sinh trưởng & giai đoạn trong năm
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="grid gap-3 md:grid-cols-[2fr,1.1fr]">
          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground">
              Thiết lập các chu kỳ / vụ trong năm (có thể là Đông Xuân, Hè Thu,
              Thu Đông...)
            </p>

            {cycles.map((c, idx) => (
              <div
                key={c.id}
                className="space-y-1.5 rounded-md border bg-muted/20 p-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold">Chu kỳ {idx + 1}</p>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground"
                    onClick={() => onRemoveCycle(c.id)}
                    disabled={cycles.length === 1}
                  >
                    ×
                  </Button>
                </div>
                <Input
                  className="h-8"
                  value={c.name}
                  onChange={(e) => onChangeCycle(c.id, "name", e.target.value)}
                  placeholder="Tên chu kỳ (VD: Chu kỳ 1 – Đông Xuân)"
                />
                <Textarea
                  rows={2}
                  className="text-xs"
                  value={c.stage}
                  onChange={(e) => onChangeCycle(c.id, "stage", e.target.value)}
                  placeholder="Mô tả khái quát: loại cây, lịch gieo – chăm sóc – thu hoạch..."
                />
                <Input
                  className="h-8"
                  value={c.note ?? ""}
                  onChange={(e) => onChangeCycle(c.id, "note", e.target.value)}
                  placeholder="Ghi chú: thời tiết, sâu bệnh, yêu cầu đất..."
                />
              </div>
            ))}

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-dashed text-[11px]"
              onClick={onAddCycle}
            >
              + Thêm chu kỳ
            </Button>
          </div>

          <div className="space-y-2 rounded-md border bg-muted/30 p-3 text-[11px] text-muted-foreground">
            <p className="mb-1 font-semibold text-foreground">
              Gợi ý ứng dụng chu kỳ
            </p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Hệ thống sẽ dùng chu kỳ để gợi ý thời gian{" "}
                <span className="font-medium">gieo, chăm sóc và thu hoạch</span>{" "}
                trong từng năm.
              </li>
              <li>
                Khi kết nối với nhật ký canh tác, có thể so sánh{" "}
                <span className="font-medium">thực tế vs kế hoạch</span> theo
                từng chu kỳ.
              </li>
              <li>
                Kết hợp với dữ liệu chi phí & sản lượng để đánh giá{" "}
                <span className="font-medium">
                  hiệu quả kinh tế của từng chu kỳ
                </span>{" "}
                (ROI theo vụ).
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ================== STEP 3 ==================

type Step3Props = {
  seasonCode: string;
  seasonName: string;
  durationDays: string;
  note: string;
  mainCrop?: Crop;
  mainSeed?: Seed;
  cycles: SeasonCycle[];
};

function Step3Review({
  seasonCode,
  seasonName,
  durationDays,
  note,
  mainCrop,
  mainSeed,
  cycles,
}: Step3Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Bước 3 – Xác nhận thông tin mùa vụ trước khi lưu
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="grid gap-3 md:grid-cols-[1.4fr,1.6fr]">
          <div className="space-y-2 rounded-md border bg-muted/30 p-3">
            <p className="mb-1 text-[11px] font-semibold text-muted-foreground">
              Thông tin chung
            </p>
            <div className="space-y-1 text-[11px]">
              <p>
                <span className="text-muted-foreground">Mã mùa vụ:</span>{" "}
                <span className="font-mono font-semibold">
                  {seasonCode || "-"}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Tên mùa vụ:</span>{" "}
                <span className="font-medium">{seasonName || "-"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">
                  Thời gian dự kiến:
                </span>{" "}
                {durationDays ? `${durationDays} ngày` : "-"}
              </p>
              {note && (
                <p>
                  <span className="text-muted-foreground">Ghi chú:</span> {note}
                </p>
              )}
            </div>

            <Separator className="my-2" />

            <p className="mb-1 text-[11px] font-semibold text-muted-foreground">
              Cây trồng & giống chính
            </p>
            <div className="space-y-2">
              {mainCrop && (
                <div className="flex gap-2 rounded-md border bg-card p-2">
                  <div className="h-12 w-16 overflow-hidden rounded bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mainCrop.image ?? "/placeholder.png"}
                      alt={mainCrop.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="text-xs font-semibold">
                      {mainCrop.name}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Nhóm: {mainCrop.category}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Thu hoạch: {mainCrop.harvestMethod}
                    </span>
                  </div>
                </div>
              )}

              {mainSeed && (
                <div className="flex gap-2 rounded-md border bg-card p-2">
                  <div className="h-12 w-16 overflow-hidden rounded bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mainSeed.image ?? "/placeholder.png"}
                      alt={mainSeed.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold">
                        {mainSeed.name}
                      </span>
                      <Badge className="font-mono text-[10px]">
                        {mainSeed.code}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Cây: {mainSeed.cropName} • Xuất xứ: {mainSeed.origin}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Năng suất tham khảo: {mainSeed.yield}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* cycles summary */}
          <div className="space-y-2 rounded-md border bg-muted/20 p-3">
            <p className="mb-1 text-[11px] font-semibold text-muted-foreground">
              Chu kỳ sinh trưởng & giai đoạn
            </p>
            {cycles.length === 0 && (
              <p className="text-[11px] text-muted-foreground">
                Chưa khai báo chu kỳ nào.
              </p>
            )}
            <div className="space-y-2">
              {cycles.map((c, idx) => (
                <div
                  key={c.id}
                  className="space-y-1 rounded-md border bg-card p-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">
                      Chu kỳ {idx + 1}: {c.name || "(chưa đặt tên)"}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
                    >
                      {idx === 0
                        ? "Vụ chính"
                        : idx === 1
                        ? "Vụ phụ"
                        : "Chu kỳ bổ sung"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {c.stage || "Chưa mô tả chi tiết."}
                  </p>
                  {c.note && (
                    <p className="text-[11px] text-muted-foreground">
                      Ghi chú: {c.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ================== STEPPER ==================

function Stepper({ step }: { step: Step }) {
  const steps = [
    { id: 1, label: "Thông tin cơ bản" },
    { id: 2, label: "Chu kỳ & giai đoạn" },
    { id: 3, label: "Xác nhận" },
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
