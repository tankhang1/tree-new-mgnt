"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Beef,
  Filter,
  HeartPulse,
  Plus,
  Search,
  ThermometerSun,
  Weight,
  User2,
} from "lucide-react";

import { useNavigate } from "react-router";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import { QuickTemplateDialog } from "./QuickTemplateDialog";
import { AddDailyRecordDialog } from "./AddDailyRecordCard";
import { animals } from "@/pages/data/animals";

type HealthStatus = "tot" | "can-theo-doi" | "can-kham" | "cach-ly";

type DailyRecord = {
  id: string;
  date: string; // yyyy-mm-dd
  animalName: string;
  tag: string;
  group: string;
  breed: string;
  weightKg: number;
  weightChangeKg: number; // so với hôm trước
  temperature: number; // °C
  feedIntakeKg: number;
  milkYieldKg?: number;
  healthScore: number; // 1–5
  status: HealthStatus;
  symptoms?: string;
  note?: string;
};

const mockRecords: DailyRecord[] = [
  {
    id: "r1",
    date: "2025-08-08",
    animalName: "Bò cái HF 001",
    tag: "HF-001",
    group: "Đàn bò sữa A1",
    breed: "Holstein Friesian",
    weightKg: 550,
    weightChangeKg: 0.8,
    temperature: 38.6,
    feedIntakeKg: 24,
    milkYieldKg: 28,
    healthScore: 5,
    status: "tot",
    note: "Ăn uống bình thường, phân đẹp.",
  },
  {
    id: "r2",
    date: "2025-08-08",
    animalName: "Bò cái HF 012",
    tag: "HF-012",
    group: "Đàn bò sữa A2",
    breed: "Holstein Friesian",
    weightKg: 570,
    weightChangeKg: 0.4,
    temperature: 39.2,
    feedIntakeKg: 22,
    milkYieldKg: 25,
    healthScore: 3,
    status: "can-theo-doi",
    symptoms: "Ăn chậm hơn bình thường, nhiệt hơi cao.",
    note: "Đề nghị theo dõi thêm 1–2 ngày.",
  },
  {
    id: "r3",
    date: "2025-08-08",
    animalName: "Bò cái hậu bị 078",
    tag: "HB-078",
    group: "Đàn bò hậu bị",
    breed: "HF × Sind",
    weightKg: 380,
    weightChangeKg: 0.9,
    temperature: 38.5,
    feedIntakeKg: 16,
    healthScore: 4,
    status: "tot",
  },
  {
    id: "r4",
    date: "2025-08-08",
    animalName: "Bò thịt lai Sind 045",
    tag: "MT-045",
    group: "Đàn bò thịt B1",
    breed: "Lai Sind",
    weightKg: 420,
    weightChangeKg: -0.3,
    temperature: 39.8,
    feedIntakeKg: 10,
    healthScore: 2,
    status: "can-kham",
    symptoms: "Sốt, giảm ăn rõ, thở nhanh.",
    note: "Cần bác sĩ thú y kiểm tra trong ngày.",
  },
];

function renderHealthStatusBadge(status: HealthStatus) {
  switch (status) {
    case "tot":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">
          Sức khoẻ tốt
        </Badge>
      );
    case "can-theo-doi":
      return (
        <Badge className="bg-amber-100 text-amber-700 text-[10px]">
          Cần theo dõi thêm
        </Badge>
      );
    case "can-kham":
      return (
        <Badge className="bg-red-100 text-red-700 text-[10px]">
          Cần khám / xử lý
        </Badge>
      );
    case "cach-ly":
      return (
        <Badge className="bg-slate-100 text-slate-700 text-[10px]">
          Đang cách ly
        </Badge>
      );
    default:
      return null;
  }
}

