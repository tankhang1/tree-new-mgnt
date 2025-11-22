import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Map, CheckCircle2 } from "lucide-react";

export function ConfirmMapDialog({
  open,
  onOpenChange,
  onConfirm,
  onSkip,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  onSkip: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="h-4 w-4 text-primary" />
            Thiết lập bản đồ vùng trồng
          </DialogTitle>
          <DialogDescription className="text-xs">
            Bạn đã hoàn tất nhập dữ liệu vùng – khu vực – lô. Bạn có muốn chuyển
            sang chức năng bản đồ để vẽ đa giác (polygon) cho vùng trồng không?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-2 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onSkip}>
            Để sau
          </Button>
          <Button
            size="sm"
            className="bg-primary! text-primary-foreground!"
            onClick={onConfirm}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Thiết lập bản đồ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
