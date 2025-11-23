"use client";

import { useState } from "react";
import {
  MapPin,
  Map,
  Layers3,
  SquareKanban,
  ArrowLeft,
  CheckCircle2,
  Plus,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import { ConfirmMapDialog } from "@/pages/crop/fields/ConfirmDialog";
import OwnerSelectCard from "@/pages/crop/fields/OwnerSelectCard";

type Area = {
  id: string;
  name: string;
  area: string;
  soilType: string;
  topo: string;
  note: string;
};

function createId() {
  return crypto.randomUUID();
}

export default function AddRegionPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [openConfirm, setOpenConfirm] = useState(false);
  const navigate = useNavigate();

  const [regionCodeSystem, setRegionCodeSystem] = useState("VTN001");
  const [regionCodeGov, setRegionCodeGov] = useState("QG-456789");
  const [regionName, setRegionName] = useState("Vùng Tây Nguyên A");
  const [province, setProvince] = useState("Đắk Lắk");
  const [district, setDistrict] = useState("TP. Buôn Ma Thuột");
  const [commune, setCommune] = useState("Xã Krông Pắk");
  const [address, setAddress] = useState(
    "Thôn 3, xã Krông Pắk, TP. Buôn Ma Thuột"
  );
  const [ownerName, setOwnerName] = useState("HTX Nông nghiệp Tây Nguyên");
  const [regionArea, setRegionArea] = useState("12.000");
  const [soilType, setSoilType] = useState("Đất đỏ bazan");
  const [terrain, setTerrain] = useState("Đồi thoải");
  const [note, setNote] = useState("Vùng trồng được đăng ký mã số QG.");

  const [latitude, setLatitude] = useState("10.762622");
  const [longitude, setLongitude] = useState("106.660172");

  const [areas, setAreas] = useState<Area[]>([
    {
      id: createId(),
      name: "Khu vực 1",
      area: "5.000",
      soilType: "Đất pha cát",
      topo: "Bằng phẳng",
      note: "",
    },
    {
      id: createId(),
      name: "Khu vực 2",
      area: "7.000",
      soilType: "Đất thịt nhẹ",
      topo: "Thoải dốc",
      note: "",
    },
  ]);

  const handleAddArea = () => {
    setAreas((prev) => [
      ...prev,
      {
        id: createId(),
        name: `Khu vực ${prev.length + 1}`,
        area: "",
        soilType: "",
        topo: "",
        note: "",
      },
    ]);
  };

  const handleChangeArea = (id: string, field: keyof Area, value: string) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleRemoveArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const goNext = () => {
    if (step < 4) setStep((s) => (s + 1) as typeof step);
  };

  const goPrev = () => {
    if (step > 1) setStep((s) => (s - 1) as typeof step);
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3">
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
              Thực hiện lần lượt các bước để khai báo thông tin vùng trồng, bản
              đồ, khu vực và xác nhận.
            </p>
          </div>
        </div>
        <Stepper step={step} />
      </header>

      {step === 1 && (
        <Step1Region
          regionCodeSystem={regionCodeSystem}
          setRegionCodeSystem={setRegionCodeSystem}
          regionCodeGov={regionCodeGov}
          setRegionCodeGov={setRegionCodeGov}
          regionName={regionName}
          setRegionName={setRegionName}
          province={province}
          setProvince={setProvince}
          district={district}
          setDistrict={setDistrict}
          commune={commune}
          setCommune={setCommune}
          address={address}
          setAddress={setAddress}
          ownerName={ownerName}
          setOwnerName={setOwnerName}
          regionArea={regionArea}
          setRegionArea={setRegionArea}
          soilType={soilType}
          setSoilType={setSoilType}
          terrain={terrain}
          setTerrain={setTerrain}
          note={note}
          setNote={setNote}
        />
      )}

      {step === 2 && (
        <Step2Map
          latitude={latitude}
          setLatitude={setLatitude}
          longitude={longitude}
          setLongitude={setLongitude}
        />
      )}

      {step === 3 && (
        <Step3Areas
          areas={areas}
          onAddArea={handleAddArea}
          onChangeArea={handleChangeArea}
          onRemoveArea={handleRemoveArea}
        />
      )}

      {step === 4 && (
        <Step4Review
          region={{
            regionCodeSystem,
            regionCodeGov,
            regionName,
            province,
            district,
            commune,
            address,
            ownerName,
            regionArea,
            soilType,
            terrain,
            note,
          }}
          coords={{ latitude, longitude }}
          areas={areas}
        />
      )}

      <div className="mb-2 flex items-center justify-between border-t pt-3">
        <Button
          variant="outline"
          size="sm"
          disabled={step === 1}
          onClick={goPrev}
        >
          Quay lại
        </Button>
        <Button
          size="sm"
          className="bg-primary! text-primary-foreground!"
          onClick={() => {
            if (step === 4) setOpenConfirm(true);
            else goNext();
          }}
        >
          {step === 4 ? "Hoàn thành" : "Tiếp tục"}
        </Button>
      </div>

      <ConfirmMapDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        onConfirm={() => {
          setOpenConfirm(false);
          navigate("/main/crop/fields/map");
        }}
        onSkip={() => {
          setOpenConfirm(false);
          navigate("/main/crop/fields");
        }}
      />
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 | 3 | 4 }) {
  const steps = [
    { id: 1, label: "Vùng trồng" },
    { id: 2, label: "Biểu đồ vùng trồng" },
    { id: 3, label: "Khu vực" },
    { id: 4, label: "Xác nhận" },
  ];
  return (
    <div className="flex flex-1 items-center gap-3">
      {steps.map((s, idx) => {
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
            {idx < steps.length - 1 && (
              <div className="h-px flex-1 bg-emerald-500/60" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step1Region(props: {
  regionCodeSystem: string;
  setRegionCodeSystem: (v: string) => void;
  regionCodeGov: string;
  setRegionCodeGov: (v: string) => void;
  regionName: string;
  setRegionName: (v: string) => void;
  province: string;
  setProvince: (v: string) => void;
  district: string;
  setDistrict: (v: string) => void;
  commune: string;
  setCommune: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  ownerName: string;
  setOwnerName: (v: string) => void;
  regionArea: string;
  setRegionArea: (v: string) => void;
  soilType: string;
  setSoilType: (v: string) => void;
  terrain: string;
  setTerrain: (v: string) => void;
  note: string;
  setNote: (v: string) => void;
}) {
  const {
    regionCodeSystem,
    setRegionCodeSystem,
    regionCodeGov,
    setRegionCodeGov,
    regionName,
    setRegionName,
    province,
    setProvince,
    district,
    setDistrict,
    commune,
    setCommune,
    address,
    setAddress,
    ownerName,
    setOwnerName,
    regionArea,
    setRegionArea,
    soilType,
    setSoilType,
    terrain,
    setTerrain,
    note,
    setNote,
  } = props;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Layers3 className="h-4 w-4 text-primary" />
            Vùng trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                Mã vùng (hệ thống)
              </p>
              <Input
                className="h-9"
                value={regionCodeSystem}
                onChange={(e) => setRegionCodeSystem(e.target.value)}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Mã vùng (định danh nhà nước)
              </p>
              <Input
                className="h-9"
                value={regionCodeGov}
                onChange={(e) => setRegionCodeGov(e.target.value)}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Tên vùng trồng *</p>
            <Input
              className="h-9"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              placeholder="Nhập tên vùng trồng"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Tỉnh/Thành phố</p>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn tỉnh/thành" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đắk Lắk">Đắk Lắk</SelectItem>
                  <SelectItem value="Gia Lai">Gia Lai</SelectItem>
                  <SelectItem value="An Giang">An Giang</SelectItem>
                  <SelectItem value="Đồng Tháp">Đồng Tháp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Quận/Huyện</p>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TP. Buôn Ma Thuột">
                    TP. Buôn Ma Thuột
                  </SelectItem>
                  <SelectItem value="Huyện Krông Pắk">
                    Huyện Krông Pắk
                  </SelectItem>
                  <SelectItem value="Huyện Cư M'gar">
                    Huyện Cư M&apos;gar
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phường/Xã</p>
              <Select value={commune} onValueChange={setCommune}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Xã Krông Pắk">Xã Krông Pắk</SelectItem>
                  <SelectItem value="Xã Ea Tu">Xã Ea Tu</SelectItem>
                  <SelectItem value="Xã Hòa Thắng">Xã Hòa Thắng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Địa chỉ</p>
            <div className="relative">
              <Input
                className="h-9 pl-7"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <OwnerSelectCard />

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Diện tích (m²) *</p>
              <Input
                className="h-9"
                value={regionArea}
                onChange={(e) => setRegionArea(e.target.value)}
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Loại đất</p>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn loại đất" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đất phù sa">Đất phù sa</SelectItem>
                  <SelectItem value="Đất đỏ bazan">Đất đỏ bazan</SelectItem>
                  <SelectItem value="Đất cát pha">Đất cát pha</SelectItem>
                  <SelectItem value="Đất thịt nhẹ">Đất thịt nhẹ</SelectItem>
                  <SelectItem value="Đất xám bạc màu">
                    Đất xám bạc màu
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Địa hình</p>
              <Select value={terrain} onValueChange={setTerrain}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn địa hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bằng phẳng">Bằng phẳng</SelectItem>
                  <SelectItem value="Đồi thoải">Đồi thoải</SelectItem>
                  <SelectItem value="Đồi dốc">Đồi dốc</SelectItem>
                  <SelectItem value="Vùng trũng">Vùng trũng</SelectItem>
                  <SelectItem value="Ven sông">Ven sông</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Ghi chú</p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <SquareKanban className="h-4 w-4 text-primary" />
            Doanh nghiệp / Nông hộ liên kết
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            Chọn một doanh nghiệp hoặc nông hộ ở bên trên để gắn làm đơn vị quản
            lý chính cho vùng trồng này.
          </p>
          <p>
            Thông tin này sẽ được dùng ở bước xác nhận và trong báo cáo truy
            xuất nguồn gốc.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Step2Map(props: {
  latitude: string;
  setLatitude: (v: string) => void;
  longitude: string;
  setLongitude: (v: string) => void;
}) {
  const { latitude, setLatitude, longitude, setLongitude } = props;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Map className="h-4 w-4 text-primary" />
          Biểu đồ vùng trồng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Latitude</p>
            <Input
              className="h-9"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Longitude</p>
            <Input
              className="h-9"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="sm" variant="outline">
            <Plus className="mr-1 h-4 w-4" />
            Thêm tọa độ
          </Button>
        </div>

        <div className="mt-1 h-[360px] w-full overflow-hidden rounded-md border bg-muted">
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Bản đồ Leaflet với polygon (placeholder)
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Step3Areas(props: {
  areas: Area[];
  onAddArea: () => void;
  onChangeArea: (id: string, field: keyof Area, value: string) => void;
  onRemoveArea: (id: string) => void;
}) {
  const { areas, onAddArea, onChangeArea, onRemoveArea } = props;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <SquareKanban className="h-4 w-4 text-primary" />
          Khu vực trong vùng
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {areas.map((a, idx) => (
          <div
            key={a.id}
            className="rounded-lg border bg-muted/10 p-3 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-muted-foreground">
                Khu vực {idx + 1}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRemoveArea(a.id)}
                  disabled={areas.length === 1}
                >
                  Xóa
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">Tên khu vực *</p>
                <Input
                  className="h-9"
                  value={a.name}
                  onChange={(e) => onChangeArea(a.id, "name", e.target.value)}
                  placeholder="VD: Khu vực 1"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Diện tích (m²)</p>
                <Input
                  className="h-9"
                  value={a.area}
                  onChange={(e) => onChangeArea(a.id, "area", e.target.value)}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Loại đất</p>
                <Select
                  value={a.soilType}
                  onValueChange={(v) => onChangeArea(a.id, "soilType", v)}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn loại đất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đất pha cát">Đất pha cát</SelectItem>
                    <SelectItem value="Đất thịt nhẹ">Đất thịt nhẹ</SelectItem>
                    <SelectItem value="Đất pha sét">Đất pha sét</SelectItem>
                    <SelectItem value="Đất đỏ bazan">Đất đỏ bazan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Địa hình</p>
                <Select
                  value={a.topo}
                  onValueChange={(v) => onChangeArea(a.id, "topo", v)}
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Chọn địa hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bằng phẳng">Bằng phẳng</SelectItem>
                    <SelectItem value="Thoải dốc">Thoải dốc</SelectItem>
                    <SelectItem value="Đồi dốc">Đồi dốc</SelectItem>
                    <SelectItem value="Vùng trũng">Vùng trũng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ghi chú</p>
                <Input
                  className="h-9"
                  value={a.note}
                  onChange={(e) => onChangeArea(a.id, "note", e.target.value)}
                  placeholder="Thông tin thêm cho khu vực"
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-1 w-full justify-center border-dashed"
            >
              <Map className="mr-1 h-4 w-4" />
              Tạo bản đồ khu vực
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-dashed"
          onClick={onAddArea}
        >
          <Plus className="mr-1 h-4 w-4" />
          Thêm khu vực
        </Button>
      </CardContent>
    </Card>
  );
}

function Step4Review(props: {
  region: {
    regionCodeSystem: string;
    regionCodeGov: string;
    regionName: string;
    province: string;
    district: string;
    commune: string;
    address: string;
    ownerName: string;
    regionArea: string;
    soilType: string;
    terrain: string;
    note: string;
  };
  coords: { latitude: string; longitude: string };
  areas: Area[];
}) {
  const { region, coords, areas } = props;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Xác nhận vùng trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
          <div className="space-y-1">
            <p>
              Mã vùng (HT):{" "}
              <span className="font-semibold">{region.regionCodeSystem}</span>
            </p>
            <p>
              Mã vùng (QG):{" "}
              <span className="font-semibold">{region.regionCodeGov}</span>
            </p>
            <p>
              Tên vùng trồng:{" "}
              <span className="font-semibold">{region.regionName}</span>
            </p>
            <p>
              Tỉnh/Thành phố:{" "}
              <span className="font-semibold">{region.province}</span>
            </p>
            <p>
              Phường/Xã: <span className="font-semibold">{region.commune}</span>
            </p>
          </div>
          <div className="space-y-1">
            <p>
              Tổ chức / Nông hộ:{" "}
              <span className="font-semibold">{region.ownerName}</span>
            </p>
            <p>
              Diện tích:{" "}
              <span className="font-semibold">{region.regionArea} m²</span>
            </p>
            <p>
              Loại đất: <span className="font-semibold">{region.soilType}</span>
            </p>
            <p>
              Địa hình: <span className="font-semibold">{region.terrain}</span>
            </p>
          </div>
          <p className="md:col-span-2">
            Địa chỉ:{" "}
            <span className="font-semibold">
              {region.address}, {region.district}, {region.province}
            </span>
          </p>
          <p className="md:col-span-2">
            Ghi chú: <span className="font-semibold">{region.note}</span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bản đồ vùng trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            Tọa độ trung tâm: Lat {coords.latitude} – Long {coords.longitude}
          </p>
          <div className="mt-1 h-[320px] w-full overflow-hidden rounded-md border bg-muted">
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Bản đồ Leaflet với polygon (placeholder)
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách khu vực ({areas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
          {areas.map((a, idx) => (
            <div
              key={a.id}
              className="rounded-lg border bg-muted/20 p-2 space-y-1"
            >
              <p className="font-semibold">
                Khu vực {idx + 1}: {a.name || "-"}
              </p>
              <p>Diện tích: {a.area || "-"} m²</p>
              <p>Loại đất: {a.soilType || "-"}</p>
              <p>Địa hình: {a.topo || "-"} </p>
              <p>Ghi chú: {a.note || "-"}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
