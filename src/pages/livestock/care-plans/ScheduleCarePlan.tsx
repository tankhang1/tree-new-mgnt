"use client";

import { useMemo, useState } from "react";
import {
  Baby,
  CalendarClock,
  CalendarRange,
  CheckCircle2,
  Filter,
  HeartPulse,
  Plus,
  Search,
  User2,
  AlertCircle,
  Timer,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { useNavigate } from "react-router";

type BreedingStatus = "scheduled" | "pregnant" | "failed" | "waiting-check";

type BreedingRecord = {
  id: string;
  cowTag: string;
  cowName: string;
  group: string;
  barn: string;
  breed: string;
  parity: number;
  heatDate: string;
  breedingDate: string;
  semenCode: string;
  bullName: string;
  round: number;
  technician: string;
  expectedCheckDate: string;
  status: BreedingStatus;
  note?: string;
};

const records: BreedingRecord[] = [
  {
    id: "1",
    cowTag: "HF-001",
    cowName: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    barn: "Chuồng 1",
    breed: "Holstein Friesian",
    parity: 1,
    heatDate: "2025-11-01",
    breedingDate: "2025-11-02",
    semenCode: "HF-BULL-001",
    bullName: "Đực giống HF 01",
    round: 1,
    technician: "Nguyễn Văn A",
    expectedCheckDate: "2025-11-23",
    status: "waiting-check",
    note: "Phối lần 1 sau cai sữa bê con",
  },
  {
    id: "2",
    cowTag: "HF-012",
    cowName: "Bò cái HF 012",
    group: "Đàn bò sữa A2",
    barn: "Chuồng 2",
    breed: "Holstein Friesian",
    parity: 2,
    heatDate: "2025-10-10",
    breedingDate: "2025-10-11",
    semenCode: "HF-BULL-002",
    bullName: "Đực giống HF 02",
    round: 2,
    technician: "Trần Thị B",
    expectedCheckDate: "2025-11-01",
    status: "pregnant",
    note: "Siêu âm 35 ngày, đã đậu thai",
  },
  {
    id: "3",
    cowTag: "HB-078",
    cowName: "Bò cái hậu bị 078",
    group: "Đàn bò hậu bị",
    barn: "Chuồng 3",
    breed: "HF × Sind",
    parity: 0,
    heatDate: "2025-10-15",
    breedingDate: "2025-10-16",
    semenCode: "SIND-B01",
    bullName: "Đực Sind 01",
    round: 1,
    technician: "Nguyễn Văn A",
    expectedCheckDate: "2025-11-06",
    status: "failed",
    note: "Không thấy thai, chuẩn bị lên giống lại",
  },
  {
    id: "4",
    cowTag: "MT-045",
    cowName: "Bò thịt lai Sind 045",
    group: "Đàn bò thịt B1",
    barn: "Chuồng 4",
    breed: "Lai Sind",
    parity: 0,
    heatDate: "2025-11-04",
    breedingDate: "2025-11-04",
    semenCode: "LIM-B01",
    bullName: "Đực giống Limousin 01",
    round: 1,
    technician: "Lê Văn C",
    expectedCheckDate: "2025-11-25",
    status: "scheduled",
    note: "Phối mục tiêu bò thịt chất lượng cao",
  },
  {
    id: "5",
    cowTag: "HF-020",
    cowName: "Bò cái HF 020",
    group: "Đàn bò sữa A1",
    barn: "Chuồng 1",
    breed: "Holstein Friesian",
    parity: 3,
    heatDate: "2025-10-05",
    breedingDate: "2025-10-06",
    semenCode: "HF-BULL-003",
    bullName: "Đực giống HF 03",
    round: 3,
    technician: "Trần Thị B",
    expectedCheckDate: "2025-10-27",
    status: "pregnant",
    note: "Bò sữa cao sản, cần theo dõi đặc biệt khẩu phần",
  },
];
const breedingColumns: ColumnDef<BreedingRecord>[] = [
  {
    accessorKey: "cowName",
    header: "Bò cái",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{r.cowName}</span>
          <span className="text-[11px] text-muted-foreground">
            Thẻ tai: {r.cowTag} • Giống: {r.breed} • Lứa đẻ: {r.parity}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "barn",
    header: "Chuồng / đàn",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium">{r.barn}</span>
          <span className="text-[11px] text-muted-foreground">{r.group}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "heatDate",
    header: "Ngày động dục",
    cell: ({ row }) => {
      const value = row.original.heatDate;
      return (
        <span className="text-xs">
          {new Date(value).toLocaleDateString("vi-VN")}
        </span>
      );
    },
  },
  {
    accessorKey: "breedingDate",
    header: "Ngày phối",
    cell: ({ row }) => {
      const value = row.original.breedingDate;
      return (
        <span className="text-xs">
          {new Date(value).toLocaleDateString("vi-VN")}
        </span>
      );
    },
  },
  {
    accessorKey: "semenCode",
    header: "Tinh / đực giống",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium">{r.bullName}</span>
          <span className="text-[11px] text-muted-foreground">
            Mã tinh: {r.semenCode}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "round",
    header: "Lần phối",
    cell: ({ row }) => (
      <span className="text-xs text-center block">{row.original.round}</span>
    ),
  },
  {
    accessorKey: "technician",
    header: "Người thực hiện",
    cell: ({ row }) => (
      <div className="inline-flex items-center gap-1 text-xs">
        <User2 className="h-3 w-3 text-muted-foreground" />
        <span>{row.original.technician}</span>
      </div>
    ),
  },
  {
    accessorKey: "expectedCheckDate",
    header: "Dự kiến khám thai",
    cell: ({ row }) => {
      const value = row.original.expectedCheckDate;
      return (
        <span className="text-xs">
          {new Date(value).toLocaleDateString("vi-VN")}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => renderStatusBadge(row.original.status),
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-[220px] text-[11px] text-muted-foreground">
        {row.original.note || "-"}
      </span>
    ),
  },
];

export default function ScheduleCarePlansPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [barnFilter, setBarnFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<BreedingStatus | "all">(
    "all"
  );
  const [range, setRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        r.cowTag.toLowerCase().includes(q) ||
        r.cowName.toLowerCase().includes(q) ||
        r.group.toLowerCase().includes(q) ||
        r.bullName.toLowerCase().includes(q);

      const matchesBarn =
        barnFilter === "all" || r.barn.toLowerCase() === barnFilter;
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;

      // range filter – ví dụ đơn giản chỉ demo (chưa tính theo ngày thật)
      const matchesRange = (() => {
        if (range === "all") return true;
        // Trong thực tế bạn dùng dayjs/date-fns để lọc theo breedingDate
        return true;
      })();

      return matchesSearch && matchesBarn && matchesStatus && matchesRange;
    });
  }, [search, barnFilter, statusFilter, range]);

  const totalBreeding = records.length;
  const pregnantCount = records.filter((r) => r.status === "pregnant").length;
  const waitingCheckCount = records.filter(
    (r) => r.status === "waiting-check"
  ).length;
  const riskCount = records.filter(
    (r) => r.status === "failed" || r.round >= 3
  ).length;
  const pregnantRate =
    totalBreeding > 0 ? Math.round((pregnantCount / totalBreeding) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">Lịch phối giống toàn bộ đàn</h1>
          <p className="text-xs text-muted-foreground">
            Theo dõi lịch phối giống, tình trạng đậu thai và các mốc cần khám
            thai cho đàn bò sữa & bò thịt.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <CalendarClock className="mr-1 h-4 w-4" />
            Lịch theo ngày
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={() => navigate("/main/livestock/plans/schedule/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm phiếu phối giống
          </Button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Lần phối trong kỳ"
          value={totalBreeding.toString()}
          sub="Tổng số lượt phối giống đã ghi nhận"
          icon={<Timer className="h-5 w-5 text-emerald-600" />}
        />
        <SummaryCard
          title="Tỷ lệ đậu thai"
          value={`${pregnantRate}%`}
          sub={`${pregnantCount} con đã xác nhận có thai`}
          icon={<Baby className="h-5 w-5 text-sky-600" />}
        />
        <SummaryCard
          title="Cần khám thai"
          value={waitingCheckCount.toString()}
          sub="Đã đến hoặc sắp đến lịch khám thai"
          icon={<CalendarRange className="h-5 w-5 text-amber-500" />}
        />
        <SummaryCard
          title="Ca nguy cơ / phối nhiều lần"
          value={riskCount.toString()}
          sub="Cần theo dõi kỹ sức khỏe sinh sản"
          icon={<HeartPulse className="h-5 w-5 text-red-500" />}
        />
      </div>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Tìm kiếm & lọc lịch phối giống
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Lọc theo bò cái, chuồng, trạng thái và khoảng ngày phối giống.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* search row */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-[260px] flex-1">
              <Input
                placeholder="Nhập mã thẻ tai, tên bò, đàn, hoặc tên đực giống..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start md:self-auto"
              onClick={() => {
                setSearch("");
                setBarnFilter("all");
                setStatusFilter("all");
                setRange("30d");
              }}
            >
              <Filter className="mr-1 h-4 w-4" />
              Làm mới bộ lọc
            </Button>
          </div>

          {/* filter row */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Barn */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Chuồng / khu nuôi
              </p>
              <Select value={barnFilter} onValueChange={setBarnFilter}>
                <SelectTrigger className="h-9 w-[160px]">
                  <SelectValue placeholder="Chọn chuồng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="chuồng 1">Chuồng 1</SelectItem>
                  <SelectItem value="chuồng 2">Chuồng 2</SelectItem>
                  <SelectItem value="chuồng 3">Chuồng 3</SelectItem>
                  <SelectItem value="chuồng 4">Chuồng 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* status */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Trạng thái sinh sản
              </p>
              <Select
                value={statusFilter}
                onValueChange={(v: BreedingStatus | "all") =>
                  setStatusFilter(v)
                }
              >
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="scheduled">
                    Đã phối (chờ kết quả)
                  </SelectItem>
                  <SelectItem value="waiting-check">Chờ khám thai</SelectItem>
                  <SelectItem value="pregnant">Đậu thai</SelectItem>
                  <SelectItem value="failed">Không đậu / phối lại</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* range */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                Khoảng ngày phối
              </p>
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="h-9 w-[180px]">
                  <SelectValue placeholder="Khoảng ngày" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 ngày gần nhất</SelectItem>
                  <SelectItem value="30d">30 ngày gần nhất</SelectItem>
                  <SelectItem value="90d">90 ngày gần nhất</SelectItem>
                  <SelectItem value="all">Toàn bộ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden lg:flex flex-1 justify-end">
              <div className="rounded-md border border-dashed border-muted-foreground/30 bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {filteredRecords.length} lịch phối giống
                </span>{" "}
                đang hiển thị sau khi áp dụng bộ lọc.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách lịch phối giống chi tiết
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={breedingColumns}
            data={filteredRecords}
            filterColumn="cowName" // hoặc "cowTag" tùy bạn muốn search theo gì
          />
        </CardContent>
      </Card>
    </div>
  );
}

function renderStatusBadge(status: BreedingStatus) {
  if (status === "pregnant") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 flex items-center gap-1 text-[10px]">
        <CheckCircle2 className="h-3 w-3" />
        Đậu thai
      </Badge>
    );
  }
  if (status === "waiting-check") {
    return (
      <Badge className="bg-amber-100 text-amber-700 border-amber-200 flex items-center gap-1 text-[10px]">
        <CalendarClock className="h-3 w-3" />
        Chờ khám thai
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1 text-[10px]">
        <AlertCircle className="h-3 w-3" />
        Không đậu / phối lại
      </Badge>
    );
  }
  return (
    <Badge className="bg-sky-100 text-sky-700 border-sky-200 flex items-center gap-1 text-[10px]">
      <HeartPulse className="h-3 w-3" />
      Đã phối – theo dõi
    </Badge>
  );
}

function SummaryCard({
  title,
  value,
  sub,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-1">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
