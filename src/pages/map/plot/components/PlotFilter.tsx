"use client";

import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function PlotFilterBar({
  onFilterChange,
  onResetFilters,
  total,
  filtered,
}: {
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
  total: number;
  filtered: number;
}) {
  const [filters, setFilters] = useState({
    keyword: "",
    province: "all",
    landType: "all",
    ward: "all",
  });

  const update = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-gray-700">
        Tìm kiếm & lọc lô trồng
      </p>

      {/* Search Bar */}
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Nhập mã lô, tên lô, khu vực, vùng…"
            className="pl-10 text-sm"
            value={filters.keyword}
            onChange={(e) => update("keyword", e.target.value)}
          />
        </div>

        <Button
          variant="outline"
          className="flex h-9 items-center gap-2 text-xs"
          onClick={() => {
            setFilters({
              keyword: "",
              province: "all",
              landType: "all",
              ward: "all",
            });
            onResetFilters();
          }}
        >
          <RotateCcw className="h-4 w-4" /> Làm mới bộ lọc
        </Button>
      </div>

      {/* Dropdown Filters */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div>
          <Select
            value={filters.province}
            onValueChange={(e) => update("province", e)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Tỉnh/Thành phố" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="angiang">An Giang</SelectItem>
              <SelectItem value="longan">Long An</SelectItem>
              <SelectItem value="cantho">Cần Thơ</SelectItem>
              <SelectItem value="gialai">Gia Lai</SelectItem>
              <SelectItem value="tiengiang">Tiền Giang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={filters.landType}
            onValueChange={(e) => update("landType", e)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Loại đất" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="bazan">Đất đỏ bazan</SelectItem>
              <SelectItem value="phusa">Đất phù sa</SelectItem>
              <SelectItem value="thitnhe">Đất thịt nhẹ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={filters.ward} onValueChange={(e) => update("ward", e)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Phường/Xã" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="xuan">P. Long Xuyên</SelectItem>
              <SelectItem value="mytho">P. Mỹ Tho</SelectItem>
              <SelectItem value="cairang">P. Cái Răng</SelectItem>
              <SelectItem value="duchoa">X. Đức Hòa</SelectItem>
              <SelectItem value="iagrai">X. Ia Grai</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-3 text-right text-xs text-gray-500">
        Đang hiển thị {filtered} / {total} lô — Áp dụng{" "}
        {filtered !== total ? "1" : "0"} bộ lọc
      </div>
    </div>
  );
}
