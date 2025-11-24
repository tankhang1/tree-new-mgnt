"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  ShieldCheck,
  Users2,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CULTIVATION_METHODS } from "@/pages/data/cultivation-methods";
import { IRRIGATION_METHODS } from "@/pages/data/irrigation-method";
import { SEEDS } from "@/pages/data/seeds";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Scope = "region" | "area" | "lot";

type Certificate = {
  id: string;
  name: string;
  code: string;
  type: string;
  validYears: number;
  imageUrl: string;
};

type StaffStatus = "ACTIVE" | "PROBATION";

type Staff = {
  id: string;
  name: string;
  avatarUrl: string;
  role: string;
  level: string;
  department: string;
  status: StaffStatus;
};

type LotNode = {
  id: string;
  code: string;
  name: string;
  areaName: string;
  regionName: string;
};

type AreaNode = {
  id: string;
  code: string;
  name: string;
  regionName: string;
  lots: LotNode[];
};

type RegionNode = {
  id: string;
  code: string;
  name: string;
  areaM2: number;
  soilType: string;
  terrain: string;
  note: string;
  areas: AreaNode[];
};

const CERTIFICATES: Certificate[] = [
  {
    id: "cert-vietgap",
    name: "Chứng nhận VietGAP",
    code: "GCN-VG-2025-001",
    type: "Cây trồng phổ biến",
    validYears: 3,
    imageUrl:
      "https://cdn.vietnambiz.vn/2020/3/2/vg-15831176957661073999454.jpg",
  },
  {
    id: "cert-globalgap",
    name: "GlobalG.A.P.",
    code: "GG-2025-013",
    type: "Quốc tế",
    validYears: 3,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROaU8VwO_xgj9ZF43F_pgJkpaU8A7AaARzJg&s",
  },
  {
    id: "cert-organic",
    name: "Hữu cơ (Organic)",
    code: "ORG-2025-009",
    type: "Canh tác hữu cơ",
    validYears: 5,
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBd-MjuuAkf5zD1-SWSMxMIG-X0Wu4UvIzDQ&s",
  },
];

const STAFFS: Staff[] = [
  {
    id: "staff-1",
    name: "Nguyễn Văn A",
    avatarUrl:
      "https://thehuboncanal.org/wp-content/uploads/2016/11/MALE-PERSON-PLACEHOLDER.jpg",
    role: "Kỹ sư canh tác",
    level: "Trưởng nhóm",
    department: "Phòng Nông nghiệp",
    status: "ACTIVE",
  },
  {
    id: "staff-2",
    name: "Trần Thị B",
    avatarUrl:
      "https://thehuboncanal.org/wp-content/uploads/2016/11/MALE-PERSON-PLACEHOLDER.jpg",
    role: "Nhân viên kỹ thuật",
    level: "Nhân viên",
    department: "Phòng Kỹ thuật",
    status: "PROBATION",
  },
  {
    id: "staff-3",
    name: "Lê Văn C",
    avatarUrl:
      "https://thehuboncanal.org/wp-content/uploads/2016/11/MALE-PERSON-PLACEHOLDER.jpg",
    role: "Nhân viên kho",
    level: "Nhân viên",
    department: "Phòng Vật tư",
    status: "ACTIVE",
  },
  {
    id: "staff-4",
    name: "Phạm Thị D",
    avatarUrl:
      "https://thehuboncanal.org/wp-content/uploads/2016/11/MALE-PERSON-PLACEHOLDER.jpg",
    role: "Trưởng bộ phận",
    level: "Quản lý",
    department: "Phòng Sản xuất",
    status: "ACTIVE",
  },
];

const REGIONS: RegionNode[] = [
  {
    id: "vt-001",
    code: "VT-001",
    name: "Vùng Đậu Nành An Giang",
    areaM2: 50000,
    soilType: "Đất đỏ bazan",
    terrain: "Cao, Thoai thoải",
    note: "Ưu tiên hệ thống tưới nhỏ giọt.",
    areas: [
      {
        id: "kv-bac",
        code: "KV-BAC",
        name: "Khu vực phía Bắc",
        regionName: "Vùng Đậu Nành An Giang",
        lots: [
          {
            id: "lo-a01",
            code: "LO-A01",
            name: "Lô A01",
            areaName: "Khu vực phía Bắc",
            regionName: "Vùng Đậu Nành An Giang",
          },
          {
            id: "lo-a02",
            code: "LO-A02",
            name: "Lô A02",
            areaName: "Khu vực phía Bắc",
            regionName: "Vùng Đậu Nành An Giang",
          },
        ],
      },
      {
        id: "kv-nam",
        code: "KV-NAM",
        name: "Khu vực phía Nam",
        regionName: "Vùng Đậu Nành An Giang",
        lots: [
          {
            id: "lo-b01",
            code: "LO-B01",
            name: "Lô B01",
            areaName: "Khu vực phía Nam",
            regionName: "Vùng Đậu Nành An Giang",
          },
        ],
      },
    ],
  },
  {
    id: "vt-002",
    code: "VT-002",
    name: "Vùng Ngô Đồng Tháp",
    areaM2: 45000,
    soilType: "Đất thịt",
    terrain: "Bằng phẳng",
    note: "Gần kênh tưới tiêu, thuận lợi vận chuyển.",
    areas: [
      {
        id: "kv-dong",
        code: "KV-DONG",
        name: "Khu vực Đồng",
        regionName: "Vùng Ngô Đồng Tháp",
        lots: [
          {
            id: "lo-c01",
            code: "LO-C01",
            name: "Lô C01",
            areaName: "Khu vực Đồng",
            regionName: "Vùng Ngô Đồng Tháp",
          },
        ],
      },
    ],
  },
];

