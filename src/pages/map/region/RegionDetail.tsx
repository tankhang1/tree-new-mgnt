"use client";

import {
  Map,
  Layers3,
  ArrowLeft,
  FileDown,
  Pencil,
  Sprout,
  Leaf,
  TreesIcon as Trees,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { SummaryCard } from "./components/SummaryCard";
import { Info } from "./components/Info";

export default function RegionDetailPage() {
  const navigate = useNavigate();

  const region = {
    codeSystem: "KV-AG01",
    codeGov: "QG-789123",
    name: "Vùng Trồng Đậu Nành An Giang",
    owner: "HTX Nông nghiệp Vàm Nao",
    province: "An Giang",
    district: "TP. Long Xuyên",
    commune: "Phường Mỹ Hòa",
    address: "Ấp Bình Thạnh, phường Mỹ Hòa, TP. Long Xuyên, An Giang",
    soilType: "Đất phù sa",
    terrain: "Bằng phẳng • Ven sông",
    area: 15000,
    note: "Vùng trồng đã được cấp mã số và đang sản xuất vụ chính.",
    lat: "10.375612",
    lng: "105.432512",
  };

  const areas = [
    {
      name: "Khu vực 1",
      area: "5.000 m²",
      soil: "Đất phù sa",
      topo: "Bằng phẳng",
      note: "Sinh trưởng đồng đều",
    },
    {
      name: "Khu vực 2",
      area: "7.000 m²",
      soil: "Đất thịt nhẹ",
      topo: "Ven sông",
      note: "Cần theo dõi ẩm độ",
    },
    {
      name: "Khu vực 3",
      area: "3.000 m²",
      soil: "Đất phù sa",
      topo: "Thoải dốc",
      note: "-",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
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
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              <Trees className="h-5 w-5 text-emerald-600" />
              {region.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              Mã vùng: <span className="font-medium">{region.codeSystem}</span>{" "}
              • {region.province}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-1 h-4 w-4" />
            Xuất file
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/main/crop/fields/map")}
          >
            <Map className="mr-1 h-4 w-4" />
            Xem bản đồ
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={() => navigate("/main/map/region/edit")}
          >
            <Pencil className="mr-1 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Diện tích vùng"
          value={`${(region.area / 1000).toFixed(1)} ha`}
          sub="Tổng diện tích khu vực"
          icon={<Map className="h-5 w-5 text-sky-600" />}
        />
        <SummaryCard
          title="Số khu vực"
          value={areas.length.toString()}
          sub="Số khu vực con trong vùng"
          icon={<Layers3 className="h-5 w-5 text-violet-600" />}
        />
        <SummaryCard
          title="Loại đất"
          value={region.soilType}
          sub="Thống kê loại đất chiếm đa số"
          icon={<Leaf className="h-5 w-5 text-amber-600" />}
        />
        <SummaryCard
          title="Địa hình"
          value={region.terrain}
          sub="Đặc điểm địa hình vùng"
          icon={<Sprout className="h-5 w-5 text-green-600" />}
        />
      </div>

      {/* CARD: THÔNG TIN VÙNG */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Thông tin vùng trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-sm">
          <Info label="Mã vùng (HT)" value={region.codeSystem} />
          <Info label="Mã vùng (QG)" value={region.codeGov} />
          <Info label="Tỉnh/Thành phố" value={region.province} />
          <Info label="Quận/Huyện" value={region.district} />
          <Info label="Phường/Xã" value={region.commune} />
          <Info label="Doanh nghiệp / Nông hộ" value={region.owner} />

          <div className="md:col-span-2">
            <Info label="Địa chỉ" value={region.address} />
          </div>

          <Info label="Loại đất" value={region.soilType} />
          <Info label="Địa hình" value={region.terrain} />

          <div className="md:col-span-2">
            <Info label="Ghi chú" value={region.note} />
          </div>
        </CardContent>
      </Card>

      {/* CARD: BẢN ĐỒ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Bản đồ vùng trồng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            Tọa độ trung tâm: Lat {region.lat} – Long {region.lng}
          </p>

          <div className="mt-1 h-[320px] w-full overflow-hidden rounded-md border bg-muted">
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              Bản đồ Leaflet (Placeholder)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CARD: DANH SÁCH KHU VỰC */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Danh sách khu vực ({areas.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 text-xs">
          {areas.map((a, idx) => (
            <div
              key={idx}
              className="rounded-lg border bg-muted/20 p-3 space-y-1"
            >
              <p className="font-semibold text-sm">{a.name}</p>
              <p>Diện tích: {a.area}</p>
              <p>Loại đất: {a.soil}</p>
              <p>Địa hình: {a.topo}</p>
              <p>Ghi chú: {a.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
