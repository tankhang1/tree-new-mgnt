// src/pages/seed/SeedListPage.tsx
"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Sprout,
  Filter,
  FileDown,
  Plus,
  CircleDot,
  Circle,
  BookOpen,
} from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table"; // data table của bạn
import { useNavigate } from "react-router";

/************ TYPES ************/

export type SeedStatus = "active" | "trial" | "archived";

export type Seed = {
  id: string;
  code: string; // mã giống
  name: string; // tên giống
  cropName: string; // cây trồng
  supplier: string; // nhà cung cấp
  origin: string; // xuất xứ
  germPercent: number; // tỷ lệ nảy mầm
  uniformPercent: number; // độ đồng đều
  yield: string; // năng suất
  note?: string;
  docUrl?: string;
  status: SeedStatus;
  imageUrl?: string;
};

/************ MOCK DATA ************/

const SEEDS: Seed[] = [
  {
    id: "1",
    code: "DN-DT84",
    name: "Đậu nành DT84",
    cropName: "Đậu nành",
    supplier: "Trung tâm Giống cây trồng Việt Nam",
    origin: "Việt Nam",
    germPercent: 90,
    uniformPercent: 70,
    yield: "2,5 tấn/ha",
    note: "Giống đầu nành ngắn ngày (90–100 ngày), chịu hạn tốt, hạt vàng sáng.",
    docUrl: "#",
    status: "active",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh3WrdDlyDlvU4zUrcW5l7GXeoJutE8IoHww&s",
  },
  {
    id: "2",
    code: "DN-DX11",
    name: "Đậu nành DX11",
    cropName: "Đậu nành",
    supplier: "Công ty Mekong Seed",
    origin: "Việt Nam",
    germPercent: 88,
    uniformPercent: 72,
    yield: "2,8 tấn/ha",
    note: "Phù hợp nhiều vùng sinh thái khác nhau.",
    docUrl: "#",
    status: "trial",
    imageUrl:
      "https://i.ex-cdn.com/nongnghiepmoitruong.vn/files/f1/Image/2009/7/5/05072009145217.jpg",
  },
  {
    id: "3",
    code: "BP-LVN10",
    name: "Bắp LVN10",
    cropName: "Bắp",
    supplier: "Viện Nghiên cứu Ngô Trung ương",
    origin: "Việt Nam",
    germPercent: 93,
    uniformPercent: 80,
    yield: "9,5 tấn/ha",
    note: "Giống bắp lai sinh trưởng khỏe, kháng sâu bệnh tốt.",
    docUrl: "#",
    status: "active",
    imageUrl:
      "https://product.hstatic.net/200000563169/product/lvn10_b2491c53014949379e9e70e735a92544_master.jpg",
  },
  {
    id: "4",
    code: "BP-NK66",
    name: "Bắp NK66",
    cropName: "Bắp",
    supplier: "Syngenta Việt Nam",
    origin: "Thái Lan",
    germPercent: 91,
    uniformPercent: 78,
    yield: "10 tấn/ha",
    note: "Năng suất cao, phù hợp Đồng Nam Bộ & Tây Nguyên.",
    docUrl: "#",
    status: "trial",
    imageUrl: "https://static.tuoitre.vn/tto/i/s626/2015/03/24/AgwPWLuq.jpg",
  },
  {
    id: "5",
    code: "BP-HN68",
    name: "Bắp nếp HN68",
    cropName: "Bắp nếp",
    supplier: "Công ty Giống cây trồng Trung ương",
    origin: "Việt Nam",
    germPercent: 89,
    uniformPercent: 75,
    yield: "8,5 tấn/ha",
    note: "Giống bắp nếp chất lượng cao, thích hợp vụ hè thu.",
    docUrl: "#",
    status: "archived",
    imageUrl:
      "https://storage.vinaseed.com.vn/Data/2020/03/30/ngo-nep-lai-hn68-637211693313959200.jpg",
  },
];

/************ COLUMNS ************/

