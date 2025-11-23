"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MapPolygonEditor from "./MapEditor";

export default function EditMapDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa bản đồ khu vực</DialogTitle>
        </DialogHeader>

        <div className="h-[380px] w-full rounded-md overflow-hidden border">
          <MapPolygonEditor />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button className="bg-primary text-white">Lưu polygon</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