function SummaryCard({
  title,
  value,
  sub,
  icon,
  color,
}: {
  title: string;
  value: string;
  sub: string;
  icon?: React.ReactNode;
  color?: string;
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
        <div className={`text-2xl font-bold ${color ?? ""}`}>{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}

export default function HealthPage() {
  const navigate = useNavigate();

  const [date, setDate] = useState<string>("2025-08-08");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<HealthStatus | "all">("all");
  const [search, setSearch] = useState<string>("");

  const recordsForDay = useMemo(
    () => mockRecords.filter((r) => r.date === date),
    [date]
  );

  const filteredRecords = useMemo(
    () =>
      recordsForDay.filter((r) => {
        if (
          groupFilter !== "all" &&
          r.group.toLowerCase() !== groupFilter.toLowerCase()
        )
          return false;
        if (statusFilter !== "all" && r.status !== statusFilter) return false;
        if (!search.trim()) return true;
        const s = search.toLowerCase();
        return (
          r.animalName.toLowerCase().includes(s) ||
          r.tag.toLowerCase().includes(s) ||
          r.group.toLowerCase().includes(s)
        );
      }),
    [recordsForDay, groupFilter, statusFilter, search]
  );

  const summary = useMemo(() => {
    if (!recordsForDay.length) {
      return {
        total: 0,
        avgGain: 0,
        alerts: 0,
        needCheck: 0,
      };
    }
    const total = recordsForDay.length;
    const avgGain =
      recordsForDay.reduce((sum, r) => sum + r.weightChangeKg, 0) / total;
    const alerts = recordsForDay.filter(
      (r) => r.status === "can-kham" || r.status === "cach-ly"
    ).length;
    const needCheck = recordsForDay.filter(
      (r) => r.status === "can-theo-doi"
    ).length;
    return { total, avgGain, alerts, needCheck };
  }, [recordsForDay]);

  // Phân tích chi tiết theo đàn & trạng thái
  const statsByGroup = useMemo(() => {
    const map: Record<
      string,
      { count: number; avgWeight: number; avgGain: number }
    > = {};
    recordsForDay.forEach((r) => {
      if (!map[r.group]) {
        map[r.group] = { count: 0, avgWeight: 0, avgGain: 0 };
      }
      const g = map[r.group];
      g.count += 1;
      g.avgWeight += r.weightKg;
      g.avgGain += r.weightChangeKg;
    });
    return Object.entries(map).map(([group, v]) => ({
      group,
      count: v.count,
      avgWeight: v.count ? v.avgWeight / v.count : 0,
      avgGain: v.count ? v.avgGain / v.count : 0,
    }));
  }, [recordsForDay]);

  const statsByStatus = useMemo(() => {
    const map: Record<HealthStatus, number> = {
      tot: 0,
      "can-theo-doi": 0,
      "can-kham": 0,
      "cach-ly": 0,
    };
    recordsForDay.forEach((r) => {
      map[r.status] += 1;
    });
    return map;
  }, [recordsForDay]);

  // COLUMNS cho DataTable
  const columns: ColumnDef<DailyRecord>[] = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      },
      {
        accessorKey: "animalName",
        header: "Con vật",
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{r.animalName}</span>
              <span className="text-[11px] text-muted-foreground">
                Thẻ tai: {r.tag} • Đàn: {r.group}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "group",
        header: "Đàn / giống",
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex flex-col">
              <span className="text-xs font-medium">{r.breed}</span>
              <span className="text-[11px] text-muted-foreground">
                {r.group}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "weightKg",
        header: () => (
          <div className="flex items-center justify-end gap-1">
            <Weight className="h-3 w-3 text-muted-foreground" />
            <span>Trọng lượng (kg)</span>
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.weightKg.toLocaleString("vi-VN", {
              maximumFractionDigits: 1,
            })}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "weightChangeKg",
        header: "Tăng/giảm (kg)",
        cell: ({ row }) => {
          const v = row.original.weightChangeKg;
          return (
            <div
              className={`text-right ${
                v >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {v >= 0 ? "+" : ""}
              {v.toFixed(2)}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "temperature",
        header: () => (
          <div className="flex items-center justify-end gap-1">
            <ThermometerSun className="h-3 w-3 text-muted-foreground" />
            <span>Nhiệt độ (°C)</span>
          </div>
        ),
        cell: ({ row }) => {
          const t = row.original.temperature;
          const high = t > 39.5;
          return (
            <div
              className={`text-right ${high ? "text-red-600 font-medium" : ""}`}
            >
              {t.toFixed(1)}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "feedIntakeKg",
        header: "Ăn vào (kg)",
        cell: ({ row }) => (
          <div className="text-right">
            {row.original.feedIntakeKg.toFixed(1)}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "milkYieldKg",
        header: "Sữa (kg)",
        cell: ({ row }) => {
          const v = row.original.milkYieldKg;
          return (
            <div className="text-right">{v != null ? v.toFixed(1) : "-"}</div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "healthScore",
        header: "Điểm sức khoẻ",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
              {row.original.healthScore}
            </span>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => (
          <div className="text-center">
            {renderHealthStatusBadge(row.original.status)}
          </div>
        ),
      },
      {
        accessorKey: "note",
        header: "Ghi chú / triệu chứng",
        cell: ({ row }) => {
          const r = row.original;
          return (
            <div className="flex flex-col gap-1 text-[11px]">
              {r.symptoms && <span className="text-red-600">{r.symptoms}</span>}
              {r.note && (
                <span className="text-muted-foreground">{r.note}</span>
              )}
              {!r.symptoms && !r.note && (
                <span className="text-muted-foreground">Không ghi chú</span>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="px-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Theo dõi tăng trưởng & sức khoẻ hằng ngày
            </h1>
            <p className="text-xs text-muted-foreground">
              Ghi nhận trọng lượng, ăn uống, nhiệt độ, sức khoẻ của từng con
              theo từng ngày.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1">
            <span className="text-xs text-muted-foreground">Ngày ghi nhận</span>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-8 w-[140px] px-2 text-xs"
            />
          </div>
          <QuickTemplateDialog
            defaultDate={date}
            onApply={(template) => {
              // TODO: tuỳ bạn xử lý
              // Ví dụ: setRecords cho các con trong đàn với giá trị mặc định
              console.log("Apply quick template: ", template);
            }}
          />
          <AddDailyRecordDialog
            defaultDate={"08/08/2025"}
            animals={animals} // từ const animals bạn đang có
            onAdd={() => {
              // push record vào state DataTable
            }}
          />
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Số con đã ghi nhận"
          value={summary.total.toString()}
          sub="Trong ngày được chọn"
          icon={<Activity className="h-5 w-5 text-emerald-600" />}
          color="text-emerald-600"
        />
        <SummaryCard
          title="Tăng trọng trung bình"
          value={`${summary.avgGain.toFixed(2)} kg/ngày`}
          sub="So với ngày trước đó"
          icon={<Weight className="h-5 w-5 text-sky-600" />}
          color={summary.avgGain >= 0 ? "text-sky-600" : "text-red-600"}
        />
        <SummaryCard
          title="Cần khám / xử lý"
          value={summary.alerts.toString()}
          sub="Sốt cao, bỏ ăn, nghi bệnh"
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          color="text-red-600"
        />
        <SummaryCard
          title="Cần theo dõi thêm"
          value={summary.needCheck.toString()}
          sub="Dấu hiệu bất thường nhẹ"
          icon={<HeartPulse className="h-5 w-5 text-amber-500" />}
          color="text-amber-600"
        />
      </div>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Tìm kiếm & lọc trong ngày
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Lọc theo đàn, trạng thái sức khoẻ, tìm nhanh theo tên hoặc thẻ
                tai.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relativ">
              <p className="text-[11px] font-medium text-muted-foreground">
                Đàn / nhóm
              </p>
              <Input
                placeholder="Nhập tên / thẻ tai / đàn..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Đàn / nhóm
                </p>
                <Select value={groupFilter} onValueChange={setGroupFilter}>
                  <SelectTrigger className="h-9 w-[170px]">
                    <SelectValue placeholder="Chọn đàn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả đàn</SelectItem>
                    <SelectItem value="đàn bò sữa a1">Đàn bò sữa A1</SelectItem>
                    <SelectItem value="đàn bò sữa a2">Đàn bò sữa A2</SelectItem>
                    <SelectItem value="đàn bò hậu bị">Đàn bò hậu bị</SelectItem>
                    <SelectItem value="đàn bò thịt b1">
                      Đàn bò thịt B1
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-medium text-muted-foreground">
                  Trạng thái sức khoẻ
                </p>
                <Select
                  value={statusFilter}
                  onValueChange={(v: HealthStatus | "all") =>
                    setStatusFilter(v)
                  }
                >
                  <SelectTrigger className="h-9 w-[190px]">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="tot">Tốt</SelectItem>
                    <SelectItem value="can-theo-doi">
                      Cần theo dõi thêm
                    </SelectItem>
                    <SelectItem value="can-kham">Cần khám</SelectItem>
                    <SelectItem value="cach-ly">Cách ly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 md:mt-5"
                onClick={() => {
                  setSearch("");
                  setGroupFilter("all");
                  setStatusFilter("all");
                }}
              >
                <Filter className="mr-1 h-4 w-4" />
                Làm mới bộ lọc
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE – DÙNG DATA TABLE */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Nhật ký tăng trưởng & sức khoẻ ngày{" "}
            {new Date(date).toLocaleDateString("vi-VN")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <p className="mb-2 text-[11px] font-semibold text-muted-foreground">
              Theo trạng thái sức khoẻ
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 rounded-md border bg-emerald-50 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                  <Activity className="h-4 w-4 text-emerald-700" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-emerald-700">Sức khoẻ tốt</p>
                  <p className="text-muted-foreground">
                    {statsByStatus.tot} con
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md border bg-amber-50 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                  <HeartPulse className="h-4 w-4 text-amber-700" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-amber-700">Cần theo dõi</p>
                  <p className="text-muted-foreground">
                    {statsByStatus["can-theo-doi"]} con
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md border bg-red-50 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-4 w-4 text-red-700" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-red-700">Cần khám</p>
                  <p className="text-muted-foreground">
                    {statsByStatus["can-kham"]} con
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-md border bg-slate-50 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
                  <User2 className="h-4 w-4 text-slate-700" />
                </div>
                <div className="text-[11px]">
                  <p className="font-semibold text-slate-700">Đang cách ly</p>
                  <p className="text-muted-foreground">
                    {statsByStatus["cach-ly"]} con
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <DataTable
              columns={columns}
              data={filteredRecords}
              // nếu bạn có DataTableToolbar dùng filterColumn, có thể set:
              // filterColumn="animalName"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
