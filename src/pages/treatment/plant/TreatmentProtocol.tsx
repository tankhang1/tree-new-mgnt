"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { FileText, Stethoscope, Activity, AlertTriangle } from "lucide-react";

// Tối thiểu vậy là đủ, nếu bạn đã có type thì bỏ phần này đi
export type TreatmentProtocol = {
  id: string;
  code: string;
  name: string;
  disease: string;
  species: string;
  group?: string;
  severity: "nhẹ" | "trung-binh" | "nang" | string;
  status: "de-xuat" | "dang-ap-dung" | "tam-ngung" | string;
  durationDays?: number;
  withdrawalDays?: number;
  createdBy?: string;
  updatedAt?: string;
  indications?: string[];
  contraindications?: string[];
  startCriteria?: string[];
  stopCriteria?: string[];
  escalationSignals?: string[];
  safetyNotes?: string;
  followupPlan?: string;
  steps?: {
    id: string;
    name: string;
    medicine: string;
    route: string;
    frequency: string;
    duration: string;
    note?: string;
  }[];
  monitoring?: {
    day: string;
    focus: string;
    expected: string;
  }[];
  note?: string;
};

// Nếu bạn đã có standardProtocols thì import từ file riêng
const mockProtocols: TreatmentProtocol[] = []; // placeholder

type ProtocolPickerDialogProps = {
  protocols?: TreatmentProtocol[];
  onSelect: (protocol: TreatmentProtocol) => void;
};

