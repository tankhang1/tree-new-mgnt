"use client";

import * as React from "react";
import {
  Stethoscope,
  Activity,
  AlertTriangle,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ArrowLeft,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";

type Step = {
  id: string;
  name: string;
  medicine: string;
  route: string;
  frequency: string;
  duration: string;
  note?: string;
};

type MonitorItem = {
  id: string;
  day: string;
  focus: string;
  expected: string;
};

/* ==== OPTIONS MẪU DÙNG CHO CÁC SELECT – CÂY TRỒNG ==== */

// Bệnh / vấn đề trên cây trồng
const DISEASE_OPTIONS = [
  "Bệnh đạo ôn lúa",
  "Bệnh khô vằn lúa",
  "Rầy nâu hại lúa",
  "Sâu đục thân bắp",
  "Rỉ sắt đậu nành",
  "Thán thư trên cây ăn trái",
  "Bệnh nấm rễ (thối gốc, chết cây con)",
];

// Đối tượng / cây trồng
const CROP_OPTIONS = [
  "Lúa",
  "Bắp (ngô)",
  "Đậu nành",
  "Cà phê",
  "Tiêu",
  "Cây ăn trái (sầu riêng, bưởi, xoài...)",
];

// Nhóm / giai đoạn / khu vực
const GROUP_OPTIONS = [
  "Lúa – Giai đoạn mạ",
  "Lúa – Đẻ nhánh",
  "Lúa – Làm đòng / trổ chín",
  "Bắp – Sau gieo 20–40 ngày",
  "Đậu nành – Giai đoạn sinh trưởng mạnh",
  "Vùng A – Vụ Đông Xuân",
  "Vùng B – Vụ Hè Thu",
];

// Người phụ trách
const EXPERT_OPTIONS = [
  "KS. Trồng trọt Nguyễn Văn A",
  "KS. BVTV Trần Thị B",
  "Kỹ thuật viên đồng ruộng Lê Văn C",
  "Quản lý vùng sản xuất Phạm Thị D",
];

// Đường dùng – cho cây trồng
const ROUTE_OPTIONS = [
  "Phun qua lá",
  "Tưới gốc / xử lý đất",
  "Xử lý hạt giống",
  "Phun đẫm cả tán",
  "Phun khoanh vùng ổ dịch",
];

// Tần suất
const FREQ_OPTIONS = [
  "1 lần/ngày",
  "2 lần/ngày",
  "3 ngày/lần",
  "7 ngày/lần",
  "Theo khuyến cáo trên nhãn",
];

// Thời gian
const DURATION_OPTIONS = [
  "1 lần",
  "2 lần cách nhau 3 ngày",
  "3–5 ngày",
  "5–7 ngày",
  "Theo khuyến cáo trên nhãn",
];

export default function AddTreatmentPlantPage() {
  const navigate = useNavigate();

  // Thông tin chung
  const [code, setCode] = React.useState("PD-LUA-DAOON-01");
  const [name, setName] = React.useState(
    "Phác đồ phòng trị bệnh đạo ôn lúa giai đoạn làm đòng"
  );
  const [disease, setDisease] = React.useState("Bệnh đạo ôn lúa");
  const [species, setSpecies] = React.useState("Lúa");
  const [group, setGroup] = React.useState("Lúa – Làm đòng / trổ chín");
  const [severity, setSeverity] = React.useState<"nhẹ" | "trung-binh" | "nang">(
    "trung-binh"
  );
  const [status, setStatus] = React.useState<
    "dang-ap-dung" | "de-xuat" | "tam-ngung"
  >("dang-ap-dung");
  const [durationDays, setDurationDays] = React.useState("5");
  const [withdrawalDays, setWithdrawalDays] = React.useState(""); // cây trồng: có thể là "Thời gian cách ly" thay vì để trống
  const [createdBy, setCreatedBy] = React.useState("KS. BVTV Trần Thị B");

  // Chỉ định / chống chỉ định / tiêu chí
  const [indications, setIndications] = React.useState(
    "Ruộng lúa xuất hiện vết bệnh đạo ôn rải rác trên lá, mật độ thấp–trung bình; Thời tiết ẩm, sương mù, có nguy cơ bùng phát dịch."
  );
  const [contra, setContra] = React.useState(
    "Ruộng đã nhiễm nặng, cháy lá trên diện rộng cần phác đồ can thiệp mạnh hơn; Khu vực đang gần thu hoạch, phải cân nhắc thời gian cách ly."
  );
  const [startCriteria, setStartCriteria] = React.useState(
    "Ghi nhận vết bệnh đầu tiên; Dự báo thời tiết ẩm, mưa nhiều; Lúa ở giai đoạn mẫn cảm (làm đòng, trổ)."
  );
  const [stopCriteria, setStopCriteria] = React.useState(
    "Vết bệnh không tiếp tục lan rộng; Lá non mới phát triển khoẻ, không xuất hiện vết đạo ôn mới."
  );
  const [escalationSignals, setEscalationSignals] = React.useState(
    "Sau 3–5 ngày phun mà bệnh vẫn lan mạnh; Tỷ lệ lá cháy > 10–15% diện tích ruộng; Cần báo kỹ sư BVTV để điều chỉnh phác đồ."
  );

  // Ghi chú / an toàn / theo dõi
  const [safetyNotes, setSafetyNotes] = React.useState(
    "Tuân thủ thời gian cách ly trước thu hoạch theo nhãn thuốc; Mang đồ bảo hộ khi pha và phun thuốc; Không xả dư lượng thuốc trực tiếp ra nguồn nước."
  );
  const [followupPlan, setFollowupPlan] = React.useState(
    "Kiểm tra lại ruộng sau 3 ngày và 7 ngày; Ghi nhận tỷ lệ lá bị bệnh, giai đoạn sinh trưởng, thời tiết để điều chỉnh lần phun tiếp theo."
  );
  const [note, setNote] = React.useState(
    "Phân bổ thuốc đều theo bờ, tránh bỏ sót vùng trũng thấp, nơi bệnh thường phát sinh mạnh hơn."
  );

  // Bước điều trị
  const [steps, setSteps] = React.useState<Step[]>([
    {
      id: crypto.randomUUID(),
      name: "Phun thuốc phòng trị đạo ôn",
      medicine:
        "Thuốc đặc trị đạo ôn (theo hoạt chất/khuyến cáo của kỹ sư BVTV)",
      route: "Phun qua lá",
      frequency: "1 lần/ngày",
      duration: "2 lần cách nhau 3 ngày",
      note: "Pha đúng liều, phun ướt đều hai mặt lá, ưu tiên vào sáng sớm hoặc chiều mát.",
    },
    {
      id: crypto.randomUUID(),
      name: "Điều chỉnh chế độ phân bón",
      medicine:
        "Giảm bón đạm, bổ sung kali, silic, phân bón lá tăng sức chống chịu",
      route: "Tưới gốc / phun qua lá",
      frequency: "7 ngày/lần",
      duration: "5–7 ngày",
      note: "Hạn chế bón đạm khi bệnh đang phát triển mạnh.",
    },
  ]);

  const [monitoring, setMonitoring] = React.useState<MonitorItem[]>([
    {
      id: crypto.randomUUID(),
      day: "Ngày 1–3",
      focus:
        "Theo dõi sự lan rộng của vết bệnh trên lá, đặc biệt trên lá đòng; Ghi nhận tình trạng thời tiết (mưa, sương mù…).",
      expected:
        "Vết bệnh mới giảm xuất hiện, không còn lan mạnh; Lá non mới vẫn xanh khoẻ.",
    },
    {
      id: crypto.randomUUID(),
      day: "Ngày 4–7",
      focus:
        "Đánh giá lại mức độ bệnh, điều chỉnh lần phun tiếp theo nếu cần; Ghi nhận ảnh hưởng lên năng suất dự kiến.",
      expected:
        "Bệnh được khống chế, không gây cháy lá trên diện rộng; Ruộng khôi phục trạng thái sinh trưởng ổn định.",
    },
  ]);

  // Handlers
  const handleAddStep = () => {
    setSteps((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        medicine: "",
        route: "",
        frequency: "",
        duration: "",
        note: "",
      },
    ]);
  };

  const handleChangeStep = (id: string, field: keyof Step, value: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveStep = (id: string) => {
    setSteps((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddMonitor = () => {
    setMonitoring((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        day: "",
        focus: "",
        expected: "",
      },
    ]);
  };

  const handleChangeMonitor = (
    id: string,
    field: keyof MonitorItem,
    value: string
  ) => {
    setMonitoring((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleRemoveMonitor = (id: string) => {
    setMonitoring((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSubmit = () => {
    const payload = {
      code,
      name,
      disease,
      species,
      group,
      severity,
      status,
      durationDays: durationDays ? Number(durationDays) : undefined,
      withdrawalDays: withdrawalDays ? Number(withdrawalDays) : undefined,
      createdBy,
      indications,
      contraindications: contra,
      startCriteria,
      stopCriteria,
      escalationSignals,
      safetyNotes,
      followupPlan,
      note,
      steps,
      monitoring,
    };

    console.log("Phác đồ cây trồng mới:", payload);
    // TODO: call API
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="px-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-lg font-semibold">
                Thêm phác đồ chăm sóc / điều trị cây trồng
              </h1>
              <p className="text-xs text-muted-foreground">
                Thiết lập phác đồ chuẩn cho từng bệnh hại và giai đoạn cây trồng
                – dùng lại cho nhiều lô / vùng sản xuất.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Phác đồ chuẩn quản lý dịch hại & dinh dưỡng cây trồng</span>
        </div>
      </header>

      {/* THÔNG TIN CHUNG */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            Thông tin chung về phác đồ
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-[2fr,1.5fr]">
          <div className="space-y-3 text-xs">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Mã phác đồ *</p>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-9 font-mono text-xs"
                  placeholder="VD: PD-LUA-DAOON-01"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Tên phác đồ chăm sóc / điều trị *
                </p>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9"
                  placeholder="VD: Phác đồ đạo ôn lúa giai đoạn làm đòng"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {/* BỆNH – Select cây trồng */}
              <div>
                <p className="text-xs text-muted-foreground">
                  Bệnh hại / vấn đề trên cây trồng *
                </p>
                <Select value={disease} onValueChange={setDisease}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn bệnh / vấn đề" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISEASE_OPTIONS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                    <SelectItem value="Khác">Khác (tự nhập sau)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ĐỐI TƯỢNG – Cây trồng */}
              <div>
                <p className="text-xs text-muted-foreground">
                  Đối tượng cây trồng *
                </p>
                <Select value={species} onValueChange={setSpecies}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn cây trồng" />
                  </SelectTrigger>
                  <SelectContent>
                    {CROP_OPTIONS.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* NHÓM VÙNG / GIAI ĐOẠN */}
            <div>
              <p className="text-xs text-muted-foreground">
                Nhóm ruộng / giai đoạn sinh trưởng
              </p>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn nhóm / giai đoạn" />
                </SelectTrigger>
                <SelectContent>
                  {GROUP_OPTIONS.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Mức độ *</p>
                <Select
                  value={severity}
                  onValueChange={(v: "nhẹ" | "trung-binh" | "nang") =>
                    setSeverity(v)
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nhẹ">Nhẹ</SelectItem>
                    <SelectItem value="trung-binh">Trung bình</SelectItem>
                    <SelectItem value="nang">Nặng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Trạng thái phác đồ *
                </p>
                <Select
                  value={status}
                  onValueChange={(
                    v: "dang-ap-dung" | "de-xuat" | "tam-ngung"
                  ) => setStatus(v)}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dang-ap-dung">Đang áp dụng</SelectItem>
                    <SelectItem value="de-xuat">Đề xuất</SelectItem>
                    <SelectItem value="tam-ngung">Tạm ngưng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* NGƯỜI SOẠN – Select kỹ sư */}
              <div>
                <p className="text-xs text-muted-foreground">
                  Người soạn / phụ trách
                </p>
                <Select value={createdBy} onValueChange={setCreatedBy}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn người phụ trách" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPERT_OPTIONS.map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Thời gian áp dụng (ước tính)
                </p>
                <Input
                  value={durationDays}
                  onChange={(e) =>
                    setDurationDays(e.target.value.replace(/\D/g, ""))
                  }
                  className="h-9"
                  placeholder="Số ngày theo dõi / phác đồ"
                />
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Thời gian cách ly (nếu là thuốc BVTV)
                </p>
                <Input
                  value={withdrawalDays}
                  onChange={(e) =>
                    setWithdrawalDays(e.target.value.replace(/\D/g, ""))
                  }
                  className="h-9"
                  placeholder="Số ngày cách ly trước thu hoạch"
                />
              </div>
            </div>
          </div>

          {/* Tóm tắt nhanh */}
          <div className="space-y-3 rounded-md border bg-muted/30 p-3 text-xs">
            <p className="mb-1 text-[11px] font-semibold text-muted-foreground">
              Thông tin tóm tắt
            </p>
            <div className="space-y-1">
              <p>
                <span className="text-muted-foreground">Mã:</span>{" "}
                <span className="font-mono font-semibold">{code || "-"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Cây trồng:</span>{" "}
                <span className="font-medium">{species || "-"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Bệnh / vấn đề:</span>{" "}
                <span className="font-medium">{disease || "-"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Nhóm / giai đoạn:</span>{" "}
                <span className="font-medium">{group || "-"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Mức độ:</span>{" "}
                <Badge
                  variant="outline"
                  className={
                    severity === "nhẹ"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : severity === "trung-binh"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                >
                  {severity === "nhẹ"
                    ? "Nhẹ"
                    : severity === "trung-binh"
                    ? "Trung bình"
                    : "Nặng"}
                </Badge>
              </p>
              <p>
                <span className="text-muted-foreground">Trạng thái:</span>{" "}
                <span className="font-medium">
                  {status === "dang-ap-dung"
                    ? "Đang áp dụng"
                    : status === "de-xuat"
                    ? "Đề xuất"
                    : "Tạm ngưng"}
                </span>
              </p>
            </div>
            <Separator className="my-2" />
            <p className="text-[11px] text-muted-foreground">
              Phác đồ có thể gắn với từng vùng / lô ruộng để chuẩn hoá quy
              trình, giảm nhập liệu lặp lại giữa các vụ.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CHỈ ĐỊNH / CHỐNG CHỈ ĐỊNH / TIÊU CHÍ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Chỉ định, chống chỉ định & tiêu chí sử dụng phác đồ
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Khi nào nên áp dụng phác đồ này?
            </p>
            <Textarea
              value={indications}
              onChange={(e) => setIndications(e.target.value)}
              className="min-h-[80px]"
              placeholder="Mô tả điều kiện, dấu hiệu trên ruộng, giai đoạn cây trồng..."
            />
            <p className="text-[11px] font-semibold text-muted-foreground">
              Khi nào KHÔNG áp dụng?
            </p>
            <Textarea
              value={contra}
              onChange={(e) => setContra(e.target.value)}
              className="min-h-[80px]"
              placeholder="Các trường hợp không phù hợp, cần phác đồ khác..."
            />
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Tiêu chí bắt đầu phác đồ
            </p>
            <Textarea
              value={startCriteria}
              onChange={(e) => setStartCriteria(e.target.value)}
              className="min-h-[80px]"
            />
            <p className="text-[11px] font-semibold text-muted-foreground">
              Tiêu chí kết thúc / chuyển phác đồ
            </p>
            <Textarea
              value={stopCriteria}
              onChange={(e) => setStopCriteria(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground">
              Dấu hiệu cần báo kỹ sư BVTV / escalations
            </p>
            <Textarea
              value={escalationSignals}
              onChange={(e) => setEscalationSignals(e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* CÁC BƯỚC ĐIỀU TRỊ / CHĂM SÓC */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Các bước / hạng mục xử lý & chăm sóc
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {steps.map((s, idx) => (
            <div
              key={s.id}
              className="rounded-md border bg-muted/20 p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold">Bước {idx + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500"
                  onClick={() => handleRemoveStep(s.id)}
                  disabled={steps.length === 1}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Tên hạng mục *
                  </p>
                  <Input
                    value={s.name}
                    onChange={(e) =>
                      handleChangeStep(s.id, "name", e.target.value)
                    }
                    className="h-8"
                    placeholder="VD: Phun thuốc phòng trị đạo ôn"
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Thuốc / biện pháp áp dụng *
                  </p>
                  <Input
                    value={s.medicine}
                    onChange={(e) =>
                      handleChangeStep(s.id, "medicine", e.target.value)
                    }
                    className="h-8"
                    placeholder="Tên thuốc BVTV / phân bón lá / biện pháp canh tác..."
                  />
                </div>
              </div>

              {/* route / frequency / duration – Select cho cây trồng */}
              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Hình thức áp dụng
                  </p>
                  <Select
                    value={s.route}
                    onValueChange={(v) => handleChangeStep(s.id, "route", v)}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Chọn hình thức" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROUTE_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                      <SelectItem value="Khác">
                        Khác (ghi cụ thể ở ghi chú)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tần suất</p>
                  <Select
                    value={s.frequency}
                    onValueChange={(v) =>
                      handleChangeStep(s.id, "frequency", v)
                    }
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Chọn tần suất" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQ_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Thời gian</p>
                  <Select
                    value={s.duration}
                    onValueChange={(v) => handleChangeStep(s.id, "duration", v)}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Chọn thời gian" />
                    </SelectTrigger>
                    <SelectContent>
                      {DURATION_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">Ghi chú</p>
                <Input
                  value={s.note ?? ""}
                  onChange={(e) =>
                    handleChangeStep(s.id, "note", e.target.value)
                  }
                  className="h-8"
                  placeholder="VD: Ưu tiên phun lúc lá khô, không phun trước mưa..."
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-dashed"
            onClick={handleAddStep}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm bước xử lý
          </Button>
        </CardContent>
      </Card>

      {/* THEO DÕI & ĐÁNH GIÁ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Theo dõi & đánh giá hiệu quả trên ruộng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          {monitoring.map((m, idx) => (
            <div
              key={m.id}
              className="rounded-md border bg-muted/20 p-3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold">
                  Giai đoạn theo dõi {idx + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500"
                  onClick={() => handleRemoveMonitor(m.id)}
                  disabled={monitoring.length === 1}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Thời gian / giai đoạn
                  </p>
                  <Input
                    value={m.day}
                    onChange={(e) =>
                      handleChangeMonitor(m.id, "day", e.target.value)
                    }
                    className="h-8"
                    placeholder="VD: Ngày 1–3, Ngày 4–7..."
                  />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Trọng tâm cần theo dõi
                  </p>
                  <Input
                    value={m.focus}
                    onChange={(e) =>
                      handleChangeMonitor(m.id, "focus", e.target.value)
                    }
                    className="h-8"
                    placeholder="VD: Tỷ lệ lá bệnh, mức độ cháy lá, sinh trưởng cây..."
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Kỳ vọng / ngưỡng cần can thiệp thêm
                </p>
                <Input
                  value={m.expected}
                  onChange={(e) =>
                    handleChangeMonitor(m.id, "expected", e.target.value)
                  }
                  className="h-8"
                  placeholder="VD: Nếu bệnh không giảm sau 3 ngày cần báo kỹ sư BVTV..."
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-dashed"
            onClick={handleAddMonitor}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm giai đoạn theo dõi
          </Button>

          <div className="grid gap-3 md:grid-cols-2 pt-2">
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Ghi chú an toàn
              </p>
              <Textarea
                value={safetyNotes}
                onChange={(e) => setSafetyNotes(e.target.value)}
                className="min-h-[80px]"
                placeholder="Lưu ý bảo hộ lao động, nước tưới, cách ly khu dân cư..."
              />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground">
                Kế hoạch đánh giá lại
              </p>
              <Textarea
                value={followupPlan}
                onChange={(e) => setFollowupPlan(e.target.value)}
                className="min-h-[80px]"
                placeholder="Thời điểm khảo sát lại, tiêu chí đánh giá hiệu quả..."
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">
              Ghi chú thêm
            </p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[60px]"
              placeholder="Ghi chú bổ sung về ruộng, giống, điều kiện canh tác..."
            />
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <AlertTriangle className="h-3 w-3 text-amber-500" />
          <span>
            Đây là phác đồ gợi ý nội bộ. Loại thuốc, liều lượng và thời gian
            cách ly phải tuân thủ đúng nhãn thuốc và quy định hiện hành.
          </span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Button variant="outline" size="sm">
            Lưu nháp
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={handleSubmit}
          >
            Lưu phác đồ chuẩn
          </Button>
        </div>
      </div>
    </div>
  );
}
