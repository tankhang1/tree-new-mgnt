"use client";

import * as React from "react";
import { ClipboardList, Filter, Search } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import MilestoneTimeline from "./MilestoneTimeline";

/* ================== TYPES ================== */

type ActivityStatus = "done" | "in-progress" | "pending";

type ActivityType =
  | "watering"
  | "fertilizing"
  | "spraying"
  | "inspection"
  | "planting"
  | "harvesting"
  | "other";

type Activity = {
  time: string;
  type: ActivityType;
  title: string;
  detail: string;
  recorder: string;
  status: ActivityStatus;
  plot: string;
  areaName: string;
};

export type Milestone = {
  id: string;
  date: string; // YYYY-MM-DD
  phase: string;
  mainCrop: string;
  weather?: string;
  tempRange?: string;
  soilMoisture?: string;
  pestRisk?: "low" | "medium" | "high";
  activities: Activity[];
};

/* ================== MOCK DATA ================== */

const milestones: Milestone[] = [
  {
    id: "m1",
    date: "2025-11-08",
    phase: "Giai đoạn sinh trưởng – Tưới & bón thúc",
    mainCrop: "Bắp lai DK9955",
    weather: "Nắng nhẹ, có gió",
    tempRange: "27–31°C",
    soilMoisture: "75%",
    pestRisk: "medium",
    activities: [
      {
        time: "06:30",
        type: "watering",
        title: "Tưới nước khu A1 bằng hệ thống nhỏ giọt",
        detail:
          "Chạy hệ thống tưới nhỏ giọt 45 phút, độ ẩm đất đo tại 3 điểm đạt 70–80%. Kiểm tra áp lực béc: ổn định, không tắc.",
        recorder: "Nguyễn Văn A",
        status: "done",
        plot: "Lô A1-01",
        areaName: "Khu A1 (bắp 25 ngày tuổi)",
      },
      {
        time: "09:15",
        type: "fertilizing",
        title: "Bón thúc NPK 16-16-8 lần 2",
        detail:
          "Liều 50 kg/ha cho khu A1-01 và A1-02. Rải cách gốc 10–15 cm, lấp nhẹ đất, tránh tiếp xúc trực tiếp với thân cây.",
        recorder: "Trần Thị B",
        status: "in-progress",
        plot: "Lô A1-02",
        areaName: "Khu A1 (bắp 25 ngày tuổi)",
      },
      {
        time: "16:00",
        type: "inspection",
        title: "Khảo sát sinh trưởng đầu chiều",
        detail:
          "Đánh giá chiều cao trung bình 42–45 cm, cây đồng đều, chưa ghi nhận đổ ngã. Tỷ lệ thiếu hụt < 3%.",
        recorder: "Nguyễn Văn A",
        status: "pending",
        plot: "Lô A1-01",
        areaName: "Khu A1",
      },
    ],
  },
  {
    id: "m2",
    date: "2025-11-07",
    phase: "Theo dõi sâu bệnh & phun phòng sinh học",
    mainCrop: "Bắp lai DK9955 + Đậu nành DT26",
    weather: "Nhiều mây, có mưa nhẹ",
    tempRange: "24–28°C",
    soilMoisture: "82%",
    pestRisk: "high",
    activities: [
      {
        time: "08:30",
        type: "inspection",
        title: "Khảo sát sâu cuốn lá trên bắp",
        detail:
          "Ghi nhận sâu cuốn lá non rải rác 3–5% tại mép ruộng, chủ yếu ở A1-03. Mức độ thấp–trung bình.",
        recorder: "Lê Văn C",
        status: "done",
        plot: "Lô A1-03",
        areaName: "Mé ruộng giáp mương thoát nước",
      },
      {
        time: "15:00",
        type: "spraying",
        title: "Phun chế phẩm sinh học BT phòng sâu cuốn lá",
        detail:
          "Dùng BT 0.5%, pha và phun đều lên tán lá, ưu tiên vùng mép ruộng A1-03 và A1-04. Không phun khi gió mạnh.",
        recorder: "Nguyễn Văn A",
        status: "done",
        plot: "Lô A1-03, A1-04",
        areaName: "Khu A1",
      },
      {
        time: "16:30",
        type: "inspection",
        title: "Kiểm tra đậu nành xen canh",
        detail:
          "Đậu nành 18 ngày tuổi, cây phát triển tốt, chưa thấy đốm lá hoặc phấn trắng. Đề xuất theo dõi thêm sau mưa.",
        recorder: "Phạm Thị D",
        status: "done",
        plot: "Lô B2-01",
        areaName: "Khu B2 (đậu nành)",
      },
    ],
  },
  {
    id: "m3",
    date: "2025-11-05",
    phase: "Gieo trồng & xử lý hạt giống",
    mainCrop: "Bắp lai DK9955",
    weather: "Nắng, khô ráo",
    tempRange: "26–32°C",
    soilMoisture: "65%",
    pestRisk: "low",
    activities: [
      {
        time: "07:00",
        type: "planting",
        title: "Gieo hạt bắp lô A1-01",
        detail:
          "Mật độ 7.5 vạn cây/ha; hàng 70 cm, cây 25 cm. Hạt đã xử lý thuốc nấm trước gieo.",
        recorder: "Nguyễn Văn A",
        status: "done",
        plot: "Lô A1-01",
        areaName: "Khu A1 (vùng cao ráo)",
      },
      {
        time: "10:00",
        type: "planting",
        title: "Gieo hạt bắp lô A1-02",
        detail:
          "Quy trình tương tự A1-01, hoàn thành gieo trước 11h để tránh nắng gắt.",
        recorder: "Tổ sản xuất số 1",
        status: "done",
        plot: "Lô A1-02",
        areaName: "Khu A1",
      },
    ],
  },
];

