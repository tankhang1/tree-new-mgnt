"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, Trash2, Plus } from "lucide-react";

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

type Plot = {
  id: string;
  code: string;
  name: string;
  area: string;
  contour: string;
  pointsCount: number;
};

function createId() {
  return crypto.randomUUID();
}

export default function EditAreaPage() {
  const navigate = useNavigate();

  const [areaName, setAreaName] = useState("Khu vực D4");
  const [areaSize, setAreaSize] = useState("11200");
  const [soilType, setSoilType] = useState<string | undefined>("dat-do");
  const [terrain, setTerrain] = useState<string | undefined>("bang-phang");
  const [note, setNote] = useState("Khu vực ven đường, thuận tiện thu hoạch.");

  const [lat, setLat] = useState("10.762622");
  const [lng, setLng] = useState("106.660172");

  const [plots, setPlots] = useState<Plot[]>([
    {
      id: createId(),
      code: "LO-01",
      name: "Lô 01 – Gần đường",
      area: "3,500",
      contour: "110m",
      pointsCount: 4,
    },
    {
      id: createId(),
      code: "LO-02",
      name: "Lô 02 – Giữa khu vực",
      area: "4,000",
      contour: "120m",
      pointsCount: 4,
    },
  ]);

  const handleChangePlot = (
    id: string,
    field: keyof Plot,
    value: string | number
  ) => {
    setPlots((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleAddPlot = () => {
    setPlots((prev) => [
      ...prev,
      {
        id: createId(),
        code: "",
        name: "",
        area: "",
        contour: "",
        pointsCount: 4,
      },
    ]);
  };

  const handleRemovePlot = (id: string) => {
    setPlots((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    // gọi API lưu ở đây
    navigate(-1);
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
            <h1 className="text-lg font-semibold">Chỉnh sửa khu vực trồng</h1>
            <p className="text-xs text-muted-foreground">
              {areaName} · {areaSize} m² ·{" "}
              {soilType === "dat-do" ? "Đất đỏ bazan" : "Loại đất khác"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            Hủy
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={handleSave}
          >
            Lưu thay đổi
          </Button>
        </div>
      </header>

      <div className="grid gap-4 grid-cols-2">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Thông tin khu vực
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Tên khu vực *
                </p>
                <Input
                  className="h-9"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                />
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Diện tích (m²) *
                </p>
                <Input
                  className="h-9"
                  value={areaSize}
                  onChange={(e) => setAreaSize(e.target.value)}
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Loại đất
                  </p>
                  <Select
                    value={soilType}
                    onValueChange={(v) => setSoilType(v)}
                  >
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Chọn loại đất" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dat-do">Đất đỏ bazan</SelectItem>
                      <SelectItem value="dat-phu-sa">Đất phù sa</SelectItem>
                      <SelectItem value="dat-cat-pha">Đất cát pha</SelectItem>
                      <SelectItem value="dat-thit-nhe">Đất thịt nhẹ</SelectItem>
                      <SelectItem value="dat-xam">Đất xám bạc màu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Địa hình
                  </p>
                  <Select value={terrain} onValueChange={(v) => setTerrain(v)}>
                    <SelectTrigger className="h-9 w-full">
                      <SelectValue placeholder="Chọn địa hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bang-phang">Bằng phẳng</SelectItem>
                      <SelectItem value="cao">Cao, Thoai thoải</SelectItem>
                      <SelectItem value="thap">Thấp, Trũng</SelectItem>
                      <SelectItem value="doi">Đồi núi thấp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Ghi chú
                </p>
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
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Lô trong khu vực
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {plots.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-lg border bg-muted/10 p-3 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Lô {idx + 1}
                    </p>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:text-red-600"
                      onClick={() => handleRemovePlot(item.id)}
                      disabled={plots.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Mã lô *</p>
                        <Input
                          className="h-9"
                          value={item.code}
                          onChange={(e) =>
                            handleChangePlot(item.id, "code", e.target.value)
                          }
                        />
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-xs text-muted-foreground">
                          Tên lô *
                        </p>
                        <Input
                          className="h-9"
                          value={item.name}
                          onChange={(e) =>
                            handleChangePlot(item.id, "name", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Diện tích (m²) *
                        </p>
                        <Input
                          className="h-9"
                          value={item.area}
                          onChange={(e) =>
                            handleChangePlot(item.id, "area", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Đường bình độ (cao độ)
                        </p>
                        <Input
                          className="h-9"
                          value={item.contour}
                          onChange={(e) =>
                            handleChangePlot(item.id, "contour", e.target.value)
                          }
                          placeholder="VD: 110m"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center border border-dashed text-emerald-700"
                    >
                      <MapPin className="mr-1 h-4 w-4" />
                      Tạo bản đồ lô
                    </Button>

                    <p className="text-center text-[11px] text-muted-foreground">
                      Tọa độ lô (tổng {item.pointsCount} điểm)
                    </p>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-dashed"
                onClick={handleAddPlot}
              >
                <Plus className="mr-1 h-4 w-4" />
                Thêm lô
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Biểu đồ khu vực
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Latitude
                  </p>
                  <Input
                    className="h-9"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Longitude
                  </p>
                  <Input
                    className="h-9"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button size="sm" variant="outline">
                  <Plus className="mr-1 h-4 w-4" />
                  Thêm tọa độ
                </Button>
              </div>
              <div className="h-[260px] w-full overflow-hidden rounded-md border">
                {/* gắn Leaflet MapContainer + Polygon của bạn vào đây */}
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  Map placeholder · Leaflet polygon
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                Xem nhanh khu vực trên bản đồ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <p>
                Lat: {lat} · Lng: {lng}
              </p>
              <p>Số lô: {plots.length}</p>
              <p>Ghi chú: {note || "-"}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
