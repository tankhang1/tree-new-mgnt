"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  FileText,
  HeartHandshake,
  MapPin,
  Milk,
  PiggyBank,
  Plus,
  Search,
  Timer,
  User2,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// nếu bạn dùng react-router:
import { useNavigate } from "react-router";
import { animals, type Animal } from "@/pages/data/animals";

type PlanType = "phoi-giong" | "nuoi-sua" | "nuoi-thit";

type Group = {
  id: string;
  name: string;
  location: string;
  size: number;
  note?: string;
};

type Sire = {
  id: string;
  name: string;
  type: "tinh-tuoi" | "bo-duc";
  origin: string;
  breed: string;
  note?: string;
};

type Staff = {
  id: string;
  name: string;
  role: string;
  phone: string;
};

// ================= SAMPLE DATA =================

const groups: Group[] = [
  {
    id: "g1",
    name: "Đàn bò sữa A1",
    location: "Khu chuồng lạnh số 1",
    size: 35,
    note: "Đàn bò sữa đang khai thác, ưu tiên HF cao sản.",
  },
  {
    id: "g2",
    name: "Đàn bò sữa A2",
    location: "Khu chuồng lạnh số 2",
    size: 28,
    note: "Nhiều bò đang mang thai tháng 4–6.",
  },
  {
    id: "g3",
    name: "Đàn bò thịt B1",
    location: "Chuồng nuôi thịt phía Đông",
    size: 40,
    note: "Bò thịt lai Sind, trọng lượng 250–350kg.",
  },
  {
    id: "g4",
    name: "Đàn bò hậu bị",
    location: "Khu hậu bị C",
    size: 22,
    note: "Bò cái chuẩn bị phối giống lần đầu.",
  },
];

const sires: Sire[] = [
  {
    id: "s1",
    name: "Tinh HF cao sản 01",
    type: "tinh-tuoi",
    origin: "Nhập khẩu New Zealand",
    breed: "Holstein Friesian",
    note: "Ưu tiên cho đàn bò sữa đang khai thác.",
  },
  {
    id: "s2",
    name: "Tinh HF cao sản 02",
    type: "tinh-tuoi",
    origin: "Nhập khẩu Hà Lan",
    breed: "Holstein Friesian",
    note: "Chỉ định cho bò hậu bị đạt BCS ≥ 3.",
  },
  {
    id: "s3",
    name: "Bò đực Sind 03",
    type: "bo-duc",
    origin: "Trại giống nội bộ",
    breed: "Sind",
    note: "Dùng cho đàn bò thịt lai Sind.",
  },
];

const staffs: Staff[] = [
  {
    id: "st1",
    name: "Bs. Trần Thị Mai",
    role: "Bác sĩ thú y",
    phone: "0909 123 456",
  },
  {
    id: "st2",
    name: "Ks. Nguyễn Văn Tý",
    role: "Kỹ sư chăn nuôi",
    phone: "0912 345 678",
  },
  {
    id: "st3",
    name: "Lê Minh Khôi",
    role: "Quản lý trại",
    phone: "0987 654 321",
  },
];

// ================= PAGE =================

