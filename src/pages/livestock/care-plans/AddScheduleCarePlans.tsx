"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  Syringe,
  Timer,
  User2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
// nếu bạn đang dùng react-router
import { useNavigate } from "react-router";

type BreedingStatus = "cho-ket-qua" | "co-chua" | "khong-chua" | "huy";

type Animal = {
  id: string;
  tag: string;
  name: string;
  group: string;
  breed: string;
  dob: string;
  parity: number;
  status: "dang-sua" | "hau-bi" | "bo-thit";
};

type Bull = {
  id: string;
  code: string;
  name: string;
  breed: string;
  origin: string;
  note?: string;
};

const animals: Animal[] = [
  {
    id: "b001",
    tag: "HF-001",
    name: "Bò cái HF 001",
    group: "Đàn bò sữa A1",
    breed: "Holstein Friesian",
    dob: "2022-01-10",
    parity: 1,
    status: "dang-sua",
  },
  {
    id: "b002",
    tag: "HF-012",
    name: "Bò cái HF 012",
    group: "Đàn bò sữa A2",
    breed: "Holstein Friesian",
    dob: "2021-09-05",
    parity: 2,
    status: "dang-sua",
  },
  {
    id: "b003",
    tag: "HB-078",
    name: "Bò cái hậu bị 078",
    group: "Đàn bò hậu bị",
    breed: "HF × Sind",
    dob: "2023-03-18",
    parity: 0,
    status: "hau-bi",
  },
  {
    id: "b004",
    tag: "MT-045",
    name: "Bò thịt lai Sind 045",
    group: "Đàn bò thịt B1",
    breed: "Lai Sind",
    dob: "2022-06-02",
    parity: 0,
    status: "bo-thit",
  },
];

const bulls: Bull[] = [
  {
    id: "t001",
    code: "HF-A123",
    name: "Đực giống HF A123",
    breed: "Holstein Friesian",
    origin: "Nhập khẩu New Zealand",
    note: "Tỷ lệ đậu thai cao, phù hợp đàn bò sữa A1, A2",
  },
  {
    id: "t002",
    code: "HF-B045",
    name: "Đực giống HF B045",
    breed: "Holstein Friesian",
    origin: "Nhập khẩu Úc",
  },
  {
    id: "t003",
    code: "LS-019",
    name: "Đực giống Lai Sind 019",
    breed: "Lai Sind",
    origin: "Trại giống trong nước",
    note: "Dùng cho đàn bò thịt",
  },
];

function formatDateInput(dt: Date) {
  return dt.toISOString().slice(0, 16); // dùng cho input type="datetime-local"
}