export const seedColumns: ColumnDef<Seed>[] = [
  {
    id: "code",
    header: "Mã giống",
    accessorKey: "code",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold">
        {row.original.code}
      </span>
    ),
  },
  {
    id: "image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const img = row.original.imageUrl;
      return (
        <div className="h-10 w-10 overflow-hidden rounded-md border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img || "/placeholder-seed.png"}
            alt={row.original.name}
            className="h-full w-full object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Tên giống",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-foreground">
          {row.original.name}
        </span>
        <span className="text-[11px] text-muted-foreground line-clamp-1">
          {row.original.supplier}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "cropName",
    header: "Cây trồng",
    cell: ({ row }) => (
      <div className="inline-flex items-center gap-1 text-xs">
        <Sprout className="h-3.5 w-3.5 text-emerald-600" />
        <span>{row.original.cropName}</span>
      </div>
    ),
  },
  {
    accessorKey: "origin",
    header: "Xuất xứ",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.origin}
      </span>
    ),
  },
  {
    id: "germ",
    header: "Tỷ lệ nảy mầm",
    cell: ({ row }) => (
      <span className="text-xs font-medium">{row.original.germPercent}%</span>
    ),
  },
  {
    id: "uniform",
    header: "Độ đồng đều",
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">
        {row.original.uniformPercent}%
      </span>
    ),
  },
  {
    accessorKey: "yield",
    header: "Năng suất tham khảo",
    cell: ({ row }) => (
      <span className="text-xs font-medium">{row.original.yield}</span>
    ),
  },
  {
    accessorKey: "note",
    header: "Mô tả ngắn",
    cell: ({ row }) => (
      <span className="text-[11px] text-muted-foreground line-clamp-2 max-w-xs">
        {row.original.note}
      </span>
    ),
  },
  {
    id: "doc",
    header: "Tài liệu kỹ thuật",
    cell: ({ row }) =>
      row.original.docUrl ? (
        <Button
          variant="link"
          size="sm"
          className="h-auto px-0 text-xs text-sky-600"
          onClick={() => window.open(row.original.docUrl, "_blank")}
        >
          <BookOpen className="mr-1 h-3 w-3" />
          Tài liệu tham khảo
        </Button>
      ) : (
        <span className="text-[11px] text-muted-foreground italic">
          Chưa đính kèm
        </span>
      ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const st = row.original.status;
      if (st === "active") {
        return (
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px]">
            <CircleDot className="mr-1 h-3 w-3" />
            Đang sử dụng
          </Badge>
        );
      }
      if (st === "trial") {
        return (
          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[11px]">
            <CircleDot className="mr-1 h-3 w-3" />
            Thử nghiệm
          </Badge>
        );
      }
      return (
        <Badge className="bg-slate-50 text-slate-600 border border-slate-200 text-[11px]">
          <Circle className="mr-1 h-3 w-3" />
          Lưu trữ
        </Badge>
      );
    },
  },
];

/************ PAGE ************/

export default function SeedsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState("");
  const [supplier, setSupplier] = React.useState<"all" | string>("all");
  const [origin, setOrigin] = React.useState<"all" | string>("all");
  const [status, setStatus] = React.useState<"all" | SeedStatus>("all");

  const suppliers = React.useMemo(
    () => Array.from(new Set(SEEDS.map((s) => s.supplier))),
    []
  );
  const origins = React.useMemo(
    () => Array.from(new Set(SEEDS.map((s) => s.origin))),
    []
  );

  const filteredSeeds = React.useMemo(() => {
    return SEEDS.filter((s) => {
      if (supplier !== "all" && s.supplier !== supplier) return false;
      if (origin !== "all" && s.origin !== origin) return false;
      if (status !== "all" && s.status !== status) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = (
          s.code +
          s.name +
          s.cropName +
          s.supplier +
          s.origin +
          (s.note ?? "")
        ).toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [search, supplier, origin, status]);

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
            <Sprout className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Quản lý hạt giống cây trồng
            </h1>
            <p className="text-xs text-muted-foreground">
              Theo dõi mã giống, nhà cung cấp, xuất xứ, tỷ lệ nảy mầm và tài
              liệu kỹ thuật kèm theo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Button variant="outline" size="sm">
            <FileDown className="mr-1 h-4 w-4" />
            Xuất file
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={() => navigate("/main/crop/seeds/add")}
          >
            <Plus className="mr-1 h-4 w-4" />
            Thêm giống mới
          </Button>
        </div>
      </header>

      {/* FILTER BAR */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Tìm kiếm & lọc nhanh
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-5 text-xs">
          <FilterItem label="Khung tìm kiếm">
            <Input
              className="h-8"
              placeholder="Nhập mã giống, tên giống, cây trồng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </FilterItem>

          <FilterItem label="Nhà cung cấp">
            <Select
              value={supplier}
              onValueChange={(v) => setSupplier(v as "all" | string)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn nhà cung cấp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {suppliers.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="Xuất xứ">
            <Select
              value={origin}
              onValueChange={(v) => setOrigin(v as "all" | string)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn xuất xứ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {origins.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FilterItem>

          <FilterItem label="Trạng thái sử dụng">
            <Select
              value={status}
              onValueChange={(v) => setStatus(v as "all" | SeedStatus)}
            >
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang sử dụng</SelectItem>
                <SelectItem value="trial">Thử nghiệm</SelectItem>
                <SelectItem value="archived">Lưu trữ</SelectItem>
              </SelectContent>
            </Select>
          </FilterItem>

          <div className="flex items-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => {
                setSearch("");
                setSupplier("all");
                setOrigin("all");
                setStatus("all");
              }}
            >
              <Filter className="mr-1 h-4 w-4" />
              Làm mới bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DATA TABLE */}
      <Card>
        <CardContent className="pt-3">
          <DataTable columns={seedColumns} data={filteredSeeds} />
          <p className="mt-2 text-[11px] text-muted-foreground">
            Hiển thị{" "}
            <span className="font-semibold text-foreground">
              {filteredSeeds.length}
            </span>{" "}
            / {SEEDS.length} giống hạt trong hệ thống.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/************ SMALL COMPONENTS ************/

function FilterItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
