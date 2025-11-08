"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import {
  Beef,
  CalendarDays,
  HeartPulse,
  ThermometerSun,
  Wheat,
  LineChart,
  Plus,
} from "lucide-react";

type Animal = {
  id: string;
  name: string;
  tag: string;
  group: string;
};

type AddDailyRecordDialogProps = {
  animals: Animal[];
  defaultDate: string;
  onAdd?: (record: {
    date: string;
    animalId: string;
    temperature: number;
    feedIntakeKg: number;
    weightChangeKg: number;
    healthStatus: "good" | "normal" | "warning";
    note: string;
  }) => void;
};

export function AddDailyRecordDialog({
  animals,
  defaultDate,
  onAdd,
}: AddDailyRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(defaultDate);
  const [animalId, setAnimalId] = useState(animals[0]?.id ?? "");
  const [temperature, setTemperature] = useState("38.5");
  const [feedIntakeKg, setFeedIntakeKg] = useState("22");
  const [weightChangeKg, setWeightChangeKg] = useState("0.8");
  const [healthStatus, setHealthStatus] = useState<
    "good" | "normal" | "warning"
  >("good");
  const [note, setNote] = useState("");

  const handleAdd = () => {
    if (!animalId) return;
    onAdd?.({
      date,
      animalId,
      temperature: Number(temperature) || 0,
      feedIntakeKg: Number(feedIntakeKg) || 0,
      weightChangeKg: Number(weightChangeKg) || 0,
      healthStatus,
      note,
    });
    setNote("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          className="flex items-center gap-1 bg-primary! text-primary-foreground! hover:bg-primary/90!"
        >
          <Plus className="h-4 w-4" />
          Thêm ghi nhận
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <HeartPulse className="h-4 w-4 text-rose-500" />
            Ghi nhận tăng trưởng & sức khỏe
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Ghi nhận nhanh các chỉ số trong ngày cho từng con — gồm nhiệt độ, ăn
            vào, tăng trọng và tình trạng sức khỏe.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          {/* Hàng 1: ngày & bò */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                Ngày ghi nhận
              </p>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <Beef className="h-3 w-3 text-emerald-600" />
                Chọn bò
              </p>
              <Select value={animalId} onValueChange={setAnimalId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Chọn bò cần ghi nhận" />
                </SelectTrigger>
                <SelectContent>
                  {animals.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      <div className="flex flex-col text-[11px]">
                        <span className="text-xs font-medium">{a.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          Thẻ tai: {a.tag} • {a.group}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Hàng 2: nhiệt độ / ăn / tăng trọng */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <ThermometerSun className="h-3 w-3 text-orange-500" />
                Nhiệt độ (°C)
              </p>
              <Input
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="h-8 text-right text-xs"
                inputMode="decimal"
              />
            </div>

            <div className="space-y-1">
              <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <Wheat className="h-3 w-3 text-lime-600" />
                Thức ăn (kg/ngày)
              </p>
              <Input
                value={feedIntakeKg}
                onChange={(e) => setFeedIntakeKg(e.target.value)}
                className="h-8 text-right text-xs"
                inputMode="decimal"
              />
            </div>

            <div className="space-y-1">
              <p className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <LineChart className="h-3 w-3 text-sky-600" />
                Tăng trọng (kg/ngày)
              </p>
              <Input
                value={weightChangeKg}
                onChange={(e) => setWeightChangeKg(e.target.value)}
                className="h-8 text-right text-xs"
                inputMode="decimal"
              />
            </div>
          </div>

          {/* Hàng 3: sức khỏe + ghi chú */}
          <div className="grid gap-3 md:grid-cols-[1fr,2fr]">
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Trạng thái sức khỏe
              </p>
              <Select
                value={healthStatus}
                onValueChange={(v: "good" | "normal" | "warning") =>
                  setHealthStatus(v)
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">✅ Tốt</SelectItem>
                  <SelectItem value="normal">ℹ️ Bình thường</SelectItem>
                  <SelectItem value="warning">⚠️ Cần theo dõi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Ghi chú trong ngày
              </p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: ăn giảm, stress nhẹ, thay đổi thời tiết..."
                className="min-h-[60px] text-xs"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-3 flex justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            size="sm"
            className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4 mr-1" />
            Lưu ghi nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