/* ================== PAGE MAIN ================== */

export default function FarmingLogsPage() {
  const [search, setSearch] = React.useState("");
  const [cropFilter, setCropFilter] = React.useState<"all" | string>("all");
  const [plotFilter, setPlotFilter] = React.useState<"all" | string>("all");
  const [typeFilter, setTypeFilter] = React.useState<"all" | ActivityType>(
    "all"
  );
  const [statusFilter, setStatusFilter] = React.useState<
    "all" | ActivityStatus
  >("all");
  const [dateRangeFilter, setDateRangeFilter] = React.useState<
    "all" | "today" | "7days"
  >("all");

  // tuỳ bạn, có thể đổi thành new Date()
  const now = new Date("2025-11-08");

  const cropOptions = Array.from(
    new Set(milestones.map((m) => m.mainCrop))
  ).sort();
  const plotOptions = Array.from(
    new Set(milestones.flatMap((m) => m.activities.map((a) => a.plot)))
  ).sort();

  const totalActivities = milestones.reduce(
    (acc, m) => acc + m.activities.length,
    0
  );
  const totalDone = milestones.reduce(
    (acc, m) => acc + m.activities.filter((a) => a.status === "done").length,
    0
  );
  const totalSpraying = milestones.reduce(
    (acc, m) => acc + m.activities.filter((a) => a.type === "spraying").length,
    0
  );

  const filteredMilestones = React.useMemo(() => {
    return milestones
      .filter((m) => {
        // filter theo khoảng thời gian
        if (dateRangeFilter !== "all") {
          const d = new Date(m.date);
          const diffDays =
            (Number(now) - Number(d)) / (1000 * 60 * 60 * 24) || 0;

          if (
            dateRangeFilter === "today" &&
            d.toDateString() !== now.toDateString()
          )
            return false;
          if (dateRangeFilter === "7days" && diffDays > 7) return false;
        }

        // filter cây trồng chính
        if (cropFilter !== "all" && m.mainCrop !== cropFilter) return false;

        return true;
      })
      .map((m) => {
        // filter activity trong từng ngày
        const acts = m.activities.filter((a) => {
          const txt = search.toLowerCase().trim();
          const matchSearch =
            !txt ||
            a.title.toLowerCase().includes(txt) ||
            a.detail.toLowerCase().includes(txt) ||
            a.plot.toLowerCase().includes(txt) ||
            a.areaName.toLowerCase().includes(txt) ||
            m.phase.toLowerCase().includes(txt);

          const matchPlot = plotFilter === "all" || a.plot === plotFilter;
          const matchType = typeFilter === "all" || a.type === typeFilter;
          const matchStatus =
            statusFilter === "all" || a.status === statusFilter;

          return matchSearch && matchPlot && matchType && matchStatus;
        });

        return { ...m, activities: acts };
      })
      .filter((m) => m.activities.length > 0);
  }, [
    search,
    cropFilter,
    plotFilter,
    typeFilter,
    statusFilter,
    dateRangeFilter,
    now,
  ]);

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Nhật ký canh tác & lịch sử trồng trọt
            </h1>
            <p className="text-xs text-muted-foreground">
              Dựng theo dạng mốc thời gian (milestone) để cuộn dọc xem lịch sử
              tưới, bón phân, phun thuốc, gieo trồng theo từng ngày.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end text-xs text-muted-foreground">
          <span>Tổng hoạt động: {totalActivities}</span>
          <span>
            Hoàn thành: {totalDone} • Lần phun: {totalSpraying}
          </span>
        </div>
      </header>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bộ lọc & tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Search + reset */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tiêu đề, nội dung, lô đất, khu vực, giai đoạn..."
                className="h-9 pl-8"
              />
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch("");
                setCropFilter("all");
                setPlotFilter("all");
                setTypeFilter("all");
                setStatusFilter("all");
                setDateRangeFilter("all");
              }}
            >
              <Filter className="mr-1 h-4 w-4" />
              Làm mới bộ lọc
            </Button>
          </div>

          {/* Filters chi tiết */}
          <div className="grid gap-3 md:grid-cols-5">
            <FilterItem
              label="Cây trồng chính"
              control={
                <Select
                  value={cropFilter}
                  onValueChange={(v) => setCropFilter(v as "all" | string)}
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Chọn cây trồng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {cropOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            />

            <FilterItem
              label="Lô đất"
              control={
                <Select
                  value={plotFilter}
                  onValueChange={(v) => setPlotFilter(v as "all" | string)}
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Chọn lô" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {plotOptions.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              }
            />

            <FilterItem
              label="Loại hoạt động"
              control={
                <Select
                  value={typeFilter}
                  onValueChange={(v) =>
                    setTypeFilter(v as ActivityType | "all")
                  }
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Chọn loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="watering">Tưới nước</SelectItem>
                    <SelectItem value="fertilizing">Bón phân</SelectItem>
                    <SelectItem value="spraying">
                      Phun thuốc / chế phẩm
                    </SelectItem>
                    <SelectItem value="inspection">
                      Khảo sát / kiểm tra
                    </SelectItem>
                    <SelectItem value="planting">Gieo trồng</SelectItem>
                    <SelectItem value="harvesting">Thu hoạch</SelectItem>
                  </SelectContent>
                </Select>
              }
            />

            <FilterItem
              label="Trạng thái"
              control={
                <Select
                  value={statusFilter}
                  onValueChange={(v) =>
                    setStatusFilter(v as ActivityStatus | "all")
                  }
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="done">Hoàn thành</SelectItem>
                    <SelectItem value="in-progress">Đang thực hiện</SelectItem>
                    <SelectItem value="pending">Chưa làm</SelectItem>
                  </SelectContent>
                </Select>
              }
            />

            <FilterItem
              label="Khoảng thời gian"
              control={
                <Select
                  value={dateRangeFilter}
                  onValueChange={(v) =>
                    setDateRangeFilter(v as "all" | "today" | "7days")
                  }
                >
                  <SelectTrigger className="h-8 w-full">
                    <SelectValue placeholder="Chọn thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toàn bộ</SelectItem>
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="7days">7 ngày gần đây</SelectItem>
                  </SelectContent>
                </Select>
              }
            />
          </div>

          <p className="text-[11px] text-muted-foreground">
            Đang hiển thị{" "}
            <span className="font-semibold text-foreground">
              {filteredMilestones.reduce(
                (acc, m) => acc + m.activities.length,
                0
              )}
            </span>{" "}
            hoạt động / {totalActivities} hoạt động đã ghi nhận.
          </p>
        </CardContent>
      </Card>

      {/* TIMELINE dạng milestone (giống layout bên chăn nuôi) */}
      <MilestoneTimeline filteredLogs={filteredMilestones} />
    </div>
  );
}

/* ================== SMALL HELPERS ================== */

function FilterItem({
  label,
  control,
}: {
  label: string;
  control: React.ReactNode;
}) {
  return (
    <div className="space-y-1 text-xs">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      {control}
    </div>
  );
}
