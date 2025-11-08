"use client";

import { useMemo, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Stethoscope,
  FilePlus2,
  Filter,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Archive,
  Activity,
  HeartPulse,
  ThermometerSun,
  Info,
  ListChecks,
  ShieldAlert,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { DataTable } from "@/components/data-table";
import { ProtocolPickerDialog } from "./TreatmentProtocol";
import { useNavigate } from "react-router";

type Severity = "nhẹ" | "trung-binh" | "nang";
type ProtocolStatus = "dang-ap-dung" | "de-xuat" | "tam-dung" | "luu-tru";

type TreatmentStep = {
  id: string;
  name: string;
  medicine: string;
  route: string;
  frequency: string;
  duration: string;
  note?: string;
};

type MonitoringNote = {
  day: string;
  focus: string;
  expected?: string;
};

type TreatmentProtocol = {
  id: string;
  code: string;
  name: string;
  disease: string;
  species: string;
  group: string;
  severity: Severity;
  status: ProtocolStatus;
  durationDays: number;
  withdrawalDays?: number;
  createdBy: string;
  updatedAt: string;
  note?: string;

  // Phần chi tiết hơn
  indications: string[]; // Chỉ định áp dụng
  contraindications: string[]; // Không áp dụng khi
  startCriteria: string[]; // Điều kiện bắt đầu phác đồ
  stopCriteria: string[]; // Điều kiện kết thúc / đổi phác đồ
  escalationSignals: string[]; // Tín hiệu cần báo bác sĩ / chuyển phác đồ
  safetyNotes?: string; // Ghi chú an toàn chung
  followupPlan?: string; // Kế hoạch tái khám / đánh giá lại

  steps: TreatmentStep[];
  monitoring: MonitoringNote[];
};

const protocols: TreatmentProtocol[] = [
  {
    id: "P001",
    code: "PD-HF-VVM-01",
    name: "Phác đồ nghi viêm vú bò sữa",
    disease: "Nghi viêm vú",
    species: "Bò sữa",
    group: "Đàn bò sữa A1",
    severity: "trung-binh",
    status: "dang-ap-dung",
    durationDays: 5,
    withdrawalDays: 3,
    createdBy: "Nguyễn Văn A (Thú y nội bộ)",
    updatedAt: "2025-11-05 09:30",
    note: "Áp dụng cho các trường hợp nghi viêm vú nhẹ đến trung bình, không sốc, không bỏ ăn hoàn toàn.",
    indications: [
      "Bò có dấu hiệu viêm vú nhẹ đến trung bình (bầu vú nóng, sưng nhẹ, đau khi sờ).",
      "Sữa có cặn, lợn cợn, thay đổi màu, nhưng con vật vẫn ăn uống tương đối bình thường.",
      "Không có dấu hiệu toàn thân nặng (sốc, nằm một chỗ, bỏ ăn hoàn toàn).",
    ],
    contraindications: [
      "Bò sốt cao > 40.5°C, nằm nhiều, bỏ ăn.",
      "Có dấu hiệu nhiễm trùng nặng toàn thân hoặc nghi nhiễm khuẩn huyết.",
      "Đang điều trị theo phác đồ khác có thể tương tác thuốc.",
    ],
    startCriteria: [
      "Xác nhận nghi viêm vú qua kiểm tra sữa, bầu vú và thân nhiệt.",
      "Ghi nhận nhật ký: ngày giờ phát hiện, bên vú bị, mức độ.",
      "Tham vấn hoặc nhận phê duyệt từ bác sĩ thú y (nội bộ/ngoài).",
    ],
    stopCriteria: [
      "Sau ít nhất 3–5 ngày, bầu vú giảm sưng, nhiệt độ trở về bình thường.",
      "Sữa trở lại trạng thái gần bình thường, không còn cục lợn cợn rõ.",
      "Không xuất hiện triệu chứng nặng hơn trong quá trình điều trị.",
    ],
    escalationSignals: [
      "Sau 24–48 giờ **không cải thiện** hoặc xấu hơn (sưng tăng, giảm ăn nhiều).",
      "Sốt cao kéo dài > 39.5–40°C.",
      "Xuất hiện dấu hiệu toàn thân: thở nhanh, nằm nhiều, lờ đờ.",
    ],
    safetyNotes:
      "Cần tuân thủ thời gian ngừng sử dụng sữa theo khuyến cáo từng loại thuốc cụ thể. Không trộn lẫn thuốc khi chưa hỏi ý kiến bác sĩ thú y.",
    followupPlan:
      "Đánh giá lại sau 3 ngày. Nếu tái phát nhiều lần ở cùng một bầu vú, cần xem xét loại thải hoặc xử lý triệt để bầu vú đó.",
    steps: [
      {
        id: "s1",
        name: "Xử lý bầu vú",
        medicine:
          "Vệ sinh bầu vú bằng dung dịch sát trùng trước và sau vắt sữa",
        route: "Thoa ngoài",
        frequency: "2 lần/ngày",
        duration: "5 ngày",
        note: "Lau khô sạch, tránh chà xát quá mạnh gây tổn thương da.",
      },
      {
        id: "s2",
        name: "Điều chỉnh khẩu phần",
        medicine: "Giảm nhẹ thức ăn tinh, bổ sung khoáng & vitamin tổng hợp",
        route: "Trộn khẩu phần",
        frequency: "Theo khẩu phần ngày",
        duration: "5–7 ngày",
      },
    ],
    monitoring: [
      {
        day: "Ngày 1–2",
        focus:
          "Theo dõi thân nhiệt, mức độ sưng bầu vú, cảm giác đau khi chạm, lượng sữa giảm bao nhiêu.",
        expected:
          "Nếu sốt cao / sưng nhiều / bỏ ăn → liên hệ bác sĩ thú y để điều chỉnh.",
      },
      {
        day: "Ngày 3–5",
        focus:
          "Theo dõi cải thiện chất lượng sữa, mức độ đau và trạng thái chung.",
        expected:
          "Nếu không cải thiện rõ, cần chuyển sang phác đồ can thiệp sâu hơn theo chỉ định thú y.",
      },
    ],
  },
  {
    id: "P002",
    code: "PD-BT-TC-01",
    name: "Phác đồ hỗ trợ tiêu chảy bê con",
    disease: "Rối loạn tiêu hoá / tiêu chảy nhẹ",
    species: "Bê con",
    group: "Đàn bê hậu bị",
    severity: "nhẹ",
    status: "de-xuat",
    durationDays: 3,
    createdBy: "Trần Thị B (Kỹ thuật trại)",
    updatedAt: "2025-11-04 16:20",
    note: "Chỉ áp dụng cho các trường hợp nhẹ, bê còn bú tốt, đi lại bình thường.",
    indications: [
      "Bê tiêu chảy nhẹ, phân lỏng nhưng không kèm máu.",
      "Bê còn bú sữa, phản xạ bú tốt, vẫn đứng / đi lại bình thường.",
    ],
    contraindications: [
      "Bê mất nước nặng (mắt trũng, da mất đàn hồi rõ).",
      "Có máu trong phân hoặc sốt cao.",
      "Tiêu chảy dai dẳng > 2–3 ngày không giảm.",
    ],
    startCriteria: [
      "Ghi nhận số lần tiêu chảy trong ngày và trạng thái ăn / uống.",
      "Đo nhiệt độ, đánh giá nhanh mức độ mất nước.",
    ],
    stopCriteria: [
      "Số lần tiêu chảy giảm rõ sau 2–3 ngày.",
      "Bê ăn uống tốt, phân trở lại sệt / bình thường.",
    ],
    escalationSignals: [
      "Tiêu chảy không giảm hoặc nặng hơn sau 24–48 giờ.",
      "Bê nằm nhiều, bỏ bú, sốt hoặc hạ thân nhiệt bất thường.",
    ],
    safetyNotes:
      "Luôn ưu tiên bù nước & điện giải. Không tự dùng kháng sinh bừa bãi khi chưa có chỉ định.",
    followupPlan:
      "Ghi nhận cân nặng và tình trạng tiêu hoá trong 1–2 tuần sau đợt tiêu chảy.",
    steps: [
      {
        id: "s1",
        name: "Bù nước & điện giải",
        medicine: "Dung dịch điện giải uống (theo hướng dẫn nhà sản xuất)",
        route: "Uống",
        frequency: "2–3 lần/ngày",
        duration: "3 ngày",
      },
      {
        id: "s2",
        name: "Điều chỉnh sữa & thức ăn",
        medicine:
          "Giảm lượng sữa mỗi cữ, chia nhỏ nhiều cữ hơn, bổ sung men tiêu hoá",
        route: "Trong khẩu phần",
        frequency: "Theo bữa ăn",
        duration: "3–5 ngày",
      },
    ],
    monitoring: [
      {
        day: "Trong 24h đầu",
        focus:
          "Theo dõi mức độ mất nước (mắt trũng, da đàn hồi), số lần tiêu chảy.",
      },
      {
        day: "Ngày 2–3",
        focus: "Theo dõi xu hướng giảm dần số lần tiêu chảy, cải thiện phân.",
      },
    ],
  },
  {
    id: "P003",
    code: "PD-TR-HH-01",
    name: "Phác đồ hỗ trợ ho, khó thở bò thịt",
    disease: "Triệu chứng hô hấp",
    species: "Bò thịt",
    group: "Đàn bò thịt B1",
    severity: "nang",
    status: "tam-dung",
    durationDays: 7,
    withdrawalDays: 5,
    createdBy: "Lê Văn C (Bác sĩ thú y)",
    updatedAt: "2025-11-01 10:05",
    note: "Các ca hô hấp nặng cần thăm khám trực tiếp để hiệu chỉnh phác đồ & thuốc.",
    indications: [
      "Bò ho nhiều, thở nhanh, nghe tiếng thở bất thường.",
      "Nghi ngờ viêm phổi / bệnh đường hô hấp, nhưng chưa có chẩn đoán cuối cùng.",
    ],
    contraindications: [
      "Bò suy hô hấp nặng, tím tái, cần cấp cứu khẩn cấp.",
      "Đã xác định bệnh truyền nhiễm phải áp dụng phác đồ chuyên biệt.",
    ],
    startCriteria: [
      "Đánh giá ban đầu: nhịp thở, tần suất ho, thân nhiệt.",
      "Cách ly tương đối để giảm lây lan.",
    ],
    stopCriteria: [
      "Ho giảm rõ, nhịp thở về gần bình thường.",
      "Không còn sốt, ăn uống, đi lại bình thường.",
    ],
    escalationSignals: [
      "Thở gắng sức, há miệng thở, lè lưỡi.",
      "Ho ra dịch mũi / có mùi, sốt cao kéo dài.",
    ],
    safetyNotes:
      "Không tự ý dùng kháng sinh liều cao hoặc phối hợp nhiều nhóm kháng sinh nếu chưa có hướng dẫn.",
    followupPlan:
      "Đánh giá lại toàn đàn, xem xét yếu tố chuồng trại, mật độ, thông gió.",
    steps: [
      {
        id: "s1",
        name: "Cải thiện môi trường chuồng",
        medicine: "Giảm mật độ, tăng thông thoáng, giảm bụi & ẩm",
        route: "Môi trường",
        frequency: "Liên tục",
        duration: "Xuyên suốt thời gian điều trị",
      },
    ],
    monitoring: [
      {
        day: "Mỗi ngày",
        focus:
          "Ghi nhận tần suất ho, nhịp thở, nhiệt độ, thái độ ăn uống của bò.",
      },
    ],
  },
];
const protocolTemplate: TreatmentProtocol = {
  id: "TEMPLATE",
  code: "PD-XXX-XXX-00", // Mã chuẩn hoá: PD-[ĐỐI TƯỢNG]-[BỆNH]-[SỐ THỨ TỰ]
  name: "Phác đồ điều trị [Tên bệnh / tình trạng]",
  disease: "[Tên bệnh / hội chứng]",
  species: "[Đối tượng: Bò sữa / Bò thịt / Bê con / Heo nái / ...]",
  group: "[Nhóm đàn áp dụng, ví dụ: Đàn bò sữa A1]",
  severity: "trung-binh",
  status: "de-xuat",
  durationDays: 0,
  withdrawalDays: undefined,
  createdBy: "[Người phụ trách phác đồ]",
  updatedAt: new Date().toISOString(),
  note: "[Ghi chú tổng quan về phạm vi áp dụng, cảnh báo…]",

  indications: [
    "Điều kiện / triệu chứng điển hình 1 để áp dụng phác đồ",
    "Điều kiện / triệu chứng điển hình 2…",
  ],
  contraindications: [
    "Trường hợp không được áp dụng phác đồ này (bệnh kèm theo, tình trạng quá nặng…)  ",
  ],
  startCriteria: [
    "Các bước/tiêu chí cần đạt trước khi bắt đầu: khám, đo nhiệt độ, chẩn đoán sơ bộ…",
  ],
  stopCriteria: [
    "Khi nào được coi là kết thúc phác đồ hoặc chuyển sang chế độ duy trì.",
  ],
  escalationSignals: [
    "Tín hiệu phải báo bác sĩ thú y hoặc chuyển phác đồ (không cải thiện, xấu đi...).",
  ],
  safetyNotes:
    "Các lưu ý an toàn chung: ngưng sữa, ngưng thịt, cảnh báo người thao tác, thiết bị bảo hộ...",
  followupPlan:
    "Kế hoạch tái khám / đánh giá lại sau khi kết thúc đợt điều trị.",

  steps: [
    {
      id: "step-1",
      name: "Tên bước 1 (vd: Xử lý triệu chứng, xử lý tại chỗ…)",
      medicine: "Tên thuốc / biện pháp / sản phẩm áp dụng",
      route:
        "Đường dùng (Uống / Tiêm bắp / Tiêm TM / Thoa ngoài / Trong khẩu phần…)",
      frequency: "Tần suất (vd: 2 lần/ngày)",
      duration: "Thời gian (vd: 3–5 ngày)",
      note: "Ghi chú thêm nếu có.",
    },
  ],
  monitoring: [
    {
      day: "Ngày / giai đoạn 1",
      focus: "Cần theo dõi những gì: nhiệt độ, ăn uống, phân, sữa...",
      expected: "Kỳ vọng, ngưỡng an toàn / khi nào cần báo bác sĩ.",
    },
  ],
};

export default function TreatmentAnimalPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<"all" | string>("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | Severity>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | ProtocolStatus>(
    "all"
  );
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(
    protocols[0]?.id ?? null
  );

  const filteredProtocols = useMemo(() => {
    return protocols.filter((p) => {
      const matchSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.disease.toLowerCase().includes(search.toLowerCase()) ||
        p.code.toLowerCase().includes(search.toLowerCase());

      const matchSpecies =
        speciesFilter === "all" || p.species === speciesFilter;
      const matchSeverity =
        severityFilter === "all" || p.severity === severityFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;

      return matchSearch && matchSpecies && matchSeverity && matchStatus;
    });
  }, [search, speciesFilter, severityFilter, statusFilter]);

  const columns: ColumnDef<TreatmentProtocol>[] = [
    {
      accessorKey: "code",
      header: "Mã phác đồ",
      cell: ({ row }) => (
        <span className="text-xs font-mono text-muted-foreground">
          {row.getValue("code")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên phác đồ",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{row.getValue("name")}</span>
          <span className="text-[11px] text-muted-foreground">
            Bệnh / tình trạng: {row.original.disease}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "species",
      header: "Đối tượng",
      cell: ({ row }) => (
        <div className="flex flex-col text-xs">
          <span className="font-medium">{row.original.species}</span>
          <span className="text-[11px] text-muted-foreground">
            {row.original.group}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "severity",
      header: "Mức độ",
      cell: ({ row }) => {
        const s = row.original.severity;
        const label =
          s === "nhẹ" ? "Nhẹ" : s === "trung-binh" ? "Trung bình" : "Nặng";
        const cls =
          s === "nhẹ"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : s === "trung-binh"
            ? "bg-amber-50 text-amber-700 border-amber-100"
            : "bg-red-50 text-red-700 border-red-100";
        return (
          <Badge
            variant="outline"
            className={`border px-2 py-0.5 text-[11px] ${cls}`}
          >
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => renderStatusBadge(row.original.status),
    },
    {
      accessorKey: "durationDays",
      header: "Thời gian",
      cell: ({ row }) => (
        <span className="text-xs">
          {row.original.durationDays} ngày
          {row.original.withdrawalDays
            ? ` • Ngưng SP: ${row.original.withdrawalDays} ngày`
            : ""}
        </span>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Cập nhật",
      cell: ({ row }) => (
        <span className="text-[11px] text-muted-foreground">
          {row.original.updatedAt}
        </span>
      ),
    },
  ];

  const selectedProtocol = filteredProtocols.find(
    (p) => p.id === selectedProtocolId
  );

  const total = protocols.length;
  const totalActive = protocols.filter(
    (p) => p.status === "dang-ap-dung"
  ).length;
  const totalDraft = protocols.filter((p) => p.status === "de-xuat").length;
  const totalArchived = protocols.filter((p) => p.status === "luu-tru").length;

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
            <Stethoscope className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Phác đồ điều trị & chăm sóc
            </h1>
            <p className="text-xs text-muted-foreground">
              Quản lý phác đồ điều trị chuẩn hoá theo bệnh, đối tượng và mức độ
              – hỗ trợ ra quyết định điều trị nhanh, có kiểm soát và truy vết
              được.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ProtocolPickerDialog protocols={protocols} onSelect={() => {}} />
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={() => navigate("/main/treatment/animals/add")}
          >
            <FilePlus2 className="mr-1 h-4 w-4" />
            Thêm phác đồ mới
          </Button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Tổng số phác đồ"
          value={total.toString()}
          icon={<Activity className="h-4 w-4 text-primary" />}
          sub="Bao gồm tất cả trạng thái"
        />
        <SummaryCard
          title="Đang áp dụng"
          value={totalActive.toString()}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          color="text-emerald-600"
          sub="Đang được dùng thực tế trên trại"
        />
        <SummaryCard
          title="Đề xuất / thử nghiệm"
          value={totalDraft.toString()}
          icon={<Clock3 className="h-4 w-4 text-amber-500" />}
          color="text-amber-600"
          sub="Cần rà soát & phê duyệt"
        />
        <SummaryCard
          title="Lưu trữ"
          value={totalArchived.toString()}
          icon={<Archive className="h-4 w-4 text-slate-500" />}
          color="text-slate-600"
          sub="Không còn áp dụng, lưu tham khảo"
        />
      </div>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Tìm kiếm & lọc phác đồ
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Lọc theo bệnh, đối tượng, mức độ và trạng thái áp dụng.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Input
                placeholder="Nhập tên phác đồ / bệnh / mã phác đồ..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8"
              />
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setSpeciesFilter("all");
                setSeverityFilter("all");
                setStatusFilter("all");
              }}
            >
              <Filter className="mr-1 h-4 w-4" />
              Làm mới bộ lọc
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <FilterItem
              label="Đối tượng"
              control={
                <Select
                  value={speciesFilter}
                  onValueChange={(v) => setSpeciesFilter(v as "all" | string)}
                >
                  <SelectTrigger className="h-8 w-[160px]">
                    <SelectValue placeholder="Chọn đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Bò sữa">Bò sữa</SelectItem>
                    <SelectItem value="Bê con">Bê con</SelectItem>
                    <SelectItem value="Bò thịt">Bò thịt</SelectItem>
                    <SelectItem value="Bò cái sau sinh">
                      Bò cái sau sinh
                    </SelectItem>
                  </SelectContent>
                </Select>
              }
            />

            <FilterItem
              label="Mức độ"
              control={
                <Select
                  value={severityFilter}
                  onValueChange={(v) =>
                    setSeverityFilter(v as Severity | "all")
                  }
                >
                  <SelectTrigger className="h-8 w-[150px]">
                    <SelectValue placeholder="Mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="nhẹ">Nhẹ</SelectItem>
                    <SelectItem value="trung-binh">Trung bình</SelectItem>
                    <SelectItem value="nang">Nặng</SelectItem>
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
                    setStatusFilter(v as ProtocolStatus | "all")
                  }
                >
                  <SelectTrigger className="h-8 w-[160px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="dang-ap-dung">Đang áp dụng</SelectItem>
                    <SelectItem value="de-xuat">
                      Đề xuất / thử nghiệm
                    </SelectItem>
                    <SelectItem value="tam-dung">Tạm dừng</SelectItem>
                    <SelectItem value="luu-tru">Lưu trữ</SelectItem>
                  </SelectContent>
                </Select>
              }
            />

            <div className="hidden md:flex flex-1 justify-end text-[11px] text-muted-foreground">
              Đang hiển thị{" "}
              <span className="mx-1 font-semibold text-foreground">
                {filteredProtocols.length}
              </span>
              / {total} phác đồ
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAIN GRID: TABLE + DETAIL */}
      <div className="grid gap-4 lg:grid-cols-[3fr,2.2fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Danh sách phác đồ điều trị
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-[11px] text-muted-foreground">
              Chọn một phác đồ bên dưới để xem chi tiết & các bước thực hiện ở
              panel bên phải.
            </div>
            <div className="cursor-pointer">
              <DataTable
                columns={columns.map((col) =>
                  col.accessorKey === "name"
                    ? {
                        ...col,
                        cell: (ctx) => (
                          <div
                            className="flex flex-col"
                            onClick={() =>
                              setSelectedProtocolId(ctx.row.original.id)
                            }
                          >
                            <span className="text-sm font-semibold">
                              {ctx.row.original.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              Bệnh / tình trạng: {ctx.row.original.disease}
                            </span>
                          </div>
                        ),
                      }
                    : col
                )}
                data={filteredProtocols}
                filterColumn="name"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <ListChecks className="h-4 w-4 text-primary" />
              Chi tiết phác đồ & tiêu chí áp dụng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {selectedProtocol ? (
              <ProtocolDetail protocol={selectedProtocol} />
            ) : (
              <div className="flex h-40 items-center justify-center text-xs text-muted-foreground">
                Chọn một phác đồ trong bảng để xem chi tiết.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ───────── Helpers ───────── */

function SummaryCard({
  title,
  value,
  icon,
  sub,
  color,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
  sub?: string;
  color?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-1">
        <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color ?? "text-foreground"}`}>
          {value}
        </div>
        {sub && <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function FilterItem({
  label,
  control,
}: {
  label: string;
  control: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      {control}
    </div>
  );
}

function renderStatusBadge(status: ProtocolStatus) {
  if (status === "dang-ap-dung") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px]">
        <CheckCircle2 className="mr-1 h-3 w-3" />
        Đang áp dụng
      </Badge>
    );
  }
  if (status === "de-xuat") {
    return (
      <Badge className="bg-amber-50 text-amber-700 border border-amber-100 text-[11px]">
        <Clock3 className="mr-1 h-3 w-3" />
        Đề xuất / thử nghiệm
      </Badge>
    );
  }
  if (status === "tam-dung") {
    return (
      <Badge className="bg-red-50 text-red-700 border border-red-100 text-[11px]">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Tạm dừng
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-50 text-slate-700 border border-slate-100 text-[11px]">
      <Archive className="mr-1 h-3 w-3" />
      Lưu trữ
    </Badge>
  );
}

function BulletList({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <ul className="ml-4 list-disc space-y-0.5">
      {items.map((item, idx) => (
        <li key={idx} className="text-[11px]">
          {item}
        </li>
      ))}
    </ul>
  );
}

function ProtocolDetail({ protocol }: { protocol: TreatmentProtocol }) {
  return (
    <div className="space-y-3">
      {/* Thông tin tổng quan */}
      <div className="rounded-md border bg-muted/40 p-2.5 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">{protocol.name}</p>
            <p className="text-[11px] text-muted-foreground">
              Mã phác đồ: <span className="font-mono">{protocol.code}</span>
            </p>
            <p className="mt-0.5 text-[11px]">
              Bệnh / tình trạng:{" "}
              <span className="font-semibold">{protocol.disease}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {renderStatusBadge(protocol.status)}
            <Badge
              variant="outline"
              className="border-amber-100 bg-amber-50 text-[10px] text-amber-700"
            >
              {protocol.severity === "nhẹ"
                ? "Mức độ: Nhẹ"
                : protocol.severity === "trung-binh"
                ? "Mức độ: Trung bình"
                : "Mức độ: Nặng"}
            </Badge>
          </div>
        </div>
        <div className="mt-1 grid gap-1 text-[11px] md:grid-cols-2">
          <p>
            Đối tượng: <span className="font-medium">{protocol.species}</span>
          </p>
          <p>
            Nhóm / đàn áp dụng:{" "}
            <span className="font-medium">{protocol.group}</span>
          </p>
          <p>
            Thời gian dự kiến:{" "}
            <span className="font-medium">{protocol.durationDays} ngày</span>
          </p>
          {protocol.withdrawalDays && (
            <p>
              Thời gian ngừng sử dụng sản phẩm:{" "}
              <span className="font-medium">
                {protocol.withdrawalDays} ngày
              </span>
            </p>
          )}
          <p>
            Cập nhật gần nhất:{" "}
            <span className="font-medium">{protocol.updatedAt}</span>
          </p>
          <p>
            Người xây dựng / phụ trách:{" "}
            <span className="font-medium">{protocol.createdBy}</span>
          </p>
        </div>
        {protocol.note && (
          <p className="mt-1 text-[11px] italic text-muted-foreground">
            Ghi chú chung: {protocol.note}
          </p>
        )}
      </div>

      {/* Khối tiêu chí & chỉ định */}
      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-md border bg-background p-2 space-y-1.5">
          <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <Info className="h-3.5 w-3.5 text-primary" />
            Chỉ định áp dụng
          </p>
          <BulletList items={protocol.indications} />
        </div>
        <div className="rounded-md border border-red-100 bg-red-50/40 p-2 space-y-1.5">
          <p className="flex items-center gap-1 text-xs font-semibold text-red-700">
            <ShieldAlert className="h-3.5 w-3.5" />
            Không áp dụng khi
          </p>
          <BulletList items={protocol.contraindications} />
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-md border bg-background p-2 space-y-1.5">
          <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <ListChecks className="h-3.5 w-3.5 text-emerald-600" />
            Điều kiện bắt đầu phác đồ
          </p>
          <BulletList items={protocol.startCriteria} />
        </div>
        <div className="rounded-md border bg-background p-2 space-y-1.5">
          <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <ListChecks className="h-3.5 w-3.5 text-sky-600" />
            Điều kiện kết thúc / đổi phác đồ
          </p>
          <BulletList items={protocol.stopCriteria} />
        </div>
      </div>

      <div className="rounded-md border border-amber-200 bg-amber-50/40 p-2 space-y-1.5">
        <p className="flex items-center gap-1 text-xs font-semibold text-amber-800">
          <AlertTriangle className="h-3.5 w-3.5" />
          Tín hiệu cần báo bác sĩ thú y / escalations
        </p>
        <BulletList items={protocol.escalationSignals} />
      </div>

      {/* Các bước điều trị */}
      <div className="space-y-1.5">
        <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <HeartPulse className="h-3.5 w-3.5 text-primary" />
          Các bước điều trị / chăm sóc
        </p>
        <div className="space-y-1.5">
          {protocol.steps.map((step, idx) => (
            <div
              key={step.id}
              className="rounded-md border bg-background p-2 text-[11px]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">
                    Bước {idx + 1}: {step.name}
                  </p>
                  <p className="mt-0.5">
                    <span className="font-medium">Biện pháp / sản phẩm:</span>{" "}
                    {step.medicine}
                  </p>
                </div>
              </div>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  <span className="font-medium">Đường dùng:</span> {step.route}
                </span>
                <span>
                  <span className="font-medium">Tần suất:</span>{" "}
                  {step.frequency}
                </span>
                <span>
                  <span className="font-medium">Thời gian:</span>{" "}
                  {step.duration}
                </span>
              </div>
              {step.note && (
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Ghi chú: {step.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Theo dõi & đánh giá */}
      <div className="space-y-1.5">
        <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <ThermometerSun className="h-3.5 w-3.5 text-orange-500" />
          Theo dõi & đánh giá kết quả
        </p>
        <div className="space-y-1.5">
          {protocol.monitoring.map((m, idx) => (
            <div
              key={idx}
              className="rounded-md border border-dashed bg-muted/30 p-2 text-[11px]"
            >
              <p className="font-semibold">{m.day}</p>
              <p className="mt-0.5">Cần theo dõi: {m.focus}</p>
              {m.expected && (
                <p className="mt-0.5 text-muted-foreground">
                  Kỳ vọng / hành động: {m.expected}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ghi chú an toàn & tái khám */}
      {(protocol.safetyNotes || protocol.followupPlan) && (
        <div className="grid gap-2 md:grid-cols-2">
          {protocol.safetyNotes && (
            <div className="rounded-md border bg-rose-50/40 p-2 text-[11px]">
              <p className="flex items-center gap-1 text-xs font-semibold text-rose-700">
                <ShieldAlert className="h-3.5 w-3.5" />
                Ghi chú an toàn
              </p>
              <p className="mt-0.5 text-rose-900">{protocol.safetyNotes}</p>
            </div>
          )}
          {protocol.followupPlan && (
            <div className="rounded-md border bg-sky-50/40 p-2 text-[11px]">
              <p className="flex items-center gap-1 text-xs font-semibold text-sky-700">
                <Info className="h-3.5 w-3.5" />
                Kế hoạch tái khám / đánh giá lại
              </p>
              <p className="mt-0.5 text-sky-900">{protocol.followupPlan}</p>
            </div>
          )}
        </div>
      )}

      <p className="mt-1 text-[10px] text-muted-foreground">
        ⚠️ Các thông tin trên chỉ mang tính chất cấu trúc & ghi chép nội bộ.
        Liều dùng, loại thuốc và chỉ định điều trị cụ thể cần theo tư vấn trực
        tiếp của bác sĩ thú y được cấp phép.
      </p>
    </div>
  );
}