export function ProtocolPickerDialog({
  protocols = mockProtocols,
  onSelect,
}: ProtocolPickerDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<string | null>(
    protocols[0]?.id ?? null
  );

  const selected = React.useMemo(
    () => protocols.find((p) => p.id === selectedId) ?? protocols[0],
    [protocols, selectedId]
  );

  const handleUse = () => {
    if (!selected) return;
    onSelect(selected);
    setOpen(false);
  };

  const renderSeverity = (sev: string) => {
    if (sev === "nhẹ") return "Nhẹ";
    if (sev === "trung-binh") return "Trung bình";
    if (sev === "nang") return "Nặng";
    return sev;
  };

  const renderStatus = (st: string) => {
    if (st === "dang-ap-dung") return "Đang áp dụng";
    if (st === "de-xuat") return "Đề xuất";
    if (st === "tam-ngung") return "Tạm ngưng";
    return st;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <FileText className="mr-1 h-4 w-4" />
          Chọn phác đồ mẫu
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl gap-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Stethoscope className="h-5 w-5 text-primary" />
            Chọn phác đồ điều trị chuẩn
          </DialogTitle>
          <DialogDescription className="text-xs">
            Chọn một phác đồ mẫu đã được chuẩn hoá để áp vào hồ sơ điều trị, sau
            đó bạn vẫn có thể chỉnh sửa lại chi tiết cho từng con.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full space-y-2 max-h-96 overflow-y-auto">
          {/* DANH SÁCH PHÁC ĐỒ BÊN TRÁI */}
          <div className="flex items-center space-x-2 overflow-x-scroll">
            {protocols.map((p) => {
              const active = p.id === selected?.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={cn(
                    "min-w-[250px] rounded-md border px-3 py-2 text-left text-xs transition-all hover:border-primary/60 hover:bg-background",
                    active &&
                      "border-primary bg-primary/5 ring-1 ring-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="line-clamp-1 text-[13px] font-semibold">
                      {p.name}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700"
                    >
                      {p.code}
                    </Badge>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground">
                    Bệnh: <span className="font-medium">{p.disease}</span>
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <Badge
                      variant="outline"
                      className="border-sky-200 bg-sky-50 text-[10px] text-sky-700"
                    >
                      {p.species}
                    </Badge>
                    {p.group && (
                      <Badge
                        variant="outline"
                        className="border-violet-200 bg-violet-50 text-[10px] text-violet-700"
                      >
                        {p.group}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px]",
                        p.severity === "nhẹ" &&
                          "border-emerald-200 bg-emerald-50 text-emerald-700",
                        p.severity === "trung-binh" &&
                          "border-amber-200 bg-amber-50 text-amber-700",
                        p.severity === "nang" &&
                          "border-red-200 bg-red-50 text-red-700"
                      )}
                    >
                      Mức độ: {renderSeverity(p.severity)}
                    </Badge>
                  </div>
                </button>
              );
            })}

            {protocols.length === 0 && (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Chưa có phác đồ chuẩn nào. Hãy tạo mới một phác đồ rồi lưu lại.
              </p>
            )}
          </div>

          {/* CHI TIẾT PHÁC ĐỒ BÊN PHẢI */}
          <div className="flex-col rounded-md border bg-muted/20 p-3 text-xs">
            {!selected ? (
              <div className="flex flex-1 items-center justify-center text-muted-foreground">
                Chọn một phác đồ bên trái để xem chi tiết.
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{selected.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Mã phác đồ:{" "}
                        <span className="font-mono font-medium">
                          {selected.code}
                        </span>
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant="outline"
                        className="border-sky-200 bg-sky-50 text-[10px] text-sky-700"
                      >
                        {selected.species}
                      </Badge>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        <span>{renderStatus(selected.status)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px]">
                    <span>
                      Bệnh:{" "}
                      <span className="font-medium">{selected.disease}</span>
                    </span>
                    {selected.group && (
                      <>
                        <Separator orientation="vertical" className="h-3" />
                        <span>
                          Nhóm đàn:{" "}
                          <span className="font-medium">{selected.group}</span>
                        </span>
                      </>
                    )}
                    {selected.durationDays && (
                      <>
                        <Separator orientation="vertical" className="h-3" />
                        <span>
                          Thời gian:{" "}
                          <span className="font-medium">
                            {selected.durationDays} ngày
                          </span>
                        </span>
                      </>
                    )}
                    {typeof selected.withdrawalDays === "number" && (
                      <>
                        <Separator orientation="vertical" className="h-3" />
                        <span>
                          Ngưng sữa / thịt:{" "}
                          <span className="font-medium">
                            {selected.withdrawalDays} ngày
                          </span>
                        </span>
                      </>
                    )}
                  </div>

                  {(selected.createdBy || selected.updatedAt) && (
                    <p className="text-[11px] text-muted-foreground">
                      Người soạn:{" "}
                      <span className="font-medium">
                        {selected.createdBy || "-"}
                      </span>
                      {selected.updatedAt && (
                        <>
                          {" "}
                          • Cập nhật:{" "}
                          <span className="font-medium">
                            {selected.updatedAt}
                          </span>
                        </>
                      )}
                    </p>
                  )}
                </div>

                <Separator className="my-2" />

                {/* Nội dung chi tiết cuộn được */}
                <ScrollArea className="flex-1 rounded-md bg-background p-2">
                  <div className="space-y-3">
                    {/* Chỉ định + chống chỉ định */}
                    <div className="grid gap-3 md:grid-cols-2">
                      <InfoBlock
                        title="Chỉ định áp dụng"
                        items={selected.indications}
                      />
                      <InfoBlock
                        title="Chống chỉ định / lưu ý không áp dụng"
                        items={selected.contraindications}
                        icon="alert"
                      />
                    </div>

                    {/* Tiêu chí bắt đầu / kết thúc / chuyển tuyến */}
                    <div className="grid gap-3 md:grid-cols-3">
                      <InfoBlock
                        title="Tiêu chí bắt đầu"
                        items={selected.startCriteria}
                      />
                      <InfoBlock
                        title="Tiêu chí dừng / hoàn thành"
                        items={selected.stopCriteria}
                      />
                      <InfoBlock
                        title="Tín hiệu cần báo bác sĩ / chuyển phác đồ"
                        items={selected.escalationSignals}
                        icon="alert"
                      />
                    </div>

                    {/* Các bước điều trị */}
                    {selected.steps && selected.steps.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Các bước / hạng mục trong phác đồ
                        </p>
                        <div className="space-y-2">
                          {selected.steps.map((s, idx) => (
                            <div
                              key={s.id}
                              className="rounded-md border bg-muted/40 p-2"
                            >
                              <p className="text-[11px] font-semibold">
                                Bước {idx + 1}: {s.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Thuốc / biện pháp:{" "}
                                <span className="font-medium">
                                  {s.medicine}
                                </span>
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Đường dùng: {s.route} • Tần suất: {s.frequency}{" "}
                                • Thời gian: {s.duration}
                              </p>
                              {s.note && (
                                <p className="text-[11px] italic text-muted-foreground">
                                  Ghi chú: {s.note}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Theo dõi */}
                    {selected.monitoring && selected.monitoring.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Kế hoạch theo dõi & đánh giá
                        </p>
                        <div className="space-y-1.5">
                          {selected.monitoring.map((m) => (
                            <div
                              key={m.day}
                              className="rounded-md border border-dashed bg-muted/30 p-2"
                            >
                              <p className="text-[11px] font-semibold">
                                {m.day}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Cần theo dõi: {m.focus}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Kỳ vọng / ngưỡng: {m.expected}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ghi chú chung */}
                    {(selected.safetyNotes ||
                      selected.followupPlan ||
                      selected.note) && (
                      <div className="space-y-1.5">
                        <p className="text-[11px] font-semibold text-muted-foreground">
                          Ghi chú & lưu ý chung
                        </p>
                        {selected.safetyNotes && (
                          <p className="text-[11px] text-muted-foreground">
                            <span className="font-medium">
                              Lưu ý an toàn:&nbsp;
                            </span>
                            {selected.safetyNotes}
                          </p>
                        )}
                        {selected.followupPlan && (
                          <p className="text-[11px] text-muted-foreground">
                            <span className="font-medium">
                              Kế hoạch theo dõi tiếp:&nbsp;
                            </span>
                            {selected.followupPlan}
                          </p>
                        )}
                        {selected.note && (
                          <p className="text-[11px] text-muted-foreground">
                            <span className="font-medium">
                              Ghi chú thêm:&nbsp;
                            </span>
                            {selected.note}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="mt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <AlertTriangle className="h-3 w-3 text-amber-500" />
            <span>
              Sau khi chọn phác đồ, bạn vẫn có thể chỉnh sửa cho phù hợp từng ca
              bệnh cụ thể.
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Đóng
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-primary!"
              disabled={!selected}
              onClick={handleUse}
            >
              Dùng phác đồ này
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoBlock({
  title,
  items,
  icon,
}: {
  title: string;
  items?: string[];
  icon?: "alert";
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="rounded-md border bg-muted/30 p-2">
      <p className="mb-1 flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
        {icon === "alert" && (
          <AlertTriangle className="h-3 w-3 text-amber-500" />
        )}
        {title}
      </p>
      <ul className="space-y-0.5 text-[11px] text-muted-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex gap-1">
            <span className="mt-[3px] h-1 w-1 rounded-full bg-muted-foreground/70" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
