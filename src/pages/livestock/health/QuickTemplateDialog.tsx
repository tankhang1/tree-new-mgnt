import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Beef,
  ThermometerSun,
  LineChart,
  Wheat,
  Sparkles,
  Divide,
} from "lucide-react";

type QuickTemplateDialogProps = {
  onApply?: (template: {
    date: string;
    group: string;
    temperature: number;
    feedIntakeKg: number;
    weightChangeKg: number;
    note: string;
  }) => void;
  defaultDate: string;
};

export function QuickTemplateDialog({
  onApply,
  defaultDate,
}: QuickTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string>("đàn bò sữa a1");
  const [temperature, setTemperature] = useState<string>("38.5");
  const [feedIntakeKg, setFeedIntakeKg] = useState<string>("22");
  const [weightChangeKg, setWeightChangeKg] = useState<string>("0.8");
  const [note, setNote] = useState<string>(
    "Mẫu chuẩn: ngày thời tiết bình thường, đàn ăn uống tốt."
  );

  const handleApply = () => {
    onApply?.({
      date: defaultDate,
      group,
      temperature: Number(temperature) || 0,
      feedIntakeKg: Number(feedIntakeKg) || 0,
      weightChangeKg: Number(weightChangeKg) || 0,
      note,
    });
    setOpen(false);
  };

  const demoAnimals = [
    { name: "Bò cái HF 001", tag: "HF-001" },
    { name: "Bò cái HF 012", tag: "HF-012" },
    { name: "Bò cái hậu bị 078", tag: "HB-078" },
  ];

  const applyPreset = (type: "cool" | "hot" | "rainy") => {
    if (type === "cool") {
      setTemperature("38.3");
      setFeedIntakeKg("23");
      setWeightChangeKg("0.9");
      setNote("Thời tiết mát, đàn ăn tốt, tăng trọng cao hơn bình thường.");
    }
    if (type === "hot") {
      setTemperature("39.0");
      setFeedIntakeKg("20");
      setWeightChangeKg("0.6");
      setNote(
        "Nắng nóng, có dấu hiệu stress nhiệt nhẹ, điều chỉnh giảm tải vận động."
      );
    }
    if (type === "rainy") {
      setTemperature("38.6");
      setFeedIntakeKg("21");
      setWeightChangeKg("0.7");
      setNote(
        "Mưa nhiều, chuồng trại ẩm, cần chú ý độ khô ráo và vệ sinh nền chuồng."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
        >
          <Sparkles className="h-4 w-4" />
          Mẫu nhập nhanh
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <Beef className="h-4 w-4 text-primary" />
            Mẫu nhập nhanh theo đàn
          </DialogTitle>
          <DialogDescription className="text-xs">
            Thiết lập một bộ giá trị **mặc định trong ngày** cho cả đàn (nhiệt
            độ, ăn vào, tăng trọng, ghi chú). Sau khi áp dụng, bạn vẫn có thể
            chỉnh sửa từng con riêng lẻ.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-5 md:grid-cols-[1.2fr,1fr] text-xs max-h-96 overflow-y-scroll">
          {/* Cột trái: Form chính */}
          <div className="space-y-4 rounded-md border bg-muted/40 p-3">
            {/* Đàn + ngày */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium">
                  Đàn / nhóm áp dụng
                </Label>
                <Select value={group} onValueChange={setGroup}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Chọn đàn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="đàn bò sữa a1">Đàn bò sữa A1</SelectItem>
                    <SelectItem value="đàn bò sữa a2">Đàn bò sữa A2</SelectItem>
                    <SelectItem value="đàn bò hậu bị">Đàn bò hậu bị</SelectItem>
                    <SelectItem value="đàn bò thịt b1">
                      Đàn bò thịt B1
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Hệ thống sẽ áp dụng mẫu cho **tất cả con** thuộc đàn này trong
                  ngày.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-medium">Ngày áp dụng</Label>
                <Input
                  type="date"
                  value={defaultDate}
                  disabled
                  className="h-8 cursor-not-allowed rounded-md bg-muted text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Ngày ghi nhận:{" "}
                  <span className="font-semibold">
                    {new Date(defaultDate).toLocaleDateString("vi-VN")}
                  </span>
                </p>
              </div>
            </div>

            {/* Chỉ tiêu chính */}
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-[11px] font-medium">
                  <ThermometerSun className="h-3 w-3 text-orange-500" />
                  Nhiệt độ trung bình (°C)
                </Label>
                <Input
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="h-8 text-right text-xs"
                  inputMode="decimal"
                />
                <p className="text-[11px] text-muted-foreground">
                  Bò sữa thường 38.3 – 39.0 °C
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-[11px] font-medium">
                  <Wheat className="h-3 w-3 text-lime-600" />
                  Lượng thức ăn (kg/con)
                </Label>
                <Input
                  value={feedIntakeKg}
                  onChange={(e) => setFeedIntakeKg(e.target.value)}
                  className="h-8 text-right text-xs"
                  inputMode="decimal"
                />
                <p className="text-[11px] text-muted-foreground">
                  Khẩu phần hỗn hợp TMR một ngày.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1 text-[11px] font-medium">
                  <LineChart className="h-3 w-3 text-sky-600" />
                  Tăng trọng (kg/ngày)
                </Label>
                <Input
                  value={weightChangeKg}
                  onChange={(e) => setWeightChangeKg(e.target.value)}
                  className="h-8 text-right text-xs"
                  inputMode="decimal"
                />
                <p className="text-[11px] text-muted-foreground">
                  Dựa trên cân định kỳ, ước tính bình quân.
                </p>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="space-y-1.5">
              <Label className="text-[11px] font-medium">
                Ghi chú chung trong ngày
              </Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: điều kiện thời tiết, thay đổi khẩu phần, tình trạng chung của đàn..."
                className="min-h-[70px] text-xs"
              />
            </div>

            {/* Presets */}
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Mẫu gợi ý nhanh
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-full border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700"
                  onClick={() => applyPreset("cool")}
                >
                  Ngày mát mẻ
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-full border-orange-200 bg-orange-50 text-[11px] text-orange-700"
                  onClick={() => applyPreset("hot")}
                >
                  Nắng nóng
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-full border-sky-200 bg-sky-50 text-[11px] text-sky-700"
                  onClick={() => applyPreset("rainy")}
                >
                  Trời mưa / ẩm
                </Button>
              </div>
            </div>
          </div>

          {/* Cột phải: Preview */}
          <div className="space-y-3">
            <div className="rounded-md border bg-gradient-to-b from-background to-muted/60 p-3">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Một số con trong đàn sẽ áp dụng mẫu
              </p>
              <div className="mt-2 space-y-2">
                {demoAnimals.map((a) => (
                  <div
                    key={a.tag}
                    className="flex items-center justify-between rounded-md bg-background px-2 py-1.5 text-[11px] shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-700">
                        {a.tag}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground">
                          {a.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          Đàn: {group}
                        </span>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                      Sẽ áp mẫu
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                * Thực tế hệ thống sẽ áp dụng cho <b>tất cả con</b> thuộc đàn
                được chọn trong ngày này.
              </p>
            </div>

            <div className="rounded-md border border-dashed bg-muted/30 p-3 text-[11px] text-muted-foreground">
              <p className="font-semibold text-foreground">
                Gợi ý quy trình sử dụng
              </p>
              <ol className="mt-1 list-decimal space-y-1 pl-4">
                <li>Chọn đàn và thiết lập mẫu nhập nhanh cho ngày hôm nay.</li>
                <li>Áp dụng mẫu cho đàn (tự động sinh bản ghi mặc định).</li>
                <li>
                  Vào từng con cần chỉnh sửa để điều chỉnh số liệu chi tiết.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-3 flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Đóng
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
            onClick={handleApply}
          >
            Áp dụng mẫu cho đàn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