export default function AddScheduleCarePlansPage() {
  const navigate = useNavigate();

  // chọn bò cái
  const [selectedAnimalId, setSelectedAnimalId] = useState<string>("b001");

  // thông tin phối
  const [heatDate, setHeatDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [heatTime, setHeatTime] = useState<string>("06:30");
  const [breedingDateTime, setBreedingDateTime] = useState<string>(
    formatDateInput(new Date())
  );
  const [round, setRound] = useState<string>("1");
  const [method, setMethod] = useState<string>("ai");
  const [bullId, setBullId] = useState<string>("t001");
  const [semenCode, setSemenCode] = useState<string>("HF-A123");
  const [technician, setTechnician] = useState<string>("Nguyễn Văn A");
  const [location, setLocation] = useState<string>("Chuồng bò sữa A1");
  const [note, setNote] = useState<string>(
    "Bò động dục mạnh, phối lần 1, sức khỏe tốt."
  );

  // nhắc lịch & trạng thái
  const [expectedCheckDate, setExpectedCheckDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 60); // giả lập +60 ngày
    return d.toISOString().slice(0, 10);
  });
  const [expectedCalvingDate, setExpectedCalvingDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 280); // giả lập +280 ngày
    return d.toISOString().slice(0, 10);
  });
  const [status, setStatus] = useState<BreedingStatus>("cho-ket-qua");

  const selectedAnimal = useMemo(
    () => animals.find((a) => a.id === selectedAnimalId) || null,
    [selectedAnimalId]
  );

  const selectedBull = useMemo(
    () => bulls.find((b) => b.id === bullId) || null,
    [bullId]
  );

  const handleSave = () => {
    // tạm thời chỉ log ra console, sau bạn nối API/phát sự kiện
    console.log("Breeding voucher data:", {
      selectedAnimal,
      heatDate,
      heatTime,
      breedingDateTime,
      round,
      method,
      bull: selectedBull,
      semenCode,
      technician,
      location,
      note,
      expectedCheckDate,
      expectedCalvingDate,
      status,
    });
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
            <h1 className="text-lg font-semibold text-foreground">
              Thêm phiếu phối giống
            </h1>
            <p className="text-xs text-muted-foreground">
              Ghi nhận thông tin phối giống cho bò cái, theo dõi lịch khám thai
              và dự kiến đẻ.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px]">
            Mã phiếu sẽ sinh tự động sau khi lưu
          </Badge>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground! hover:bg-primary/90!"
            onClick={handleSave}
          >
            Lưu phiếu phối giống
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="grid gap-4 lg:grid-cols-[1.3fr,1.7fr]">
        {/* CỘT TRÁI – CHỌN BÒ CÁI & THÔNG TIN */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Timer className="h-4 w-4 text-emerald-600" />
              Chọn bò cái phối giống
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Lọc nhanh */}
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <p className="text-[11px] text-muted-foreground">Chọn bò cái</p>
                <Select
                  value={selectedAnimalId}
                  onValueChange={setSelectedAnimalId}
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue placeholder="Chọn bò cái" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} ({a.tag})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground">
                  Chuồng / đàn
                </p>
                <Input
                  value={selectedAnimal?.group || ""}
                  disabled
                  className="mt-1 h-9 bg-muted/60 text-xs"
                />
              </div>
            </div>

            {/* Card thông tin bò */}
            {selectedAnimal && (
              <div className="rounded-lg border bg-muted/20 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">
                      {selectedAnimal.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Thẻ tai:{" "}
                      <span className="font-medium">{selectedAnimal.tag}</span>
                    </p>
                  </div>
                  <div>
                    {selectedAnimal.status === "dang-sua" && (
                      <Badge className="bg-sky-100 text-sky-700 text-[10px]">
                        Đang cho sữa
                      </Badge>
                    )}
                    {selectedAnimal.status === "hau-bi" && (
                      <Badge className="bg-amber-100 text-amber-700 text-[10px]">
                        Hậu bị chuẩn bị phối giống
                      </Badge>
                    )}
                    {selectedAnimal.status === "bo-thit" && (
                      <Badge className="bg-slate-100 text-slate-700 text-[10px]">
                        Bò thịt
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Giống:{" "}
                  <span className="font-medium">{selectedAnimal.breed}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Ngày sinh:{" "}
                  {new Date(selectedAnimal.dob).toLocaleDateString("vi-VN")} •
                  Lứa đẻ:{" "}
                  <span className="font-medium">{selectedAnimal.parity}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Đàn:{" "}
                  <span className="font-medium">{selectedAnimal.group}</span>
                </p>
              </div>
            )}

            {/* Gợi ý theo dõi / lưu ý */}
            <div className="rounded-md border border-dashed border-amber-200 bg-amber-50/60 p-3 text-[11px] text-amber-800 flex gap-2">
              <Info className="mt-[2px] h-3.5 w-3.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-xs">
                  Gợi ý theo dõi sinh sản cho bò cái
                </p>
                <p>
                  Nên ghi nhận đầy đủ lịch sử phối giống, khám thai và sinh để
                  tối ưu năng suất đàn bò và vòng đời khai thác sữa.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CỘT PHẢI – THÔNG TIN PHỐI GIỐNG */}
        <div className="flex flex-col gap-4">
          {/* BƯỚC 1: THÔNG TIN ĐỘNG DỤC & PHỐI */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <CalendarDays className="h-4 w-4 text-primary" />
                Thông tin động dục & thời điểm phối
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Ngày phát hiện động dục
                </p>
                <Input
                  type="date"
                  value={heatDate}
                  onChange={(e) => setHeatDate(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Giờ phát hiện (ước tính)
                </p>
                <Input
                  type="time"
                  value={heatTime}
                  onChange={(e) => setHeatTime(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Ngày giờ phối giống
                </p>
                <Input
                  type="datetime-local"
                  value={breedingDateTime}
                  onChange={(e) => setBreedingDateTime(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">Lần phối</p>
                <Select value={round} onValueChange={setRound}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn lần phối" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Lần 1</SelectItem>
                    <SelectItem value="2">Lần 2</SelectItem>
                    <SelectItem value="3">Lần 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Hình thức phối
                </p>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn hình thức" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai">Thụ tinh nhân tạo (AI)</SelectItem>
                    <SelectItem value="natural">
                      Phối trực tiếp (thả đực)
                    </SelectItem>
                    <SelectItem value="khac">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Vị trí / chuồng
                </p>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* BƯỚC 2: ĐỰC GIỐNG / TINH */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Syringe className="h-4 w-4 text-emerald-600" />
                Thông tin tinh / đực giống
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
              <div className="space-y-1 md:col-span-2">
                <p className="text-[11px] text-muted-foreground">
                  Chọn tinh / đực giống sử dụng
                </p>
                <Select value={bullId} onValueChange={setBullId}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn tinh / đực giống" />
                  </SelectTrigger>
                  <SelectContent>
                    {bulls.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">Mã tinh</p>
                <Input
                  value={semenCode}
                  onChange={(e) => setSemenCode(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Người thực hiện phối giống
                </p>
                <div className="flex items-center gap-2">
                  <User2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={technician}
                    onChange={(e) => setTechnician(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              {selectedBull && (
                <div className="md:col-span-2 rounded-md border bg-muted/30 p-3 text-[11px] space-y-1">
                  <p className="text-xs font-semibold">
                    Thông tin tinh / đực giống
                  </p>
                  <p>
                    Tên:{" "}
                    <span className="font-medium">
                      {selectedBull.name} ({selectedBull.code})
                    </span>
                  </p>
                  <p>
                    Giống:{" "}
                    <span className="font-medium">{selectedBull.breed}</span>
                  </p>
                  <p>
                    Nguồn gốc:{" "}
                    <span className="font-medium">{selectedBull.origin}</span>
                  </p>
                  {selectedBull.note && (
                    <p className="text-muted-foreground">
                      Ghi chú: {selectedBull.note}
                    </p>
                  )}
                </div>
              )}

              <div className="md:col-span-2 space-y-1">
                <p className="text-[11px] text-muted-foreground">Ghi chú</p>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[70px]"
                  placeholder="Ví dụ: bò đứng yên khi phối, tình trạng dịch nhầy, phản ứng sau phối..."
                />
              </div>
            </CardContent>
          </Card>

          {/* BƯỚC 3: LỊCH NHẮC VÀ TRẠNG THÁI */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Clock className="h-4 w-4 text-sky-600" />
                Lịch nhắc & trạng thái theo dõi
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3 text-xs">
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Dự kiến khám thai
                </p>
                <Input
                  type="date"
                  value={expectedCheckDate}
                  onChange={(e) => setExpectedCheckDate(e.target.value)}
                  className="h-9"
                />
                <p className="text-[11px] text-muted-foreground">
                  Thường sau phối 45–60 ngày
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Dự kiến ngày đẻ
                </p>
                <Input
                  type="date"
                  value={expectedCalvingDate}
                  onChange={(e) => setExpectedCalvingDate(e.target.value)}
                  className="h-9"
                />
                <p className="text-[11px] text-muted-foreground">
                  Khoảng 280 ngày sau phối
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground">
                  Trạng thái phiếu
                </p>
                <Select
                  value={status}
                  onValueChange={(v: BreedingStatus) => setStatus(v)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cho-ket-qua">
                      Chờ kết quả khám thai
                    </SelectItem>
                    <SelectItem value="co-chua">Đã có chửa</SelectItem>
                    <SelectItem value="khong-chua">Không chửa</SelectItem>
                    <SelectItem value="huy">Hủy phiếu</SelectItem>
                  </SelectContent>
                </Select>
                <div className="mt-1">
                  {status === "cho-ket-qua" && (
                    <Badge className="bg-sky-100 text-sky-700 text-[10px]">
                      Đang chờ khám thai
                    </Badge>
                  )}
                  {status === "co-chua" && (
                    <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">
                      Đã xác nhận có chửa
                    </Badge>
                  )}
                  {status === "khong-chua" && (
                    <Badge className="bg-rose-100 text-rose-700 text-[10px]">
                      Không chửa – cần lập kế hoạch phối lại
                    </Badge>
                  )}
                  {status === "huy" && (
                    <Badge className="bg-slate-100 text-slate-700 text-[10px]">
                      Phiếu đã hủy
                    </Badge>
                  )}
                </div>
              </div>

              <div className="md:col-span-3 rounded-md border border-dashed border-sky-200 bg-sky-50/60 px-3 py-2 text-[11px] text-sky-900 flex items-start gap-2">
                <CheckCircle2 className="mt-[2px] h-3.5 w-3.5 flex-shrink-0" />
                <p>
                  Sau khi lưu, phiếu phối giống sẽ được đưa vào{" "}
                  <span className="font-semibold">
                    danh sách lịch phối giống
                  </span>{" "}
                  và hệ thống có thể dùng để nhắc{" "}
                  <span className="font-semibold">lịch khám thai</span>,{" "}
                  <span className="font-semibold">lịch đẻ</span> và thống kê
                  năng suất sinh sản.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
