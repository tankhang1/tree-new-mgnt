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

// Thay đoạn const protocols = [...] hiện tại bằng đoạn dưới

const protocols: TreatmentProtocol[] = [
  {
    id: "C001",
    code: "PD-LUA-DAOON-01",
    name: "Phác đồ quản lý bệnh đạo ôn lá lúa",
    disease: "Bệnh đạo ôn lá (Pyricularia oryzae)",
    species: "Lúa",
    group: "Ruộng lúa vụ Đông Xuân – giống OM5451",
    severity: "trung-binh",
    status: "dang-ap-dung",
    durationDays: 7,
    withdrawalDays: 0,
    createdBy: "KS. Trồng trọt Nguyễn Văn A",
    updatedAt: "2025-11-06 08:30",
    note: "Áp dụng khi vết bệnh xuất hiện rải rác trên lá, chưa lan rộng khắp ruộng và chưa cháy lá hàng loạt.",

    indications: [
      "Xuất hiện các vết bệnh hình thoi, màu nâu xám, rải rác trên lá, chủ yếu tầng lá giữa và trên.",
      "Độ ẩm cao, sương mù nhiều, ruộng bón thừa đạm hoặc lá lúa xanh đậm, rậm tán.",
      "Ruộng đang ở giai đoạn đẻ nhánh đến đứng cái – nhạy cảm với bệnh đạo ôn.",
    ],
    contraindications: [
      "Ruộng đã cháy lá nặng, >40–50% diện tích lá bị hại – cần đánh giá lại khả năng phục hồi trước khi tiếp tục đầu tư.",
      "Đang trong thời gian sát ngày thu hoạch (< 14 ngày), hạn chế phun thuốc hoá học.",
    ],
    startCriteria: [
      "Kiểm tra đồng ruộng ít nhất 2–3 điểm/ha, ghi nhận tỷ lệ lá có vết bệnh.",
      "Xác định có mặt bệnh đạo ôn (phân biệt với cháy bìa lá, khô vằn…).",
      "Dự báo thời tiết tiếp tục ẩm, mưa phùn hoặc sương mù dày đặc.",
    ],
    stopCriteria: [
      "Sau 5–7 ngày, vết bệnh dừng lan, lá non ra sau không còn bị nhiễm mới.",
      "Màu lá trở lại xanh bình thường, không xuất hiện thêm vết bệnh trên ruộng.",
      "Không còn điều kiện thời tiết thuận lợi cho bệnh phát triển (ẩm độ giảm, nắng nhiều hơn).",
    ],
    escalationSignals: [
      "Sau khi phun 1–2 lần nhưng vết bệnh vẫn lan mạnh, xuất hiện cả trên lá đòng.",
      "Thân – cổ bông có dấu hiệu cháy đạo ôn, nguy cơ lép trắng cao.",
      "Xuất hiện thêm bệnh thứ cấp khác (cháy bìa lá, khô vằn…) trên cùng ruộng.",
    ],
    safetyNotes:
      "Tuân thủ thời gian cách ly của từng hoạt chất. Không phun thuốc khi gió mạnh, trời sắp mưa lớn. Trang bị đồ bảo hộ khi pha và phun thuốc.",
    followupPlan:
      "Ghi chép nhật ký: ngày phát hiện, tình hình trước và sau xử lý, loại thuốc/biện pháp đã dùng. Đánh giá để rút kinh nghiệm cho vụ sau (liều đạm, giống, mật độ).",

    steps: [
      {
        id: "s1",
        name: "Giảm đạm, điều chỉnh dinh dưỡng",
        medicine:
          "Giảm hoặc ngưng bón thêm đạm, ưu tiên bổ sung kali & silic (nếu có).",
        route: "Bón gốc / phun bổ sung qua lá (tuỳ sản phẩm).",
        frequency: "1 lần trong đợt xử lý",
        duration: "Trong 3–5 ngày đầu",
        note: "Không bón thêm đạm khi ruộng đang bị đạo ôn, đặc biệt đang xanh tốt.",
      },
      {
        id: "s2",
        name: "Phun thuốc trừ bệnh đạo ôn",
        medicine:
          "Sử dụng thuốc đặc trị đạo ôn (chọn một sản phẩm phù hợp theo khuyến cáo Nhà nước & nhà sản xuất).",
        route: "Phun qua lá",
        frequency:
          "1 lần, có thể nhắc lại sau 5–7 ngày nếu còn điều kiện bệnh.",
        duration: "1–2 lần/đợt bùng phát",
        note: "Phun kỹ phần lá trên, ưu tiên khu vực đầu nguồn gió & chỗ bệnh xuất hiện nhiều.",
      },
      {
        id: "s3",
        name: "Quản lý nước trên ruộng",
        medicine: "Điều chỉnh mực nước (rút nước – phơi ruộng nhẹ nếu quá ẩm).",
        route: "Điều tiết nước",
        frequency: "Theo dõi hàng ngày",
        duration: "Trong suốt giai đoạn có nguy cơ",
        note: "Tránh để ruộng luôn ẩm ướt kéo dài, nhưng không làm lúa bị khô hạn.",
      },
    ],
    monitoring: [
      {
        day: "Ngày 1–2 sau xử lý",
        focus:
          "Ghi nhận tốc độ lan vết bệnh, lá non có bị nhiễm mới không, điều kiện thời tiết (sương mù, ẩm độ).",
        expected:
          "Vết bệnh cũ khô lại, ít xuất hiện vết mới. Nếu vẫn lan mạnh, cần xem lại cách phun & loại thuốc.",
      },
      {
        day: "Ngày 3–7",
        focus:
          "Theo dõi độ xanh của lá, tỉ lệ lá bệnh trên ruộng, tình trạng sinh trưởng của lúa.",
        expected:
          "Bệnh dừng lại, ruộng phục hồi, đẻ nhánh / đứng cái bình thường.",
      },
    ],
  },

  {
    id: "C002",
    code: "PD-BAP-SKEO-01",
    name: "Phác đồ quản lý sâu keo mùa thu hại bắp (ngô)",
    disease: "Sâu keo mùa thu (Spodoptera frugiperda)",
    species: "Bắp (ngô)",
    group: "Vùng bắp Đông Xuân – mật độ vừa",
    severity: "trung-binh",
    status: "de-xuat",
    durationDays: 10,
    createdBy: "KS. BVTV Trần Thị B",
    updatedAt: "2025-11-03 14:10",
    note: "Tập trung quản lý giai đoạn bắp 3–8 lá – giai đoạn mẫn cảm, sâu phá hại mạnh.",

    indications: [
      "Bắp giai đoạn 3–8 lá thật, quan sát có lá bị thủng lỗ, lá xoăn, có phân sâu trong nõn.",
      "Kiểm tra trên đồng ruộng, thấy sâu non trong nõn, tỷ lệ cây bị hại vượt ngưỡng kinh tế.",
      "Khu vực đã từng xuất hiện sâu keo mùa thu ở các vụ trước.",
    ],
    contraindications: [
      "Bắp gần thu hoạch, bắp tơ đã đóng trái, hạn chế sử dụng thuốc hoá học phổ rộng.",
      "Phun tràn lan khi mật độ sâu dưới ngưỡng, không có dấu hiệu lan rộng.",
    ],
    startCriteria: [
      "Điều tra đồng ruộng: ít nhất 5 điểm/ruộng, mỗi điểm 10 cây.",
      "Tỷ lệ cây bị hại từ 10–20% trở lên tuỳ giai đoạn – bắt đầu xem xét can thiệp.",
    ],
    stopCriteria: [
      "Sau 7–10 ngày, tỷ lệ cây bị hại giảm rõ, ít hoặc không còn lá mới bị khoét.",
      "Không còn sâu non sống trong nõn khi kiểm tra ngẫu nhiên.",
    ],
    escalationSignals: [
      "Tỷ lệ cây bị hại tiếp tục tăng sau 1 lần xử lý.",
      "Xuất hiện sâu tuổi lớn (sâu to, khó diệt), cần biện pháp mạnh và luân phiên hoạt chất.",
    ],
    safetyNotes:
      "Ưu tiên biện pháp sinh học (thiên địch, chế phẩm vi sinh) trước, hạn chế dùng thuốc phổ rộng gây hại thiên địch.",
    followupPlan:
      "Luân phiên hoạt chất nếu phải phun nhiều lần trong một vụ. Ghi chép loại thuốc, liều, thời điểm để tránh kháng thuốc.",

    steps: [
      {
        id: "s1",
        name: "Cắt bỏ lá bị hại nặng (nếu diện tích nhỏ)",
        medicine: "Thu gom, tiêu huỷ lá bị hại nặng, tập trung tại bờ ruộng.",
        route: "Thủ công",
        frequency: "1 lần trước khi phun",
        duration: "Trong 1–2 ngày đầu",
      },
      {
        id: "s2",
        name: "Phun chế phẩm sinh học / vi sinh (khuyến khích)",
        medicine:
          "Chế phẩm Bt, nấm xanh / nấm trắng (tuỳ điều kiện vùng và sản phẩm được phép).",
        route: "Phun vào nõn và lá non",
        frequency: "1–2 lần, cách nhau 5–7 ngày",
        duration: "Trong giai đoạn mật độ sâu trung bình",
        note: "Phun vào chiều mát, tránh trời mưa ngay sau phun.",
      },
      {
        id: "s3",
        name: "Phun thuốc hoá học chọn lọc (khi mật độ cao)",
        medicine:
          "Chọn 1 hoạt chất phù hợp, nằm trong danh mục được phép trên bắp tại Việt Nam.",
        route: "Phun tập trung vào nõn và tán lá trên",
        frequency: "1 lần, nhắc lại sau 5–7 ngày nếu cần",
        duration: "Tối đa 2 lần/đợt dịch",
        note: "Luân phiên hoạt chất nếu cần phun lại; tuân thủ thời gian cách ly.",
      },
    ],
    monitoring: [
      {
        day: "3–5 ngày sau xử lý",
        focus:
          "Đếm lại số cây bị hại mới, kiểm tra xem còn sâu non sống hay không.",
        expected:
          "Số cây bị hại mới giảm, khó tìm thấy sâu sống trong nõn – nếu không, cần xem lại loại thuốc & kỹ thuật phun.",
      },
      {
        day: "7–10 ngày sau xử lý",
        focus:
          "Tiếp tục theo dõi, ghi nhận tình trạng tán lá và tốc độ sinh trưởng.",
        expected:
          "Không xuất hiện lứa sâu mới bùng phát, cây bắp sinh trưởng tự nhiên.",
      },
    ],
  },

  {
    id: "C003",
    code: "PD-DAUNANH-RISAT-01",
    name: "Phác đồ quản lý bệnh rỉ sắt trên đậu nành",
    disease: "Bệnh rỉ sắt (Phakopsora pachyrhizi)",
    species: "Đậu nành",
    group: "Vùng đậu nành vụ Hè Thu – gieo quanh bờ ruộng bắp",
    severity: "nhẹ",
    status: "dang-ap-dung",
    durationDays: 5,
    withdrawalDays: 0,
    createdBy: "KS. Trồng trọt Lê Văn C",
    updatedAt: "2025-11-02 09:00",
    note: "Ưu tiên phòng sớm, phun khi mới xuất hiện chấm rỉ li ti trên lá, chưa cháy lá nhiều.",

    indications: [
      "Lá có các đốm nhỏ màu vàng nâu ở mặt trên, mặt dưới có ổ bào tử màu nâu gỉ.",
      "Thường xuất hiện trên lá già trước, sau lan dần lên lá trên.",
      "Điều kiện ẩm, mưa kéo dài, mật độ trồng dày, ít thông thoáng.",
    ],
    contraindications: [
      "Đậu đã gần thu hoạch, lá rụng nhiều, cây đã già cỗi – hạn chế dùng thêm thuốc.",
    ],
    startCriteria: [
      "Kiểm tra lá tầng dưới & giữa, phát hiện vết bệnh đầu tiên.",
      "Dự báo thời tiết có mưa, ẩm kéo dài trong 5–7 ngày tới.",
    ],
    stopCriteria: [
      "Sau 5–7 ngày, vết bệnh không lan thêm, lá non trên vẫn xanh tốt.",
      "Không thấy thêm ổ rỉ mới trên lá mới.",
    ],
    escalationSignals: [
      "Vết bệnh lan rất nhanh, nhiều lá chuyển màu vàng nâu, rụng sớm.",
      "Diện tích bị hại >30–40% tán lá toàn ruộng.",
    ],
    safetyNotes:
      "Luôn luân canh cây trồng, không trồng đậu nành liên tục nhiều vụ trên cùng đất để hạn chế mầm bệnh tích tụ.",
    followupPlan:
      "Quan sát & ghi nhận giống, thời vụ, điều kiện thời tiết để tối ưu lịch gieo trồng & phòng bệnh cho vụ sau.",

    steps: [
      {
        id: "s1",
        name: "Tỉa bớt lá già / quá rậm (nếu mật độ dày)",
        medicine: "Cắt bỏ lá già bị bệnh nặng, tạo sự thông thoáng cho tán lá.",
        route: "Thủ công",
        frequency: "1 lần đầu đợt xử lý",
        duration: "Trong 1–2 ngày đầu",
      },
      {
        id: "s2",
        name: "Phun thuốc trừ nấm phổ hẹp chuyên trị rỉ sắt",
        medicine:
          "Chọn 1 hoạt chất phù hợp trong danh mục cho phép trên đậu nành (theo khuyến cáo).",
        route: "Phun qua lá",
        frequency: "1 lần, có thể nhắc lại sau 7–10 ngày nếu cần",
        duration: "1–2 lần tuỳ điều kiện",
      },
      {
        id: "s3",
        name: "Bổ sung dinh dưỡng lá",
        medicine: "Phân bón lá chứa vi lượng (Zn, B, Mn…) nếu cây suy yếu.",
        route: "Phun qua lá",
        frequency: "1 lần sau xử lý bệnh",
        duration: "Tùy tình trạng ruộng",
      },
    ],
    monitoring: [
      {
        day: "3–5 ngày sau phun",
        focus:
          "Theo dõi vết bệnh cũ (khô lại hay lan thêm), tình trạng lá mới, màu sắc chung của tán lá.",
        expected:
          "Vết bệnh cũ khô, ít vết mới xuất hiện, cây vẫn giữ được bộ lá xanh.",
      },
      {
        day: "7–10 ngày sau phun",
        focus:
          "Đánh giá tỉ lệ lá rụng, khả năng quang hợp, mức độ ảnh hưởng đến năng suất dự kiến.",
        expected:
          "Bệnh khống chế được, giữ được bộ lá đủ để nuôi trái đến cuối vụ.",
      },
    ],
  },
];

export default function TreatmentPlantPage() {
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
            onClick={() => navigate("/main/treatment/plants/add")}
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
            {/* Đối tượng (Cây trồng) */}
            <FilterItem
              label="Đối tượng"
              control={
                <Select
                  value={speciesFilter}
                  onValueChange={(v) => setSpeciesFilter(v as "all" | string)}
                >
                  <SelectTrigger className="h-8 w-[180px]">
                    <SelectValue placeholder="Chọn đối tượng cây trồng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Lúa">Lúa</SelectItem>
                    <SelectItem value="Bắp (ngô)">Bắp (ngô)</SelectItem>
                    <SelectItem value="Đậu nành">Đậu nành</SelectItem>
                    <SelectItem value="Sầu riêng">Sầu riêng</SelectItem>
                    <SelectItem value="Cà phê">Cà phê</SelectItem>
                  </SelectContent>
                </Select>
              }
            />

            {/* Mức độ */}
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

            {/* Trạng thái */}
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

            {/* Đang hiển thị bao nhiêu phác đồ */}
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
