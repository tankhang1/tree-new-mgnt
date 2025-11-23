"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Ruler,
  MountainSnow,
  Rows,
  MapPin,
  Save,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SummaryCard } from "../region/components/SummaryCard";

type LotAllocation = {
  id: string;
  code: string;
  name: string;
  areaName: string;
  regionName: string;
  areaSqm: number;
  contourDesc: string;
  rowCount: number;
};

const MOCK_LOTS: LotAllocation[] = [
  {
    id: "1",
    code: "LO-A1",
    name: "Lô A1",
    areaName: "Khu vực A1",
    regionName: "Vùng A",
    areaSqm: 1500,
    contourDesc: "Địa hình dốc nhẹ, từ 48m đến 56m",
    rowCount: 8,
  },
  {
    id: "2",
    code: "LO-B1",
    name: "Lô B1",
    areaName: "Khu vực B1",
    regionName: "Vùng B",
    areaSqm: 2000,
    contourDesc: "Địa hình dốc nhẹ, từ 48m đến 56m",
    rowCount: 12,
  },
  {
    id: "3",
    code: "LO-C1",
    name: "Lô C1",
    areaName: "Khu vực C1",
    regionName: "Vùng C",
    areaSqm: 1800,
    contourDesc: "Địa hình bằng phẳng, cao độ 50m",
    rowCount: 10,
  },
];

function formatArea(m2: number) {
  return `${m2.toLocaleString("vi-VN")} m²`;
}

export default function EditPlotPage() {
  const navigate = useNavigate();
  const lot = MOCK_LOTS[0];

  const [code, setCode] = useState(lot.code);
  const [name, setName] = useState(lot.name);
  const [areaName, setAreaName] = useState(lot.areaName);
  const [regionName, setRegionName] = useState(lot.regionName);
  const [areaSqm, setAreaSqm] = useState<number>(lot.areaSqm);
  const [contourDesc, setContourDesc] = useState(lot.contourDesc);
  const [rowCount, setRowCount] = useState<number>(lot.rowCount);
  const [note, setNote] = useState("");

  const handleSave = () => {
    const payload: LotAllocation & { note: string } = {
      id: lot.id,
      code,
      name,
      areaName,
      regionName,
      areaSqm,
      contourDesc,
      rowCount,
      note,
    };
    console.log("Save lot", payload);
    navigate("/main/map/lots");
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
            <h1 className="text-lg font-semibold">Chỉnh sửa lô trồng</h1>
            <p className="text-xs text-muted-foreground">
              Cập nhật thông tin lô, diện tích, địa hình và khu vực quản lý.
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-4">
        <SummaryCard
          title="Diện tích lô"
          value={formatArea(areaSqm)}
          sub="Tổng diện tích hiện tại"
          icon={<Ruler className="h-4 w-4 text-muted-foreground" />}
        />
        <SummaryCard
          title="Địa hình"
          value={contourDesc || "Chưa khai báo"}
          sub="Mô tả đường bình độ"
          icon={<MountainSnow className="h-4 w-4 text-muted-foreground" />}
        />
        <SummaryCard
          title="Số hàng cây"
          value={String(rowCount || 0)}
          sub="Tổng số hàng trong lô"
          icon={<Rows className="h-4 w-4 text-muted-foreground" />}
        />
        <SummaryCard
          title="Thuộc khu"
          value={areaName || "Chưa chọn khu"}
          sub={regionName || "Chưa chọn vùng"}
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Mã lô <span className="text-red-500">*</span>
              </p>
              <Input
                className="h-9"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Tên lô <span className="text-red-500">*</span>
              </p>
              <Input
                className="h-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Khu vực <span className="text-red-500">*</span>
              </p>
              <Input
                className="h-9"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Vùng trồng</p>
              <Input
                className="h-9"
                value={regionName}
                onChange={(e) => setRegionName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Diện tích (m²) <span className="text-red-500">*</span>
              </p>
              <Input
                className="h-9"
                type="number"
                min={0}
                value={areaSqm}
                onChange={(e) => setAreaSqm(Number(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Số hàng cây</p>
              <Input
                className="h-9"
                type="number"
                min={0}
                value={rowCount}
                onChange={(e) => setRowCount(Number(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              Địa hình & ghi chú
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                Thông tin địa hình / đường bình độ
              </p>
              <Textarea
                className="min-h-[80px]"
                value={contourDesc}
                onChange={(e) => setContourDesc(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Ghi chú nội bộ</p>
              <Textarea
                className="min-h-[80px]"
                placeholder="Ví dụ: Lô nằm gần đường nội bộ, ưu tiên thu hoạch sớm..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-2 flex items-center justify-between border-t bg-background/60 py-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Hủy
        </Button>
        <Button
          size="sm"
          className="bg-primary! text-primary-foreground!"
          onClick={handleSave}
        >
          <Save className="mr-1 h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
