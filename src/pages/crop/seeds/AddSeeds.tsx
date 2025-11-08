"use client";

import * as React from "react";
import {
  ArrowLeft,
  Sprout,
  Building2,
  UploadCloud,
  FileText,
  Percent,
  Info,
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AddSeedsPage() {
  const [code, setCode] = React.useState("VAR001");
  const [name, setName] = React.useState("Giống lúa thơm ST25");
  const [crop, setCrop] = React.useState("lúa");
  const [supplier, setSupplier] = React.useState("CTY Nông Nghiệp Xanh");
  const [origin, setOrigin] = React.useState("Việt Nam");
  const [germRate, setGermRate] = React.useState("90");
  const [uniformRate, setUniformRate] = React.useState("72");
  const [yieldValue, setYieldValue] = React.useState("7.5");
  const [description, setDescription] = React.useState(
    "Giống lúa thơm, chất lượng gạo cao, phù hợp vụ Đông Xuân."
  );
  const [docMode, setDocMode] = React.useState<"pdf" | "text">("pdf");
  const [techText, setTechText] = React.useState("");

  const handleSubmit = () => {
    const payload = {
      code,
      name,
      crop,
      supplier,
      origin,
      germRate: Number(germRate) || undefined,
      uniformRate: Number(uniformRate) || undefined,
      yield: Number(yieldValue) || undefined,
      description,
      docMode,
      techText,
    };
    console.log("New seed:", payload);
    // TODO: call API
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
              <Sprout className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Tạo mới hạt giống cây</h1>
              <p className="text-xs text-muted-foreground">
                Khai báo mã giống, nhà cung cấp, thông số kỹ thuật và tài liệu
                tham khảo cho việc canh tác.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Button variant="outline" size="sm">
            Hủy
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={handleSubmit}
          >
            Lưu hạt giống
          </Button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.4fr,1.6fr]">
        {/* CỘT TRÁI – Thông tin chung & thông số */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Thông tin hạt giống
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs">Mã giống (theo hệ thống) *</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="h-8 font-mono text-xs"
                placeholder="VD: VAR001"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Tên giống *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8"
                placeholder="VD: Lúa thơm ST25"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Cây trồng *</Label>
              <Select value={crop} onValueChange={setCrop}>
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Chọn cây trồng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lúa">Lúa</SelectItem>
                  <SelectItem value="bắp">Bắp</SelectItem>
                  <SelectItem value="đậu nành">Đậu nành</SelectItem>
                  <SelectItem value="rau màu">Rau màu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Nhà cung cấp</Label>
              <div className="relative">
                <Input
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="h-8 pr-20"
                  placeholder="Nhập hoặc chọn nhà cung cấp"
                />
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span>Doanh nghiệp / cá nhân</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Có thể liên kết với danh mục nhà cung cấp chi tiết ở module
                riêng.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Xuất xứ (quốc gia)</Label>
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="h-8"
                  placeholder="VD: Việt Nam, Thái Lan..."
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-xs">
                  <Percent className="h-3 w-3" />
                  Tỷ lệ nảy mầm (%)
                </Label>
                <Input
                  value={germRate}
                  onChange={(e) =>
                    setGermRate(e.target.value.replace(/\D/g, ""))
                  }
                  className="h-8"
                  placeholder="VD: 90"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Độ đồng đều (%)</Label>
                <Input
                  value={uniformRate}
                  onChange={(e) =>
                    setUniformRate(e.target.value.replace(/\D/g, ""))
                  }
                  className="h-8"
                  placeholder="VD: 75"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Năng suất tham khảo (tấn/ha)</Label>
                <Input
                  value={yieldValue}
                  onChange={(e) =>
                    setYieldValue(e.target.value.replace(/[^\d.]/g, ""))
                  }
                  className="h-8"
                  placeholder="VD: 7.5"
                />
              </div>
            </div>

            <div className="rounded-md border border-dashed bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
              <Info className="mr-1 inline h-3 w-3" />
              Các thông số trên dùng để hiển thị nhanh trong báo cáo sản lượng,
              không thay thế kết quả kiểm nghiệm chính thức.
            </div>
          </CardContent>
        </Card>

        {/* CỘT PHẢI – Ảnh, mô tả & tài liệu */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Hình ảnh, mô tả & tài liệu kỹ thuật
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {/* Upload ảnh */}
            <div className="space-y-1.5">
              <Label className="text-xs">Hình ảnh hạt giống</Label>
              <div className="flex h-32 items-center justify-center rounded-md border border-dashed bg-muted/30 text-center text-[11px] text-muted-foreground">
                <div className="space-y-1">
                  <UploadCloud className="mx-auto h-5 w-5 text-muted-foreground" />
                  <p className="font-medium text-foreground">
                    Kéo hoặc chọn để tải ảnh lên
                  </p>
                  <p>Định dạng .jpg, .png, kích thước tối đa 5MB</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-1 h-7 px-2 text-[11px]"
                  >
                    Chọn file…
                  </Button>
                </div>
              </div>
            </div>

            {/* Mô tả ngắn */}
            <div className="space-y-1.5">
              <Label className="text-xs">Mô tả ngắn</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Mô tả về đặc tính chính, ưu nhược điểm, vùng trồng khuyến nghị..."
              />
            </div>

            {/* Tài liệu kỹ thuật */}
            <div className="space-y-2 rounded-md border bg-muted/10 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-muted-foreground">
                  Tài liệu kỹ thuật kèm theo
                </p>
                <RadioGroup
                  value={docMode}
                  onValueChange={(v: "pdf" | "text") => setDocMode(v)}
                  className="flex items-center gap-4 text-[11px]"
                >
                  <Label className="flex cursor-pointer items-center gap-1">
                    <RadioGroupItem value="pdf" className="h-3 w-3" />
                    Tải file PDF
                  </Label>
                  <Label className="flex cursor-pointer items-center gap-1">
                    <RadioGroupItem value="text" className="h-3 w-3" />
                    Nhập nội dung tóm tắt
                  </Label>
                </RadioGroup>
              </div>

              {docMode === "pdf" ? (
                <div className="flex h-28 flex-col items-center justify-center rounded-md border border-dashed bg-background text-[11px] text-muted-foreground">
                  <FileText className="mb-1 h-5 w-5 text-muted-foreground" />
                  <p className="font-medium text-foreground">
                    Kéo và thả file PDF vào đây
                  </p>
                  <p>
                    File quy trình kỹ thuật, tiêu chuẩn chất lượng (tối đa 10MB)
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="mt-1 h-7 px-2 text-[11px]"
                  >
                    Chọn file PDF…
                  </Button>
                </div>
              ) : (
                <Textarea
                  value={techText}
                  onChange={(e) => setTechText(e.target.value)}
                  rows={5}
                  placeholder="Tóm tắt kỹ thuật canh tác, yêu cầu chất lượng, lưu ý phòng trừ sâu bệnh..."
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