function formatArea(m2: number) {
  const ha = m2 / 10000;
  return `${m2.toLocaleString("vi-VN")} m² (${ha.toFixed(1)} ha)`;
}
type CropConfig = {
  cultivationMethodId?: string;
  irrigationMethod?: string;
  seedId?: string;
  seedLayout?: string;
};
export default function AddFarmingRegionPage() {
  const [step, setStep] = useState<number>(1);

  const navigate = useNavigate();
  const [scope, setScope] = useState<Scope>("region");
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>([
    CERTIFICATES[0]?.id,
  ]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([
    STAFFS[0]?.id,
    STAFFS[1]?.id,
  ]);
  const [regionConfig, setRegionConfig] = useState<CropConfig>({});
  const [areaConfigs, setAreaConfigs] = useState<Record<string, CropConfig>>(
    {}
  );
  const [lotConfigs, setLotConfigs] = useState<Record<string, CropConfig>>({});
  const totalRegions = REGIONS.length;
  const totalAreas = useMemo(
    () => REGIONS.reduce((sum, r) => sum + r.areas.length, 0),
    []
  );
  const totalLots = useMemo(
    () =>
      REGIONS.reduce(
        (sum, r) => sum + r.areas.reduce((s, a) => s + a.lots.length, 0),
        0
      ),
    []
  );

  const handleToggleCert = (id: string) => {
    setSelectedCertIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleStaff = (id: string) => {
    setSelectedStaffIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllCerts = () => {
    setSelectedCertIds(CERTIFICATES.map((c) => c.id));
  };

  const handleClearCerts = () => {
    setSelectedCertIds([]);
  };

  const handleSelectAllStaff = () => {
    setSelectedStaffIds(STAFFS.map((s) => s.id));
  };

  const handleClearStaff = () => {
    setSelectedStaffIds([]);
  };

  const handleNext = () => {
    setStep((prev) => (prev < 3 ? prev + 1 : prev));
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">
              Thêm mới vùng trồng theo từng bước
            </h1>
            <p className="text-xs text-muted-foreground">
              Bước 1: Vùng trồng · Bước 2: Cây trồng · Bước 3: Xác nhận.
            </p>
          </div>
        </div>
        <Stepper step={step} />
      </header>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Phạm vi áp dụng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={scope}
            onValueChange={(v) => setScope(v as Scope)}
            className="grid gap-2 md:grid-cols-3"
          >
            <ScopeOption
              value="region"
              label="Theo vùng"
              description={`${totalRegions} vùng trồng`}
              active={scope === "region"}
            />
            <ScopeOption
              value="area"
              label="Theo khu vực"
              description={`${totalAreas} khu vực trong các vùng`}
              active={scope === "area"}
            />
            <ScopeOption
              value="lot"
              label="Theo lô"
              description={`${totalLots} lô trồng trong toàn hệ thống`}
              active={scope === "lot"}
            />
          </RadioGroup>
          <p className="text-[11px] text-muted-foreground">
            Chọn phạm vi để áp dụng chung{" "}
            <span className="font-semibold">giấy chứng nhận</span> và{" "}
            <span className="font-semibold">nhân viên quản lý</span>. Có thể
            chỉnh sửa chi tiết ở màn hình cấu hình sau.
          </p>
        </CardContent>
      </Card>
      {step === 1 && (
        <Step1Region
          handleClearCerts={handleClearCerts}
          handleClearStaff={handleClearStaff}
          handleSelectAllCerts={handleSelectAllCerts}
          handleSelectAllStaff={handleSelectAllStaff}
          handleToggleCert={handleToggleCert}
          handleToggleStaff={handleToggleStaff}
          scope={scope}
          selectedCertIds={selectedCertIds}
          selectedStaffIds={selectedStaffIds}
        />
      )}
      {step === 2 && (
        <Step2Tree
          scope={scope}
          regionConfig={regionConfig}
          areaConfigs={areaConfigs}
          lotConfigs={lotConfigs}
          onChangeRegionConfig={setRegionConfig}
          onChangeAreaConfig={(areaId, config) =>
            setAreaConfigs((prev) => ({ ...prev, [areaId]: config }))
          }
          onChangeLotConfig={(lotId, config) =>
            setLotConfigs((prev) => ({ ...prev, [lotId]: config }))
          }
        />
      )}
      {step === 3 && (
        <Step3Confirm
          scope={scope}
          selectedCertIds={selectedCertIds}
          selectedStaffIds={selectedStaffIds}
          regionConfig={regionConfig}
          areaConfigs={areaConfigs}
          lotConfigs={lotConfigs}
        />
      )}

      <div className="mt-2 mb-2 flex items-center justify-between border-t pt-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
        <Button
          size="sm"
          className="bg-primary! text-primary-foreground!"
          onClick={handleNext}
        >
          {step === 3 ? "Hoàn tất" : "Tiếp theo"}
        </Button>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = [
    { id: 1, label: "Vùng trồng" },
    { id: 2, label: "Cây trồng" },
    { id: 3, label: "Xác nhận" },
  ];

  return (
    <div className="flex flex-1 items-center gap-3">
      {steps.map((s, index) => {
        const isActive = s.id === step;
        const isDone = s.id < step;

        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-9 items-center rounded-full border px-3 text-xs font-medium ${
                isDone
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isActive
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted text-muted-foreground"
              }`}
            >
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  s.id
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase">
                  Bước {s.id}
                </span>
                <span className="text-[10px]">{s.label}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="h-px flex-1 bg-emerald-500/60" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ScopeOption({
  value,
  label,
  description,
  active,
}: {
  value: Scope;
  label: string;
  description: string;
  active: boolean;
}) {
  return (
    <Label
      htmlFor={value}
      className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2 text-xs transition ${
        active
          ? "border-emerald-500 bg-emerald-50 text-emerald-900"
          : "border-border bg-card hover:bg-muted/60"
      }`}
    >
      <RadioGroupItem id={value} value={value} className="mt-0.5" />
      <div className="flex flex-col">
        <span className="font-semibold">{label}</span>
        <span className="text-[11px] text-muted-foreground">{description}</span>
      </div>
    </Label>
  );
}

function CertificateSelectableCard({
  cert,
  selected,
  onToggle,
}: {
  cert: Certificate;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex min-w-[260px] items-center gap-3 rounded-lg border px-3 py-2 text-left text-xs shadow-sm transition ${
        selected
          ? "border-emerald-500 bg-emerald-50"
          : "border-border bg-card hover:bg-muted/60"
      }`}
    >
      <img
        src={cert.imageUrl}
        alt={cert.name}
        className="h-12 w-12 rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col">
        <p className="text-sm font-semibold">{cert.name}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Mã số:{" "}
          <span className="font-medium text-foreground">{cert.code}</span>
        </p>
        <div className="mt-1 flex items-center gap-1">
          <Badge
            variant="outline"
            className="rounded-full border-emerald-500 bg-emerald-50 text-[10px] font-medium text-emerald-700"
          >
            <ShieldCheck className="mr-1 h-3 w-3" />
            {cert.type}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            Hiệu lực {cert.validYears} năm
          </span>
        </div>
      </div>
      {selected && <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />}
    </button>
  );
}

function StaffSelectableCard({
  staff,
  selected,
  onToggle,
}: {
  staff: Staff;
  selected: boolean;
  onToggle: () => void;
}) {
  const statusLabel = staff.status === "ACTIVE" ? "ĐANG HOẠT ĐỘNG" : "THỬ VIỆC";
  const statusClass =
    staff.status === "ACTIVE"
      ? "bg-emerald-50 text-emerald-700 border-emerald-500"
      : "bg-amber-50 text-amber-700 border-amber-500";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex min-w-[260px] items-center gap-3 rounded-lg border px-3 py-2 text-left text-xs shadow-sm transition ${
        selected
          ? "border-emerald-500 bg-emerald-50"
          : "border-border bg-card hover:bg-muted/60"
      }`}
    >
      <img
        src={staff.avatarUrl}
        alt={staff.name}
        className="h-12 w-12 rounded-full object-cover"
      />
      <div className="flex flex-1 flex-col">
        <p className="text-sm font-semibold">{staff.name}</p>
        <div className="mt-1 flex flex-wrap items-center gap-1">
          <span className="text-[11px] text-muted-foreground">
            Vai trò:{" "}
            <span className="font-medium text-foreground">{staff.role}</span>
          </span>
          <Separator orientation="vertical" className="h-3" />
          <span className="text-[11px] text-muted-foreground">
            Cấp bậc:{" "}
            <span className="font-medium text-foreground">{staff.level}</span>
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Phòng ban:{" "}
          <span className="font-medium text-foreground">
            {staff.department}
          </span>
        </p>
        <Badge
          variant="outline"
          className={`mt-1 w-fit rounded-full border px-2 py-0 text-[10px] font-semibold ${statusClass}`}
        >
          <Users2 className="mr-1 h-3 w-3" />
          {statusLabel}
        </Badge>
      </div>
      {selected && <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />}
    </button>
  );
}

function RegionCard({ region }: { region: RegionNode }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-between gap-2 p-3 text-xs">
        <div>
          <p className="text-[11px] text-muted-foreground">Vùng trồng</p>
          <p className="text-sm font-semibold">{region.name}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Mã vùng:{" "}
            <span className="font-medium text-foreground">{region.code}</span>
          </p>
        </div>
        <div className="mt-1 space-y-0.5">
          <p className="text-[11px] text-muted-foreground">
            Diện tích:{" "}
            <span className="font-medium text-foreground">
              {formatArea(region.areaM2)}
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            Loại đất:{" "}
            <span className="font-medium text-foreground">
              {region.soilType}
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            Địa hình:{" "}
            <span className="font-medium text-foreground">
              {region.terrain}
            </span>
          </p>
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
          Ghi chú: {region.note}
        </p>
      </CardContent>
    </Card>
  );
}

function AreaCard({ area }: { area: AreaNode }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-between gap-2 p-3 text-xs">
        <div>
          <p className="text-[11px] text-muted-foreground">Khu vực</p>
          <p className="text-sm font-semibold">{area.name}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Mã khu:{" "}
            <span className="font-medium text-foreground">{area.code}</span>
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Thuộc vùng:{" "}
          <span className="font-medium text-foreground">{area.regionName}</span>
        </p>
        <p className="text-[11px] text-muted-foreground">
          Số lô canh tác:{" "}
          <span className="font-medium text-foreground">
            {area.lots.length}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}

function LotCard({ lot }: { lot: LotNode }) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col justify-between gap-2 p-3 text-xs">
        <div>
          <p className="text-[11px] text-muted-foreground">Lô trồng</p>
          <p className="text-sm font-semibold">{lot.name}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Mã lô:{" "}
            <span className="font-medium text-foreground">{lot.code}</span>
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Khu vực:{" "}
          <span className="font-medium text-foreground">{lot.areaName}</span>
        </p>
        <p className="text-[11px] text-muted-foreground">
          Vùng:{" "}
          <span className="font-medium text-foreground">{lot.regionName}</span>
        </p>
      </CardContent>
    </Card>
  );
}

function labelScope(scope: Scope) {
  if (scope === "region") return "vùng";
  if (scope === "area") return "khu vực";
  return "lô";
}

type TStep1Region = {
  scope: Scope;
  handleSelectAllCerts: () => void;
  handleClearCerts: () => void;
  selectedCertIds: string[];
  handleToggleCert: (id: string) => void;
  handleSelectAllStaff: () => void;
  handleClearStaff: () => void;
  selectedStaffIds: string[];
  handleToggleStaff: (id: string) => void;
};

const Step1Region = ({
  scope,
  handleSelectAllCerts,
  handleClearCerts,
  selectedCertIds,
  handleToggleCert,
  handleSelectAllStaff,
  handleClearStaff,
  selectedStaffIds,
  handleToggleStaff,
}: TStep1Region) => {
  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-3 md:grid-cols-[2fr,3fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              Thông tin khu vực canh tác
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground">Khu vực canh tác</p>
              <Input className="h-9" placeholder="Tên khu vực canh tác" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ghi chú</p>
              <Textarea className="h-9" placeholder="Ghi chú" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              Giấy chứng nhận áp dụng
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px]"
                onClick={handleSelectAllCerts}
              >
                Chọn tất cả
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-[11px] text-muted-foreground"
                onClick={handleClearCerts}
              >
                Bỏ chọn
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-2">
            <ScrollArea className="w-full">
              <div className="flex gap-3 overflow-x-auto pb-1">
                {CERTIFICATES.map((cert) => (
                  <CertificateSelectableCard
                    key={cert.id}
                    cert={cert}
                    selected={selectedCertIds.includes(cert.id)}
                    onToggle={() => handleToggleCert(cert.id)}
                  />
                ))}
              </div>
            </ScrollArea>
            <p className="text-[11px] text-muted-foreground">
              Đã chọn{" "}
              <span className="font-semibold">
                {selectedCertIds.length}/{CERTIFICATES.length}
              </span>{" "}
              giấy chứng nhận cho phạm vi{" "}
              <span className="font-semibold">{labelScope(scope)}</span>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold">
              Nhân viên quản lý
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-[11px]"
                onClick={handleSelectAllStaff}
              >
                Chọn tất cả
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-[11px] text-muted-foreground"
                onClick={handleClearStaff}
              >
                Bỏ chọn
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <ScrollArea className="w-full">
              <div className="flex gap-3 overflow-x-auto pb-1">
                {STAFFS.map((staff) => (
                  <StaffSelectableCard
                    key={staff.id}
                    staff={staff}
                    selected={selectedStaffIds.includes(staff.id)}
                    onToggle={() => handleToggleStaff(staff.id)}
                  />
                ))}
              </div>
            </ScrollArea>
            <p className="text-[11px] text-muted-foreground">
              Đã chọn{" "}
              <span className="font-semibold">
                {selectedStaffIds.length}/{STAFFS.length}
              </span>{" "}
              nhân viên cho phạm vi{" "}
              <span className="font-semibold">{labelScope(scope)}</span>.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin theo {labelScope(scope)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scope === "region" && (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {REGIONS.map((region) => (
                <RegionCard key={region.id} region={region} />
              ))}
            </div>
          )}

          {scope === "area" && (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {REGIONS.flatMap((region) =>
                region.areas.map((area) => (
                  <AreaCard key={area.id} area={area} />
                ))
              )}
            </div>
          )}

          {scope === "lot" && (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {REGIONS.flatMap((region) =>
                region.areas.flatMap((area) =>
                  area.lots.map((lot) => <LotCard key={lot.id} lot={lot} />)
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

type AreaConfig = {
  id: string;
  code: string;
  name: string;
};

const AREAS: AreaConfig[] = [
  { id: "kv-bac", code: "KV-BAC", name: "Khu vực phía Bắc" },
  { id: "kv-nam", code: "KV-NAM", name: "Khu vực phía Nam" },
  { id: "kv-dong", code: "KV-DONG", name: "Khu vực Đồng" },
];

const LOTS_CONFIG = REGIONS.flatMap((region) =>
  region.areas.flatMap((area) =>
    area.lots.map((lot) => ({
      ...lot,
      areaName: area.name,
      regionName: region.name,
    }))
  )
);

type TStep2Tree = {
  scope: Scope;
  regionConfig: CropConfig;
  areaConfigs: Record<string, CropConfig>;
  lotConfigs: Record<string, CropConfig>;
  onChangeRegionConfig: (config: CropConfig) => void;
  onChangeAreaConfig: (areaId: string, config: CropConfig) => void;
  onChangeLotConfig: (lotId: string, config: CropConfig) => void;
};

const Step2Tree = ({
  scope,
  regionConfig,
  areaConfigs,
  lotConfigs,
  onChangeRegionConfig,
  onChangeAreaConfig,
  onChangeLotConfig,
}: TStep2Tree) => {
  if (scope === "region") {
    const handleRegionChange = (partial: Partial<CropConfig>) => {
      onChangeRegionConfig({ ...regionConfig, ...partial });
    };

    return (
      <div className="flex flex-col gap-4">
        <section className="grid gap-3 md:grid-cols-[2fr,3fr]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">
                Cấu hình vùng canh tác
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Phương pháp canh tác
                </p>
                <Select
                  value={regionConfig.cultivationMethodId}
                  onValueChange={(value) =>
                    handleRegionChange({ cultivationMethodId: value })
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn phương pháp canh tác" />
                  </SelectTrigger>
                  <SelectContent>
                    {CULTIVATION_METHODS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium">
                            {item.label}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Tối đa 3 giống trên lô tùy phương pháp.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Phương pháp tưới tiêu
                </p>
                <Select
                  value={regionConfig.irrigationMethod}
                  onValueChange={(value) =>
                    handleRegionChange({ irrigationMethod: value })
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn phương pháp tưới tiêu" />
                  </SelectTrigger>
                  <SelectContent>
                    {IRRIGATION_METHODS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-muted-foreground">
                  Tối đa 3 giống trên lô tùy phương pháp.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-1">
                  Danh sách hạt giống
                </p>
                <Select
                  value={regionConfig.seedId}
                  onValueChange={(value) =>
                    handleRegionChange({ seedId: value })
                  }
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn hạt giống 1" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEEDS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <div className="flex items-center gap-2">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-5 w-5 rounded object-cover"
                          />
                          <span className="text-xs">{item.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Cấu hình hạt giống
                </p>
                <Input
                  className="h-9"
                  placeholder="VD: LVN10 hàng chẵn, MX2 hàng lẻ..."
                  value={regionConfig.seedLayout ?? ""}
                  onChange={(e) =>
                    handleRegionChange({ seedLayout: e.target.value })
                  }
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Mô tả chi tiết cách bố trí hạt giống trên lô.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  if (scope === "area") {
    return (
      <div className="flex flex-col gap-4">
        <section className="grid gap-3 md:grid-cols-[2fr,3fr]">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">
                Cấu hình khu vực canh tác
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Accordion
                type="multiple"
                defaultValue={AREAS.map((item) => item.id)}
                className="w-full space-y-3"
              >
                {AREAS.map((area) => {
                  const config = areaConfigs[area.id] ?? {};
                  const handleAreaChange = (partial: Partial<CropConfig>) => {
                    onChangeAreaConfig(area.id, { ...config, ...partial });
                  };

                  return (
                    <AccordionItem key={area.id} value={area.id}>
                      <AccordionTrigger className="px-3 py-2 text-left text-sm font-semibold bg-muted rounded-md">
                        <div className="flex flex-col gap-0.5">
                          <span>{area.name}</span>
                          <span className="text-[11px] font-normal text-muted-foreground">
                            Mã khu vực: {area.code}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border-x border-b border-muted bg-card px-4 pb-4 pt-3 rounded-b-md">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Phương pháp canh tác
                            </p>
                            <Select
                              value={config.cultivationMethodId}
                              onValueChange={(value) =>
                                handleAreaChange({
                                  cultivationMethodId: value,
                                })
                              }
                            >
                              <SelectTrigger className="h-9 w-full">
                                <SelectValue placeholder="Chọn phương pháp canh tác" />
                              </SelectTrigger>
                              <SelectContent>
                                {CULTIVATION_METHODS.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-xs font-medium">
                                        {item.label}
                                      </span>
                                      <span className="text-[11px] text-muted-foreground">
                                        {item.description}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-[11px] text-muted-foreground">
                              Tối đa 3 giống trên lô tùy phương pháp.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Phương pháp tưới tiêu
                            </p>
                            <Select
                              value={config.irrigationMethod}
                              onValueChange={(value) =>
                                handleAreaChange({
                                  irrigationMethod: value,
                                })
                              }
                            >
                              <SelectTrigger className="h-9 w-full">
                                <SelectValue placeholder="Chọn phương pháp tưới tiêu" />
                              </SelectTrigger>
                              <SelectContent>
                                {IRRIGATION_METHODS.map((item) => (
                                  <SelectItem key={item} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-[11px] text-muted-foreground">
                              Tối đa 3 giống trên lô tùy phương pháp.
                            </p>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <p className="mb-1 text-xs text-muted-foreground">
                              Danh sách hạt giống
                            </p>
                            <Select
                              value={config.seedId}
                              onValueChange={(value) =>
                                handleAreaChange({ seedId: value })
                              }
                            >
                              <SelectTrigger className="h-9 w-full">
                                <SelectValue placeholder="Chọn hạt giống 1" />
                              </SelectTrigger>
                              <SelectContent>
                                {SEEDS.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="h-5 w-5 rounded object-cover"
                                      />
                                      <span className="text-xs">
                                        {item.name}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="md:col-span-2">
                            <p className="mb-1 text-xs text-muted-foreground">
                              Cấu hình hạt giống
                            </p>
                            <Input
                              className="h-9"
                              placeholder="VD: LVN10 hàng chẵn, MX2 hàng lẻ..."
                              value={config.seedLayout ?? ""}
                              onChange={(e) =>
                                handleAreaChange({
                                  seedLayout: e.target.value,
                                })
                              }
                            />
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              Mô tả chi tiết cách bố trí hạt giống trên lô.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  if (scope === "lot") {
    return (
      <div className="flex flex-col gap-4">
        <section className="grid gap-3 md:grid-cols-[2fr,3fr]">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold">
                Cấu hình theo từng lô canh tác
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Accordion
                type="multiple"
                defaultValue={LOTS_CONFIG.map((item) => item.id)}
                className="w-full"
              >
                {LOTS_CONFIG.map((lot) => {
                  const config = lotConfigs[lot.id] ?? {};
                  const handleLotChange = (partial: Partial<CropConfig>) => {
                    onChangeLotConfig(lot.id, { ...config, ...partial });
                  };

                  return (
                    <AccordionItem key={lot.id} value={lot.id}>
                      <AccordionTrigger className="px-3 py-2 text-left text-sm font-semibold bg-muted rounded-md">
                        <div className="flex flex-col gap-0.5">
                          <span>{lot.name}</span>
                          <span className="text-[11px] font-normal text-muted-foreground">
                            Mã lô: {lot.code} · Khu vực: {lot.areaName} · Vùng:{" "}
                            {lot.regionName}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="border-x border-b border-muted bg-card px-4 pb-4 pt-3 rounded-b-md">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Phương pháp canh tác
                            </p>
                            <Select
                              value={config.cultivationMethodId}
                              onValueChange={(value) =>
                                handleLotChange({
                                  cultivationMethodId: value,
                                })
                              }
                            >
                              <SelectTrigger className="h-9 w-full">
                                <SelectValue placeholder="Chọn phương pháp canh tác" />
                              </SelectTrigger>
                              <SelectContent>
                                {CULTIVATION_METHODS.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    <div className="flex flex-col gap-0.5">
                                      <span className="text-xs font-medium">
                                        {item.label}
                                      </span>
                                      <span className="text-[11px] text-muted-foreground">
                                        {item.description}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-[11px] text-muted-foreground">
                              Tối đa 3 giống trên lô tùy phương pháp.
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-muted-foreground">
                              Phương pháp tưới tiêu
                            </p>
                            <Select
                              value={config.irrigationMethod}
                              onValueChange={(value) =>
                                handleLotChange({
                                  irrigationMethod: value,
                                })
                              }
                            >
                              <SelectTrigger className="h-9 w-full">
                                <SelectValue placeholder="Chọn phương pháp tưới tiêu" />
                              </SelectTrigger>
                              <SelectContent>
                                {IRRIGATION_METHODS.map((item) => (
                                  <SelectItem key={item} value={item}>
                                    {item}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-[11px] text-muted-foreground">
                              Tối đa 3 giống trên lô tùy phương pháp.
                            </p>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <p className="mb-1 text-xs text-muted-foreground">
                              Danh sách hạt giống
                            </p>
                            <Select
                              value={config.seedId}
                              onValueChange={(value) =>
                                handleLotChange({ seedId: value })
                              }
                            >
                              <SelectTrigger className="h-9 w-full">
                                <SelectValue placeholder="Chọn hạt giống 1" />
                              </SelectTrigger>
                              <SelectContent>
                                {SEEDS.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    <div className="flex items-center gap-2">
                                      <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="h-5 w-5 rounded object-cover"
                                      />
                                      <span className="text-xs">
                                        {item.name}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="md:col-span-2">
                            <p className="mb-1 text-xs text-muted-foreground">
                              Cấu hình hạt giống
                            </p>
                            <Input
                              className="h-9"
                              placeholder="VD: LVN10 hàng chẵn, MX2 hàng lẻ..."
                              value={config.seedLayout ?? ""}
                              onChange={(e) =>
                                handleLotChange({
                                  seedLayout: e.target.value,
                                })
                              }
                            />
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              Mô tả chi tiết cách bố trí hạt giống trên lô.
                            </p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  }

  return null;
};
type TStep3Confirm = {
  scope: Scope;
  selectedCertIds: string[];
  selectedStaffIds: string[];
  regionConfig: CropConfig;
  areaConfigs: Record<string, CropConfig>;
  lotConfigs: Record<string, CropConfig>;
};

const Step3Confirm = ({
  scope,
  selectedCertIds,
  selectedStaffIds,
  regionConfig,
  areaConfigs,
  lotConfigs,
}: TStep3Confirm) => {
  const selectedCerts = CERTIFICATES.filter((item) =>
    selectedCertIds.includes(item.id)
  );
  const selectedStaffs = STAFFS.filter((item) =>
    selectedStaffIds.includes(item.id)
  );

  const totalRegions = REGIONS.length;
  const totalAreas = REGIONS.reduce(
    (sum, region) => sum + region.areas.length,
    0
  );
  const totalLots = REGIONS.reduce(
    (sum, region) =>
      sum + region.areas.reduce((s, area) => s + area.lots.length, 0),
    0
  );

  const appliedItems =
    scope === "region"
      ? REGIONS
      : scope === "area"
      ? REGIONS.flatMap((region) => region.areas)
      : REGIONS.flatMap((region) => region.areas.flatMap((area) => area.lots));

  const findCultivationLabel = (id?: string) =>
    CULTIVATION_METHODS.find((item) => item.id === id)?.label;

  const findSeed = (id?: string) => SEEDS.find((item) => item.id === id);

  const isEmptyConfig = (config: CropConfig | undefined) =>
    !config ||
    (!config.cultivationMethodId &&
      !config.irrigationMethod &&
      !config.seedId &&
      !config.seedLayout);

  const scopeConfigs =
    scope === "region"
      ? [{ id: "region-all", name: "Toàn bộ vùng", config: regionConfig }]
      : scope === "area"
      ? AREAS.map((area) => ({
          id: area.id,
          name: area.name,
          config: areaConfigs[area.id],
        }))
      : LOTS_CONFIG.map((lot) => ({
          id: lot.id,
          name: `${lot.name} (${lot.areaName} · ${lot.regionName})`,
          config: lotConfigs[lot.id],
        }));

  const nonEmptyConfigs = scopeConfigs.filter(
    (item) => !isEmptyConfig(item.config)
  );

  const uniqueCultivations = Array.from(
    new Set(
      nonEmptyConfigs
        .map((item) => findCultivationLabel(item.config?.cultivationMethodId))
        .filter(Boolean)
    )
  );
  const uniqueIrrigations = Array.from(
    new Set(
      nonEmptyConfigs
        .map((item) => item.config?.irrigationMethod)
        .filter(Boolean)
    )
  );
  const uniqueSeeds = Array.from(
    new Set(
      nonEmptyConfigs
        .map((item) => item.config?.seedId)
        .filter(Boolean) as string[]
    )
  )
    .map((id) => findSeed(id))
    .filter(Boolean) as { id: string; name: string; imageUrl: string }[];

  const scopeLabel = labelScope(scope);

  return (
    <div className="flex flex-col gap-4">
      <section className="grid gap-3 md:grid-cols-3">
        <Card className="border-emerald-100 bg-emerald-50/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700">
                {scope === "region" ? "V" : scope === "area" ? "K" : "L"}
              </span>
              Tổng quan phạm vi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="rounded-md bg-white/70 px-3 py-2 text-[11px]">
              <p className="text-muted-foreground">
                Phạm vi áp dụng theo{" "}
                <span className="font-semibold">{scopeLabel}</span>.
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Cấu hình sẽ được dùng để sinh cây trồng, phân bổ nhân sự và giấy
                chứng nhận cho toàn bộ phạm vi này.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <div className="rounded-md border bg-white px-2 py-1.5">
                <p className="text-muted-foreground">Vùng</p>
                <p className="text-sm font-semibold">{totalRegions}</p>
              </div>
              <div className="rounded-md border bg-white px-2 py-1.5">
                <p className="text-muted-foreground">Khu vực</p>
                <p className="text-sm font-semibold">{totalAreas}</p>
              </div>
              <div className="rounded-md border bg-white px-2 py-1.5">
                <p className="text-muted-foreground">Lô trồng</p>
                <p className="text-sm font-semibold">{totalLots}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Tóm tắt cấu hình cây trồng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            {nonEmptyConfigs.length === 0 ? (
              <p className="text-[11px] text-muted-foreground">
                Chưa cấu hình cây trồng cho {scopeLabel}. Vui lòng quay lại bước
                2 nếu cần điều chỉnh.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    Đã cấu hình:{" "}
                    <span className="font-semibold">
                      {nonEmptyConfigs.length}/{scopeConfigs.length}{" "}
                      {scopeLabel}
                    </span>
                  </span>
                  {uniqueCultivations.length > 0 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                      {uniqueCultivations.length > 1
                        ? "Nhiều phương pháp canh tác"
                        : "Phương pháp canh tác thống nhất"}
                    </span>
                  )}
                </div>

                {uniqueCultivations.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Phương pháp canh tác
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {uniqueCultivations.map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-muted px-2 py-0.5 text-[11px]"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {uniqueIrrigations.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Phương pháp tưới tiêu
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {uniqueIrrigations.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-muted px-2 py-0.5 text-[11px]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {uniqueSeeds.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Hạt giống sử dụng
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSeeds.map((seed) => (
                        <div
                          key={seed.id}
                          className="flex items-center gap-1.5 rounded-md border bg-muted/60 px-2 py-1"
                        >
                          <img
                            src={seed.imageUrl}
                            alt={seed.name}
                            className="h-6 w-6 rounded object-cover"
                          />
                          <span className="text-[11px] font-medium">
                            {seed.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Nhân sự & giấy chứng nhận
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2">
              <div className="flex flex-col">
                <span className="text-[11px] text-muted-foreground">
                  Giấy chứng nhận
                </span>
                <span className="text-sm font-semibold">
                  {selectedCerts.length}/{CERTIFICATES.length}
                </span>
              </div>
              <div className="flex -space-x-1.5">
                {selectedCerts.slice(0, 3).map((cert) => (
                  <img
                    key={cert.id}
                    src={cert.imageUrl}
                    alt={cert.name}
                    className="h-7 w-7 rounded border border-background object-cover"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md bg-muted/60 px-3 py-2">
              <div className="flex flex-col">
                <span className="text-[11px] text-muted-foreground">
                  Nhân viên quản lý
                </span>
                <span className="text-sm font-semibold">
                  {selectedStaffs.length}/{STAFFS.length}
                </span>
              </div>
              <div className="flex -space-x-1.5">
                {selectedStaffs.slice(0, 3).map((staff) => (
                  <img
                    key={staff.id}
                    src={staff.avatarUrl}
                    alt={staff.name}
                    className="h-7 w-7 rounded-full border border-background object-cover"
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Chi tiết danh sách nhân sự và giấy chứng nhận xem ở phía dưới.
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Cấu hình cây trồng theo {scopeLabel}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          <ScrollArea className="h-60 w-full">
            <Accordion
              type="multiple"
              defaultValue={
                scope === "region"
                  ? REGIONS.map((r) => r.id)
                  : scope === "area"
                  ? AREAS.map((a) => a.id)
                  : LOTS_CONFIG.map((l) => l.id)
              }
              className="w-full space-y-2"
            >
              {scope === "region" &&
                REGIONS.map((region) => {
                  const config = regionConfig;
                  const seed = findSeed(config?.seedId);
                  const empty = isEmptyConfig(config);

                  return (
                    <AccordionItem key={region.id} value={region.id}>
                      <AccordionTrigger className="rounded-md bg-muted px-3 py-2 text-left text-xs font-semibold">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold">
                            {region.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Mã vùng: {region.code} · Diện tích:{" "}
                            {formatArea(region.areaM2)}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="rounded-b-md border-x border-b border-muted bg-card px-4 pb-3 pt-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 flex-col gap-0.5">
                            {empty ? (
                              <p className="text-[11px] text-muted-foreground">
                                Chưa cấu hình cây trồng cho phạm vi vùng.
                              </p>
                            ) : (
                              <>
                                <p className="text-[11px] text-muted-foreground">
                                  Phương pháp canh tác:{" "}
                                  <span className="font-medium text-foreground">
                                    {findCultivationLabel(
                                      config?.cultivationMethodId
                                    ) ?? "Chưa chọn"}
                                  </span>
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Phương pháp tưới tiêu:{" "}
                                  <span className="font-medium text-foreground">
                                    {config?.irrigationMethod ?? "Chưa chọn"}
                                  </span>
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Cấu hình hạt giống:{" "}
                                  <span className="font-medium text-foreground">
                                    {config?.seedLayout || "Chưa nhập mô tả"}
                                  </span>
                                </p>
                              </>
                            )}
                          </div>
                          {seed && (
                            <div className="mt-1 flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1.5 md:mt-0">
                              <img
                                src={seed.imageUrl}
                                alt={seed.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="text-xs font-medium">
                                  {seed.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  Hạt giống áp dụng
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}

              {scope === "area" &&
                AREAS.map((area) => {
                  const config = areaConfigs[area.id];
                  const seed = findSeed(config?.seedId);
                  const empty = isEmptyConfig(config);
                  const region = REGIONS.find((r) =>
                    r.areas.some((a) => a.id === area.id)
                  );

                  return (
                    <AccordionItem key={area.id} value={area.id}>
                      <AccordionTrigger className="rounded-md bg-muted px-3 py-2 text-left text-xs font-semibold">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold">
                            {area.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Mã khu vực: {area.code} · Vùng:{" "}
                            {region?.name ?? "-"}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="rounded-b-md border-x border-b border-muted bg-card px-4 pb-3 pt-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 flex-col gap-0.5">
                            {empty ? (
                              <p className="text-[11px] text-muted-foreground">
                                Chưa cấu hình cây trồng cho khu vực này.
                              </p>
                            ) : (
                              <>
                                <p className="text-[11px] text-muted-foreground">
                                  Phương pháp canh tác:{" "}
                                  <span className="font-medium text-foreground">
                                    {findCultivationLabel(
                                      config?.cultivationMethodId
                                    ) ?? "Chưa chọn"}
                                  </span>
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Phương pháp tưới tiêu:{" "}
                                  <span className="font-medium text-foreground">
                                    {config?.irrigationMethod ?? "Chưa chọn"}
                                  </span>
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Cấu hình hạt giống:{" "}
                                  <span className="font-medium text-foreground">
                                    {config?.seedLayout || "Chưa nhập mô tả"}
                                  </span>
                                </p>
                              </>
                            )}
                          </div>
                          {seed && (
                            <div className="mt-1 flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1.5 md:mt-0">
                              <img
                                src={seed.imageUrl}
                                alt={seed.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="text-xs font-medium">
                                  {seed.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  Hạt giống áp dụng
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}

              {scope === "lot" &&
                LOTS_CONFIG.map((lot) => {
                  const config = lotConfigs[lot.id];
                  const seed = findSeed(config?.seedId);
                  const empty = isEmptyConfig(config);

                  return (
                    <AccordionItem key={lot.id} value={lot.id}>
                      <AccordionTrigger className="rounded-md bg-muted px-3 py-2 text-left text-xs font-semibold">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-semibold">
                            {lot.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            Mã lô: {lot.code} · Khu vực: {lot.areaName} · Vùng:{" "}
                            {lot.regionName}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="rounded-b-md border-x border-b border-muted bg-card px-4 pb-3 pt-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 flex-col gap-0.5">
                            {empty ? (
                              <p className="text-[11px] text-muted-foreground">
                                Chưa cấu hình cây trồng cho lô này.
                              </p>
                            ) : (
                              <>
                                <p className="text-[11px] text-muted-foreground">
                                  Phương pháp canh tác:{" "}
                                  <span className="font-medium text-foreground">
                                    {findCultivationLabel(
                                      config?.cultivationMethodId
                                    ) ?? "Chưa chọn"}
                                  </span>
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Phương pháp tưới tiêu:{" "}
                                  <span className="font-medium text-foreground">
                                    {config?.irrigationMethod ?? "Chưa chọn"}
                                  </span>
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Cấu hình hạt giống:{" "}
                                  <span className="font-medium text-foreground">
                                    {config?.seedLayout || "Chưa nhập mô tả"}
                                  </span>
                                </p>
                              </>
                            )}
                          </div>
                          {seed && (
                            <div className="mt-1 flex items-center gap-2 rounded-md border bg-muted/40 px-2 py-1.5 md:mt-0">
                              <img
                                src={seed.imageUrl}
                                alt={seed.name}
                                className="h-8 w-8 rounded object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="text-xs font-medium">
                                  {seed.name}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  Hạt giống áp dụng
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </ScrollArea>
          <p className="text-[11px] text-muted-foreground">
            Mở từng {scopeLabel} để kiểm tra chi tiết cấu hình cây trồng trước
            khi hoàn tất.
          </p>
        </CardContent>
      </Card>

      <section className="grid gap-3 md:grid-cols-[2fr,3fr]">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Giấy chứng nhận & nhân viên (chi tiết)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-xs md:grid-cols-1 lg:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Giấy chứng nhận ({selectedCerts.length}/{CERTIFICATES.length})
              </p>
              {selectedCerts.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  Chưa chọn giấy chứng nhận.
                </p>
              ) : (
                <ScrollArea className="h-40 w-full">
                  <div className="space-y-1.5 pr-1">
                    {selectedCerts.map((cert) => (
                      <div
                        key={cert.id}
                        className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5"
                      >
                        <img
                          src={cert.imageUrl}
                          alt={cert.name}
                          className="h-8 w-8 rounded object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-xs font-medium">
                            {cert.name}
                          </span>
                          <span className="truncate text-[11px] text-muted-foreground">
                            Mã: {cert.code} · Hiệu lực {cert.validYears} năm
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-muted-foreground">
                Nhân viên quản lý ({selectedStaffs.length}/{STAFFS.length})
              </p>
              {selectedStaffs.length === 0 ? (
                <p className="text-[11px] text-muted-foreground">
                  Chưa chọn nhân viên quản lý.
                </p>
              ) : (
                <ScrollArea className="h-40 w-full">
                  <div className="space-y-1.5 pr-1">
                    {selectedStaffs.map((staff) => (
                      <div
                        key={staff.id}
                        className="flex items-center gap-2 rounded-md border bg-card px-2 py-1.5"
                      >
                        <img
                          src={staff.avatarUrl}
                          alt={staff.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-xs font-medium">
                            {staff.name}
                          </span>
                          <span className="truncate text-[11px] text-muted-foreground">
                            {staff.role} · {staff.department}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Cấp bậc: {staff.level}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1 rounded-full px-2 py-0 text-[10px] font-semibold ${
                            staff.status === "ACTIVE"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-amber-500 bg-amber-50 text-amber-700"
                          }`}
                        >
                          <Users2 className="h-3 w-3" />
                          {staff.status === "ACTIVE"
                            ? "Đang hoạt động"
                            : "Thử việc"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Danh sách {scopeLabel} được áp dụng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ScrollArea className="h-60 w-full">
              <div className="divide-y text-xs">
                {scope === "region" &&
                  (appliedItems as RegionNode[]).map((region) => (
                    <div
                      key={region.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {region.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Mã vùng: {region.code} · Diện tích:{" "}
                          {formatArea(region.areaM2)}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {region.areas.length} khu vực /{" "}
                        {region.areas.reduce(
                          (sum, area) => sum + area.lots.length,
                          0
                        )}{" "}
                        lô
                      </span>
                    </div>
                  ))}

                {scope === "area" &&
                  (appliedItems as AreaNode[]).map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {area.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Mã khu vực: {area.code} · Vùng: {area.regionName}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {area.lots.length} lô
                      </span>
                    </div>
                  ))}

                {scope === "lot" &&
                  (appliedItems as LotNode[]).map((lot) => (
                    <div
                      key={lot.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {lot.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          Mã lô: {lot.code} · Khu vực: {lot.areaName} · Vùng:{" "}
                          {lot.regionName}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
            <p className="text-[11px] text-muted-foreground">
              Sau khi bấm <span className="font-semibold">Hoàn tất</span>, cấu
              hình sẽ được ghi nhận cho toàn bộ danh sách {scopeLabel} bên trên.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};
