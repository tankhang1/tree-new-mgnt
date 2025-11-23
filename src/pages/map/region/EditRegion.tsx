"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Layers3,
  MapPin,
  Map,
  FileDown,
  Plus,
  Trash2,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import { TextareaItem } from "./components/TextareaItem";
import EditMapDialog from "./components/EditMapDialog";
type Area = {
  id: string;
  name: string;
  area: string;
  soilType: string;
  terrain: string;
  note: string;
};
type FieldFormState = {
  codeSystem: string;
  codeGov: string;
  name: string;
  owner: string;
  province: string;
  district: string;
  commune: string;
  address: string;
  soilType: string;
  terrain: string;
  area: string;
  note: string;
  lat: string;
  lng: string;
};

export default function EditRegionPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FieldFormState>({
    codeSystem: "KV-AG01",
    codeGov: "QG-789123",
    name: "Vùng Trồng Đậu Nành An Giang",
    owner: "HTX Nông nghiệp Vàm Nao",
    province: "An Giang",
    district: "TP. Long Xuyên",
    commune: "Phường Mỹ Hòa",
    address: "Ấp Bình Thạnh, phường Mỹ Hòa, TP. Long Xuyên, An Giang",
    soilType: "Đất phù sa",
    terrain: "Bằng phẳng",
    area: "15000",
    note: "Vùng trồng đã được cấp mã số và đang sản xuất vụ chính.",
    lat: "10.375612",
    lng: "105.432512",
  });
  const [areas, setAreas] = useState<Area[]>([
    {
      id: crypto.randomUUID(),
      name: "Khu vực 1 – Ven kênh",
      area: "8.000",
      soilType: "Đất phù sa",
      terrain: "Bằng phẳng",
      note: "Phù hợp cho bắp và đậu nành.",
    },
    {
      id: crypto.randomUUID(),
      name: "Khu vực 2 – Gò cao",
      area: "5.000",
      soilType: "Đất thịt nhẹ",
      terrain: "Gò đồi",
      note: "Ưu tiên đậu nành vụ Hè Thu.",
    },
  ]);

  const [openMap, setOpenMap] = useState(false);

  const updateArea = (id: string, key: keyof Area, value: string) => {
    setAreas((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [key]: value } : a))
    );
  };

  const addArea = () => {
    setAreas((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        area: "",
        soilType: "",
        terrain: "",
        note: "",
      },
    ]);
  };

  const removeArea = (id: string) => {
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const updateField = <K extends keyof FieldFormState>(
    key: K,
    value: FieldFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
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
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-primary" />
              Chỉnh sửa vùng trồng
            </h1>
            <p className="text-xs text-muted-foreground">
              Cập nhật thông tin vùng trồng, loại đất, địa điểm và bản đồ.
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm">
          <FileDown className="mr-1 h-4 w-4" />
          Xuất file
        </Button>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Thông tin vùng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid gap-3 md:grid-cols-2">
              <InputItem
                label="Mã vùng (HT)"
                value={form.codeSystem}
                onChange={(v) => updateField("codeSystem", v)}
              />
              <InputItem
                label="Mã vùng (QG)"
                value={form.codeGov}
                onChange={(v) => updateField("codeGov", v)}
              />
            </div>

            <InputItem
              label="Tên vùng trồng"
              value={form.name}
              onChange={(v) => updateField("name", v)}
            />

            <InputItem
              label="Doanh nghiệp / Nông hộ"
              value={form.owner}
              onChange={(v) => updateField("owner", v)}
            />

            <div className="grid gap-3 md:grid-cols-3">
              <SelectItemBlock
                label="Tỉnh/Thành phố"
                value={form.province}
                onChange={(v) => updateField("province", v)}
                options={["An Giang", "Đồng Tháp", "Cần Thơ", "Tiền Giang"]}
              />

              <SelectItemBlock
                label="Quận/Huyện"
                value={form.district}
                onChange={(v) => updateField("district", v)}
                options={["TP. Long Xuyên", "Huyện Chợ Mới", "Huyện Thoại Sơn"]}
              />

              <SelectItemBlock
                label="Phường/Xã"
                value={form.commune}
                onChange={(v) => updateField("commune", v)}
                options={[
                  "Phường Mỹ Hòa",
                  "Phường Bình Khánh",
                  "Phường Mỹ Bình",
                ]}
              />
            </div>

            <InputIconItem
              label="Địa chỉ"
              value={form.address}
              onChange={(v) => updateField("address", v)}
              icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
            />

            <div className="grid gap-3 md:grid-cols-3">
              <InputItem
                label="Diện tích (m²)"
                value={form.area}
                onChange={(v) => updateField("area", v)}
              />

              <SelectItemBlock
                label="Loại đất"
                value={form.soilType}
                onChange={(v) => updateField("soilType", v)}
                options={[
                  "Đất phù sa",
                  "Đất đỏ bazan",
                  "Đất cát pha",
                  "Đất thịt nhẹ",
                ]}
              />

              <SelectItemBlock
                label="Địa hình"
                value={form.terrain}
                onChange={(v) => updateField("terrain", v)}
                options={[
                  "Bằng phẳng",
                  "Thoải dốc",
                  "Đồi dốc",
                  "Vùng trũng",
                  "Ven sông",
                ]}
              />
            </div>

            <TextareaItem
              label="Ghi chú"
              value={form.note}
              onChange={(v) => updateField("note", v)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Layers3 className="h-4 w-4 text-primary" />
              Khu vực trong vùng
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {areas.map((a, index) => (
              <div
                key={a.id}
                className="rounded-lg border bg-muted/10 p-3 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Khu vực {index + 1}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500"
                    disabled={areas.length === 1}
                    onClick={() => removeArea(a.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                  {/* Tên khu vực */}
                  <div className="xl:col-span-2">
                    <label className="text-xs text-muted-foreground">
                      Tên khu vực
                    </label>
                    <Input
                      className="h-9"
                      value={a.name}
                      onChange={(e) => updateArea(a.id, "name", e.target.value)}
                    />
                  </div>

                  {/* Diện tích */}
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Diện tích (m²)
                    </label>
                    <Input
                      className="h-9"
                      value={a.area}
                      onChange={(e) => updateArea(a.id, "area", e.target.value)}
                    />
                  </div>

                  {/* Loại đất */}
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Loại đất
                    </label>
                    <Select
                      value={a.soilType}
                      onValueChange={(v) => updateArea(a.id, "soilType", v)}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Chọn loại đất" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Đất phù sa">Đất phù sa</SelectItem>
                        <SelectItem value="Đất thịt nhẹ">
                          Đất thịt nhẹ
                        </SelectItem>
                        <SelectItem value="Đất cát pha">Đất cát pha</SelectItem>
                        <SelectItem value="Đất đỏ bazan">
                          Đất đỏ bazan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Địa hình */}
                  <div>
                    <label className="text-xs text-muted-foreground">
                      Địa hình
                    </label>
                    <Select
                      value={a.terrain}
                      onValueChange={(v) => updateArea(a.id, "terrain", v)}
                    >
                      <SelectTrigger className="h-9 w-full">
                        <SelectValue placeholder="Chọn địa hình" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bằng phẳng">Bằng phẳng</SelectItem>
                        <SelectItem value="Dốc nhẹ (0–8%)">
                          Dốc nhẹ (0–8%)
                        </SelectItem>
                        <SelectItem value="Gò đồi">Gò đồi</SelectItem>
                        <SelectItem value="Trũng">Vùng trũng</SelectItem>
                        <SelectItem value="Ven sông">Ven sông</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ghi chú */}
                  <div className="xl:col-span-2">
                    <label className="text-xs text-muted-foreground">
                      Ghi chú
                    </label>
                    <Input
                      className="h-9"
                      value={a.note}
                      onChange={(e) => updateArea(a.id, "note", e.target.value)}
                    />
                  </div>
                </div>

                {/* Button chỉnh bản đồ */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-fit"
                  onClick={() => setOpenMap(true)}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Chỉnh polygon bản đồ
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="border-dashed"
              onClick={addArea}
            >
              <Plus className="h-4 w-4 mr-1" /> Thêm khu vực mới
            </Button>
          </CardContent>

          <EditMapDialog open={openMap} onOpenChange={setOpenMap} />
        </Card>
      </div>

      <div className="flex items-center justify-end gap-2 border-t py-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Hủy
        </Button>
        <Button className="bg-primary! text-primary-foreground!">
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}

type InputItemProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function InputItem({ label, value, onChange }: InputItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Input
        className="h-9"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

type InputIconItemProps = InputItemProps & {
  icon: React.ReactNode;
};

function InputIconItem({ label, value, onChange, icon }: InputIconItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="relative">
        <Input
          className="h-9 pl-7"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span className="absolute left-2 top-2.5">{icon}</span>
      </div>
    </div>
  );
}

type SelectItemBlockProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

function SelectItemBlock({
  label,
  value,
  onChange,
  options,
}: SelectItemBlockProps) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 w-full">
          <SelectValue placeholder="Chọn" />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
