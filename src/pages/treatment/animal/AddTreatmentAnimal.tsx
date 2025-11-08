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

/* ==== OPTIONS MẪU DÙNG CHO CÁC SELECT ==== */

const DISEASE_OPTIONS = [
  "Viêm vú bò sữa",
  "Viêm tử cung sau đẻ",
  "Sót nhau",
  "Tiêu chảy bê con",
  "Viêm phổi bê",
  "Viêm khớp",
  "Ký sinh trùng máu",
];

const GROUP_OPTIONS = [
  "Đàn bò đang khai thác sữa",
  "Bò cái hậu bị",
  "Bò cái chửa",
  "Bê con 0–6 tháng",
  "Bê hậu bị 6–12 tháng",
  "Bò thịt vỗ béo",
];

const VET_OPTIONS = [
  "Bs. Thú y Nguyễn Văn A",
  "Bs. Thú y Trần Thị B",
  "KTV thú y Lê Văn C",
  "Kỹ sư chăn nuôi Phạm Thị D",
];

const ROUTE_OPTIONS = [
  "Tiêm bắp",
  "Tiêm dưới da",
  "Tiêm tĩnh mạch (theo chỉ định)",
  "Uống",
  "Tại chỗ (bầu vú)",
  "Xịt / nhỏ tại chỗ",
];

const FREQ_OPTIONS = [
  "1 lần/ngày",
  "2 lần/ngày",
  "3 lần/ngày",
  "Mỗi 48 giờ",
  "Theo chỉ định bác sĩ",
];

const DURATION_OPTIONS = [
  "1 ngày",
  "3 ngày",
  "3–5 ngày",
  "5 ngày",
  "7 ngày",
  "7–10 ngày",
];

