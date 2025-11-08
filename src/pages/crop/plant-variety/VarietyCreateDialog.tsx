"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Upload, FileText, Image as ImageIcon, Plus } from "lucide-react";

type VarietyForm = {
  code: string;
  name: string;
  cropName: string;
  description: string;
  imageName: string;
  docType: "pdf" | "text";
  docFile: File | null;
  docContent: string;
  status: "active" | "testing" | "archived";
};

export default function VarietyCreateDialog({}: {}) {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<VarietyForm>({
    code: "",
    name: "",
    cropName: "",
    description: "",
    imageName: "",
    docType: "pdf",
    docFile: null,
    docContent: "",
    status: "active",
  });

  const handleChange = (key: keyof VarietyForm, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <DialogTrigger asChild>
          <Button
            onClick={() => setOpen(true)}
            variant="default"
            size="sm"
            className="flex items-center gap-1 bg-primary! text-primary-foreground! hover:bg-primary/90!"
          >
            <Plus className="h-4 w-4" />
            Thêm mới
          </Button>
        </DialogTrigger>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-4 sm:p-6">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-base font-semibold">
            Tạo mới giống cây
          </DialogTitle>
          <p className="text-[11px] text-muted-foreground">
            Thêm thông tin giống, cây trồng liên quan và tài liệu kỹ thuật để sử
            dụng lại trong các kế hoạch sản xuất.
          </p>
        </DialogHeader>

        <div className="space-y-4 text-xs max-h-96 overflow-y-auto">
          {/* ── Thông tin cơ bản ─────────────────────── */}
          <div className="space-y-2 rounded-md border bg-muted/20 p-3">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Thông tin cơ bản
            </p>
            <div className="grid gap-3 sm:grid-cols-[1.1fr,1fr]">
              <div className="space-y-1">
                <Label className="text-[11px]">Mã giống cây *</Label>
                <Input
                  placeholder="VD: VAR001"
                  value={form.code}
                  onChange={(e) => handleChange("code", e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Trạng thái</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    handleChange("status", v as VarietyForm["status"])
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang sử dụng</SelectItem>
                    <SelectItem value="testing">Thử nghiệm</SelectItem>
                    <SelectItem value="archived">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <Label className="text-[11px]">Tên giống *</Label>
                <Input
                  placeholder="VD: Lúa thơm ST25"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Cây trồng *</Label>
                <Select
                  value={form.cropName}
                  onValueChange={(v) => handleChange("cropName", v as string)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Chọn cây trồng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lúa">Lúa</SelectItem>
                    <SelectItem value="Bắp">Bắp</SelectItem>
                    <SelectItem value="Đậu nành">Đậu nành</SelectItem>
                    <SelectItem value="Khoai mì">Khoai mì</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-[11px]">Mô tả ngắn</Label>
              <Textarea
                rows={2}
                placeholder="Ghi tóm tắt ưu điểm: năng suất, chất lượng, phù hợp vùng sinh thái..."
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </div>

          {/* ── Ảnh & tài liệu kỹ thuật ───────────────── */}
          <div className="grid gap-3 md:grid-cols-[1.1fr,1.1fr]">
            {/* Ảnh */}
            <div className="space-y-2 rounded-md border bg-muted/20 p-3">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Ảnh giống cây
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-md bg-muted">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <label className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-background text-[11px] text-muted-foreground transition hover:bg-muted/40">
                    <Upload className="mb-1 h-4 w-4" />
                    <span>Nhấn để chọn ảnh hoặc kéo thả</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleChange(
                          "imageName",
                          e.target.files?.[0]?.name ?? ""
                        )
                      }
                    />
                  </label>
                  {form.imageName && (
                    <p className="mt-1 text-[11px] text-emerald-600">
                      Đã chọn:{" "}
                      <span className="font-medium">{form.imageName}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tài liệu */}
            <div className="space-y-2 rounded-md border bg-muted/20 p-3">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Tài liệu kỹ thuật
              </p>

              <RadioGroup
                value={form.docType}
                onValueChange={(v) =>
                  handleChange("docType", v as VarietyForm["docType"])
                }
                className="flex gap-4 text-[11px]"
              >
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="pdf" id="doc-pdf" />
                  <span>Tải file PDF</span>
                </label>
                <label className="flex items-center gap-2">
                  <RadioGroupItem value="text" id="doc-text" />
                  <span>Nhập nội dung tóm tắt</span>
                </label>
              </RadioGroup>

              {form.docType === "pdf" ? (
                <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed bg-background text-[11px] text-muted-foreground transition hover:bg-muted/40">
                  <FileText className="mb-1 h-4 w-4" />
                  <span>Chọn file PDF (tối đa 5MB)</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) =>
                      handleChange("docFile", e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              ) : (
                <Textarea
                  rows={4}
                  placeholder="Nhập tóm tắt quy trình kỹ thuật, yêu cầu chăm sóc, thu hoạch..."
                  value={form.docContent}
                  onChange={(e) => handleChange("docContent", e.target.value)}
                />
              )}

              {form.docFile && (
                <p className="mt-1 text-[11px] text-emerald-600">
                  File đã chọn:{" "}
                  <span className="font-medium">{form.docFile.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* ── Hint nhỏ ─────────────────────────────── */}
          <div className="rounded-md border border-dashed bg-muted/10 px-3 py-2 text-[11px] text-muted-foreground">
            Gợi ý: Nên dùng mô tả ngắn & trạng thái để lọc nhanh trong danh sách
            giống (Đang sử dụng / Thử nghiệm / Lưu trữ).
          </div>
        </div>

        <DialogFooter className="mt-3 gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={handleSubmit}
          >
            Tạo giống cây
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
