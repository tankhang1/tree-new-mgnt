"use client";

import * as React from "react";
import {
  Sprout,
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  AlertTriangle,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Stage = {
  id: string;
  name: string;
  duration?: string;
  note?: string;
};

const CROP_OPTIONS = ["Đậu nành", "Bắp lai", "Lúa", "Rau màu", "Cây ăn trái"];

export default function AddCyclePage() {
  const [code, setCode] = React.useState("CYCLE-DSX-110");
  const [name, setName] = React.useState(
    "Chu kỳ 110 ngày – Đậu nành Đông Xuân"
  );
  const [mainCrop, setMainCrop] = React.useState("Đậu nành");
  const [seasonPattern, setSeasonPattern] = React.useState(
    "Đông Xuân (gieo 10–20/11, thu hoạch cuối 2)"
  );
  const [totalDays, setTotalDays] = React.useState("110");
  const [description, setDescription] = React.useState(
    "Chu kỳ áp dụng cho vùng đất thịt nhẹ, có tưới chủ động; luân canh sau lúa."
  );

  const [stages, setStages] = React.useState<Stage[]>([
    {
      id: crypto.randomUUID(),
      name: "Gieo hạt – nảy mầm",
      duration: "0–10 ngày",
      note: "Xử lý hạt giống, giữ ẩm bề mặt đất.",
    },
    {
      id: crypto.randomUUID(),
      name: "Sinh trưởng sinh dưỡng",
      duration: "10–35 ngày",
      note: "Bón thúc, quản lý cỏ dại.",
    },
    {
      id: crypto.randomUUID(),
      name: "Ra hoa – đậu quả",
      duration: "35–65 ngày",
      note: "Theo dõi sâu bệnh, tránh hạn – úng.",
    },
    {
      id: crypto.randomUUID(),
      name: "Tích lũy – chín sinh lý",
      duration: "65–110 ngày",
      note: "Giảm tưới, chuẩn bị thu hoạch.",
    },
  ]);

  const handleAddStage = () => {
    setStages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", duration: "", note: "" },
    ]);
  };

  const handleRemoveStage = (id: string) => {
    setStages((prev) =>
      prev.length === 1 ? prev : prev.filter((s) => s.id !== id)
    );
  };

  const handleChangeStage = (id: string, field: keyof Stage, value: string) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = () => {
    const payload = {
      code,
      name,
      mainCrop,
      seasonPattern,
      totalDays: totalDays ? Number(totalDays) : undefined,
      description,
      stages,
    };
    console.log("Tạo chu kỳ sinh trưởng:", payload);
    // TODO: call API
  };

  const totalStageText = stages
    .map((s) => s.duration)
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
            <Sprout className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-sm font-semibold">
              Tạo mới chu kỳ sinh trưởng
            </h1>
            <p className="text-xs text-muted-foreground">
              Khai báo khung thời gian và các giai đoạn sinh trưởng chuẩn để tái
              sử dụng cho mùa vụ, nhật ký canh tác.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            Mẫu: Đông Xuân – 2 vụ/năm
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Gợi ý: {totalDays || "…"} ngày / {stages.length} giai đoạn
          </span>
        </div>
      </header>

      {/* LAYOUT CHÍNH */}
      <div className="grid gap-4 lg:grid-cols-[1.7fr,1.3fr]">
        {/* Cột trái – form chính */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              1. Thông tin chung
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid gap-3 md:grid-cols-[0.9fr,1.6fr]">
              <Field label="Mã chu kỳ *">
                <Input
                  className="h-8 font-mono text-xs"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="VD: CYCLE-DSX-110"
                />
              </Field>
              <Field label="Tên chu kỳ *">
                <Input
                  className="h-8"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Chu kỳ 110 ngày – Đậu nành Đông Xuân"
                />
              </Field>
            </div>

            <Separator />

            <div className="grid gap-3 md:grid-cols-[1.1fr,1.2fr]">
              <Field label="Cây trồng chính áp dụng *">
                <Select value={mainCrop} onValueChange={(v) => setMainCrop(v)}>
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Chọn cây trồng" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROP_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Mùa vụ / thời điểm áp dụng">
                <Input
                  className="h-8"
                  value={seasonPattern}
                  onChange={(e) => setSeasonPattern(e.target.value)}
                  placeholder="VD: Đông Xuân (gieo 10–20/11, thu hoạch cuối 2)"
                />
              </Field>
            </div>

            <div className="grid gap-3 md:grid-cols-[0.8fr,2fr]">
              <Field label="Tổng thời gian chu kỳ (ngày)">
                <Input
                  className="h-8"
                  value={totalDays}
                  onChange={(e) =>
                    setTotalDays(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="VD: 110"
                />
              </Field>
              <Field label="Mô tả tóm tắt (hiển thị trong danh sách)">
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs"
                  placeholder="Vùng áp dụng, mục tiêu năng suất, điều kiện đất/nguồn nước..."
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Cột phải – giai đoạn sinh trưởng + tóm tắt */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                2. Giai đoạn sinh trưởng trong chu kỳ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  Thêm các giai đoạn chính: gieo – sinh dưỡng – ra hoa – chín…
                </span>
                <Badge variant="outline" className="text-[10px]">
                  {stages.length} giai đoạn
                </Badge>
              </div>

              <div className="space-y-2">
                {stages.map((s, idx) => (
                  <div
                    key={s.id}
                    className="rounded-md border bg-muted/30 p-2 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="h-5 rounded-full px-2 text-[10px]"
                        >
                          Giai đoạn {idx + 1}
                        </Badge>
                        {s.duration && (
                          <span className="text-[11px] text-muted-foreground">
                            {s.duration}
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-muted-foreground"
                        onClick={() => handleRemoveStage(s.id)}
                        disabled={stages.length === 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>

                    <Input
                      className="h-8"
                      value={s.name}
                      onChange={(e) =>
                        handleChangeStage(s.id, "name", e.target.value)
                      }
                      placeholder="Tên giai đoạn (VD: Gieo hạt – nảy mầm)"
                    />
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        className="h-8"
                        value={s.duration ?? ""}
                        onChange={(e) =>
                          handleChangeStage(s.id, "duration", e.target.value)
                        }
                        placeholder="Thời gian (VD: 0–10 ngày)"
                      />
                      <Input
                        className="h-8"
                        value={s.note ?? ""}
                        onChange={(e) =>
                          handleChangeStage(s.id, "note", e.target.value)
                        }
                        placeholder="Ghi chú kỹ thuật nếu có"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-dashed text-[11px]"
                onClick={handleAddStage}
              >
                <Plus className="mr-1 h-3 w-3" />
                Thêm giai đoạn sinh trưởng
              </Button>
            </CardContent>
          </Card>

          {/* Tóm tắt nhanh */}
          <Card className="border-dashed bg-muted/30">
            <CardContent className="space-y-2 py-3 text-[11px] text-muted-foreground">
              <p className="font-semibold text-foreground">
                Tóm tắt chu kỳ sẽ lưu
              </p>
              <p>
                • Cây trồng:{" "}
                <span className="font-medium text-foreground">
                  {mainCrop || "Chưa chọn"}
                </span>
              </p>
              <p>• Mùa vụ: {seasonPattern || "Chưa ghi"}</p>
              <p>
                • Thời gian: {totalDays ? `${totalDays} ngày` : "Chưa xác định"}{" "}
                {totalStageText && `(giai đoạn: ${totalStageText})`}
              </p>
              <p>
                • Mô tả: {description ? description : "Chưa có mô tả chi tiết."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs mb-2">
        <div className="flex items-center gap-1 text-muted-foreground">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          <span>
            Chu kỳ mang tính tham chiếu – nên được rà soát lại mỗi vụ theo dự
            báo thời tiết và giống thực tế.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Lưu nháp
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={handleSubmit}
          >
            Tạo chu kỳ sinh trưởng
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Sub component nhỏ để label gọn & đồng nhất ── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