export default function AddTreatmentProtocolPage() {
  const navigate = useNavigate();
  // Thông tin chung
  const [code, setCode] = React.useState("PD-HF-VIEMVU-01");
  const [name, setName] = React.useState("Phác đồ điều trị viêm vú bò sữa nhẹ");
  const [disease, setDisease] = React.useState("Viêm vú bò sữa");
  const [species, setSpecies] = React.useState("Bò sữa");
  const [group, setGroup] = React.useState("Đàn bò đang khai thác sữa");
  const [severity, setSeverity] = React.useState<"nhẹ" | "trung-binh" | "nang">(
    "nhẹ"
  );
  const [status, setStatus] = React.useState<
    "dang-ap-dung" | "de-xuat" | "tam-ngung"
  >("dang-ap-dung");
  const [durationDays, setDurationDays] = React.useState("5");
  const [withdrawalDays, setWithdrawalDays] = React.useState("3");
  const [createdBy, setCreatedBy] = React.useState("Bs. Thú y Nguyễn Văn A");

  // Chỉ định / chống chỉ định / tiêu chí
  const [indications, setIndications] = React.useState(
    "Viêm vú mức độ nhẹ, không sốt, ăn uống bình thường; Sữa hơi vón cục, bầu vú hơi nóng."
  );
  const [contra, setContra] = React.useState(
    "Bò sốt cao, bỏ ăn, viêm vú nặng; Nghi ngờ nhiễm khuẩn toàn thân, cần phác đồ khác."
  );
  const [startCriteria, setStartCriteria] = React.useState(
    "Phát hiện bất thường sữa trong 24 giờ; Được bác sĩ thú y xác nhận mức độ nhẹ."
  );
  const [stopCriteria, setStopCriteria] = React.useState(
    "Sữa trở lại bình thường; Bầu vú hết sưng nóng, bò ăn uống tốt."
  );
  const [escalationSignals, setEscalationSignals] = React.useState(
    "Sau 48 giờ không cải thiện; Bò sốt, bỏ ăn; Sữa có mủ hoặc máu."
  );

  // Ghi chú / an toàn / theo dõi
  const [safetyNotes, setSafetyNotes] = React.useState(
    "Tuân thủ thời gian ngưng sữa trước khi bán; Đeo găng tay khi xử lý sữa bệnh."
  );
  const [followupPlan, setFollowupPlan] = React.useState(
    "Tái khám sau 2–3 ngày; Ghi nhận sản lượng sữa từng vú mỗi ca vắt."
  );
  const [note, setNote] = React.useState(
    "Có thể điều chỉnh liều theo thể trạng và trọng lượng bò."
  );

  // Bước điều trị
  const [steps, setSteps] = React.useState<Step[]>([
    {
      id: crypto.randomUUID(),
      name: "Điều trị tại chỗ bầu vú",
      medicine: "Thuốc điều trị viêm vú tại chỗ (theo khuyến cáo hãng)",
      route: "Tại chỗ (bầu vú)",
      frequency: "2 lần/ngày",
      duration: "3–5 ngày",
      note: "Vệ sinh sạch núm vú, sát trùng trước khi bơm thuốc.",
    },
    {
      id: crypto.randomUUID(),
      name: "Hỗ trợ toàn thân (nếu cần)",
      medicine:
        "Kháng sinh toàn thân + thuốc kháng viêm (theo chỉ định bác sĩ)",
      route: "Tiêm bắp",
      frequency: "1 lần/ngày",
      duration: "3 ngày",
      note: "Chỉ áp dụng nếu có biểu hiện mệt, sốt nhẹ.",
    },
  ]);

  const [monitoring, setMonitoring] = React.useState<MonitorItem[]>([
    {
      id: crypto.randomUUID(),
      day: "Ngày 1–2",
      focus: "Theo dõi nhiệt độ, mức độ đau/sưng bầu vú, độ đặc của sữa.",
      expected: "Giảm sưng đau, sữa ít vón cục hơn, bò ăn uống bình thường.",
    },
    {
      id: crypto.randomUUID(),
      day: "Ngày 3–5",
      focus: "Đánh giá lại sản lượng sữa, độ trong/sạch của sữa.",
      expected: "Sữa trở lại gần bình thường, không có cục vón, bầu vú mềm.",
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

    console.log("Phác đồ mới:", payload);
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
                Thêm phác đồ điều trị mới
              </h1>
              <p className="text-xs text-muted-foreground">
                Thiết lập phác đồ chuẩn cho từng bệnh, có thể áp dụng lại cho
                nhiều con vật.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-4 w-4" />
          <span>Phác đồ chuẩn chăn nuôi thú y</span>
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
                  placeholder="VD: PD-HF-VIEMVU-01"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Tên phác đồ điều trị *
                </p>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-9"
                  placeholder="VD: Phác đồ viêm vú bò sữa mức độ nhẹ"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {/* BỆNH – chuyển sang Select */}
              <div>
                <p className="text-xs text-muted-foreground">
                  Bệnh / hội chứng *
                </p>
                <Select value={disease} onValueChange={setDisease}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn bệnh / hội chứng" />
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

              {/* ĐỐI TƯỢNG – vẫn Select */}
              <div>
                <p className="text-xs text-muted-foreground">
                  Đối tượng vật nuôi *
                </p>
                <Select value={species} onValueChange={setSpecies}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn đối tượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bò sữa">Bò sữa</SelectItem>
                    <SelectItem value="Bò thịt">Bò thịt</SelectItem>
                    <SelectItem value="Heo nái">Heo nái</SelectItem>
                    <SelectItem value="Heo thịt">Heo thịt</SelectItem>
                    <SelectItem value="Gia cầm">Gia cầm</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* NHÓM ĐÀN – chuyển sang Select */}
            <div>
              <p className="text-xs text-muted-foreground">
                Nhóm đàn / giai đoạn
              </p>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn nhóm đàn / giai đoạn" />
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
                <p className="text-xs text-muted-foreground">Mức độ bệnh *</p>
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

              {/* NGƯỜI SOẠN – chuyển sang Select */}
              <div>
                <p className="text-xs text-muted-foreground">
                  Người soạn / phụ trách
                </p>
                <Select value={createdBy} onValueChange={setCreatedBy}>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn người phụ trách" />
                  </SelectTrigger>
                  <SelectContent>
                    {VET_OPTIONS.map((v) => (
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
                  Thời gian điều trị (ước tính)
                </p>
                <Input
                  value={durationDays}
                  onChange={(e) =>
                    setDurationDays(e.target.value.replace(/\D/g, ""))
                  }
                  className="h-9"
                  placeholder="Số ngày điều trị"
                />
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Thời gian ngưng sữa / thịt (nếu có)
                </p>
                <Input
                  value={withdrawalDays}
                  onChange={(e) =>
                    setWithdrawalDays(e.target.value.replace(/\D/g, ""))
                  }
                  className="h-9"
                  placeholder="Số ngày ngưng sử dụng sản phẩm"
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
                <span className="text-muted-foreground">Đối tượng:</span>{" "}
                <span className="font-medium">{species || "-"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Bệnh:</span>{" "}
                <span className="font-medium">{disease || "-"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Nhóm đàn:</span>{" "}
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
              Bạn có thể lưu phác đồ này vào danh mục chuẩn để tái sử dụng cho
              nhiều ca bệnh khác nhau, giảm thời gian nhập liệu.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CHỈ ĐỊNH, CHỐNG CHỈ ĐỊNH, TIÊU CHÍ */}
      {/* ... phần này giữ nguyên như trước ... */}

      {/* CÁC BƯỚC ĐIỀU TRỊ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Các bước / hạng mục điều trị
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
                    placeholder="VD: Điều trị tại chỗ bầu vú"
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
                    placeholder="Tên thuốc, hoạt chất, chế phẩm..."
                  />
                </div>
              </div>

              {/* route / frequency / duration — ĐỔI THÀNH SELECT */}
              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Đường dùng</p>
                  <Select
                    value={s.route}
                    onValueChange={(v) => handleChangeStep(s.id, "route", v)}
                  >
                    <SelectTrigger className="h-8 w-full">
                      <SelectValue placeholder="Chọn đường dùng" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROUTE_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                      <SelectItem value="Khác">
                        Khác (tự ghi ở ghi chú)
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
                      <SelectItem value="Theo chỉ định bác sĩ">
                        Theo chỉ định bác sĩ
                      </SelectItem>
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
                  placeholder="VD: Vắt bỏ sữa bệnh trong thời gian điều trị..."
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
            Thêm bước điều trị
          </Button>
        </CardContent>
      </Card>

      {/* Phần theo dõi & footer giữ nguyên như trước */}
      {/* ... */}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <AlertTriangle className="h-3 w-3 text-amber-500" />
          <span>
            Đây là phác đồ gợi ý, cần được bác sĩ thú y xem xét trước khi áp
            dụng thực tế.
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
