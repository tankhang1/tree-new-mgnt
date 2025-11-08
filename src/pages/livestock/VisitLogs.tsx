"use client";

import { useMemo, useState } from "react";
import {
  PawPrint,
  FilePlus2,
  FileDown,
  CalendarDays,
  Beef,
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
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import MilestoneTimeline from "./MilestoneTimeline";

// ================== TYPES & MOCK DATA ==================

type LogType = string;

export type LivestockLog = {
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
      "Ăn khẩu phần cỏ tươi + cám hỗn hợp, lượng ăn 95% khẩu phần, uống nước bình thường.",
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
];

// ================== UTILS ==================

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

function getStatusBadgeColor(status: LivestockLog["status"]) {
  switch (status) {
    case "normal":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "warning":
      return "bg-amber-50 text-amber-700 border-amber-100";
    case "critical":
      return "bg-red-50 text-red-700 border-red-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
}

function getLogTypeLabel(t: LogType) {
  switch (t) {
    case "feeding":
      return "Cho ăn & dinh dưỡng";
    case "health":
      return "Sức khỏe & điều trị";
    case "breeding":
      return "Phối giống & sinh sản";
    case "environment":
      return "Chuồng trại & môi trường";
    case "other":
      return "Khác";
  }
}

function getLogTypeIcon(t: LogType) {
  switch (t) {
    case "feeding":
      return <Wheat className="h-3.5 w-3.5 text-lime-600" />;
    case "health":
      return <Stethoscope className="h-3.5 w-3.5 text-rose-600" />;
    case "breeding":
      return <Droplets className="h-3.5 w-3.5 text-sky-600" />;
    case "environment":
      return <Sparkles className="h-3.5 w-3.5 text-amber-600" />;
    case "other":
      return <PawPrint className="h-3.5 w-3.5 text-slate-500" />;
  }
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

  const columns: ColumnDef<LivestockLog>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Chọn dòng"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 30,
    },
    {
      accessorKey: "date",
      header: "Ngày / giờ",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-xs font-medium">
              {formatDate(d.date)} • {d.time}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Trại: {d.farm}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "animalTag",
      header: "Đối tượng",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex items-start gap-2">
            <div className="mt-[2px] flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-semibold text-emerald-700">
              <Beef className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{d.animalName}</span>
              <span className="text-[11px] text-muted-foreground">
                Thẻ tai: {d.animalTag} • {d.group}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "logType",
      header: "Loại nhật ký",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <Badge
            variant="outline"
            className="flex items-center gap-1 border-emerald-100 bg-emerald-50 text-[10px] text-emerald-700"
          >
            {getLogTypeIcon(d.logType)}
            {getLogTypeLabel(d.logType)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Nội dung chính",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-xs font-medium">{d.title}</span>
            <span className="line-clamp-2 text-[11px] text-muted-foreground">
              {d.detail}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "recorder",
      header: "Người ghi nhận",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <div className="flex flex-col">
            <span className="text-xs font-medium">{d.recorder}</span>
            <span className="text-[11px] text-muted-foreground">
              Ghi nhận tại {formatDate(d.date)} {d.time}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const d = row.original;
        return (
          <Badge
            variant="outline"
            className={`flex items-center gap-1 border ${getStatusBadgeColor(
              d.status
            )}`}
          >
            {d.status === "normal" && "Ổn định"}
            {d.status === "warning" && (
              <>
                <AlertTriangle className="h-3 w-3" />
                Cần theo dõi
              </>
            )}
            {d.status === "critical" && (
              <>
                <AlertTriangle className="h-3 w-3" />
                Nguy cấp
              </>
            )}
          </Badge>
        );
      },
    },
  ];

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
