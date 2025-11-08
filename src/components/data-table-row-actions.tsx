"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Row } from "@tanstack/react-table";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  onView?: (row: TData) => void;
  onEdit?: (row: TData) => void;
  onDelete?: (row: TData) => void;
  more?: { label: string; onClick: (row: TData) => void }[];
}

export function DataTableRowActions<TData>({
  row,
  onView,
  onEdit,
  onDelete,
  more,
}: DataTableRowActionsProps<TData>) {
  const data = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onView?.(data)}>
          Xem chi tiết
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(data)}>
          Chỉnh sửa
        </DropdownMenuItem>
        {more?.map((item) => (
          <DropdownMenuItem onClick={() => item.onClick?.(data)}>
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(data)}
          className="text-red-600"
        >
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
