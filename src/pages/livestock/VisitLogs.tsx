"use client";

import { useMemo, useState } from "react";
import {
  PawPrint,
  FileDown,
  CalendarDays,
  Stethoscope,
  Wheat,
  Droplets,
  Sparkles,
  Search,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MilestoneTimeline from "./MilestoneTimeline";
// ================== TYPES & MOCK DATA ==================

type LogType =
  | "feeding"
  | "health"
  | "breeding"
  | "environment"
  | "other"
  | "production"
  | "treatment"
  | "growth"
  | "movement";

type LivestockLog = {
  id: string;
  date: string; // ISO
  time: string; // HH:mm
  animalTag: string;
  animalName: string;
  group: string;
  farm: string;
  logType: LogType;
  title: string;
  detail: string;
  recorder: string;
  status: "normal" | "warning" | "critical";
};

const logs: LivestockLog[] = [
  {
    id: "1",
    date: "2025-11-06",
    time: "06:30",
    animalTag: "HF-001",
    animalName: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    farm: "Trại bò sữa A1",
    logType: "feeding",
    title: "Cho ăn sáng",
    detail:
      "Ăn khẩu phần cỏ tươi + cám hỗn hợp, lượng ăn ~95% khẩu phần, uống nước bình thường.",
    recorder: "Nguyễn Văn A",
    status: "normal",
  },
  {
    id: "2",
    date: "2025-11-06",
    time: "09:15",
    animalTag: "HF-012",
    animalName: "Bò cái HF 012",
    group: "Đàn bò sữa A2",
    farm: "Trại bò sữa A1",
    logType: "health",
    title: "Khám sức khoẻ",
    detail:
      "Nhiệt độ 39.2°C, hơi sốt nhẹ, giảm ăn. Theo dõi thêm và cân nhắc mời thú y nếu không cải thiện.",
    recorder: "Trần Thị B",
    status: "warning",
  },
  {
    id: "3",
    date: "2025-11-05",
    time: "15:40",
    animalTag: "HB-078",
    animalName: "Bò cái hậu bị 078",
    group: "Đàn bò hậu bị",
    farm: "Trại giống B2",
    logType: "breeding",
    title: "Phát hiện động dục & phối giống",
    detail:
      "Bò có dấu hiệu động dục rõ, phối tinh đực HF mã HF-SE-001, lần phối thứ 1.",
    recorder: "Lê Văn C",
    status: "normal",
  },
  {
    id: "4",
    date: "2025-11-04",
    time: "10:20",
    animalTag: "MT-045",
    animalName: "Bò thịt lai Sind 045",
    group: "Đàn bò thịt B1",
    farm: "Trại bò thịt C1",
    logType: "environment",
    title: "Vệ sinh chuồng & thay đệm lót",
    detail:
      "Chuồng hơi ẩm, đã thay đệm lót mới, bổ sung thông gió, giảm mùi hôi.",
    recorder: "Nguyễn Văn A",
    status: "normal",
  },
  {
    id: "5",
    date: "2025-11-03",
    time: "18:45",
    animalTag: "HF-001",
    animalName: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    farm: "Trại bò sữa A1",
    logType: "health",
    title: "Phát hiện viêm vú nghi ngờ",
    detail:
      "Sữa vắt buổi tối có cục lợn cợn, bầu vú hơi nóng. Đánh dấu nghi viêm vú, cần bác sĩ thú y kiểm tra.",
    recorder: "Nguyễn Văn A",
    status: "critical",
  },
  // ===== Thêm nhiều bản ghi khác =====
  {
    id: "6",
    date: "2025-11-06",
    time: "16:10",
    animalTag: "HF-001",
    animalName: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    farm: "Trại bò sữa A1",
    logType: "production",
    title: "Ghi nhận sản lượng sữa chiều",
    detail:
      "Vắt được 18.5 lít, sữa đều, màu bình thường. Giảm nhẹ 0.5 lít so với hôm trước.",
    recorder: "Nguyễn Văn A",
    status: "normal",
  },
  {
    id: "7",
    date: "2025-11-06",
    time: "20:05",
    animalTag: "HF-012",
    animalName: "Bò cái HF 012",
    group: "Đàn bò sữa A2",
    farm: "Trại bò sữa A1",
    logType: "treatment",
    title: "Tiêm hạ sốt & kháng sinh",
    detail:
      "Tiêm hạ sốt theo phác đồ thú y, kết hợp kháng sinh 3 ngày, theo dõi nhiệt độ sáng/chiều.",
    recorder: "Bác sĩ thú y Phạm Văn D",
    status: "warning",
  },
  {
    id: "8",
    date: "2025-11-05",
    time: "06:20",
    animalTag: "HB-078",
    animalName: "Bò cái hậu bị 078",
    group: "Đàn bò hậu bị",
    farm: "Trại giống B2",
    logType: "feeding",
    title: "Khẩu phần sáng",
    detail:
      "Bò ăn hết 100% khẩu phần cỏ voi + rơm khô, uống nước nhiều, phân bình thường.",
    recorder: "Nguyễn Thị E",
    status: "normal",
  },
  {
    id: "9",
    date: "2025-11-05",
    time: "19:00",
    animalTag: "MT-045",
    animalName: "Bò thịt lai Sind 045",
    group: "Đàn bò thịt B1",
    farm: "Trại bò thịt C1",
    logType: "growth",
    title: "Cân khối lượng định kỳ",
    detail:
      "Khối lượng đạt 345 kg, tăng 12 kg so với kỳ trước (2 tuần). Tốc độ tăng trưởng đạt yêu cầu.",
    recorder: "Lê Văn C",
    status: "normal",
  },
  {
    id: "10",
    date: "2025-11-04",
    time: "05:50",
    animalTag: "HF-020",
    animalName: "Bò cái HF 020",
    group: "Đàn bò sữa A3",
    farm: "Trại bò sữa A1",
    logType: "feeding",
    title: "Ăn kém buổi sáng",
    detail:
      "Chỉ ăn khoảng 60% khẩu phần, đứng riêng, ít giao tiếp. Cần theo dõi thêm.",
    recorder: "Nguyễn Văn A",
    status: "warning",
  },
  {
    id: "11",
    date: "2025-11-04",
    time: "14:10",
    animalTag: "HF-020",
    animalName: "Bò cái HF 020",
    group: "Đàn bò sữa A3",
    farm: "Trại bò sữa A1",
    logType: "health",
    title: "Khám sơ bộ bò ăn kém",
    detail:
      "Nhiệt độ 38.7°C, không sốt, rumen hoạt động chậm, niêm mạc nhợt. Nghi rối loạn tiêu hoá nhẹ.",
    recorder: "Bùi Thị F",
    status: "warning",
  },
  {
    id: "12",
    date: "2025-11-03",
    time: "07:00",
    animalTag: "HF-001",
    animalName: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    farm: "Trại bò sữa A1",
    logType: "production",
    title: "Sản lượng sữa sáng",
    detail:
      "Vắt được 19 lít, chất lượng sữa tốt, không có bất thường về màu/mùi.",
    recorder: "Nguyễn Văn A",
    status: "normal",
  },
  {
    id: "13",
    date: "2025-11-03",
    time: "09:30",
    animalTag: "HF-001",
    animalName: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    farm: "Trại bò sữa A1",
    logType: "treatment",
    title: "Điều trị nghi viêm vú",
    detail:
      "Vệ sinh bầu vú, vắt bỏ sữa vú bệnh, dùng kháng sinh bơm vú theo hướng dẫn. Ghi rõ đánh dấu chuồng.",
    recorder: "Bác sĩ thú y Phạm Văn D",
    status: "critical",
  },
  {
    id: "14",
    date: "2025-11-02",
    time: "16:30",
    animalTag: "HB-078",
    animalName: "Bò cái hậu bị 078",
    group: "Đàn bò hậu bị",
    farm: "Trại giống B2",
    logType: "growth",
    title: "Đánh giá tăng trưởng hậu bị",
    detail:
      "Thân hình phát triển đều, điểm thể trạng BCS 3.0/5, phù hợp giai đoạn chuẩn bị phối giống.",
    recorder: "Lê Văn C",
    status: "normal",
  },
  {
    id: "15",
    date: "2025-11-02",
    time: "11:15",
    animalTag: "MT-045",
    animalName: "Bò thịt lai Sind 045",
    group: "Đàn bò thịt B1",
    farm: "Trại bò thịt C1",
    logType: "feeding",
    title: "Điều chỉnh khẩu phần",
    detail:
      "Tăng thêm 0.5 kg cám tinh/con/ngày để đẩy nhanh tăng trọng, theo dõi trong 7 ngày.",
    recorder: "Nguyễn Văn A",
    status: "normal",
  },
  {
    id: "16",
    date: "2025-11-01",
    time: "08:00",
    animalTag: "HF-030",
    animalName: "Bò cái HF 030",
    group: "Đàn bò sữa A2",
    farm: "Trại bò sữa A1",
    logType: "environment",
    title: "Kiểm tra hệ thống làm mát",
    detail:
      "Quạt chuồng hoạt động tốt, hệ thống phun sương hoạt động 80%, cần bảo dưỡng 2 đầu phun.",
    recorder: "Trần Thị B",
    status: "normal",
  },
  {
    id: "17",
    date: "2025-11-01",
    time: "19:20",
    animalTag: "HF-030",
    animalName: "Bò cái HF 030",
    group: "Đàn bò sữa A2",
    farm: "Trại bò sữa A1",
    logType: "health",
    title: "Ghi nhận ho nhẹ",
    detail:
      "Thỉnh thoảng ho, không sốt, chưa khó thở. Theo dõi thêm, nếu tăng sẽ mời thú y.",
    recorder: "Nguyễn Văn A",
    status: "warning",
  },
  {
    id: "18",
    date: "2025-10-31",
    time: "06:10",
    animalTag: "HF-012",
    animalName: "Bò cái HF 012",
    group: "Đàn bò sữa A2",
    farm: "Trại bò sữa A1",
    logType: "feeding",
    title: "Ăn tốt buổi sáng",
    detail:
      "Ăn sạch khẩu phần trong 30 phút, uống nước bình thường, phân khuôn đẹp.",
    recorder: "Nguyễn Văn A",
    status: "normal",
  },
  {
    id: "19",
    date: "2025-10-31",
    time: "17:00",
    animalTag: "HF-012",
    animalName: "Bò cái HF 012",
    group: "Đàn bò sữa A2",
    farm: "Trại bò sữa A1",
    logType: "production",
    title: "Sản lượng sữa ngày",
    detail:
      "Tổng sản lượng ngày 27.5 lít, tăng 1 lít so với trung bình 7 ngày trước.",
    recorder: "Trần Thị B",
    status: "normal",
  },
  {
    id: "20",
    date: "2025-10-30",
    time: "13:30",
    animalTag: "HF-001",
    animalName: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    farm: "Trại bò sữa A1",
    logType: "movement",
    title: "Cho vận động khu sân chơi",
    detail:
      "Thả đàn ra sân chơi 1.5 giờ, bò vận động tốt, không có dấu hiệu tập tễnh hay chấn thương.",
    recorder: "Nguyễn Văn A",
    status: "normal",
  },
  {
    id: "21",
    date: "2025-10-29",
    time: "09:00",
    animalTag: "HB-078",
    animalName: "Bò cái hậu bị 078",
    group: "Đàn bò hậu bị",
    farm: "Trại giống B2",
    logType: "health",
    title: "Tiêm vaccine định kỳ",
    detail:
      "Tiêm vaccine Lở mồm long móng theo lịch, ghi sổ lô vaccine và hạn sử dụng đầy đủ.",
    recorder: "Bác sĩ thú y Phạm Văn D",
    status: "normal",
  },
  {
    id: "22",
    date: "2025-10-29",
    time: "18:10",
    animalTag: "MT-045",
    animalName: "Bò thịt lai Sind 045",
    group: "Đàn bò thịt B1",
    farm: "Trại bò thịt C1",
    logType: "health",
    title: "Quan sát dáng đi",
    detail:
      "Bò bước hơi khập khiễng chân sau phải, chưa sưng. Ghi nhận để kiểm tra lại ngày hôm sau.",
    recorder: "Nguyễn Văn A",
    status: "warning",
  },
  {
    id: "23",
    date: "2025-10-28",
    time: "07:20",
    animalTag: "HF-001",
    animalName: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    farm: "Trại bò sữa A1",
    logType: "breeding",
    title: "Khám thai sau phối 35 ngày",
    detail:
      "Siêu âm thấy túi thai, kết luận có thai. Ghi nhận ngày dự kiến sinh.",
    recorder: "Bác sĩ thú y Phạm Văn D",
    status: "normal",
  },
  {
    id: "24",
    date: "2025-10-27",
    time: "16:45",
    animalTag: "HF-030",
    animalName: "Bò cái HF 030",
    group: "Đàn bò sữa A2",
    farm: "Trại bò sữa A1",
    logType: "environment",
    title: "Điều chỉnh mật độ chuồng",
    detail:
      "Giảm bớt 1 con trong ô chuồng, tăng diện tích nằm cho bò, giảm stress do chật chội.",
    recorder: "Trần Thị B",
    status: "normal",
  },
  {
    id: "25",
    date: "2025-10-27",
    time: "20:30",
    animalTag: "MT-045",
    animalName: "Bò thịt lai Sind 045",
    group: "Đàn bò thịt B1",
    farm: "Trại bò thịt C1",
    logType: "feeding",
    title: "Bỏ ăn một phần",
    detail:
      "Chỉ ăn khoảng 70% khẩu phần chiều, uống nước bình thường. Ghi nhận để đối chiếu với tăng trọng kỳ sau.",
    recorder: "Nguyễn Văn A",
    status: "warning",
  },
];

// ================== UTILS ==================

function renderHealthBadge(status: string | undefined) {
  if (!status) {
    return (
      <Badge variant="outline" className="text-[10px]">
        Chưa đánh giá
      </Badge>
    );
  }

  if (status === "tot") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">
        Sức khoẻ tốt
      </Badge>
    );
  }
  if (status === "can-theo-doi") {
    return (
      <Badge className="bg-amber-100 text-amber-700 text-[10px]">
        Cần theo dõi
      </Badge>
    );
  }
  if (status === "can-xu-ly") {
    return (
      <Badge className="bg-red-100 text-red-700 text-[10px]">
        Cần xử lý ngay
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-[10px]">
      {status}
    </Badge>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-[10px]">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

// ================== PAGE COMPONENT ==================

export default function VisitLogsPage() {
  const [tab, setTab] = useState<LogType | "all">("all");
  const [farmFilter, setFarmFilter] = useState<"all" | string>("all");
  const [groupFilter, setGroupFilter] = useState<"all" | string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | LivestockLog["status"]
  >("all");
  const [search, setSearch] = useState("");

  const [dateFrom, setDateFrom] = useState("2025-11-01");
  const [dateTo, setDateTo] = useState("2025-11-07");

  const totalLogs = logs.length;
  const warningCount = logs.filter((l) => l.status === "warning").length;
  const criticalCount = logs.filter((l) => l.status === "critical").length;
  const feedingCount = logs.filter((l) => l.logType === "feeding").length;

  const farms = Array.from(new Set(logs.map((l) => l.farm)));
  const groups = Array.from(new Set(logs.map((l) => l.group)));

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (tab !== "all" && l.logType !== tab) return false;
      if (farmFilter !== "all" && l.farm !== farmFilter) return false;
      if (groupFilter !== "all" && l.group !== groupFilter) return false;
      if (statusFilter !== "all" && l.status !== statusFilter) return false;

      if (dateFrom && l.date < dateFrom) return false;
      if (dateTo && l.date > dateTo) return false;

      if (search.trim()) {
        const text = search.toLowerCase();
        const haystack = (
          l.animalName +
          l.animalTag +
          l.title +
          l.detail +
          l.recorder +
          l.group
        ).toLowerCase();
        if (!haystack.includes(text)) return false;
      }

      return true;
    });
  }, [tab, farmFilter, groupFilter, statusFilter, dateFrom, dateTo, search]);

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-start gap-2">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
            <PawPrint className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Nhật ký chăn nuôi hằng ngày
            </h1>
            <p className="text-xs text-muted-foreground">
              Ghi nhận tăng trưởng, sức khỏe, khẩu phần ăn và môi trường chuồng
              trại cho từng con / từng đàn.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-1 h-4 w-4" />
            Xuất file
          </Button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Nhật ký trong kỳ"
          value={`${totalLogs}`}
          sub="Tổng số dòng ghi nhận từ đầu kỳ đến nay"
          icon={<CalendarDays className="h-4 w-4 text-sky-600" />}
        />
        <SummaryCard
          title="Ghi nhận khẩu phần"
          value={`${feedingCount}`}
          sub="Số lần ghi nhận liên quan đến cho ăn & dinh dưỡng"
          icon={<Wheat className="h-4 w-4 text-lime-600" />}
        />
        <SummaryCard
          title="Cảnh báo sức khỏe"
          value={`${warningCount}`}
          sub="Nhật ký có trạng thái cần theo dõi thêm"
          icon={<Stethoscope className="h-4 w-4 text-amber-600" />}
        />
        <SummaryCard
          title="Ca nguy cấp"
          value={`${criticalCount}`}
          sub="Cần ưu tiên kiểm tra của bác sĩ thú y"
          icon={<AlertTriangle className="h-4 w-4 text-red-600" />}
        />
      </div>

      {/* TABS LOẠI NHẬT KÝ */}
      <div className="flex flex-wrap items-center gap-2">
        <FilterTabButton
          active={tab === "all"}
          onClick={() => setTab("all")}
          label="Tất cả"
        />
        <FilterTabButton
          active={tab === "feeding"}
          onClick={() => setTab("feeding")}
          label="Cho ăn & dinh dưỡng"
          icon={<Wheat className="h-3.5 w-3.5" />}
        />
        <FilterTabButton
          active={tab === "health"}
          onClick={() => setTab("health")}
          label="Sức khỏe & điều trị"
          icon={<Stethoscope className="h-3.5 w-3.5" />}
        />
        <FilterTabButton
          active={tab === "breeding"}
          onClick={() => setTab("breeding")}
          label="Phối giống & sinh sản"
          icon={<Droplets className="h-3.5 w-3.5" />}
        />
        <FilterTabButton
          active={tab === "environment"}
          onClick={() => setTab("environment")}
          label="Chuồng trại & môi trường"
          icon={<Sparkles className="h-3.5 w-3.5" />}
        />
      </div>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bộ lọc & tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {/* Hàng 1: search + date range */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Input
                placeholder="Tìm theo tên bò, thẻ tai, nội dung, người ghi nhận..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-7 text-xs"
              />
              <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-muted-foreground">
                  Từ ngày
                </span>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-muted-foreground">
                  Đến ngày
                </span>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  setSearch("");
                  setTab("all");
                  setFarmFilter("all");
                  setGroupFilter("all");
                  setStatusFilter("all");
                }}
              >
                Xoá bộ lọc
              </Button>
            </div>
          </div>

          {/* Hàng 2: farm / group / status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Trại / khu chăn nuôi
              </p>
              <Select
                value={farmFilter}
                onValueChange={(v) => setFarmFilter(v as "all" | string)}
              >
                <SelectTrigger className="h-8 w-[190px] text-xs">
                  <SelectValue placeholder="Chọn trại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trại</SelectItem>
                  {farms.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Đàn / nhóm
              </p>
              <Select
                value={groupFilter}
                onValueChange={(v) => setGroupFilter(v as "all" | string)}
              >
                <SelectTrigger className="h-8 w-[190px] text-xs">
                  <SelectValue placeholder="Chọn đàn / nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đàn</SelectItem>
                  {groups.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-muted-foreground">
                Trạng thái
              </p>
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  setStatusFilter(v as "all" | LivestockLog["status"])
                }
              >
                <SelectTrigger className="h-8 w-[170px] text-xs">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="normal">Ổn định</SelectItem>
                  <SelectItem value="warning">Cần theo dõi</SelectItem>
                  <SelectItem value="critical">Nguy cấp</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Info line */}
          <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">
              {filteredLogs.length} dòng nhật ký
            </span>{" "}
            đang hiển thị sau khi áp dụng bộ lọc.
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <MilestoneTimeline filteredLogs={filteredLogs} />
    </div>
  );
}

// ================== SUB COMPONENTS ==================

function SummaryCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

function FilterTabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant={active ? "default" : "ghost"}
      className={
        active
          ? "bg-white text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted/60"
      }
      onClick={onClick}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </Button>
  );
}
