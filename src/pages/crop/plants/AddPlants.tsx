"use client";

import * as React from "react";
import {
  Sprout,
  Scissors,
  CalendarRange,
  Info,
  ImageIcon,
  Plus,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";

const VARIETIES = [
  {
    id: "DK9955",
    name: "Bắp lai DK9955 (Dekalb)",
    supplier: "Dekalb Vietnam",
    yield: "9–10 tấn/ha",
  },
  {
    id: "DT26",
    name: "Đậu nành DT26",
    supplier: "Trung tâm giống miền Nam",
    yield: "2.2–2.8 tấn/ha",
  },
  {
    id: "ST25",
    name: "Lúa thơm ST25",
    supplier: "Công ty Hồ Quang Cua",
    yield: "6.5–7 tấn/ha",
  },
];

type StageRow = {
  id: string;
  name: string;
  duration?: string;
  note?: string;
};

export default function AddPlantsPage() {
  const navigate = useNavigate();
  const [name, setName] = React.useState("Bắp lai DK9955");
  const [code, setCode] = React.useState("CROP-BAP-DK9955");
  const [imageUrl, setImageUrl] = React.useState(
    "https://images.pexels.com/photos/6065405/pexels-photo-6065405.jpeg"
  );

  const [selectedVariety, setSelectedVariety] = React.useState("DK9955");
  const [harvestForm, setHarvestForm] = React.useState("thu-bap-non");
  const [note, setNote] = React.useState(
    "Giai đoạn trổ cờ – phun râu cần đảm bảo tưới đủ ẩm, tránh gió mạnh làm gãy thân."
  );

  // Chu kỳ sinh trưởng: nhập + danh sách giai đoạn
  const [cycleName, setCycleName] = React.useState(
    "Chu kỳ 110–120 ngày (vụ Đông Xuân)"
  );
  const [stages, setStages] = React.useState<StageRow[]>([
    {
      id: crypto.randomUUID(),
      name: "Gieo hạt – nảy mầm",
      duration: "0–10 ngày",
      note: "Đảm bảo đủ ẩm, tránh ngập úng.",
    },
    {
      id: crypto.randomUUID(),
      name: "Sinh trưởng thân lá",
      duration: "10–40 ngày",
      note: "Bón thúc lần 1, kiểm soát cỏ dại.",
    },
    {
      id: crypto.randomUUID(),
      name: "Trổ cờ – phun râu",
      duration: "40–65 ngày",
      note: "Tập trung nước, hạn chế stress.",
    },
    {
      id: crypto.randomUUID(),
      name: "Làm hạt – chín sinh lý",
      duration: "65–110 ngày",
      note: "Theo dõi sâu bệnh, chuẩn bị thu hoạch.",
    },
  ]);

  const varietyInfo = VARIETIES.find((v) => v.id === selectedVariety);

  const handleAddStage = () => {
    setStages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        duration: "",
        note: "",
      },
    ]);
  };

  const handleChangeStage = (
    id: string,
    field: keyof StageRow,
    value: string
  ) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveStage = (id: string) => {
    setStages((prev) =>
      prev.length === 1 ? prev : prev.filter((s) => s.id !== id)
    );
  };

  const handleSave = () => {
    const payload = {
      name,
      code,
      imageUrl,
      selectedVariety,
      harvestForm,
      cycleName,
      stages,
      note,
    };
    console.log("Cây trồng mới:", payload);
    // TODO: call API
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="px-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
          <Sprout className="h-5 w-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Thêm cây trồng mới</h1>
          <p className="text-xs text-muted-foreground">
            Khai báo cây, chọn giống, hình thức thu hoạch và chu kỳ sinh trưởng
            (tự nhập).
          </p>
        </div>
      </header>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin cây trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[2fr,1.3fr] text-xs">
          {/* LEFT FORM */}
          <div className="space-y-3">
            {/* Tên + mã */}
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Tên cây trồng</p>
                <Input
                  className="h-8"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Mã cây</p>
                <Input
                  className="h-8 font-mono text-xs"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            {/* Ảnh */}
            <div>
              <p className="text-xs text-muted-foreground">Hình ảnh minh họa</p>
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  className="h-8"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Dán link hình ảnh hoặc để trống"
                />
              </div>
            </div>

            {/* Giống */}
            <div>
              <p className="text-xs text-muted-foreground">Giống cây trồng</p>
              <Select
                value={selectedVariety}
                onValueChange={(v) => setSelectedVariety(v)}
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Chọn giống" />
                </SelectTrigger>
                <SelectContent>
                  {VARIETIES.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium">{v.name}</span>
                        <span className="text-[11px] text-muted-foreground">
                          {v.supplier} • {v.yield}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hình thức thu hoạch */}
            <div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Scissors className="h-3 w-3 text-emerald-600" />
                Hình thức thu hoạch
              </p>
              <Select
                value={harvestForm}
                onValueChange={(v) => setHarvestForm(v)}
              >
                <SelectTrigger className="h-8 w-full">
                  <SelectValue placeholder="Chọn hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thu-tuoi">Thu tươi</SelectItem>
                  <SelectItem value="thu-hat">Thu hạt / khô</SelectItem>
                  <SelectItem value="thu-bap-non">
                    Thu bắp non / trái non
                  </SelectItem>
                  <SelectItem value="cat-luot">Cắt lứa nhiều lần</SelectItem>
                  <SelectItem value="khac">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Chu kỳ sinh trưởng: NHẬP + DANH SÁCH GIAI ĐOẠN */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Chu kỳ sinh trưởng & các giai đoạn
              </p>

              {/* Tên chu kỳ */}
              <Input
                className="h-8"
                value={cycleName}
                onChange={(e) => setCycleName(e.target.value)}
                placeholder="VD: Chu kỳ 110–120 ngày (Đông Xuân)"
              />

              {/* Danh sách giai đoạn */}
              <div className="space-y-2">
                {stages.map((s, idx) => (
                  <div
                    key={s.id}
                    className="relative rounded-lg border bg-gradient-to-br from-background to-muted/40 p-3 shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Header giai đoạn */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-white">
                          {idx + 1}
                        </span>
                        <p className="text-[12px] font-semibold text-foreground">
                          Giai đoạn {idx + 1}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-muted-foreground hover:text-red-500"
                        onClick={() => handleRemoveStage(s.id)}
                        disabled={stages.length === 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Nội dung */}
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        className="h-8 text-[12px]"
                        value={s.name}
                        onChange={(e) =>
                          handleChangeStage(s.id, "name", e.target.value)
                        }
                        placeholder="Tên giai đoạn (VD: Gieo hạt – nảy mầm)"
                      />
                      <Input
                        className="h-8 text-[12px]"
                        value={s.duration ?? ""}
                        onChange={(e) =>
                          handleChangeStage(s.id, "duration", e.target.value)
                        }
                        placeholder="Thời gian (VD: 0–10 ngày)"
                      />
                    </div>

                    <div className="mt-2">
                      <Input
                        className="h-8 text-[12px]"
                        value={s.note ?? ""}
                        onChange={(e) =>
                          handleChangeStage(s.id, "note", e.target.value)
                        }
                        placeholder="Ghi chú kỹ thuật nếu có (VD: tưới ẩm, bón thúc...)"
                      />
                    </div>

                    {/* Đường kẻ trang trí */}
                    <div className="absolute -left-[6px] top-4 h-[calc(100%-1rem)] w-[2px] bg-emerald-200 rounded-full" />
                  </div>
                ))}

                {/* Nút thêm giai đoạn */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full justify-center border-dashed text-[11px] hover:border-emerald-400 hover:text-emerald-700"
                  onClick={handleAddStage}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Thêm giai đoạn sinh trưởng
                </Button>
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Info className="h-3 w-3" /> Ghi chú chung
              </p>
              <Textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú về lưu ý kỹ thuật, thời tiết, đất đai phù hợp..."
              />
            </div>
          </div>

          {/* RIGHT PREVIEW */}
          <div className="space-y-3 rounded-md border bg-muted/30 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Xem trước thông tin
            </p>
            <div className="flex items-start gap-2">
              <div className="h-20 w-28 overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 text-[11px]">
                <span className="font-semibold">{name}</span>
                <span className="font-mono text-muted-foreground">{code}</span>
                <span>Giống: {varietyInfo?.name}</span>
                <span>
                  Năng suất: <b>{varietyInfo?.yield}</b>
                </span>
                <span>Thu hoạch: {harvestForm}</span>
                <span>Chu kỳ: {cycleName}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-1 text-[11px]">
              <p className="font-semibold text-muted-foreground">
                Giai đoạn sinh trưởng:
              </p>
              <ul className="list-disc pl-4 space-y-0.5">
                {stages.map((s) => (
                  <li key={s.id}>
                    <b>{s.name || "Chưa đặt tên"}</b>
                    {s.duration && ` • ${s.duration}`}
                    {s.note && (
                      <span className="text-muted-foreground"> – {s.note}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <p className="text-[11px] text-muted-foreground">{note}</p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="flex items-center justify-between border-t pt-3 mb-2">
        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
          <CalendarRange className="h-3 w-3" /> Cây trồng sẽ được dùng cho kế
          hoạch gieo trồng, nhật ký canh tác và báo cáo sản lượng.
        </p>
        <Button
          size="sm"
          className="bg-primary! text-primary-foreground!"
          onClick={handleSave}
        >
          Lưu cây trồng
        </Button>
      </div>
    </div>
  );
}
