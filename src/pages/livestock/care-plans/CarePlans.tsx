"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  Crown,
  FileDown,
  Filter,
  HeartHandshake,
  Plus,
  Search,
  Timer,
  User2,
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/data-table";
import { type ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";

type PlanStatus = "draft" | "running" | "done" | "risk";

type BreedingPlan = {
  id: string;
  animalId: string;
  animalName: string;
  group: string; // đàn / chuồng / lô
  purpose: string;
  planType: "nuoi-thit" | "nuoi-sua" | "phoi-giong";
  startDate: string;
  endDate: string;
  expectedOffspring?: number;
  status: PlanStatus;
  vet: string;
  note?: string;
};

type UpcomingMating = {
  id: string;
  date: string;
  femaleId: string;
  femaleName: string;
  maleId: string;
  maleName: string;
  method: "tinh-tuoi" | "phoi-truc-tiep";
  location: string;
  risk?: string;
};

// ====== SAMPLE DATA ======

const breedingPlans: BreedingPlan[] = [
  {
    id: "BP-001",
    animalId: "B001",
    animalName: "Bò cái HF 01",
    group: "Đàn bò sữa A1",
    purpose: "Chu kỳ phối giống lần 2",
    planType: "phoi-giong",
    startDate: "2025-08-01",
    endDate: "2025-11-15",
    expectedOffspring: 1,
    status: "running",
    vet: "Bs. Trần Thị Mai",
    note: "Theo dõi động dục 21 ngày/lần, ưu tiên tinh HF cao sản.",
  },
  {
    id: "BP-002",
    animalId: "B045",
    animalName: "Bò cái lai Sind 45",
    group: "Đàn bò thịt B2",
    purpose: "Vỗ béo xuất bán",
    planType: "nuoi-thit",
    startDate: "2025-07-10",
    endDate: "2025-12-20",
    status: "running",
    vet: "Ks. Nguyễn Văn Tý",
    note: "Tăng cường khẩu phần tinh bột 10–15%.",
  },
  {
    id: "BP-003",
    animalId: "B012",
    animalName: "Bò cái HF 12",
    group: "Đàn bò sữa A2",
    purpose: "Chu kỳ mang thai tháng 7–9",
    planType: "nuoi-sua",
    startDate: "2025-05-01",
    endDate: "2025-12-01",
    expectedOffspring: 1,
    status: "done",
    vet: "Bs. Lê Minh Khôi",
    note: "Dự kiến bê con đạt 35–40kg.",
  },
  {
    id: "BP-004",
    animalId: "B078",
    animalName: "Bò cái HF 78",
    group: "Đàn bò hậu bị",
    purpose: "Chuẩn bị phối giống lần đầu",
    planType: "phoi-giong",
    startDate: "2025-09-01",
    endDate: "2026-01-30",
    expectedOffspring: 1,
    status: "risk",
    vet: "Bs. Trần Thị Mai",
    note: "Thể trạng hơi gầy, cần bổ sung khoáng & vitamin.",
  },
];

const upcomingMatings: UpcomingMating[] = [
  {
    id: "M-001",
    date: "2025-08-09 07:30",
    femaleId: "B001",
    femaleName: "Bò cái HF 01",
    maleId: "T-HF-01",
    maleName: "Tinh HF cao sản 01",
    method: "tinh-tuoi",
    location: "Chuồng bò sữa A1",
  },
  {
    id: "M-002",
    date: "2025-08-10 09:00",
    femaleId: "B078",
    femaleName: "Bò cái HF 78",
    maleId: "T-HF-02",
    maleName: "Tinh HF cao sản 02",
    method: "tinh-tuoi",
    location: "Khu phối giống 02",
    risk: "Thể trạng hơi gầy, cân nhắc dời lịch nếu chưa đạt BCS.",
  },
  {
    id: "M-003",
    date: "2025-08-12 16:00",
    femaleId: "B045",
    femaleName: "Bò cái lai Sind 45",
    maleId: "B-Đực-03",
    maleName: "Bò đực Sind 03",
    method: "phoi-truc-tiep",
    location: "Chuồng phối B2",
  },
];

// ====== COLUMNS ======

const planColumns: ColumnDef<BreedingPlan>[] = [
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
  },
  {
    accessorKey: "id",
    header: "Mã kế hoạch",
  },
  {
    accessorKey: "animalName",
    header: "Con vật",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.original.animalName}</span>
        <span className="text-[11px] text-muted-foreground">
          Mã: {row.original.animalId}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "group",
    header: "Đàn / chuồng",
  },
  {
    accessorKey: "planType",
    header: "Loại kế hoạch",
    cell: ({ row }) => {
      const type = row.original.planType;
      if (type === "phoi-giong") {
        return (
          <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">
            Phối giống
          </Badge>
        );
      }
      if (type === "nuoi-sua") {
        return (
          <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">
            Nuôi bò sữa
          </Badge>
        );
      }
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          Nuôi bò thịt
        </Badge>
      );
    },
  },
  {
    accessorKey: "purpose",
    header: "Mục đích",
  },
  {
    accessorKey: "startDate",
    header: "Bắt đầu",
    cell: ({ row }) => (
      <span>
        {new Date(row.original.startDate).toLocaleDateString("vi-VN")}
      </span>
    ),
  },
  {
    accessorKey: "endDate",
    header: "Kết thúc (dự kiến)",
    cell: ({ row }) => (
      <span>{new Date(row.original.endDate).toLocaleDateString("vi-VN")}</span>
    ),
  },
  {
    accessorKey: "expectedOffspring",
    header: "Số con dự kiến",
    cell: ({ row }) =>
      row.original.expectedOffspring ? (
        <span>{row.original.expectedOffspring}</span>
      ) : (
        <span className="text-xs text-muted-foreground">-</span>
      ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === "draft") {
        return (
          <Badge variant="outline" className="text-xs">
            Nháp
          </Badge>
        );
      }
      if (status === "running") {
        return (
          <Badge className="bg-emerald-100 text-emerald-700 text-xs">
            Đang thực hiện
          </Badge>
        );
      }
      if (status === "done") {
        return (
          <Badge className="bg-blue-100 text-blue-700 text-xs">
            Hoàn thành
          </Badge>
        );
      }
      if (status === "risk") {
        return (
          <Badge className="bg-amber-100 text-amber-700 text-xs">
            Cần lưu ý
          </Badge>
        );
      }
      return null;
    },
  },
  {
    accessorKey: "vet",
    header: "Cán bộ phụ trách",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <User2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm">{row.original.vet}</span>
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: "Ghi chú",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground line-clamp-2">
        {row.original.note || "-"}
      </span>
    ),
  },
];