export default function AddCarePlansPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // B1 – chọn loại & con vật
  const [planType, setPlanType] = useState<PlanType>("phoi-giong");
  const [groupId, setGroupId] = useState<string>("g1");
  const [animalSearch, setAnimalSearch] = useState("");
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>("b001");

  // B2 – thông tin kế hoạch
  const [planName, setPlanName] = useState("Chu kỳ phối giống bò cái HF 001");
  const [purpose, setPurpose] = useState(
    "Phối giống lần 2, mục tiêu có bê HF cao sản."
  );
  const [sireId, setSireId] = useState<string>("s1");
  const [targetMilk, setTargetMilk] = useState<string>("28");
  const [targetWeight, setTargetWeight] = useState<string>("420");
  const [note, setNote] = useState(
    "Theo dõi động dục 21 ngày/lần, bổ sung khoáng và vitamin nhóm B."
  );

  // B3 – lịch & theo dõi
  const [startDate, setStartDate] = useState("2025-08-01");
  const [endDate, setEndDate] = useState("2025-11-30");
  const [expectedCalvingDate, setExpectedCalvingDate] = useState("2026-05-05");
  const [staffId, setStaffId] = useState<string>("st1");
  const [reminder, setReminder] = useState("7"); // ngày nhắc trước
  const [monitoringNote, setMonitoringNote] = useState(
    "Ghi nhận tình trạng ăn uống, thể trạng, dấu hiệu động dục vào app mỗi ngày."
  );

  const filteredAnimals = useMemo(
    () =>
      animals.filter((a) => {
        const byGroup =
          groupId === "all"
            ? true
            : a.group === groups.find((g) => g.id === groupId)?.name;
        const byPlanType =
          planType === "nuoi-thit"
            ? a.status === "bo-thit"
            : planType === "nuoi-sua"
            ? a.status === "dang-sua" || a.status === "hau-bi"
            : true;
        const bySearch =
          !animalSearch ||
          `${a.name} ${a.tag} ${a.group}`
            .toLowerCase()
            .includes(animalSearch.toLowerCase());

        return byGroup && byPlanType && bySearch;
      }),
    [groupId, planType, animalSearch]
  );

  const selectedAnimal = useMemo(
    () => animals.find((a) => a.id === selectedAnimalId) || null,
    [selectedAnimalId]
  );

  const selectedGroup = useMemo(
    () => groups.find((g) => g.id === groupId) || null,
    [groupId]
  );

  const selectedSire = useMemo(
    () => sires.find((s) => s.id === sireId) || null,
    [sireId]
  );

  const selectedStaff = useMemo(
    () => staffs.find((s) => s.id === staffId) || null,
    [staffId]
  );

  const handleNext = () => {
    if (step < 4) setStep((prev) => (prev + 1) as typeof step);
  };

  const handlePrev = () => {
    if (step > 1) setStep((prev) => (prev - 1) as typeof step);
  };

  const handleSubmit = () => {
    // TODO: call API tạo kế hoạch
    console.log("SUBMIT PLAN", {
      planType,
      groupId,
      selectedAnimalId,
      planName,
      purpose,
      sireId,
      targetMilk,
      targetWeight,
      note,
      startDate,
      endDate,
      expectedCalvingDate,
      staffId,
      reminder,
      monitoringNote,
    });
    // navigate lên danh sách
    navigate("/main/livestock/breeding-plan");
  };

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
            <h1 className="text-lg font-semibold">
              Tạo mới kế hoạch chăn nuôi & phối giống
            </h1>
            <p className="text-xs text-muted-foreground">
              Thiết lập kế hoạch cho từng con bò và theo dõi lịch phối giống,
              nuôi dưỡng.
            </p>
          </div>
        </div>
        <Stepper step={step} />
      </header>

      {/* STEPS */}
      {step === 1 && (
        <Step1SelectAnimal
          planType={planType}
          setPlanType={setPlanType}
          groupId={groupId}
          setGroupId={setGroupId}
          groupList={groups}
          animals={filteredAnimals}
          selectedAnimalId={selectedAnimalId}
          setSelectedAnimalId={setSelectedAnimalId}
          animalSearch={animalSearch}
          setAnimalSearch={setAnimalSearch}
          selectedGroup={selectedGroup}
        />
      )}

      {step === 2 && (
        <Step2PlanInfo
          planType={planType}
          planName={planName}
          setPlanName={setPlanName}
          purpose={purpose}
          setPurpose={setPurpose}
          sireId={sireId}
          setSireId={setSireId}
          sires={sires}
          selectedSire={selectedSire}
          targetMilk={targetMilk}
          setTargetMilk={setTargetMilk}
          targetWeight={targetWeight}
          setTargetWeight={setTargetWeight}
          note={note}
          setNote={setNote}
          selectedAnimal={selectedAnimal}
        />
      )}

      {step === 3 && (
        <Step3Schedule
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          expectedCalvingDate={expectedCalvingDate}
          setExpectedCalvingDate={setExpectedCalvingDate}
          planType={planType}
          staffId={staffId}
          setStaffId={setStaffId}
          staffs={staffs}
          reminder={reminder}
          setReminder={setReminder}
          monitoringNote={monitoringNote}
          setMonitoringNote={setMonitoringNote}
        />
      )}

      {step === 4 && (
        <Step4Review
          planType={planType}
          selectedAnimal={selectedAnimal}
          selectedGroup={selectedGroup}
          planName={planName}
          purpose={purpose}
          selectedSire={selectedSire}
          targetMilk={targetMilk}
          targetWeight={targetWeight}
          note={note}
          startDate={startDate}
          endDate={endDate}
          expectedCalvingDate={expectedCalvingDate}
          selectedStaff={selectedStaff}
          reminder={reminder}
          monitoringNote={monitoringNote}
        />
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex justify-between border-t pt-4">
        <Button
          variant="outline"
          size="sm"
          disabled={step === 1}
          onClick={handlePrev}
        >
          Quay lại
        </Button>

        <div className="flex gap-2">
          {step < 4 && (
            <Button
              size="sm"
              className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
              onClick={handleNext}
            >
              Tiếp theo
            </Button>
          )}
          {step === 4 && (
            <Button
              size="sm"
              className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
              onClick={handleSubmit}
            >
              Xác nhận tạo kế hoạch
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= COMPONENTS =================

function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const items = [
    { id: 1, label: "Chọn con vật & đàn" },
    { id: 2, label: "Thông tin kế hoạch" },
    { id: 3, label: "Lịch & theo dõi" },
    { id: 4, label: "Xác nhận" },
  ];
  return (
    <div className="flex flex-1 items-center gap-3">
      {items.map((s, idx) => {
        const isActive = s.id === step;
        const isDone = s.id < step;
        return (
          <div key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-9 items-center rounded-full border px-3 text-xs ${
                isDone
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : isActive
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-muted text-muted-foreground"
              }`}
            >
              <div className="mr-2 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-xs font-semibold">
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  s.id
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold">Bước {s.id}</span>
                <span className="text-[11px]">{s.label}</span>
              </div>
            </div>
            {idx < items.length - 1 && (
              <div className="hidden h-px flex-1 bg-emerald-500/70 md:block" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1SelectAnimal({
  planType,
  setPlanType,
  groupId,
  setGroupId,
  groupList,
  animals,
  selectedAnimalId,
  setSelectedAnimalId,
  animalSearch,
  setAnimalSearch,
  selectedGroup,
}: {
  planType: PlanType;
  setPlanType: (v: PlanType) => void;
  groupId: string;
  setGroupId: (v: string) => void;
  groupList: Group[];
  animals: Animal[];
  selectedAnimalId: string;
  setSelectedAnimalId: (v: string) => void;
  animalSearch: string;
  setAnimalSearch: (v: string) => void;
  selectedGroup: Group | null;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,0.9fr)]">
      <div className="flex flex-col gap-4">
        {/* Loại kế hoạch + nhóm */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Chọn loại kế hoạch & đàn
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant={planType === "phoi-giong" ? "default" : "outline"}
                className={
                  planType === "phoi-giong"
                    ? "bg-primary! text-primary-foreground!"
                    : ""
                }
                onClick={() => setPlanType("phoi-giong")}
              >
                <HeartHandshake className="mr-1 h-4 w-4" />
                Phối giống
              </Button>
              <Button
                type="button"
                size="sm"
                variant={planType === "nuoi-sua" ? "default" : "outline"}
                className={
                  planType === "nuoi-sua"
                    ? "bg-primary! text-primary-foreground!"
                    : ""
                }
                onClick={() => setPlanType("nuoi-sua")}
              >
                <Milk className="mr-1 h-4 w-4" />
                Nuôi bò sữa
              </Button>
              <Button
                type="button"
                size="sm"
                variant={planType === "nuoi-thit" ? "default" : "outline"}
                className={
                  planType === "nuoi-thit"
                    ? "bg-primary! text-primary-foreground!"
                    : ""
                }
                onClick={() => setPlanType("nuoi-thit")}
              >
                <PiggyBank className="mr-1 h-4 w-4" />
                Nuôi bò thịt
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-[220px,1fr]">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Đàn / chuồng</p>
                <Select value={groupId} onValueChange={setGroupId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn đàn / chuồng" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupList.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="all">Tất cả đàn / chuồng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Tìm kiếm con vật trong đàn
                </p>
                <div className="relative">
                  <Input
                    value={animalSearch}
                    onChange={(e) => setAnimalSearch(e.target.value)}
                    placeholder="Nhập tên, mã thẻ tai, đàn..."
                    className="h-9 pl-8"
                  />
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danh sách con vật */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Chọn con vật áp dụng kế hoạch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {animals.map((a) => {
                const selected = a.id === selectedAnimalId;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedAnimalId(a.id)}
                    className={`group flex h-full flex-col rounded-lg border bg-card/80 p-3 text-left text-xs shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md ${
                      selected
                        ? "border-primary ring-1 ring-primary/40"
                        : "border-border"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      {/* Avatar + tên */}
                      <div className="flex items-start gap-2">
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border bg-muted">
                          {a.avatar ? (
                            <img
                              src={a.avatar}
                              alt={a.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Timer className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{a.name}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Thẻ tai:{" "}
                            <span className="font-medium">{a.tag}</span>
                          </p>
                        </div>
                      </div>

                      {/* Icon trạng thái chọn */}
                      {selected ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Timer className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      )}
                    </div>

                    <p className="text-[11px] text-muted-foreground">
                      Đàn: <span className="font-medium">{a.group}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Giống: <span className="font-medium">{a.breed}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Ngày sinh: {new Date(a.dob).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Số lứa đẻ: <span className="font-medium">{a.parity}</span>
                    </p>

                    <div className="mt-2">
                      {a.status === "dang-sua" && (
                        <Badge className="bg-sky-100 text-sky-700 text-[10px]">
                          Đang cho sữa
                        </Badge>
                      )}
                      {a.status === "hau-bi" && (
                        <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                          Hậu bị chuẩn bị phối giống
                        </Badge>
                      )}
                      {a.status === "bo-thit" && (
                        <Badge className="bg-slate-100 text-slate-700 text-[10px]">
                          Bò thịt vỗ béo
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}

              {animals.length === 0 && (
                <div className="col-span-full flex items-center justify-center rounded-lg border border-dashed bg-muted/40 px-4 py-10 text-xs text-muted-foreground">
                  Không tìm thấy con vật phù hợp với bộ lọc hiện tại.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thông tin đàn / gợi ý */}
      <Card className="h-fit">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <span>Thông tin đàn / chuồng</span>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          {selectedGroup ? (
            <>
              <p className="font-semibold text-foreground">
                {selectedGroup.name}
              </p>
              <p className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Khu vực:{" "}
                <span className="font-medium">{selectedGroup.location}</span>
              </p>
              <p className="text-muted-foreground">
                Quy mô đàn:{" "}
                <span className="font-semibold">{selectedGroup.size} con</span>
              </p>
              {selectedGroup.note && (
                <p className="text-muted-foreground">
                  Ghi chú:{" "}
                  <span className="font-medium">{selectedGroup.note}</span>
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">
              Chọn một đàn / chuồng để xem thông tin tổng quan.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Step2PlanInfo({
  planType,
  planName,
  setPlanName,
  purpose,
  setPurpose,
  sireId,
  setSireId,
  sires,
  selectedSire,
  targetMilk,
  setTargetMilk,
  targetWeight,
  setTargetWeight,
  note,
  setNote,
  selectedAnimal,
}: {
  planType: PlanType;
  planName: string;
  setPlanName: (v: string) => void;
  purpose: string;
  setPurpose: (v: string) => void;
  sireId: string;
  setSireId: (v: string) => void;
  sires: Sire[];
  selectedSire: Sire | null;
  targetMilk: string;
  setTargetMilk: (v: string) => void;
  targetWeight: string;
  setTargetWeight: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
  selectedAnimal: Animal | null;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,0.9fr)]">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Thông tin kế hoạch
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Tên kế hoạch</p>
              <Input
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="h-9"
                placeholder="VD: Chu kỳ phối giống bò HF 001 lần 2"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Mục đích</p>
              <Textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="min-h-[80px]"
                placeholder="Mục tiêu của kế hoạch (phối giống, tăng sữa, tăng trọng bò thịt...)"
              />
            </div>

            {planType === "phoi-giong" && (
              <>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Tinh / bò đực sử dụng
                  </p>
                  <Select value={sireId} onValueChange={setSireId}>
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Chọn tinh / bò đực" />
                    </SelectTrigger>
                    <SelectContent>
                      {sires.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} – {s.breed}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="grid gap-3 md:grid-cols-2">
              {planType !== "nuoi-thit" && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Sản lượng sữa mục tiêu (lít/con/ngày)
                  </p>
                  <Input
                    value={targetMilk}
                    onChange={(e) =>
                      setTargetMilk(e.target.value.replace(/\D/g, ""))
                    }
                    className="h-9"
                    placeholder="VD: 25–30"
                  />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Trọng lượng mục tiêu (kg)
                </p>
                <Input
                  value={targetWeight}
                  onChange={(e) =>
                    setTargetWeight(e.target.value.replace(/\D/g, ""))
                  }
                  className="h-9"
                  placeholder="VD: 420"
                />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Ghi chú</p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="min-h-[80px]"
                placeholder="Ghi chú thêm: khẩu phần, lưu ý sức khỏe, vaccine, tẩy ký sinh trùng..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <span>Thông tin con vật</span>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs">
          {selectedAnimal ? (
            <>
              <p className="font-semibold text-foreground">
                {selectedAnimal.name} – {selectedAnimal.tag}
              </p>
              <p className="text-muted-foreground">
                Đàn: <span className="font-medium">{selectedAnimal.group}</span>
              </p>
              <p className="text-muted-foreground">
                Giống:{" "}
                <span className="font-medium">{selectedAnimal.breed}</span>
              </p>
              <p className="text-muted-foreground">
                Ngày sinh:{" "}
                {new Date(selectedAnimal.dob).toLocaleDateString("vi-VN")}
              </p>
              <p className="text-muted-foreground">
                Số lứa đẻ:{" "}
                <span className="font-medium">{selectedAnimal.parity}</span>
              </p>
              <p className="text-muted-foreground">
                Tình trạng:{" "}
                <span className="font-medium">
                  {selectedAnimal.status === "dang-sua"
                    ? "Đang cho sữa"
                    : selectedAnimal.status === "hau-bi"
                    ? "Hậu bị"
                    : "Bò thịt"}
                </span>
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">
              Chưa chọn con vật. Vui lòng quay lại bước 1.
            </p>
          )}

          {planType === "phoi-giong" && selectedSire && (
            <div className="mt-3 rounded-md border bg-muted/40 p-2">
              <p className="mb-1 text-[11px] font-semibold text-muted-foreground">
                Tinh / bò đực được chọn:
              </p>
              <p className="text-xs font-semibold">{selectedSire.name}</p>
              <p className="text-xs text-muted-foreground">
                Giống: {selectedSire.breed}
              </p>
              <p className="text-xs text-muted-foreground">
                Nguồn gốc: {selectedSire.origin}
              </p>
              {selectedSire.note && (
                <p className="text-xs text-muted-foreground">
                  Ghi chú: {selectedSire.note}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Step3Schedule({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  expectedCalvingDate,
  setExpectedCalvingDate,
  planType,
  staffId,
  setStaffId,
  staffs,
  reminder,
  setReminder,
  monitoringNote,
  setMonitoringNote,
}: {
  startDate: string;
  setStartDate: (v: string) => void;
  endDate: string;
  setEndDate: (v: string) => void;
  expectedCalvingDate: string;
  setExpectedCalvingDate: (v: string) => void;
  planType: PlanType;
  staffId: string;
  setStaffId: (v: string) => void;
  staffs: Staff[];
  reminder: string;
  setReminder: (v: string) => void;
  monitoringNote: string;
  setMonitoringNote: (v: string) => void;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(260px,0.9fr)]">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Lịch thực hiện kế hoạch
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Ngày bắt đầu kế hoạch
              </p>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Ngày kết thúc dự kiến
              </p>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-9"
              />
            </div>

            {planType === "phoi-giong" && (
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs text-muted-foreground">
                  Ngày dự kiến sinh bê
                </p>
                <Input
                  type="date"
                  value={expectedCalvingDate}
                  onChange={(e) => setExpectedCalvingDate(e.target.value)}
                  className="h-9 max-w-[220px]"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Gợi ý: Khoảng 280–285 ngày sau ngày phối giống.
                </p>
              </div>
            )}

            <div className="space-y-1 md:col-span-2">
              <p className="text-xs text-muted-foreground">
                Ghi chú theo dõi hàng ngày
              </p>
              <Textarea
                value={monitoringNote}
                onChange={(e) => setMonitoringNote(e.target.value)}
                className="min-h-[80px]"
                placeholder="Nhập tiêu chí cần theo dõi: ăn uống, thân nhiệt, sản lượng sữa, độ hoạt động..."
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
            <span>Người phụ trách & nhắc việc</span>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Người phụ trách</p>
            <Select value={staffId} onValueChange={setStaffId}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Chọn cán bộ phụ trách" />
              </SelectTrigger>
              <SelectContent>
                {staffs.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} – {s.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border bg-muted/30 p-2">
            {staffs.map((s) => {
              const selected = s.id === staffId;
              if (!selected) return null;
              return (
                <div
                  key={s.id}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <User2 className="mt-[2px] h-4 w-4" />
                  <div>
                    <p className="font-semibold text-foreground">{s.name}</p>
                    <p>{s.role}</p>
                    <p>SĐT: {s.phone}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              Số ngày nhắc trước mốc quan trọng
            </p>
            <Input
              value={reminder}
              onChange={(e) => setReminder(e.target.value.replace(/\D/g, ""))}
              className="h-9 max-w-[120px]"
              placeholder="VD: 7"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Hệ thống sẽ nhắc trước các mốc: phối giống lại, kiểm tra chửa, cận
              ngày sinh...
            </p>
          </div>

          <div className="mt-2 rounded-md border border-dashed bg-muted/20 p-2 text-[11px] text-muted-foreground">
            <p className="font-medium text-foreground">Gợi ý mốc theo dõi:</p>
            <ul className="list-disc pl-4">
              <li>Ngày phối giống lần 1, lần 2</li>
              <li>Ngày kiểm tra chửa (30–45 ngày sau phối)</li>
              <li>Ngày tiêm vaccine, tẩy ký sinh trùng</li>
              <li>Ngày dự kiến sinh bê, chăm sóc sau sinh</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step4Review({
  planType,
  selectedAnimal,
  selectedGroup,
  planName,
  purpose,
  selectedSire,
  targetMilk,
  targetWeight,
  note,
  startDate,
  endDate,
  expectedCalvingDate,
  selectedStaff,
  reminder,
  monitoringNote,
}: {
  planType: PlanType;
  selectedAnimal: Animal | null;
  selectedGroup: Group | null;
  planName: string;
  purpose: string;
  selectedSire: Sire | null;
  targetMilk: string;
  targetWeight: string;
  note: string;
  startDate: string;
  endDate: string;
  expectedCalvingDate: string;
  selectedStaff: Staff | null;
  reminder: string;
  monitoringNote: string;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin chung kế hoạch
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Loại kế hoạch:{" "}
            <span className="font-semibold">
              {planType === "phoi-giong"
                ? "Phối giống"
                : planType === "nuoi-sua"
                ? "Nuôi bò sữa"
                : "Nuôi bò thịt"}
            </span>
          </p>
          <p>
            Tên kế hoạch:{" "}
            <span className="font-semibold">{planName || "-"}</span>
          </p>
          <p>
            Đàn / chuồng:{" "}
            <span className="font-semibold">{selectedGroup?.name || "-"}</span>
          </p>
          <p>
            Con vật:{" "}
            <span className="font-semibold">
              {selectedAnimal
                ? `${selectedAnimal.name} – ${selectedAnimal.tag}`
                : "-"}
            </span>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Mục đích</p>
          <p className="rounded-md bg-muted/40 p-2 text-xs">{purpose || "-"}</p>

          {planType === "phoi-giong" && (
            <>
              <p className="mt-2 text-xs text-muted-foreground">
                Tinh / bò đực sử dụng
              </p>
              <p className="rounded-md bg-muted/40 p-2 text-xs">
                {selectedSire
                  ? `${selectedSire.name} – ${selectedSire.breed} (${selectedSire.origin})`
                  : "-"}
              </p>
            </>
          )}

          <div className="mt-2 grid gap-2 text-sm md:grid-cols-2">
            {planType !== "nuoi-thit" && (
              <p>
                Sản lượng sữa mục tiêu:{" "}
                <span className="font-semibold">
                  {targetMilk ? `${targetMilk} lít/con/ngày` : "-"}
                </span>
              </p>
            )}
            <p>
              Trọng lượng mục tiêu:{" "}
              <span className="font-semibold">
                {targetWeight ? `${targetWeight} kg` : "-"}
              </span>
            </p>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">Ghi chú</p>
          <p className="rounded-md bg-muted/40 p-2 text-xs">{note || "-"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Lịch thực hiện & theo dõi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Thời gian:{" "}
            <span className="font-semibold">
              {startDate
                ? new Date(startDate).toLocaleDateString("vi-VN")
                : "-"}{" "}
              {" → "}
              {endDate ? new Date(endDate).toLocaleDateString("vi-VN") : "-"}
            </span>
          </p>
          {planType === "phoi-giong" && (
            <p>
              Ngày dự kiến sinh bê:{" "}
              <span className="font-semibold">
                {expectedCalvingDate
                  ? new Date(expectedCalvingDate).toLocaleDateString("vi-VN")
                  : "-"}
              </span>
            </p>
          )}
          <p>
            Người phụ trách:{" "}
            <span className="font-semibold">
              {selectedStaff
                ? `${selectedStaff.name} – ${selectedStaff.role}`
                : "-"}
            </span>
          </p>
          <p>
            SĐT liên hệ:{" "}
            <span className="font-semibold">{selectedStaff?.phone || "-"}</span>
          </p>
          <p>
            Nhắc trước:{" "}
            <span className="font-semibold">
              {reminder ? `${reminder} ngày` : "-"}
            </span>
          </p>

          <p className="mt-2 text-xs text-muted-foreground">Ghi chú theo dõi</p>
          <p className="rounded-md bg-muted/40 p-2 text-xs">
            {monitoringNote || "-"}
          </p>

          <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-[11px] text-amber-800">
            <AlertTriangle className="mt-[2px] h-3.5 w-3.5" />
            <div>
              <p className="font-semibold">
                Lưu ý trước khi xác nhận kế hoạch:
              </p>
              <ul className="list-disc pl-4">
                <li>Đảm bảo thể trạng bò phù hợp với mục tiêu kế hoạch.</li>
                <li>Đã kiểm tra lịch vaccine, tẩy ký sinh trùng gần nhất.</li>
                <li>Đảm bảo đủ chuồng trại, thức ăn, nhân sự theo dõi.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