export default function CarePlansPage() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<PlanStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "nuoi-thit" | "nuoi-sua" | "phoi-giong"
  >("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredPlans = useMemo(
    () =>
      breedingPlans.filter((p) => {
        if (
          search &&
          !`${p.animalName} ${p.animalId} ${p.group} ${p.purpose}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        if (statusFilter !== "all" && p.status !== statusFilter) return false;
        if (typeFilter !== "all" && p.planType !== typeFilter) return false;
        if (groupFilter !== "all" && p.group !== groupFilter) return false;
        return true;
      }),
    [statusFilter, typeFilter, groupFilter, search]
  );

  const totalPlans = breedingPlans.length;
  const running = breedingPlans.filter((p) => p.status === "running").length;
  const matingPlans = breedingPlans.filter(
    (p) => p.planType === "phoi-giong"
  ).length;
  const riskPlans = breedingPlans.filter((p) => p.status === "risk").length;

  const groups = Array.from(new Set(breedingPlans.map((p) => p.group)));

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div>
          <h1 className="text-lg font-semibold">
            Kế hoạch chăn nuôi & phối giống
          </h1>
          <p className="text-xs text-muted-foreground">
            Lập kế hoạch cho đàn bò sữa / bò thịt và quản lý lịch phối giống,
            sinh sản.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-1 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={() => navigate("/main/livestock/plans/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm kế hoạch
          </Button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tổng số kế hoạch"
          value={totalPlans.toString()}
          sub="Tất cả kế hoạch chăn nuôi & phối giống"
          icon={<Activity className="h-5 w-5 text-sky-600" />}
          color="text-sky-700"
        />
        <SummaryCard
          title="Kế hoạch đang thực hiện"
          value={running.toString()}
          sub="Đang trong thời gian theo dõi"
          icon={<Timer className="h-5 w-5 text-emerald-600" />}
          color="text-emerald-700"
        />
        <SummaryCard
          title="Kế hoạch phối giống"
          value={matingPlans.toString()}
          sub="Chu kỳ phối giống & mang thai"
          icon={<HeartHandshake className="h-5 w-5 text-pink-600" />}
          color="text-pink-700"
        />
        <SummaryCard
          title="Kế hoạch cần lưu ý"
          value={riskPlans.toString()}
          sub="Thể trạng yếu, rủi ro sức khỏe"
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
          color="text-amber-700"
        />
      </div>

      {/* MAIN AREA: FILTERS + TABLE + SIDEBAR */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(280px,0.9fr)]">
        <div className="flex flex-col gap-4">
          {/* FILTER BAR */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Tìm kiếm & lọc kế hoạch
                  </CardTitle>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Lọc theo đàn, loại kế hoạch, trạng thái và từ khóa.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative flex-1 min-w-[220px]">
                  <Input
                    placeholder="Tìm theo con vật, mã số, đàn / chuồng..."
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
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                    setGroupFilter("all");
                  }}
                >
                  <Filter className="mr-1 h-4 w-4" />
                  Làm mới bộ lọc
                </Button>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Đàn / chuồng
                  </p>
                  <Select
                    value={groupFilter}
                    onValueChange={(v) => setGroupFilter(v)}
                  >
                    <SelectTrigger className="h-9 w-[190px]">
                      <SelectValue placeholder="Chọn đàn / chuồng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {groups.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Loại kế hoạch
                  </p>
                  <Select
                    value={typeFilter}
                    onValueChange={(
                      v: "all" | "nuoi-thit" | "nuoi-sua" | "phoi-giong"
                    ) => setTypeFilter(v)}
                  >
                    <SelectTrigger className="h-9 w-[180px]">
                      <SelectValue placeholder="Chọn loại kế hoạch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="phoi-giong">Phối giống</SelectItem>
                      <SelectItem value="nuoi-sua">Nuôi bò sữa</SelectItem>
                      <SelectItem value="nuoi-thit">Nuôi bò thịt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Trạng thái
                  </p>
                  <Select
                    value={statusFilter}
                    onValueChange={(v: PlanStatus | "all") =>
                      setStatusFilter(v)
                    }
                  >
                    <SelectTrigger className="h-9 w-[160px]">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="draft">Nháp</SelectItem>
                      <SelectItem value="running">Đang thực hiện</SelectItem>
                      <SelectItem value="done">Hoàn thành</SelectItem>
                      <SelectItem value="risk">Cần lưu ý</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TABLE */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Danh sách kế hoạch chăn nuôi & phối giống
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={planColumns}
                data={filteredPlans}
                filterColumn="animalName"
              />
            </CardContent>
          </Card>
        </div>

        {/* SIDEBAR – UPCOMING MATINGS */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
              <span>Lịch phối giống sắp tới</span>
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {upcomingMatings.map((m) => (
              <div
                key={m.id}
                className="rounded-lg border bg-muted/30 p-3 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-primary">
                    {new Date(m.date).toLocaleString("vi-VN")}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-[10px]"
                  >
                    {m.method === "tinh-tuoi"
                      ? "Thụ tinh nhân tạo"
                      : "Phối trực tiếp"}
                  </Badge>
                </div>
                <p className="text-[13px] font-semibold">
                  {m.femaleName}{" "}
                  <span className="text-[11px] text-muted-foreground">
                    (cái – {m.femaleId})
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Đực / tinh:{" "}
                  <span className="font-medium">
                    {m.maleName} ({m.maleId})
                  </span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Vị trí: <span className="font-medium">{m.location}</span>
                </p>
                {m.risk && (
                  <p className="mt-1 flex items-start gap-1 text-[11px] text-amber-700">
                    <AlertTriangle className="mt-[1px] h-3 w-3" />
                    <span>{m.risk}</span>
                  </p>
                )}
              </div>
            ))}

            <Button
              onClick={() => navigate("/main/livestock/plans/schedule")}
              variant="outline"
              size="sm"
              className="mt-1 w-full justify-center"
            >
              Xem toàn bộ lịch phối giống
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
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
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
